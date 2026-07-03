<template>
  <div class="flex items-center flex-col justify-center bg-slate-50 px-10">
    <div class="w-md h-fit bg-white shadow-lg !p-10 relative">
      <!-- Close Button -->
      <button
        @click="handleClosePopup"
        class="absolute !top-3 !right-3 text-black hover:text-white cursor-pointer hover:bg-black hover:rounded-full !p-3"
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
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Header -->
      <div class="text-lg">
        <h1 class="text-3xl font-bold text-slate-900 !pt-1">
          {{ t("auth.createAccountTitle") }}
        </h1>
        <p class="text-gray-500 !py-4">
          {{ t("auth.createAccountSubtitle") }}
        </p>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- API Error Message -->
        <div
          v-if="apiError"
          class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600"
        >
          {{ apiError }}
        </div>

        <div class="flex gap-3">
          <!-- First Name -->
          <div class="!mt-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ t("auth.firstName") }}
            </label>
            <input
              v-model="form.firstName"
              @blur="v$.firstName.$touch"
              type="text"
              :placeholder="t('auth.enterFirstName')"
              class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
            />
            <span
              v-for="error in v$.firstName.$errors"
              :key="error.$uid"
              class="text-sm text-red-500 mt-1 block"
            >
              {{ error.$message }}
            </span>
          </div>

          <!-- Last Name -->
          <div class="!mt-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ t("auth.lastName") }}
            </label>
            <input
              v-model="form.lastName"
              @blur="v$.lastName.$touch"
              type="text"
              :placeholder="t('auth.enterLastName')"
              class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
            />
            <span
              v-for="error in v$.lastName.$errors"
              :key="error.$uid"
              class="text-sm text-red-500 mt-1 block"
            >
              {{ error.$message }}
            </span>
          </div>
        </div>
        <!-- Email -->
        <div class="!mt-4">
          <label class="block text-sm font-medium text-gray-700"> Email </label>
          <input
            v-model="form.email"
            @blur="v$.email.$touch"
            type="email"
            placeholder="Enter your email"
            class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
          />
          <span
            v-for="error in v$.email.$errors"
            :key="error.$uid"
            class="text-sm text-red-500 mt-1 block"
          >
            {{ error.$message }}
          </span>
        </div>

        <!-- Password -->
        <div class="!mt-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ t("auth.password") }}
          </label>
          <input
            v-model="form.password"
            @blur="v$.password.$touch"
            type="password"
            :placeholder="t('auth.createPassword')"
            class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
          />
          <span
            v-for="error in v$.password.$errors"
            :key="error.$uid"
            class="text-sm text-red-500 mt-1 block"
          >
            {{ error.$message }}
          </span>
        </div>

        <!-- Register Button -->
        <div class="!pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-10 rounded-xl bg-slate-950 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {{ loading ? t("auth.creatingAccount") : t("auth.createAccount") }}
          </button>
        </div>
      </form>

      <!-- Social Register -->
      <div class="!mt-5 !space-y-5">
        <!-- Google -->
        <button
          target="_blank"
          @click="loginWithProvider('google')"
          class="w-full cursor-pointer h-10 border border-gray-300 rounded-xl flex items-center justify-center gap-3 font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            class="w-5 h-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-2.1 1.6-4.7 2.4-7.3 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.7 39.6 16.3 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.7 5.8l6.2 5.2C40.6 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"
            />
          </svg>
          <span>{{ t("auth.signUpGoogle") }}</span>
        </button>

        <!-- GitHub -->
        <button
          @click="loginWithProvider('github')"
          class="w-full cursor-pointer h-10 border border-gray-300 rounded-xl flex items-center justify-center gap-3 font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              d="M12 2C6.48 2 2 6.58 2 12.22c0 4.51 2.87 8.33 6.84 9.68.5.1.66-.22.66-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.54 1.05 1.54 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.33 4.8-4.56 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.67.49A10.25 10.25 0 0 0 22 12.22C22 6.58 17.52 2 12 2z"
            />
          </svg>
          <span>{{ t("auth.signUpGitHub") }}</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="!mt-5 text-center text-sm text-gray-500">
        {{ t("auth.alreadyHaveAccount") }}
        <button
          @click="switchToLogin"
          class="font-semibold text-slate-900 hover:underline"
        >
          {{ t("auth.signInLink") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import api from "@/lib/axios.ts";
import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const { loginWithProvider, isLoading } = useAuth();
const { t } = useI18n();
const authStore = useAuthStore();

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const form = reactive<RegisterForm>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const loading = ref(false);
const apiError = ref("");

const rules = computed(() => ({
  firstName: {
    required: helpers.withMessage("First name is required", required),
    minLength: helpers.withMessage(
      "First name must be at least 2 characters",
      minLength(2),
    ),
  },
  lastName: {
    required: helpers.withMessage("Last name is required", required),
    minLength: helpers.withMessage(
      "Last name must be at least 2 characters",
      minLength(2),
    ),
  },
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 8 characters",
      minLength(8),
    ),
  },
}));

const v$ = useVuelidate(rules, form);

async function handleSubmit(): Promise<void> {
  v$.value.$touch();
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  apiError.value = "";

  try {
    await api.post("/register", {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
    });
    authStore.registrationSuccess = true;
    switchToLogin();
  } catch (e: any) {
    const msg = e.response?.data?.message;
    apiError.value = msg || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
}

const emit = defineEmits(["close", "close-login"]);
const handleClosePopup = () => emit("close");
const switchToLogin = () => {
  emit("close");
  emit("close-login");
};
</script>
