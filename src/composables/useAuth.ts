import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
interface OAuthConfig {
  url: string;
  params: Record<string, string>;
}
export type OAuthProvider = "google" | "github";
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  function loginWithProvider(provider: "google" | "github") {
    window.open(
      `${import.meta.env.VITE_API_URL}/auth/${provider}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function logiCredentail(
    email: String,
    password: String,
  ): Promise<void> {
    try {
      await authStore.loginWithCredentials(email, password);
      console.log("All accessible browser cookies:", document.cookie);
      const queryRedirect = router.currentRoute.value.query.redirect;
      let safeRedirect = "/dashboard";

      if (typeof queryRedirect === "string" && queryRedirect.startsWith("/")) {
        safeRedirect = queryRedirect;
      }

      await router.push(safeRedirect);
    } catch (error: any) {
      throw error;
    }
  }

  async function logout() {
    await authStore.logout();
    router.push("/login");
  }

  return {
    loginWithProvider,
    logiCredentail,
    logout,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
  };
}
