<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import LoginView from "./LoginView.vue";
import RegisterView from "./RegisterView.vue";
import LogoutModal from "./LogoutView.vue";
import MobileNav from "@/components/MobileNav.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useI18n } from "vue-i18n";
import LangDropdown from "@/components/LangDropdown.vue";
const { t } = useI18n();
const authStore = useAuthStore();

const showLogoutModal = ref(false);
const openModal = ref(false);
const openRegisterModal = ref(false);
const openLoginModal = () => {
  openModal.value = true;
  openRegisterModal.value = false;
  authStore.showAuthModal = true;
};

const closeLoginModal = (val: boolean) => {
  openModal.value = val;

  authStore.showAuthModal = val;
};

const openRegisterModalOnly = () => {
  openRegisterModal.value = true;
  openModal.value = false;
  authStore.showAuthModal = true;
};

const closeRegisterModal = (val: boolean) => {
  openRegisterModal.value = val;
  authStore.showAuthModal = val;
};

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      openModal.value = false;
      openRegisterModal.value = false;
      authStore.showAuthModal = false;
    }
  },
);

// const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = async () => {
  await authStore.logout();
};

const query = ref("");
const isSearchOpen = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(["search", "clear"]);

async function openSearch() {
  isSearchOpen.value = true;
  await nextTick();
  searchInput.value?.focus();
}

function closeSearch() {
  isSearchOpen.value = false;
}

function onSearch() {
  emit("search", query.value);
  closeSearch();
}

