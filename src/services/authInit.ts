import { tokenStore } from "@/lib/tokenStore";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.ts";

const baseURL = import.meta.env.VITE_API_URL as string;

const authInitApi = axios.create({ baseURL, withCredentials: true });

let isRefreshing = false;
let pendingRequests: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const onRefreshed = (token: string) => {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
};

const onRefreshFailed = (err: unknown) => {
  pendingRequests.forEach(({ reject }) => reject(err));
  pendingRequests = [];
};

// authInitApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config as any;

//     const isTokenExpired =
//       error.response?.status === 401 ||
//       (error.response?.status === 400 &&
//         error.response?.data?.message?.toLowerCase().includes("jwt expired"));

//     if (!isTokenExpired || originalRequest?._retry) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (!isRefreshing) {
//       isRefreshing = true;

//       try {
//         const { data } = await authInitApi.post("/refresh"); // <- rawApi, not authInitApi
//         tokenStore.set(data.accessToken);
//         onRefreshed(data.accessToken);

//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`; // <- was missing
//         return authInitApi(originalRequest);
//       } catch (refreshError) {
//         console.log("❌ Refresh failed - logging out");
//         onRefreshFailed(refreshError);

//         // const authStore = useAuthStore();
//         // await authStore.logout(); // logout's own request should also use rawApi, see below

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // Queue concurrent requests while refresh is in flight
//     return new Promise((resolve, reject) => {
//       pendingRequests.push({
//         resolve: (token: string) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           resolve(authInitApi(originalRequest));
//         },
//         reject,
//       });
//     });
//   },
// );

export default authInitApi;
