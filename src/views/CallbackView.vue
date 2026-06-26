<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import DashboardView from "./DashboardView.vue";
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const { code, state, error, provider } = route.query;

  // if (provider && !code) {
  //   if (error) {
  //     router.push(`/login?error=${error}`);
  //     return;
  //   }

  //   // try {
  //   //   const accessToken = getCookie("accessToken");
  //   //   if (!accessToken) throw new Error("No token found");

  //   //   tokenStore.set(accessToken);

  //   //   deleteCookie("accessToken");

  //   //   await authStore.fetchUser();

  //   //   const redirect =
  //   //     sessionStorage.getItem("post_login_redirect") ?? "/dashboard";
  //   //   sessionStorage.removeItem("post_login_redirect");
  //   //   router.push(redirect);
  //   // } catch {
  //   //   router.push("/login?error=token_missing");
  //   // }
  // //   return;
  // }
  if (provider && token) {
    try {
      // Move from URL to memory immediately
      tokenStore.set(token);

      // Fetch user profile
      const { data } = await api.get("/auth/profile");

      const authStore = useAuthStore();
      authStore.user = data.data;
      authStore.isAuthenticated = true;

      // Clean the token out of the URL immediately
      router.replace("/dashboard");
    } catch {
      router.push("/login?error=auth_failed");
    }
    return;
  }
  router.push("/login?error=missing_params");
});

// function getCookie(name) {
//   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
//   return match ? decodeURIComponent(match[2]) : null;
// }

// function deleteCookie(name) {
//   document.cookie = `${name}=; Max-Age=0; path=/`;
// }
</script>

<template>
  <!-- Minimal loading state while the exchange happens -->
  <button @click="router.push('/dashboard')">Dashboard</button>
  <div class="callback-wrapper">
    <span class="spinner" aria-label="Signing you in…"></span>
  </div>
</template>

<style scoped>
.callback-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
