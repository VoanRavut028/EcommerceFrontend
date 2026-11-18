import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/lib/axios";

export type ProductRecord = Record<string, unknown> & {
  id?: string | number;
  product_id?: string | number;
  _id?: string;
  slug?: string;
  product_slug?: string;
  name?: string;
  product_name?: string;
  title?: string;
};

export type ProductFilters = {
  category?: string;
  page: number;
  limit: number;
  brand?: string;
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  tags?: string[];
};

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type ProductPayload = Record<string, unknown>;

const responseProducts = (data: unknown): ProductRecord[] => {
  if (Array.isArray(data)) return data as ProductRecord[];
  if (!data || typeof data !== "object") return [];

  const response = data as Record<string, unknown>;
  const nested = response.data;
  const candidates = [
    response.products,
    response.items,
    response.results,
    response.listProducts,
    nested,
    nested && typeof nested === "object"
      ? (nested as Record<string, unknown>).products
      : undefined,
    nested && typeof nested === "object"
      ? (nested as Record<string, unknown>).items
      : undefined,
  ];

  return (candidates.find(Array.isArray) as ProductRecord[] | undefined) ?? [];
};

const responseProduct = (data: unknown, depth = 0): ProductRecord | null => {
  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data) || depth > 3) return null;
  const response = data as Record<string, unknown>;
  const candidate = response.product ?? response.item ?? response.data;
  if (candidate && typeof candidate === "object") {
    return responseProduct(candidate, depth + 1);
  }
  return data as ProductRecord;
};

const responsePagination = (value: unknown, fallback: Pick<ProductFilters, "page" | "limit">): ProductPagination => {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const number = (candidate: unknown, defaultValue: number) => {
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
  };
  const page = number(source.page ?? source.currentPage ?? source.current_page, fallback.page);
  const limit = number(source.limit ?? source.pageSize ?? source.page_size, fallback.limit);
  const total = number(source.total ?? source.totalCount ?? source.total_count ?? source.totalItems ?? source.total_items ?? source.totalProducts ?? source.count, 0);
  const totalPages = number(source.totalPages ?? source.total_pages ?? source.pages, total ? Math.ceil(total / Math.max(limit, 1)) : 0);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: Boolean(source.hasNextPage ?? source.has_next_page ?? source.hasNext ?? page < totalPages),
    hasPreviousPage: Boolean(source.hasPreviousPage ?? source.has_previous_page ?? source.hasPrev ?? page > 1),
  };
};

const apiV1Base = String(api.defaults.baseURL ?? "").replace(/\/+$/, "");

function apiUrl(path: string) {
  return `${apiV1Base}${path}`;
}

export const useProductStore = defineStore("product", () => {
  const products = ref<ProductRecord[]>([]);
  const adminProducts = ref<ProductRecord[]>([]);
  const selectedProduct = ref<ProductRecord | null>(null);
  const isLoading = ref(false);
  const isAdminLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<ProductPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  let listRequestId = 0;
  let listController: AbortController | null = null;

  const hasProducts = computed(() => products.value.length > 0);

  const clearProducts = () => {
    listController?.abort();
    listRequestId += 1;
    products.value = [];
    pagination.value = {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
    isLoading.value = false;
    error.value = null;
  };

  const fetchProducts = async (filters: ProductFilters) => {
    listController?.abort();
    const controller = new AbortController();
    listController = controller;
    const requestId = ++listRequestId;
    isLoading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
      });
      if (filters.category) params.set("category", filters.category);
      if (filters.brand?.trim()) params.set("brand", filters.brand.trim());
      if (filters.search?.trim()) params.set("search", filters.search.trim());
      if (filters.minPrice !== undefined && filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
      if (filters.tags?.length) params.set("tags", filters.tags.join(","));

      const response = await fetch(`${apiUrl("/products")}?${params.toString()}`, {
        cache: "no-store",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null) as Record<string, unknown> | null;
      if (!response.ok) {
        const message = result && typeof result.message === "string"
          ? result.message
          : `Products request failed (${response.status}).`;
        throw new Error(message);
      }
      const rows = result && Array.isArray(result.data) ? result.data as ProductRecord[] : [];
      const pageInfo = responsePagination(result?.pagination, filters);
      if (requestId === listRequestId) {
        products.value = rows;
        pagination.value = pageInfo;
      }
      return { products: rows, pagination: pageInfo };
    } catch (cause) {
      if (controller.signal.aborted || requestId !== listRequestId) {
        return { products: products.value, pagination: pagination.value };
      }
      error.value = cause instanceof Error ? cause.message : "Unable to load products. Please try again.";
      products.value = [];
      throw cause;
    } finally {
      if (requestId === listRequestId) isLoading.value = false;
    }
  };

  const fetchProductBySlug = async (slug: string) => {
    const response = await fetch(apiUrl(`/products/${encodeURIComponent(slug)}`), {
      cache: "no-store",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const result = await response.json().catch(() => null) as unknown;
    if (!response.ok) throw new Error(`Product request failed (${response.status}).`);
    selectedProduct.value = responseProduct(result);
    return selectedProduct.value;
  };

  const fetchAdminProducts = async () => {
    isAdminLoading.value = true;
    try {
      const { data } = await api.get("/listProducts");
      adminProducts.value = responseProducts(data);
      return adminProducts.value;
    } finally {
      isAdminLoading.value = false;
    }
  };

  const createProduct = async (payload: ProductPayload) => {
    const { data } = await api.post("/product", payload);
    const created = responseProduct(data);
    if (created) adminProducts.value = [created, ...adminProducts.value];
    return data;
  };

  const uploadProductImages = async (formData: FormData) => {
    const { data } = await api.post("/products/images", formData);
    return data;
  };

  const addProductVariant = async (
    id: string | number,
    payload: ProductPayload,
  ) => {
    const { data } = await api.post(
      `/${encodeURIComponent(id)}/variants`,
      payload,
    );
    return data;
  };

  const updateProduct = async (id: string | number, payload: ProductPayload) => {
    const { data } = await api.patch(`/${encodeURIComponent(id)}`, payload);
    return data;
  };

  const deleteProduct = async (id: string | number) => {
    const { data } = await api.delete(`/${encodeURIComponent(id)}`);
    adminProducts.value = adminProducts.value.filter(
      (product) =>
        String(product.product_id ?? product.id ?? product._id) !== String(id),
    );
    return data;
  };

  const restoreProduct = async (id: string | number) => {
    const { data } = await api.patch(`/${encodeURIComponent(id)}/restore`);
    return data;
  };

  const updateVariantStock = async (
    id: string | number,
    variantId: string | number,
    payload: ProductPayload,
  ) => {
    const { data } = await api.patch(
      `/${encodeURIComponent(id)}/variants/${encodeURIComponent(variantId)}/stock`,
      payload,
    );
    return data;
  };

  return {
    products,
    adminProducts,
    selectedProduct,
    isLoading,
    isAdminLoading,
    error,
    pagination,
    hasProducts,
    clearProducts,
    fetchProducts,
    fetchProductBySlug,
    fetchAdminProducts,
    createProduct,
    uploadProductImages,
    addProductVariant,
    updateProduct,
    deleteProduct,
    restoreProduct,
    updateVariantStock,
  };
});
