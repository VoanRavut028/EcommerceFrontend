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

    try {
      const { data } = await api.get("/auth/me");
      authStore.user = data.user;
      authStore.isAuthenticated = true;
    } catch (err) {
      // token was bad / request failed — bail out to login instead of dashboard
      router.replace("/login");
      return;
    }
  }

  // clean the token out of the URL and send them to the app
  router.replace("/dashboard");
});
</script>

<template>
  <div>
    <!-- optional: loading spinner while the callback resolves -->
    <p>Signing you in...</p>
  </div>
</template>
