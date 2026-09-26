import axios from "axios";
import { tokenStore } from "./tokenStore.ts";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { useAuthStore } from "@/stores/auth.ts";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

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

let refreshInFlight: Promise<string> | null = null;

function silentRefresh(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  const authStore = useAuthStore();
  refreshInFlight = authStore
    .refreshToken()
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

function isPublicEndpoint(url: string): boolean {
  return ["/login", "/register", "/refresh", "/logout"].some((p) =>
    url.includes(p),
  );
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  const token = tokenStore.get();

  if (token) {
    authStore.isAuthenticated = true;
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!token || isPublicEndpoint(config.url ?? "")) {
    return config;
  }

  const exp = readExp(token);
  if (exp === null || exp - Date.now() > 30_000) {
    return config;
  }

  try {
    const fresh = await silentRefresh();
    config.headers.Authorization = `Bearer ${fresh}`;
  } catch {
  
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const original = err.config as CustomAxiosRequestConfig;
    const authStore = useAuthStore();

    if (
      err.response?.status !== 401 ||
      !original ||
      original._retry ||
      isPublicEndpoint(original.url ?? "") ||
      !original.headers?.Authorization
    ) {
      return Promise.reject(err);
    }

    original._retry = true;

    return silentRefresh()
      .then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      })
      .catch((refreshErr) => {
        authStore.clearSession();
        tokenStore.clear();
        return Promise.reject(refreshErr);
      });
  },
);

export default api;