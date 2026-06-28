import axios from "axios";
import { tokenStore } from "./tokenStore.ts";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import authInitApi from "@/services/authInit.ts";

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
  const token = tokenStore.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

interface RefreshResponse {
  accessToken: string;
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as CustomAxiosRequestConfig;

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
      const { data } = await authInitApi.post<RefreshResponse>("/refresh");
      const newToken = data.accessToken;

      tokenStore.set(newToken);

      refreshQueue.forEach(({ resolve }) => resolve(newToken));
      refreshQueue = [];

      if (original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`;
      }
      return api(original);
    } catch (refreshErr) {
      refreshQueue.forEach(({ reject }) => reject(refreshErr));
      refreshQueue = [];
      tokenStore.clear();
      window.location.href = "/index";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
