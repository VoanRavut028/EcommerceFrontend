<!-- src/views/LogoutView.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();
const emit = defineEmits(["close"]);

const loading = ref(false);

const handleLogout = async () => {
  loading.value = true;
  try {
    await authStore.logout();
    emit("close");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm bg-secondary text-text overflow-hidden">
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-border px-4 sm:px-6 py-3 sm:py-4"
    >
      <p
        class="text-[11px] font-semibold uppercase tracking-[0.3em] text-text-muted"
      >
        {{ t("logout.account") }}
      </p>
      <button
        @click="emit('close')"
        :aria-label="t('logout.close')"
        class="p-1 text-text-muted transition-colors hover:text-text-strong cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="px-4 sm:px-6 py-6 sm:py-8 text-center">
      <!-- Brand mark -->
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-dominant shadow-sm"
      >
        <img
          v-if="authStore.user?.avatar_url"
          :src="authStore.user.avatar_url"
          alt="Avatar"
          class="h-16 w-16 rounded-full object-cover"
        />
        <span
          v-else
          class="text-lg font-black tracking-tighter text-text-strong"
        >
          {{ authStore.fullName?.firstName?.[0] || "V" }}
          {{ authStore.fullName?.lastName?.[0] || "S" }}
        </span>
      </div>

      <h2
        class="text-xl font-bold tracking-tight text-text-strong"
      >
        {{ t("logout.title") }}
      </h2>
      <p class="mt-2 text-sm leading-6 text-text-muted">
        {{ t("logout.subtitle") }}
      </p>

      <!-- Signed in as -->
      <div
        class="mt-6 flex items-center justify-center gap-3 border-y border-border py-4"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold uppercase text-text"
        >
          <img
            v-if="authStore.user?.avatar_url"
            :src="authStore.user.avatar_url"
            alt=""
            class="h-9 w-9 rounded-full object-cover"
          />
          <span v-else>
            {{ authStore.fullName?.firstName?.[0] || "" }}
            {{ authStore.fullName?.lastName?.[0] || "" }}
          </span>
        </div>
        <div class="min-w-0 text-left">
          <p class="truncate text-sm font-medium text-text-strong">
            {{ authStore.fullName?.firstName || "" }}
            {{ authStore.fullName?.lastName || "" }}
          </p>
          <p class="truncate text-xs text-text-muted">
            {{ authStore.user?.email || t("logout.member") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-3 border-t border-border px-4 sm:px-6 py-4 sm:py-5">
      <button
        @click="handleLogout"
        :disabled="loading"
        class="flex h-10 sm:h-11 w-full items-center justify-center gap-2 rounded-none bg-text-strong text-sm font-semibold text-secondary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          v-if="loading"
          class="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
            stroke-opacity="0.25"
          />
          <path
            d="M20 12a8 8 0 10-8 8"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        {{ loading ? t("logout.loggingOut") : t("logout.confirm") }}
      </button>

      <button
        @click="emit('close')"
        :disabled="loading"
        class="w-full py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-strong cursor-pointer disabled:cursor-not-allowed"
      >
        {{ t("logout.cancel") }}
      </button>
    </div>
  </div>
</template>