function onClear() {
  query.value = "";
  emit("clear");
}
</script>
<template>
  <div class="fixed inset-x-0 top-0 z-[1000] dark:!bg-navbar">
    <nav class="container mx-auto bg-dominant py-2 dark:!bg-navbar">
      <div class="flex justify-between items-center">
        <div class="lg:hidden shrink-0">
          <MobileNav
            @open-login="openLoginModal"
            @open-register="openRegisterModalOnly"
            @logout="handleLogout"
          />
        </div>
        <!-- Left Menu -->
        <div class="hidden lg:flex lg:items-center font-bold">
          <ul class="flex items-center">
            <!-- Products Dropdown -->
            <li class="relative group">
              <span
                class="flex items-center text-text hover:cursor-pointer hover:text-accent active:text-accent gap-2 transition-all duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 active:after:scale-x-100"
              >
                {{ t("nav.products") }}
                <span
                  class="w-1.5 h-1.5 border-r-2 border-b-2 border-black transform rotate-45 transition-transform duration-300 translate-y-[-2px] group-hover:rotate-[225deg] group-hover:translate-y-[1px]"
                ></span>
              </span>

              <div
                class="absolute left-0 pt-4 w-60 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50"
              >
                <div
                  class="bg-dominant border border-gray-100 shadow-xl py-2 rounded-md"
                >
                  <RouterLink to="/">
                    <a
                      class="block px-6 py-3 text-[16px] text-text hover:text-accent relative after:absolute after:left-6 after:right-6 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 transition-colors"
                    >
                      {{ t("nav.kitchen") }}
                    </a>
                  </RouterLink>
                  <RouterLink to="/products/fashion">
                    <a
                      class="block px-6 py-3 text-[16px] text-text hover:text-accent relative after:absolute after:left-6 after:right-6 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 transition-colors"
                    >
                      {{ t("nav.fashion") }}
                    </a>
                  </RouterLink>
                  <RouterLink to="/products/Electronics">
                    <a
                      class="block px-6 py-3 text-[16px] text-text hover:text-accent relative after:absolute after:left-6 after:right-6 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 transition-colors"
                    >
                      {{ t("nav.electronics") }}
                    </a>
                  </RouterLink>
                  <div class="mx-6 border-t border-gray-50 my-1"></div>
                  <RouterLink to="/products/all">
                    <a
                      class="block px-6 py-3 text-[16px] text-text hover:text-accent relative after:absolute after:left-6 after:right-6 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 transition-colors"
                    >
                      {{ t("nav.shopAll") }}
                    </a>
                  </RouterLink>
                </div>
              </div>
            </li>

            <li
              class="px-5 py-3 transition-colors cursor-pointer rounded text-text hover:text-accent relative after:absolute after:left-5 after:right-5 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {{ t("nav.men") }}
            </li>
            <li
              class="px-5 py-3 transition-colors cursor-pointer rounded text-text hover:text-accent relative after:absolute after:left-5 after:right-5 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {{ t("nav.boys") }}
            </li>
            <li
              class="px-5 py-3 transition-colors cursor-pointer rounded text-text hover:text-accent relative after:absolute after:left-5 after:right-5 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {{ t("nav.girls") }}
            </li>
          </ul>
        </div>

        <!-- Logo -->
        <div class="justify-self-center">
          <p
            class="text-normal text-[20px] hidden sm:text-2xl lg:flex lg:text-2xl xl:text-4xl font-[900] tracking-tighter"
          >
            VUT SHOP
          </p>
        </div>
        <!-- Right Side -->
        <div class="flex items-center gap-6 not-odd: justify-self-end">
          <!-- Search -->

          <!-- Full search bar overlay, opens on click -->
          <Transition name="fade">
            <div
              v-if="isSearchOpen"
              class="fixed inset-0 z-50 bg-dominant"
              @click.self="closeSearch"
            >
              <div class="w-full bg-dominant shadow-md">
                <!-- Top dark strip -->
                <div class="h-2 bg-dominant w-full"></div>

                <!-- Search bar -->
                <div class="px-6 py-4">
                  <div
                    class="relative flex items-center border-b border-gray-300 pb-3"
                  >
                    <input
                      ref="searchInput"
                      v-model="query"
                      type="text"
                      placeholder="What are you searching for?"
                      class="w-full pr-16 text-base text-text outline-none bg-transparent"
                      @keyup.enter="onSearch"
                      @keyup.esc="closeSearch"
                    />

                    <div class="absolute right-0 flex items-center gap-4">
                      <!-- Search icon -->
                      <button
                        type="button"
                        class="text-gray-800 hover:text-gray-500 transition-colors"
                        aria-label="Search"
                        @click="onSearch"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </button>

                      <!-- Close icon -->
                      <button
                        type="button"
                        class="text-gray-800 hover:text-gray-500 transition-colors"
                        aria-label="Close search"
                        @click="closeSearch"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          <!-- Icons -->
          <div class="flex items-center gap-3 text-text">
            <button
              type="button"
              @click="openSearch"
              class="hover:text-accent transition-colors hover:cursor-pointer p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            <button
              class="hover:text-accent transition-colors hover:cursor-pointer"
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            <button
              class="hover:text-accent cursor-pointer transition-colors"
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
              class="relative hover:text-accent cursor-pointer transition-colors"
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
                class="absolute -top-1 -right-1 bg-accent text-white text-[16px] font-bold px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
              >
                0
              </span>
            </button>

            <LangDropdown />
            <ThemeToggle />
          </div>

          <!-- Auth Buttons -->
          <div
            v-if="!authStore.isAuthenticated"
            class="hidden lg:flex items-center gap-3 text-[16px] font-bold text-text"
          >
            <button
              @click="openLoginModal"
              class="btn-secondary cursor-pointer dark:!bg-accent dark:hover:!border-text"
            >
              {{ t("nav.signIn") }}
            </button>
            <button
              @click="openRegisterModalOnly"
              class="btn-secondary dark:!bg-accent dark:hover:!border-text cursor-pointer"
            >
              {{ t("nav.register") }}
            </button>
          </div>
          <!-- user info -->
          <!-- In your Navbar -->
          <div
            v-else
            class="hidden lg:flex items-center gap-3 text-sm text-text"
          >
            <button
              @click="showLogoutModal = true"
              class="flex items-center gap-2.5 hover:text-black transition-colors cursor-pointer group"
            >
              <!-- Avatar -->
              <div
                class="w-8 h-8 rounded-full overflow-hidden border border-dominant"
              >
                <img
                  v-if="authStore.user?.avatar_url"
                  :src="authStore.user.avatar_url"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Name -->
              <span class="flex items-center gap-1 text-[16px]">
                {{ authStore.fullName?.firstName || "" }}
                {{ authStore.fullName?.lastName || "" }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  class="size-4 opacity-70 group-hover:opacity-100"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
          </div>

          <!-- Logout Modal using your BaseModal -->
          <BaseModal :open="showLogoutModal" @close="showLogoutModal = false">
            <LogoutModal @close="showLogoutModal = false" />
          </BaseModal>
        </div>
      </div>
    </nav>

    <BaseModal :open="openModal">
      <LoginView
        v-if="openModal"
        @close="closeLoginModal"
        @open-register="openRegisterModalOnly"
      ></LoginView>
    </BaseModal>

    <BaseModal :open="openRegisterModal">
      <RegisterView
        v-if="openRegisterModal"
        @close="closeRegisterModal"
        @open-login="openLoginModal"
      ></RegisterView>
    </BaseModal>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-from {
  opacity: 0;
}
</style>
