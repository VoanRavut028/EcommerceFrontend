import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/lib/axios";
import { tokenStore } from "@/lib/tokenStore.ts";
import router from "@/routers/index";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const registrationSuccess = ref(false);
  const showAuthModal = ref(false);
  const messageFromRegisterInit = ref("");
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

      if (!tokenStore.get()) {
        await refreshToken();
      }

      const res = await api.get("/profile");
      console.log(`init auth is running success ${res.data.success}`);
      console.log(`init auth is running success ${res.data.message}`);
      user.value = res.data.user;
      console.log(`User data after init: ${res.data.user}`);
      if (res.data.accessToken) {
        tokenStore.set(res.data.accessToken);
      }
      isAuthenticated.value = true;
    } catch (error: any) {
      clearSession();
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  function readExp(token: string): number | null {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const json = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      );
      return typeof json.exp === "number" ? json.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  function scheduleRefresh(accessToken: string) {
    if (refreshTimer) clearTimeout(refreshTimer);

    const exp = readExp(accessToken);
    if (exp === null) return;

    const delay = Math.max(exp - Date.now() - 30_000, 0);

    refreshTimer = setTimeout(async () => {
      try {
        const newToken = await refreshToken();
        scheduleRefresh(newToken);
      } catch {}
    }, delay);
  }

  function stopScheduledRefresh() {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  }

  const refreshToken = async () => {
    isLoading.value = true;
    try {
      const { data } = await api.post("/refresh");
      tokenStore.set(data.accessToken);
      isAuthenticated.value = true;
      scheduleRefresh(data.accessToken);
      return data.accessToken;
    } catch (error) {
      clearSession();
      throw error;
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

  type OAuthProvider = "google" | "github";

  const loginWithProvider = (provider: OAuthProvider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  // const loginWithCredentials = async (
  //   phone: string,
  //   password: string,
  // ): Promise<string | undefined> => {
  //   try {
  //     isLoading.value = true;
  //     const res = await api.post("/login", {
  //       phone,
  //       password,
  //     });

  //     tokenStore.set(res.data.accessToken);
  //     user.value = res.data.user;

  //     isAuthenticated.value = true;
  //     showAuthModal.value = false;
  //     scheduleRefresh(res.data.accessToken);
  //     console.log("All accessible browser cookies:", document.cookie);
  //     return res.data.code;
  //   } catch (error: any) {
  //     const message = error.response?.data?.code || "Login failed";
  //     console.log("Login error:", message);
  //     return message;
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  const loginWithCredentials = async (
    phone: string,
    password: string,
  ): Promise<any> => {
    try {
      isLoading.value = true;

      const { data } = await api.post("/login", {
        phone,
        password,
      });

      tokenStore.set(data.accessToken);
      user.value = data.user;

      isAuthenticated.value = true;
      showAuthModal.value = false;
      scheduleRefresh(data.accessToken);

      console.log("All accessible browser cookies:", document.cookie);

      return {
        message: data.code,
        status: data.status,
      };
    } catch (error: any) {
      const message = error.response?.data?.code || "Login failed";
      console.log("Login error:", message);
      return {
        message,
        status: error.response?.data?.status,
      };
    } finally {
      isLoading.value = false;
    }
  };
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
    } finally {
      tokenStore.clear();
      isAuthenticated.value = false;
      user.value = null;
      showAuthModal.value = false;
      router.push("/index");
    }
  };

  const clearSession = () => {
    stopScheduledRefresh();
    tokenStore.clear();
    user.value = null;
    isAuthenticated.value = false;
    showAuthModal.value = false;
  };

  const clearRegistrationSuccess = () => {
    registrationSuccess.value = false;
  };
  const signupInit = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
  ) => {
    try {
      const message: string = await api.post("/register/init", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
      });
      return (messageFromRegisterInit.value = message);
    } catch (error: any) {
      return (messageFromRegisterInit.value =
        error.response?.data?.message || "Registration initiation failed");
    }
  };

  const signupVerifyOtp = (idToken: string, phone_number: string) =>
    api.post("/register/verify", {
      idToken: idToken,
      phone_number: phone_number,
    });

  const signupComplete = (registrationTicket: string, password: string) =>
    api.post("/register", {
      registrationTicket: registrationTicket,
      password: password,
    });

  const resetPasswordInit = (phone_number: string) =>
    api.post("/reset-password/init", { phone_number });

  const resetPasswordVerifyOtp = (idToken: string, phone_number: string) =>
    api.post("/reset-password/verify-otp", { idToken, phone_number });

  const resetPasswordComplete = (
    resetTicket: string,
    password: string,
    confirmPassword: string,
  ) =>
    api.post("/reset-password/complete", {
      resetTicket,
      password,
      confirmPassword,
    });
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
    loginWithProvider,
    loginWithCredentials,
    exchangeOAuthCode,
    logout,
    clearSession,
    clearRegistrationSuccess,
    signupInit,
    signupVerifyOtp,
    signupComplete,
    resetPasswordInit,
    resetPasswordVerifyOtp,
    resetPasswordComplete,
  };
});
