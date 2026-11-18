import { computed, ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import api from "@/lib/axios";

export const CATEGORY_TYPES = ["women", "men", "kids", "accessories"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const isCategoryType = (value: unknown): value is CategoryType =>
  typeof value === "string" && CATEGORY_TYPES.includes(value as CategoryType);

const typeError = () => new Error(`Invalid category type. Use one of: ${CATEGORY_TYPES.join(", ")}.`);

export type CategoryRecord = Record<string, unknown> & {
  id?: string | number;
  category_id?: string | number;
  _id?: string;
  slug?: string;
  category_slug?: string;
  name?: string;
  category_name?: string;
  type?: CategoryType;
};

type CategoryPayload = Record<string, unknown>;

const responseCategories = (data: unknown): CategoryRecord[] => {
  if (Array.isArray(data)) return data as CategoryRecord[];
  if (!data || typeof data !== "object") return [];

  const response = data as Record<string, unknown>;
  const nested = response.data;
  const candidates = [
    response.categories,
    response.items,
    response.results,
    nested,
    nested && typeof nested === "object"
      ? (nested as Record<string, unknown>).categories
      : undefined,
    nested && typeof nested === "object"
      ? (nested as Record<string, unknown>).items
      : undefined,
  ];

  return (candidates.find(Array.isArray) as CategoryRecord[] | undefined) ?? [];
};

const responseCategory = (data: unknown, depth = 0): CategoryRecord | null => {
  if (!data || typeof data !== "object" || Array.isArray(data) || depth > 3)
    return null;
  const response = data as Record<string, unknown>;
  const candidate = response.category ?? response.item ?? response.data;
  if (candidate && typeof candidate === "object") {
    return responseCategory(candidate, depth + 1);
  }
  return data as CategoryRecord;
};

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<CategoryRecord[]>([]);
  const selectedCategory = ref<CategoryRecord | null>(null);
  const selectedType = ref<CategoryType | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const selectedCategoryError = ref<string | null>(null);
  let listRequestId = 0;
  let detailRequestId = 0;

  const hasCategories = computed(() => categories.value.length > 0);

  const fetchCategories = async (type?: string) => {
    const requestId = ++listRequestId;
    if (type !== undefined && !isCategoryType(type)) {
      categories.value = [];
      selectedType.value = null;
      isLoading.value = false;
      error.value = typeError().message;
      throw typeError();
    }
    isLoading.value = true;
    error.value = null;
    try {
      const types: (CategoryType | undefined)[] = type ? [type as CategoryType] : [...CATEGORY_TYPES];
      const results = await Promise.all(types.map(async (categoryType) => {
        const { data } = await api.get("/categories", {
          params: categoryType ? { type: categoryType } : undefined,
        });
        return responseCategories(data).map((category) => ({
          ...category,
          type: category.type ?? categoryType,
        }));
      }));
      const fetched = results.flat();
      if (requestId === listRequestId) {
        categories.value = fetched;
        selectedType.value = (type as CategoryType | undefined) ?? null;
      }
      return fetched;
    } catch (cause) {
      const status = axios.isAxiosError(cause) ? cause.response?.status : undefined;
      if (requestId === listRequestId) {
        categories.value = [];
        selectedType.value = null;
        error.value = status === 400
          ? typeError().message
          : "Unable to load categories. Please try again.";
      }
      throw cause;
    } finally {
      if (requestId === listRequestId) isLoading.value = false;
    }
  };

  const fetchCategoryBySlug = async (slug: string, type: string) => {
    const requestId = ++detailRequestId;
    if (!isCategoryType(type)) {
      selectedCategoryError.value = typeError().message;
      selectedCategory.value = null;
      throw typeError();
    }
    selectedCategoryError.value = null;
    try {
      const { data } = await api.get(`/categories/${encodeURIComponent(slug)}`, {
        params: { type },
      });
      const fetched = responseCategory(data);
      if (requestId === detailRequestId) {
        selectedCategory.value = fetched;
        selectedType.value = type;
      }
      return fetched;
    } catch (cause) {
      const status = axios.isAxiosError(cause) ? cause.response?.status : undefined;
      if (requestId === detailRequestId) {
        selectedCategory.value = null;
        selectedCategoryError.value = status === 404
          ? "Category not found for this department."
          : status === 400
            ? typeError().message
            : "Unable to load this category. Please try again.";
      }
      throw cause;
    }
  };

  const clearSelectedCategory = () => {
    detailRequestId += 1;
    selectedCategory.value = null;
    selectedCategoryError.value = null;
  };

  const createCategory = async (payload: CategoryPayload) => {
    const parent = payload.parent ?? payload.parent_id ?? payload.parentId;
    const requestPayload: CategoryPayload = { ...payload };
    delete requestPayload.parent_id;
    delete requestPayload.parentId;
    if (parent !== undefined && parent !== null && parent !== "") {
      const parentId = typeof parent === "object"
        ? (parent as Record<string, unknown>)._id ?? (parent as Record<string, unknown>).id
          ?? (parent as Record<string, unknown>).category_id
        : parent;
      if (parentId === undefined || parentId === null || parentId === "") {
        throw new Error("A child category must include a valid parent ID.");
      }
      delete requestPayload.type;
      requestPayload.parent = parentId;
    } else {
      delete requestPayload.parent;
      if (!isCategoryType(requestPayload.type)) throw typeError();
    }
    const { data } = await api.post("/categories", requestPayload);
    const created = responseCategory(data);
    if (created) categories.value = [created, ...categories.value];
    return data;
  };

  const updateCategory = async (
    id: string | number,
    payload: CategoryPayload,
  ) => {
    const { data } = await api.patch(
      `/categories/${encodeURIComponent(id)}`,
      payload,
    );
    const updated = responseCategory(data);
    if (updated) {
      const key = String(
        updated.category_id ?? updated.id ?? updated._id ?? id,
      );
      const index = categories.value.findIndex(
        (category) =>
          String(category.category_id ?? category.id ?? category._id) === key,
      );
      if (index >= 0) categories.value[index] = updated;
    }
    return data;
  };

  const deleteCategory = async (id: string | number) => {
    const { data } = await api.delete(`/categories/${encodeURIComponent(id)}`);
    categories.value = categories.value.filter(
      (category) =>
        String(category.category_id ?? category.id ?? category._id) !==
        String(id),
    );
    return data;
  };

  const restoreCategory = async (id: string | number) => {
    const { data } = await api.patch(
      `/categories/${encodeURIComponent(id)}/restore`,
    );
    const restored = responseCategory(data);
    if (restored) categories.value = [restored, ...categories.value];
    return data;
  };

  return {
    categories,
    selectedCategory,
    clearSelectedCategory,
    selectedType,
    isLoading,
    error,
    selectedCategoryError,
    hasCategories,
    fetchCategories,
    fetchCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
  };
});
