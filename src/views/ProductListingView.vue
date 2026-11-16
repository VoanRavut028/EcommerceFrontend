<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore, type ProductRecord } from "@/stores/product";
import { isCategoryType, useCategoryStore, type CategoryRecord, type CategoryType } from "@/stores/category";

type Product = {
  id: string | number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  color: string;
  image: string;
  badge?: string;
  brand?: string;
  createdAt?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryType?: string;
};

type CategoryOption = {
  id: string;
  slug: string;
  name: string;
  type?: CategoryType;
  parentId?: string;
  parentSlug?: string;
};

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const search = ref(String(route.query.search ?? ""));
const category = ref("All");
const departmentType = computed<CategoryType | null>(() =>
  isCategoryType(route.query.type) ? route.query.type : null,
);
const minPrice = ref(0);
const maxPrice = ref<number | null>(null);
const sortBy = ref("featured");
const page = ref(1);
const pageSize = 8;
const filtersOpen = ref(false);

function field(record: ProductRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return String(object.name ?? object.title ?? object.label ?? object.category_name ?? "");
  }
  return "";
}

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function toCategory(record: CategoryRecord): CategoryOption {
  const idValue = field(record, "category_id", "id", "_id");
  const name = textValue(field(record, "name", "category_name", "title")) || "Category";
  const slug = textValue(field(record, "slug", "category_slug")) || slugify(name);
  const parentValue = record.parent ?? record.parent_id ?? record.parentId;
  let parentId: string | undefined;
  let parentSlug: string | undefined;
  if (parentValue && typeof parentValue === "object") {
    const parent = parentValue as Record<string, unknown>;
    const rawParentId = parent._id ?? parent.id ?? parent.category_id;
    parentId = rawParentId === undefined || rawParentId === null ? undefined : String(rawParentId);
    parentSlug = textValue(parent.slug ?? parent.category_slug) || undefined;
  } else if (parentValue !== undefined && parentValue !== null && parentValue !== "") {
    parentId = String(parentValue);
  }
  const type = isCategoryType(record.type) ? record.type : undefined;
  return { id: String(idValue ?? slug), slug, name, type, parentId, parentSlug };
}

function imageValue(product: ProductRecord): string {
  const direct = field(product, "image", "image_url", "product_image", "thumbnail", "cover_image");
  if (typeof direct === "string") return direct;
  const imageList = field(product, "images", "product_images", "image_urls");
  if (Array.isArray(imageList)) {
    const first = imageList[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const image = first as Record<string, unknown>;
      return String(image.url ?? image.image_url ?? image.path ?? "");
    }
  }
  return "";
}

function toProduct(record: ProductRecord): Product {
  const categoryValue = field(record, "category", "category_name", "categoryName", "type");
  const categoryRecord = categoryValue && typeof categoryValue === "object"
    ? categoryValue as Record<string, unknown>
    : {};
  const price = Number(field(record, "price", "product_price", "sale_price", "current_price") ?? 0);
  const oldPriceValue = field(record, "oldPrice", "old_price", "original_price", "compare_at_price", "regular_price");
  const oldPrice = oldPriceValue === undefined ? undefined : Number(oldPriceValue);
  const name = textValue(field(record, "name", "product_name", "title")) || "Product";
  const id = field(record, "id", "product_id", "_id");

  return {
    id: typeof id === "string" || typeof id === "number" ? id : name,
    name,
    category: textValue(categoryValue) || "Other",
    price: Number.isFinite(price) ? price : 0,
    oldPrice: oldPrice !== undefined && Number.isFinite(oldPrice) ? oldPrice : undefined,
    color: textValue(field(record, "color", "color_name", "variant_color")),
    image: imageValue(record),
    badge: textValue(field(record, "badge", "label", "tag")) || undefined,
    brand: textValue(field(record, "brand", "brand_name", "manufacturer")) || undefined,
    createdAt: textValue(field(record, "created_at", "createdAt", "updated_at", "updatedAt")) || undefined,
    categoryId: String(field(record, "category_id", "categoryId") ?? categoryRecord.category_id ?? categoryRecord.id ?? categoryRecord._id ?? "") || undefined,
    categorySlug: textValue(field(record, "category_slug", "categorySlug")) || textValue(categoryRecord.slug ?? categoryRecord.category_slug) || undefined,
    categoryType: textValue(field(record, "category_type", "categoryType") ?? categoryRecord.type) || undefined,
  };
}

const products = computed(() => productStore.products.map(toProduct));
const categories = computed(() => categoryStore.categories.map(toCategory));
const parentCategories = computed(() => categories.value.filter((item) => !item.parentId && !item.parentSlug));
const maxAvailablePrice = computed(() => Math.max(150, ...products.value.map((product) => product.price)));
const effectiveMaxPrice = computed(() => maxPrice.value ?? maxAvailablePrice.value);

