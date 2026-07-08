import axios from "axios";
import { tokenStore } from "./tokenStore.ts";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { useAuthStore } from "@/stores/auth.ts";
interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  const token = tokenStore.get();

  console.log(`Token is the intercepter : ${token}`);
  if (token) {
    authStore.isAuthenticated = true;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as CustomAxiosRequestConfig;
    const authStore = useAuthStore();
    if (err.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        if (original.headers) {
          original.headers.Authorization = `Bearer ${token}`;
        }
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const token = await authStore.refreshToken();
      refreshQueue.forEach(({ resolve }) => resolve(token));
      refreshQueue = [];
      if (original.headers) {
        original.headers.Authorization = `Bearer ${token}`;
      }
      return api(original);
    } catch (refreshErr) {
      refreshQueue.forEach(({ reject }) => reject(refreshErr));
      refreshQueue = [];
      authStore.clearSession();
      tokenStore.clear();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
