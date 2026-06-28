<template>
  <div class="min-h-screen flex items-center justify-center bg-[#3F2A1D] p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Top right close button -->
      <div class="flex justify-end p-4">
        <button
          @click="emitClose"
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
        >
          ✕
        </button>
      </div>

      <div class="px-8 pb-10">
        <!-- Header -->
        <h1 class="text-3xl font-semibold text-gray-900 text-center mb-1">
          Welcome back, {{ user?.first_name }}!
        </h1>
        <p class="text-gray-600 text-center mb-8">
          Are you sure you want to log out?
        </p>

        <!-- User Info Card -->
        <div class="bg-gray-50 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              v-if="user?.avatar_url"
              :src="user.avatar_url"
              alt="Profile"
              class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center text-4xl"
            >
              👤
            </div>
          </div>

          <!-- User Details -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-xl text-gray-900 truncate">
              {{ user?.first_name }} {{ user?.last_name }}
            </p>
            <p class="text-gray-500 text-sm truncate">{{ user?.email }}</p>
            <p v-if="user?.createdAt" class="text-xs text-gray-400 mt-1">
              Member since {{ formatYear(user.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          :disabled="loading"
          class="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition-colors text-white font-medium py-4 px-6 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-sm"
        >
          <span v-if="loading" class="animate-spin inline-block w-5 h-5"
            >⟳</span
          >
          Log out
        </button>

        <!-- Cancel -->
        <button
          @click="emitCancel"
          class="w-full mt-3 bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium py-4 px-6 rounded-2xl"
        >
          Cancel
        </button>

        <p class="text-center text-xs text-gray-400 mt-8">
          You will need to sign in again to access your account
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const loading = ref(false);

const handleLogout = async () => {
  loading.value = true;

  try {
    await authStore.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    loading.value = false;
  }
};

const emitCancel = () => {
  // You can emit or use router.go(-1)
  // emit('cancel')
};

const emitClose = () => {
  // emit('close')
};

// Helper
const formatYear = (date: string | Date) => {
  return new Date(date).getFullYear();
};
</script>
