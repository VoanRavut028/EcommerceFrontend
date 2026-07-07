import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import authInitApi from "@/services/authInit";
import { tokenStore } from "@/lib/tokenStore";

interface OAuthConfig {
  url: string;
  params: Record<string, string>;
}

export type OAuthProvider = "google" | "github";

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  function loginWithProvider(provider: OAuthProvider) {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  }

  async function loginWithCredentials(
    email: string,
    password: string,
  ): Promise<void> {
    try {
      authStore.isLoading = true;
      const { data } = await authInitApi.post("/login", {
        email,
        password,
      });

      tokenStore.set(data.accessToken);
      authStore.user = data.user;
      authStore.isAuthenticated = true;
      authStore.showAuthModal = false;

      console.log("All accessible browser cookies:", document.cookie);
      const queryRedirect = router.currentRoute.value.query.redirect;
      // let safeRedirect = "/index";

      // if (typeof queryRedirect === "string" && queryRedirect.startsWith("/")) {
      //   safeRedirect = queryRedirect;
      // }

      // await router.push(safeRedirect);
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    } finally {
      authStore.isLoading = false;
    }
  }

  async function logout() {
    await authStore.logout();
    router.push("/login");
  }

  return {
    loginWithProvider,
    loginWithCredentials,
    logout,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
  };
}
