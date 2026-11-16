<script setup lang="ts">
import NavbarView from "@/views/NavbarView.vue";
import { useLocaleStore } from "@/stores/locale.ts";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const localeStore = useLocaleStore();

function handleSearch(value: string) {
  const query = value.trim();
  router.push({ path: "/products/all", query: query ? { search: query } : {} });
}

function clearSearch() {
  router.replace({ path: "/products/all" });
}
</script>

<template>
  <div :class="[localeStore.fontClass, 'min-h-screen']">
    <NavbarView
      :search-value="String(route.query.search ?? '')"
      @search="handleSearch"
      @clear="clearSearch"
    />
    <div class="pt-12 sm:pt-16">
      <router-view />
    </div>
  </div>
</template>
