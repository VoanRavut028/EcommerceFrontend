<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "../composables/useModal.ts";
import BaseModal from "@/components/BaseModal.vue";
import LoginView from "./LoginView.vue";
import RegisterView from "./RegisterView.vue";

const openModal = ref(false);
const openRegisterModal = ref(false);
interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const isMobileMenuOpen = ref(false);
const showProducts = ref(false);

const toggleProducts = () => {
  showProducts.value = !showProducts.value;
};
</script>
<template>
  <div>
    <nav
      class="w-full bg-white border-b border-gray-100 font-sans tracking-tight py-2"
    >
      <!-- Mobile Hamburger -->
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
      <div class="mx-auto flex items-center justify-between">
        <!-- Left Menu -->
        <div
          class="hidden lg:flex items-center gap-8 text-[13px] font-bold text-gray-800"
        >
          <ul class="flex items-center text-[1rem]">
            <!-- Products Dropdown -->
            <li class="relative group cursor-pointer">
              <button
                class="flex items-center gap-2 uppercase transition-all duration-300"
              >
                Products
                <span
                  class="w-1.5 h-1.5 border-r-2 border-b-2 border-black transform rotate-45 transition-transform duration-300 translate-y-[-2px] group-hover:rotate-[225deg] group-hover:translate-y-[1px]"
                ></span>
              </button>

              <div
                class="absolute left-0 pt-4 w-60 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50"
              >
                <div
                  class="bg-white border border-gray-100 shadow-xl py-2 rounded-md"
                >
                  <RouterLink to="/">
                    <a
                      class="block px-6 py-3 text-[10px] tracking-widest uppercase text-gray-950 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      Kitchen
                    </a>
                  </RouterLink>
                  <RouterLink to="/products/fashion">
                    <a
                      class="block px-6 py-3 text-[10px] tracking-widest uppercase text-gray-950 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      FASHION
                    </a>
                  </RouterLink>
                  <RouterLink to="/products/Electronics">
                    <a
                      class="block px-6 py-3 text-[10px] tracking-widest uppercase text-gray-950 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      ELECTRONICS
                    </a>
                  </RouterLink>
                  <div class="mx-6 border-t border-gray-50 my-1"></div>
                  <RouterLink to="/products/all">
                    <a
                      class="block px-6 py-3 text-[10px] tracking-widest uppercase text-gray-950 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      Shop All
                    </a>
                  </RouterLink>
                </div>
              </div>
            </li>

            <li
              class="hover:bg-gray-100 px-5 py-3 transition-colors cursor-pointer rounded"
            >
              MEN
            </li>
            <li
              class="hover:bg-gray-100 px-5 py-3 transition-colors cursor-pointer rounded"
            >
              BOYS
            </li>
            <li
              class="hover:bg-gray-100 px-5 py-3 transition-colors cursor-pointer rounded"
            >
              GIRLS
            </li>
          </ul>
        </div>

        <!-- Logo -->
        <div>
          <span class="text-3xl font-[900] tracking-tighter text-black"
            >VUT SHOP</span
          >
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-6">
          <!-- Search -->
          <div class="relative flex items-center">
            <span class="absolute left-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              class="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-48"
            />
          </div>

          <!-- Icons -->
          <div class="flex items-center gap-4 text-gray-700">
            <button class="hover:text-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            <button
              class="hover:text-black cursor-pointer transition-colors"
              @click="$router.push('/MyWishlist')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            <button
              class="relative hover:text-black cursor-pointer transition-colors"
              @click="$router.push('/cart')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.11 13.5A2.25 2.25 0 0 1 18.477 24H5.523a2.25 2.25 0 0 1-2.238-2.493l1.11-13.5A2.25 2.25 0 0 1 6.63 6h10.74a2.25 2.25 0 0 1 2.238 2.007Z"
                />
              </svg>
              <span
                class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
              >
                0
              </span>
            </button>
          </div>

          <!-- Auth Buttons -->
          <div
            class="flex items-center gap-3 text-[13px] font-bold text-gray-800"
          >
            <button
              @click="openModal = true"
              class="bg-[#e8def8] text-[#21005d] rounded-full px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-[#d8cef0] transition-colors"
            >
              SIGN IN
            </button>
            <button
              @click="openRegisterModal = true"
              class="bg-[#6750a4] text-white rounded-full px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-[#5b4397] transition-colors"
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Sidebar -->
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
            <!-- Sidebar Header -->
            <div class="flex justify-between items-center mb-8">
              <span class="text-3xl font-[900] tracking-tighter text-black"
                >PVR SHOP</span
              >
              <button @click="isMobileMenuOpen = false" class="text-gray-500">
                ✕
              </button>
            </div>

            <!-- Menu Items -->
            <div class="flex flex-col space-y-6 text-[15px] font-medium">
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

            <!-- Auth Buttons in Sidebar -->
            <div class="mt-10 space-y-4">
              <button
                @click="
                  openModal = true;
                  isMobileMenuOpen = false;
                "
                class="w-full bg-[#e8def8] text-[#21005d] rounded-full py-3.5 text-sm font-medium"
              >
                SIGN IN
              </button>
              <button
                @click="
                  openRegisterModal = true;
                  isMobileMenuOpen = false;
                "
                class="w-full bg-[#6750a4] text-white rounded-full py-3.5 text-sm font-medium"
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <BaseModal :open="openModal" @close="openModal = false">
      <LoginView
        @close="openModal = false"
        @close-register="
          openModal = false;
          openRegisterModal = true;
        "
      ></LoginView>
    </BaseModal>
    <BaseModal :open="openRegisterModal" @close="openRegisterModal = false">
      <RegisterView
        @close="openRegisterModal = false"
        @open-login="
          openRegisterModal = false;
          openModal = true;
        "
      ></RegisterView>
    </BaseModal>
  </div>
</template>
