<!-- src/views/DashboardView.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";

import api from "@/lib/axios";
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  provider: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}
const user = ref<UserProfile | null>(null);
const error = ref<string>("");

onMounted(async () => {
  try {
    const res = await api.get<ApiResponse>("/profile");
    user.value = res.data.data;
  } catch (e) {
    error.value = "Unauthorized — token may be invalid or expired";
  }
});
</script>

<template>
  <div class="p-8">
    <div v-if="user">
      <h1 class="text-xl font-bold">Welcome, {{ user.name }}</h1>
      <pre class="mt-4 bg-gray-100 p-4 rounded text-sm">{{
        JSON.stringify(user, null, 2)
      }}</pre>
    </div>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <p v-else class="text-gray-400">Loading...</p>
  </div>
</template>
