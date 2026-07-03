<!-- src/App.vue -->
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import Navbar from "@/views/NavbarView.vue";
import HomePage from "./views/HomePage.vue";
import { onMounted } from "vue";
import Testing from "./views/Testing.vue";
import { useLocaleStore } from "@/stores/locale.ts";
const authStore = useAuthStore();
const localeStore = useLocaleStore();
// onMounted(() => authStore.initializeAuth());
</script>

<template>
  <!-- <testing /> -->
  <div :class="localeStore.fontClass">
    <router-view />
  </div>
  <!-- <AuthModal v-if="authStore.showAuthModal" /> -->
</template>
