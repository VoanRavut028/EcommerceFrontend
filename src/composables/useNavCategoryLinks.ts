import { computed } from "vue";

// Static navigation keys map directly to the category type expected by the API.
export const NAV_CATEGORY_TYPES = {
  women: "women",
  men: "men",
  kids: "kids",
  accessories: "accessories",
} as const;

export function useNavCategoryLinks(translate: (key: string) => string) {
  const categoryLinks = computed(() =>
    Object.entries(NAV_CATEGORY_TYPES).map(([key, type]) => ({
      key,
      type,
      label: translate(`productCategories.${key}`),
      to: { path: "/products/all", query: { type } },
    })),
  );

  return { categoryLinks };
}
