<template>
  <RouterLink :to="to" class="flex items-center gap-1">
    <mat-icon>arrow_back</mat-icon>
    {{ label }}
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

const props = withDefaults(
  defineProps<{
    label?: string;
    to?: string;
  }>(),
  {
    label: "Back",
    to: "/",
  },
);
</script>
