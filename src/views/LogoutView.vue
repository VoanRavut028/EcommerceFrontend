<!-- src/components/LogoutModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'  

const authStore = useAuthStore()
const emit = defineEmits(['close'])

const loading = ref(false)

const handleLogout = async () => {
  loading.value = true
  try {
    await authStore.logout()        
    emit('close')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
    <!-- Header -->
    <div class="flex justify-between items-center px-6 py-5 border-b">
      <h2 class="text-xl font-semibold text-gray-900">Log out</h2>
      <button
        @click="emit('close')"
        class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-8 text-center">
      <div class="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <span class="text-5xl">👋</span>
      </div>

      <h3 class="text-xl font-medium text-gray-900 mb-2">
        Are you sure you want to log out?
      </h3>

      <!-- User Info -->
      <div class="inline-flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-3 mb-8">
        <img
          v-if="authStore.user?.avatar_url"
          :src="authStore.user.avatar_url"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div v-else class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          👤
        </div>
        <div class="text-left">
          <p class="font-medium text-gray-900">
            {{ authStore.fullName?.firstName }} {{ authStore.fullName?.lastName }}
          </p>
          <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        :disabled="loading"
        class="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition-colors text-white font-medium py-3.5 rounded-2xl text-lg mb-3"
      >
        {{ loading ? 'Logging out...' : 'Yes, Log out' }}
      </button>

      <button
        @click="emit('close')"
        class="w-full text-gray-600 hover:text-gray-800 font-medium py-3"
      >
        Cancel
      </button>
    </div>
  </div>
</template>