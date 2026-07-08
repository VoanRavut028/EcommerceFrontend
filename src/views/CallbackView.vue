<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // adjust to your store setup
import { tokenStore } from "@/lib/tokenStore"; // adjust to your setup
import api from "@/lib/axios";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("accessToken");

  if (accessToken) {
    tokenStore.set(accessToken);
  }

  router.replace("/index");
});
</script>

<template></template>
