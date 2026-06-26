<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Testing from'./views/Testing.vue'
const authStore = useAuthStore();

</script>

<template>
 
    <!--<Testing></Testing>-->
  <router-view />
</template>




