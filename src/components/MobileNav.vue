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
      class="lg:hidden text-gray-800 focus:outline-none"
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
      class="text-[20px] sm:text-2xl lg:hidden font-[900] tracking-tighter text-black"
    >
      VUT SHOP
    </RouterLink>
  </div>

  <div
    v-if="isMobileMenuOpen"
    class="fixed inset-0 bg-black/50 z-[2000] lg:hidden"
    @click="isMobileMenuOpen = false"
  >
    <div
      class="w-72 bg-white h-full shadow-2xl transform transition-transform duration-300"
      :class="{
        'translate-x-0': isMobileMenuOpen,
        '-translate-x-full': !isMobileMenuOpen,
      }"
      @click.stop
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-8">
          <span class="text-3xl font-[900] tracking-tighter text-black"
            >PVR SHOP</span
          >
          <button @click="isMobileMenuOpen = false" class="text-gray-500">
            ✕
          </button>
        </div>

        <div class="flex flex-col space-y-6 text-[15px]">
          <div>
            <button
              @click="toggleProducts"
              class="flex items-center justify-between w-full py-3 border-b"
            >
              Products
              <span :class="{ 'rotate-180': showProducts }">▼</span>
            </button>
            <div v-if="showProducts" class="pl-4 mt-3 space-y-3 text-sm">
              <RouterLink
                to="/"
                class="block py-2"
                @click="isMobileMenuOpen = false"
                >Kitchen</RouterLink
              >
              <RouterLink
                to="/products/fashion"
                class="block py-2"
                @click="isMobileMenuOpen = false"
                >Fashion</RouterLink
              >
              <RouterLink
                to="/products/Electronics"
                class="block py-2"
                @click="isMobileMenuOpen = false"
                >Electronics</RouterLink
              >
              <RouterLink
                to="/products/all"
                class="block py-2"
                @click="isMobileMenuOpen = false"
                >Shop All</RouterLink
              >
            </div>
          </div>

          <RouterLink
            to="#"
            class="py-3 border-b"
            @click="isMobileMenuOpen = false"
            >MEN</RouterLink
          >
          <RouterLink
            to="#"
            class="py-3 border-b"
            @click="isMobileMenuOpen = false"
            >BOYS</RouterLink
          >
          <RouterLink
            to="#"
            class="py-3 border-b"
            @click="isMobileMenuOpen = false"
            >GIRLS</RouterLink
          >
        </div>

        <div
          v-if="!authStore.isAuthenticated"
          class="mt-10 space-y-4 lg:hidden"
        >
          <button
            @click="openLogin"
            class="w-full bg-[#e8def8] text-[#21005d] rounded-full py-3.5 text-sm"
          >
            SIGN IN
          </button>
          <button
            @click="openRegister"
            class="w-full bg-[#6750a4] text-white rounded-full py-3.5 text-sm"
          >
            REGISTER
          </button>
        </div>

        <div v-else class="mt-6 space-y-3">
          <RouterLink to="/dashboard" class="block text-sm text-slate-700"
            >Dashboard</RouterLink
          >
          <span class="block text-sm text-slate-600">
            {{ authStore.fullName?.firstName || "" }}
            {{ authStore.fullName?.lastName || "" }}
          </span>
          <button @click="logout" class="text-sm text-red-600">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>
