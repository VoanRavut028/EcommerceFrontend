import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { tokenStore } from "@/lib/tokenStore";
import authInitApi from "@/services/authInit";
const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("@/views/HomePage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/callbackview",
    name: "callback",
    component: () => import("@/views/CallbackView.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/Testing.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ─── Bootstrap once per page load ───────────────────────────────────────────
let bootstrapped = false;

// router.beforeEach(async (to) => {
//   const authStore = useAuthStore();
//   debugger;
//   if (!bootstrapped) {
//     bootstrapped = true;
//     await authStore.bootstrap();
//   }

//   // Guest-only routes (redirect logged-in users away from /login)
//   if (to.meta.guestOnly && authStore.isAuthenticated) {
//     return { name: "dashboard" };
//   }

//   // Protected routes
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     // Remember where they were going
//     sessionStorage.setItem("post_login_redirect", to.fullPath);
//     return { name: "login" };
//   }
// });

let authInit: Promise<void> | null = null;
const initAuth = () => {
  if (!authInit) {
    console.log("baseURL:", authInitApi.defaults.baseURL);
    console.log("withCredentials:", authInitApi.defaults.withCredentials);

    authInit = authInitApi
      .post("/refresh")
      .then(({ data }) => tokenStore.set(data.accessToken))
      .catch((err) => {
        console.log(
          "refresh failed:",
          err.response?.status,
          err.response?.data,
        );
        tokenStore.clear();
      });
  }
  return authInit;
};

router.beforeEach(async (to, from, next) => {
  await initAuth();

  const isAuthenticated = tokenStore.get() !== null;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});
export default router;
