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

export const useProductStore = defineStore("product", () => {
  const products = ref<ProductRecord[]>([]);
  const adminProducts = ref<ProductRecord[]>([]);
  const selectedProduct = ref<ProductRecord | null>(null);
  const isLoading = ref(false);
  const isAdminLoading = ref(false);
  const error = ref<string | null>(null);

  const hasProducts = computed(() => products.value.length > 0);

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await api.get("/products");
      products.value = responseProducts(data);
      return products.value;
    } catch (cause) {
      error.value = "Unable to load products. Please try again.";
      throw cause;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProductBySlug = async (slug: string) => {
    const { data } = await api.get(`/products/${encodeURIComponent(slug)}`);
    selectedProduct.value = responseProduct(data);
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
    hasProducts,
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
