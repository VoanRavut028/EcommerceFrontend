import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/lib/axios";
import { tokenStore } from "@/lib/tokenStore.ts";
import authInitApi from "@/services/authInit";
import router from "@/routers/index";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const registrationSuccess = ref(false);
  const showAuthModal = ref(false);

  const fullName = computed(() => {
    if (!user.value) return;
    return {
      firstName: user.value.first_name,
      lastName: user.value.last_name,
    };
  });
  const avatar = computed(() => user.value?.avatar ?? null);

  const initializeAuth = async () => {
    try {
      isLoading.value = true;
      const res = await api.get("/profile");
      console.log(`init auth is running success ${res.data.success}`);
      console.log(`init auth is running success ${res.data.message}`);
      user.value = res.data.user;
      console.log(`User data after init: ${res.data.user}`);
      tokenStore.set(res.data.accessToken);
      isAuthenticated.value = true;
    } catch (error) {
      logout();
    } finally {
      isLoading.value = false;
    }
  };

  const refreshToken = async () => {
    isLoading.value = true;
    try {
      const { data } = await authInitApi.post("/refresh");
      tokenStore.set(data.accessToken);
      // isAuthenticated.value = true;
    } catch {
      clearSession();
    } finally {
      isLoading.value = false;
    }
  };

  const exchangeOAuthCode = async (code: any, state: any, provider: any) => {
    const storedState = sessionStorage.getItem("oauth_state");
    if (!storedState || storedState !== state) {
      throw new Error("State mismatch — possible CSRF attack");
    }
 

    const { data } = await api.post(`/auth/${provider}/callback`, { code });
    tokenStore.set(data.accessToken);
    user.value = data.user;
    isAuthenticated.value = true;
    showAuthModal.value = false;
  };

  const logout = async () => {
    try {
      await authInitApi.post("/logout");
    } catch {
    } finally {
      tokenStore.clear();
      isAuthenticated.value = false;
      user.value = null;
      showAuthModal.value = false;
      router.push("/login");
    }
  };

  const clearSession = () => {
    tokenStore.clear();
    user.value = null;
    isAuthenticated.value = false;
    showAuthModal.value = false;
  };

  const clearRegistrationSuccess = () => {
    registrationSuccess.value = false;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    registrationSuccess,
    showAuthModal,

    fullName,
    avatar,

    initializeAuth,
    refreshToken,
    exchangeOAuthCode,
    logout,
    clearSession,
    clearRegistrationSuccess,
  };
});
