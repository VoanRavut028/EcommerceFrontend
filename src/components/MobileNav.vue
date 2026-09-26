<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();
const isMobileMenuOpen = ref(false);
const showProducts = ref(false);
const emit = defineEmits<{
  (event: "open-login"): void;
  (event: "open-register"): void;
  (event: "logout"): void;
}>();

const openLogin = () => {
  emit("open-login");
  isMobileMenuOpen.value = false;
};

const openRegister = () => {
  emit("open-register");
  isMobileMenuOpen.value = false;
};

const logout = () => {
  emit("logout");
  isMobileMenuOpen.value = false;
};

const toggleProducts = () => {
  showProducts.value = !showProducts.value;
};
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      @click="isMobileMenuOpen = true"
      class="lg:hidden text-text hover:text-accent transition-colors cursor-pointer focus:outline-none"
      :aria-label="t('nav.products')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-7 h-7"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>

    <RouterLink
      to="/index"
      class="text-[20px] sm:text-2xl lg:hidden font-[900] tracking-tighter text-text hover:text-accent transition-colors"
    >
      VUT SHOP
    </RouterLink>
  </div>

  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-[2000] lg:hidden overflow-y-auto bg-dominant"
      @click="isMobileMenuOpen = false"
    >
      <div
        class="min-h-full bg-dominant p-6 flex flex-col"
        @click.stop
      >
        <div class="flex justify-between items-center">
          <span class="text-2xl font-[900] tracking-tighter text-text"
            >VUT SHOP</span
          >
          <button
            type="button"
            @click="isMobileMenuOpen = false"
            class="p-2 -m-2 text-gray-500 hover:text-white hover:bg-black cursor-pointer transition-colors"
            :aria-label="t('registerFlow.close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="mt-8 text-text">
          <div class="mb-1">
            <button
              type="button"
              @click="toggleProducts"
              class="flex items-center justify-between w-full py-3 font-semibold border-b border-border hover:text-accent transition-colors"
            >
              {{ t("nav.products") }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4 transition-transform duration-300"
                :class="{ 'rotate-180': showProducts }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <div v-if="showProducts" class="pl-4 mt-2 space-y-2 text-sm">
              <RouterLink
                to="/"
                class="block py-2 text-text hover:text-accent transition-colors"
                @click="isMobileMenuOpen = false"
                >{{ t("nav.kitchen") }}</RouterLink
              >
              <RouterLink
                to="/products/fashion"
                class="block py-2 text-text hover:text-accent transition-colors"
                @click="isMobileMenuOpen = false"
                >{{ t("nav.fashion") }}</RouterLink
              >
              <RouterLink
                to="/products/Electronics"
                class="block py-2 text-text hover:text-accent transition-colors"
                @click="isMobileMenuOpen = false"
                >{{ t("nav.electronics") }}</RouterLink
              >
              <RouterLink
                to="/products/all"
                class="block py-2 text-text hover:text-accent transition-colors"
                @click="isMobileMenuOpen = false"
                >{{ t("nav.shopAll") }}</RouterLink
              >
            </div>
          </div>

          <RouterLink
            to="#"
            class="block py-3 font-semibold border-b border-border hover:text-accent transition-colors"
            @click="isMobileMenuOpen = false"
            >{{ t("nav.men") }}</RouterLink
          >
          <RouterLink
            to="#"
            class="block py-3 font-semibold border-b border-border hover:text-accent transition-colors"
            @click="isMobileMenuOpen = false"
            >{{ t("nav.boys") }}</RouterLink
          >
          <RouterLink
            to="#"
            class="block py-3 font-semibold border-b border-border hover:text-accent transition-colors"
            @click="isMobileMenuOpen = false"
            >{{ t("nav.girls") }}</RouterLink
          >
        </nav>

        <div
          v-if="!authStore.isAuthenticated"
          class="mt-auto pt-10 space-y-3"
        >
          <button
            type="button"
            @click="openLogin"
            class="w-full h-10 bg-slate-950 text-white font-semibold text-sm hover:opacity-90 transition cursor-pointer"
          >
            {{ t("nav.signIn") }}
          </button>
          <button
            type="button"
            @click="openRegister"
            class="w-full h-10 border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            {{ t("nav.register") }}
          </button>
        </div>

        <div v-else class="mt-auto pt-10 space-y-3">
          <RouterLink
            to="/dashboard"
            class="block text-sm font-semibold text-text hover:text-accent transition-colors"
            @click="isMobileMenuOpen = false"
            >Dashboard</RouterLink
          >
          <span class="block text-sm text-gray-500">
            {{ authStore.fullName?.firstName || "" }}
            {{ authStore.fullName?.lastName || "" }}
          </span>
          <button
            type="button"
            @click="logout"
            class="text-sm text-red-600 hover:text-red-500 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>