const childCategories = (parent: CategoryOption) =>
  categories.value.filter((item) =>
    item.parentId === parent.id || item.parentSlug === parent.slug,
  );

const categoryFromRoute = (value: unknown): string => {
  const normalized = String(value ?? "all").toLowerCase();
  if (!normalized || normalized === "all") return "All";
  const categorySlug = normalized === "fashion" ? "women" : normalized === "kitchen" ? "home" : normalized;
  const found = categories.value.find((item) =>
    item.slug.toLowerCase() === categorySlug ||
    item.id.toLowerCase() === categorySlug ||
    slugify(item.name) === categorySlug,
  );
  if (found) return found.slug;
  return categorySlug;
};

watch([() => route.params.category, () => route.query.type], async ([value, rawType]) => {
  category.value = categoryFromRoute(value);
  page.value = 1;
  categoryStore.clearSelectedCategory();
  const requestedSlug = String(value ?? "").trim();
  const typeValue = rawType === undefined ? undefined : String(rawType);

  if (typeValue !== undefined && !isCategoryType(typeValue)) {
    await categoryStore.fetchCategories(typeValue).catch(() => undefined);
    categoryStore.clearSelectedCategory();
    return;
  }

  const type = typeValue as CategoryType | undefined;
  if (categoryStore.selectedType !== (type ?? null) || !categoryStore.hasCategories) {
    await categoryStore.fetchCategories(type).catch(() => undefined);
  }

  if (String(route.params.category ?? "all") !== String(value ?? "all") || String(route.query.type ?? "") !== String(rawType ?? "")) return;

  if (requestedSlug && requestedSlug.toLowerCase() !== "all") {
    if (type) await categoryStore.fetchCategoryBySlug(requestedSlug, type).catch(() => undefined);
    else {
      categoryStore.clearSelectedCategory();
      categoryStore.selectedCategoryError = "Choose a department to load this category.";
    }
  } else {
    categoryStore.clearSelectedCategory();
  }
}, { immediate: true });
watch(() => route.query.search, (value) => {
  search.value = String(value ?? "");
}, { immediate: true });
onMounted(() => {
  void reloadProducts();
});

async function reloadProducts() {
  await productStore.fetchProducts().catch(() => undefined);
}

