<template>
  <div class="flex items-center flex-col justify-center bg-slate-50 px-10">
    <div class="w-md h-fit bg-white shadow-lg !p-10 relative">
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
        <h1 class="text-3xl font-bold text-slate-900 !pt-1">Welcome back</h1>
        <p class="text-gray-500 !py-4">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div
        v-if="registrationSuccess"
        class="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700"
      >
        Registration successful! Please log in with your new account.
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleLoginWithCredentail">
        <!-- Email -->
        <div class=" ">
          <label class="block text-sm font-medium text-gray-700"> Email </label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div class=" ">
          <label class="block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
          />
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Forgot Password -->
        <div>
          <button
            type="button"
            class="text-sm font-semibold text-slate-900 hover:underline hover:cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full h-10 rounded-xl bg-slate-950 text-white font-semibold hover:opacity-90 transition"
        >
          Login
        </button>
      </form>

      <!-- Social Login -->
      <div class="!mt-5 !space-y-5">
        <!-- Google -->
        <button
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

          <span>Sign in with Google</span>
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

          <span>Sign in with GitHub</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="!mt-5 text-center text-sm text-gray-500">
        Don't have an account?
        <button
          @click="switchToRegister"
          class="font-semibold text-slate-900 hover:underline"
        >
          Sign up for free
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { validateLogin } from "@/composables/loginValidate";
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const { loginWithProvider, logiCredentail, isLoading } = useAuth();
const authStore = useAuthStore();
const registrationSuccess = ref(false);

onMounted(() => {
  if (authStore.registrationSuccess) {
    registrationSuccess.value = true;
    authStore.clearRegistrationSuccess();
  }
});
const email = ref("");
const password = ref("");
const errors = ref({ email: "", password: "" });

const handleLoginWithCredentail = async () => {
  const result = validateLogin({
    email: email.value,
    password: password.value,
  });

  errors.value = result.errors;
  if (!result.valid) return;

  try {
    await logiCredentail(email.value, password.value);
  } catch (err: any) {
    throw new Error(err);
  }
};

const emit = defineEmits<{
  (e: "close"): void;
  (e: "close-register"): void;
}>();
const handleClosePopup = () => {
  emit("close");
  
};

const switchToRegister = () => {
  emit("close");
  emit("close-register");
};
</script>
