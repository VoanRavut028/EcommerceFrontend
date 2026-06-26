import { defineStore } from "pinia";
import api from "@/lib/axios";
import { tokenStore } from "@/lib/tokenStore.ts";
import authInitApi from "@/services/authInit";
import router from "@/routers/index";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    registrationSuccess: false,
  }),

  getters: {
    fullName: (state: any) => state.user?.name ?? "",
    avatar: (state: any) => state.user?.avatar ?? null,
  },

  actions: {
    // auth.ts
    async fetchUser() {
      const { data } = await api.get("/profile");
      this.user = data.user;
      this.isAuthenticated = true;
    },
    // ── Called on app boot to restore session from refresh token cookie ───────
    async bootstrap() {
      this.isLoading = true;
      try {
        const { data } = await api.post("/refresh");
        tokenStore.set(data.accessToken);
        this.user = data.user;
        this.isAuthenticated = true;
      } catch {
        // No valid refresh token — user is logged out, that's fine
        this.clearSession();
      } finally {
        this.isLoading = false;
      }
    },

    async loginWithCredentials(email: String, password: String) {
      try {
        console.log(`Email ${email}`);
        console.log(`Password ${password}`);

        const { data } = await authInitApi.post("/login", {
          email: email,
          password: password,
        });
        console.log(`Refresh token ${data.refreshToken}`);
        tokenStore.set(data.accessToken);
        this.user = data.user;
        this.isAuthenticated = true;
        console.log("All accessible browser cookies:", document.cookie);
      } catch (error: any) {
        const message = error.response?.data?.message || "Login failed";
        console.log(error);
        throw new Error(message);
      }
    },

    // ── OAuth callback: send code to backend, receive tokens ──────────────────
    async exchangeOAuthCode(code: any, state: any, provider: any) {
      const storedState = sessionStorage.getItem("oauth_state");
      if (!storedState || storedState !== state) {
        throw new Error("State mismatch — possible CSRF attack");
      }
      sessionStorage.removeItem("oauth_state");

      const { data } = await api.post(`/auth/${provider}/callback`, { code });
      tokenStore.set(data.accessToken);
      this.user = data.user;
      this.isAuthenticated = true;
    },

    // ── Logout: tell backend to clear the httpOnly cookie ────────────────────
    async logout() {
      try {
        await authInitApi.post("/logout"); // bypasses interceptor — can't retrigger refresh
      } catch {
        // ignore — we're logging out regardless
      } finally {
        tokenStore.clear();
        router.push("/login");
      }
    },
    // ── Internal: wipe everything ─────────────────────────────────────────────
    clearSession() {
      tokenStore.clear();
      this.user = null;
      this.isAuthenticated = false;
    },

    // ── Clear registration success flag ──────────────────────────────────────
    clearRegistrationSuccess() {
      this.registrationSuccess = false;
    },
  },
});
