<!-- src/App.vue -->
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import Navbar from "@/views/NavbarView.vue";
import HomePage from "./views/HomePage.vue";
const authStore = useAuthStore();
</script>

<template>
  <home-page></home-page>
  <router-view />
  <!-- <AuthModal v-if="authStore.showAuthModal" /> -->
</template>