const filteredProducts = computed(() => {
  const query = search.value.trim().toLowerCase();
  const selectedCategory = categories.value.find((item) => item.slug === category.value || item.id === category.value);
  const selectedCategoryGroup = category.value === "All" && departmentType.value
    ? categories.value
    : selectedCategory
    ? selectedCategory.parentId
      ? [selectedCategory]
      : [selectedCategory, ...childCategories(selectedCategory)]
    : [];
  const result = products.value.filter((product) =>
    ((category.value === "All" && !departmentType.value) || selectedCategoryGroup.some((item) =>
      product.categoryId === item.id ||
      ((!departmentType.value || !product.categoryType || product.categoryType === departmentType.value) && (
        product.categorySlug === item.slug ||
        slugify(product.category) === item.slug ||
        product.category.toLowerCase() === item.name.toLowerCase()
      ))
    )) &&
    product.price >= minPrice.value &&
    product.price <= effectiveMaxPrice.value &&
    (!query || `${product.name} ${product.category} ${product.color} ${product.brand ?? ""}`.toLowerCase().includes(query)),
  );
  if (sortBy.value === "price-low") result.sort((a, b) => a.price - b.price);
  if (sortBy.value === "price-high") result.sort((a, b) => b.price - a.price);
  if (sortBy.value === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy.value === "newest") {
    result.sort((a, b) => {
      const dateA = a.createdAt ? Date.parse(a.createdAt) : Number.NaN;
      const dateB = b.createdAt ? Date.parse(b.createdAt) : Number.NaN;
      const timeA = Number.isFinite(dateA) ? dateA : Number(a.id) || 0;
      const timeB = Number.isFinite(dateB) ? dateB : Number(b.id) || 0;
      return timeB - timeA;
    });
  }
  return result;
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)));
const listingTitle = computed(() => {
  if (category.value === "All") return departmentType.value?.toUpperCase() ?? "NEW ARRIVALS";
  return categories.value.find((item) => item.slug === category.value || item.id === category.value)?.name.toUpperCase() ?? category.value.toUpperCase();
});
const visibleProducts = computed(() => filteredProducts.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const resultStart = computed(() => filteredProducts.value.length ? (page.value - 1) * pageSize + 1 : 0);
const resultEnd = computed(() => Math.min(page.value * pageSize, filteredProducts.value.length));

watch([category, minPrice, maxPrice, sortBy], () => { page.value = 1; });
watch(pageCount, (count) => { if (page.value > count) page.value = count; });

function setCategory(value: string, type?: CategoryType) {
  category.value = value;
  const slug = value === "All" ? "all" : value;
  const query = type ? { ...route.query, type } : route.query;
  if (route.params.category !== slug || (type && route.query.type !== type)) {
    router.replace({ path: `/products/${slug}`, query });
  }
}

function chooseDropdownCategory(value: string, event: MouseEvent, type?: CategoryType) {
  (event.currentTarget as HTMLElement).closest("details")?.removeAttribute("open");
  setCategory(value, type);
}

function clearFilters() {
  search.value = "";
  category.value = "All";
  minPrice.value = 0;
  maxPrice.value = null;
  router.replace({ path: "/products/all" });
}
</script>

<template>
  <main class="min-h-screen bg-dominant pb-16 text-text">
    <section class="container mx-auto px-4 pt-7 sm:px-6 lg:px-8">
      <header class="border-b border-border pb-4">
        <h1 class="text-xl font-semibold tracking-wide text-text-strong sm:text-2xl">
          {{ listingTitle }}
          <span class="ml-1 text-sm font-normal text-text-muted">({{ filteredProducts.length }} items)</span>
        </h1>
        <div class="mt-5 flex flex-wrap items-start gap-2 pb-1">
          <button type="button" @click="setCategory('All')" class="shrink-0 border px-4 py-2 text-xs font-medium uppercase tracking-wide transition" :class="category === 'All' ? 'border-text-strong bg-text-strong text-dominant' : 'border-border bg-secondary text-text hover:border-text-strong'">New Arrivals</button>
          <details v-for="parent in parentCategories" :key="parent.id" class="group relative shrink-0">
            <summary class="flex cursor-pointer list-none items-center gap-2 border px-4 py-2 text-xs font-medium uppercase tracking-wide transition" :class="category === parent.slug || childCategories(parent).some((child) => child.slug === category) ? 'border-text-strong bg-text-strong text-dominant' : 'border-border bg-secondary text-text hover:border-text-strong'">
              {{ parent.name }}
              <svg class="h-3 w-3 transition-transform group-open:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 4 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </summary>
            <div class="absolute left-0 top-full z-40 mt-1 min-w-48 border border-border bg-secondary py-1 shadow-lg">
              <button v-for="child in childCategories(parent)" :key="child.id" type="button" @click="chooseDropdownCategory(child.slug, $event, child.type)" class="block w-full px-4 py-2.5 pl-7 text-left text-xs uppercase tracking-wide text-text hover:bg-dominant-alt">{{ child.name }}</button>
              <span v-if="!childCategories(parent).length" class="block px-4 py-2.5 text-xs text-text-muted">No subcategories</span>
            </div>
          </details>
        </div>
        <p v-if="categoryStore.isLoading" class="mt-2 text-xs text-text-muted" role="status">Loading categories…</p>
        <p v-else-if="categoryStore.error" class="mt-2 text-xs text-text-muted">{{ categoryStore.error }}</p>
        <p v-if="categoryStore.selectedCategoryError" class="mt-2 text-xs text-text-muted" role="status">{{ categoryStore.selectedCategoryError }}</p>
      </header>

      <div class="flex items-center justify-between border-b border-border py-4">
        <button type="button" @click="filtersOpen = !filtersOpen" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-strong hover:text-text-muted">
          <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4" aria-hidden="true"><path d="M3 5h14M6 10h8m-5 5h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
          {{ filtersOpen ? 'Hide filters' : 'Filter' }}
        </button>
        <label class="flex items-center gap-2 text-xs uppercase tracking-wide text-text-muted">
          Sort by
          <select v-model="sortBy" class="!h-9 !min-w-36 !border-0 !bg-dominant !px-1 !text-xs !font-medium !text-text-strong !outline-none">
            <option value="featured">Recommend</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div v-if="filtersOpen" class="grid gap-6 border-b border-border bg-dominant-alt px-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wide text-text-strong">Category</h2>
          <div class="mt-3 space-y-2">
            <div v-for="parent in parentCategories" :key="parent.id" class="space-y-2">
              <p class="text-sm font-medium text-text-strong">{{ parent.name }}</p>
              <label v-for="child in childCategories(parent)" :key="child.id" class="flex cursor-pointer items-center gap-2 pl-6 text-sm text-text-muted">
                <input type="radio" name="category" :checked="category === child.slug" @change="setCategory(child.slug, child.type)" class="!h-3.5 !w-3.5 accent-[var(--primary)]" />
                {{ child.name }}
              </label>
            </div>
            <label class="flex cursor-pointer items-center gap-2 text-sm text-text">
              <input type="radio" name="category" :checked="category === 'All'" @change="setCategory('All')" class="!h-3.5 !w-3.5 accent-[var(--primary)]" />
              New Arrivals
            </label>
          </div>
        </div>
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wide text-text-strong">Price range</h2>
          <div class="mt-3 flex items-center gap-2">
            <label class="sr-only" for="min-price">Minimum price</label>
            <input id="min-price" v-model.number="minPrice" type="number" min="0" :max="effectiveMaxPrice" class="!h-9 !w-24 !border !border-border !bg-secondary !px-2 !text-sm !text-text-strong placeholder:!text-text-muted" placeholder="$0" />
            <span class="text-text-muted">to</span>
            <label class="sr-only" for="max-price">Maximum price</label>
            <input id="max-price" v-model.number="maxPrice" type="number" :min="minPrice" :max="maxAvailablePrice" class="!h-9 !w-24 !border !border-border !bg-secondary !px-2 !text-sm !text-text-strong placeholder:!text-text-muted" :placeholder="`$${maxAvailablePrice}`" />
          </div>
        </div>
        <div class="flex items-end">
          <button type="button" @click="clearFilters" class="text-xs font-semibold uppercase tracking-wide text-text-strong underline underline-offset-4">Clear all</button>
        </div>
      </div>

      <div class="flex items-center justify-between py-4 text-xs text-text-muted">
        <span>Showing {{ resultStart }}–{{ resultEnd }} of {{ filteredProducts.length }} items</span>
        <span class="hidden sm:inline">New styles added regularly</span>
      </div>

      <div v-if="productStore.isLoading" class="flex min-h-64 items-center justify-center text-sm text-text-muted" role="status">Loading products…</div>
      <div v-else-if="productStore.error" class="flex min-h-64 flex-col items-center justify-center px-6 text-center">
        <span class="text-lg font-medium text-text-strong">Products could not be loaded</span>
        <p class="mt-2 text-sm text-text-muted">{{ productStore.error }}</p>
        <button type="button" @click="productStore.fetchProducts()" class="mt-4 text-xs font-semibold uppercase text-text-strong underline underline-offset-4">Try again</button>
      </div>
      <div v-else-if="visibleProducts.length" class="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5">
        <article v-for="product in visibleProducts" :key="product.id" class="group min-w-0">
          <div class="relative aspect-[3/4] overflow-hidden bg-dominant-alt">
            <img v-if="product.image" :src="product.image" :alt="product.name" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
            <span v-if="product.oldPrice" class="absolute left-0 top-3 bg-secondary px-2 py-1 text-[10px] font-semibold text-text-strong">
              -{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
            </span>
            <span v-else-if="product.badge" class="absolute left-0 top-3 bg-secondary px-2 py-1 text-[10px] font-semibold uppercase text-text-strong">{{ product.badge }}</span>
            <button type="button" :aria-label="`Add ${product.name} to wishlist`" class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-text hover:text-text-strong">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /></svg>
            </button>
          </div>
          <div class="pt-2.5">
            <p class="text-[10px] font-medium uppercase tracking-wide text-text-muted">{{ product.brand || product.category }}</p>
            <div class="mt-1 flex items-start justify-between gap-2">
              <h2 class="line-clamp-2 text-xs leading-5 text-text-strong sm:text-sm">{{ product.name }}</h2>
              <div class="shrink-0 text-right text-xs sm:text-sm">
                <p class="font-medium text-text-strong">US ${{ product.price.toFixed(2) }}</p>
                <p v-if="product.oldPrice" class="text-[11px] text-text-muted line-through">US ${{ product.oldPrice.toFixed(2) }}</p>
              </div>
            </div>
            <p v-if="product.color" class="mt-1 text-[11px] text-text-muted">{{ product.color }}</p>
          </div>
        </article>
      </div>
      <div v-else class="flex min-h-64 flex-col items-center justify-center px-6 text-center">
        <span class="text-lg font-medium text-text-strong">Aww… no result was found</span>
        <p class="mt-2 text-sm text-text-muted">Try another search or clear your filters.</p>
        <button type="button" @click="clearFilters" class="mt-4 text-xs font-semibold uppercase text-text-strong underline underline-offset-4">Clear filters</button>
      </div>

      <nav v-if="pageCount > 1" class="mt-12 flex items-center justify-center gap-1" aria-label="Pagination">
        <button type="button" :disabled="page === 1" @click="page--" class="px-3 py-2 text-sm text-text-strong disabled:text-text-muted" aria-label="Previous page">‹</button>
        <button v-for="number in pageCount" :key="number" type="button" @click="page = number" class="min-w-9 border-b px-3 py-2 text-sm" :class="page === number ? 'border-text-strong font-semibold text-text-strong' : 'border-transparent text-text-muted'" :aria-current="page === number ? 'page' : undefined">{{ number }}</button>
        <button type="button" :disabled="page === pageCount" @click="page++" class="px-3 py-2 text-sm text-text-strong disabled:text-text-muted" aria-label="Next page">›</button>
      </nav>
    </section>
  </main>
</template>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}

summary::marker {
  content: "";
}
</style>
