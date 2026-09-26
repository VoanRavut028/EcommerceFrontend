<!-- src/views/ForgotPasswordView.vue -->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/index";
import { normalizePhone } from "@/composables/registerValidate";
import CountryCodePicker from "@/components/CountryCodePicker.vue";
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const emit = defineEmits<{
  close: [];
  openLogin: [];
}>();

const phone = ref(
  typeof route.query.phone === "string" ? route.query.phone : "",
);
const countryCode = ref("+855");
const otpCode = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const isSubmitting = ref(false);
const step = ref<1 | 2 | 3 | 4>(1);
let confirmationResult: any = null;
let recaptchaVerifier: any = null;
let resetTicket: string | null = null;

onMounted(() => {
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
  });
});

const getErrorMessage = (err: any) =>
  err.response?.data?.message || err.message || t("forgot.requestFailed");

const handleInit = async () => {
  const valid = /^\+?[\d\s().-]{8,}$/.test(phone.value.trim());
  if (!valid) {
    error.value = t("forgot.phoneInvalid");
    return;
  }

  isSubmitting.value = true;
  error.value = "";

  try {
    const normalizedPhone = normalizePhone(phone.value, countryCode.value);
    await authStore.resetPasswordInit(normalizedPhone);
    confirmationResult = await signInWithPhoneNumber(
      auth,
      normalizedPhone,
      recaptchaVerifier,
    );
    step.value = 2;
  } catch (err: any) {
    error.value = getErrorMessage(err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleVerifyOtp = async () => {
  const normalizedPhone = normalizePhone(phone.value, countryCode.value);
  if (!confirmationResult || !otpCode.value.trim()) {
    error.value = t("forgot.otpInvalid");
    return;
  }

  isSubmitting.value = true;
  error.value = "";

  try {
    const userCredential = await confirmationResult.confirm(
      otpCode.value.trim(),
    );
    const idToken = await userCredential.user.getIdToken();
    const response = await authStore.resetPasswordVerifyOtp(
      idToken,
      normalizedPhone,
    );
    resetTicket = response.data.resetTicket;
    step.value = 3;
  } catch (err: any) {
    error.value = getErrorMessage(err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleComplete = async () => {
  error.value = "";

  if (!password.value || password.value !== confirmPassword.value) {
    error.value = t("forgot.passwordMismatch");
    return;
  }

  if (!resetTicket) {
    error.value = t("forgot.requestFailed");
    return;
  }

  isSubmitting.value = true;

  try {
    await authStore.resetPasswordComplete(
      resetTicket,
      password.value,
      confirmPassword.value,
    );
    step.value = 4;
  } catch (err: any) {
    error.value = getErrorMessage(err);
  } finally {
    isSubmitting.value = false;
  }
};

const goToLogin = () => {
  if (route.name === "forgot-password") {
    router.push({ name: "login" });
    return;
  }

  emit("openLogin");
};

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div
    class="flex items-center flex-col justify-center bg-slate-50 px-4 sm:px-10"
  >
    <div
      class="w-full max-w-md sm:w-md h-fit bg-white shadow-lg !p-6 sm:!p-10 relative"
    >
      <button
        @click="closeModal"
        :aria-label="t('forgot.close')"
        class="absolute !top-3 !right-3 text-black hover:text-white cursor-pointer hover:bg-black !p-3"
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
          {{ t("forgot.title") }}
        </h1>
        <p class="text-gray-500 !py-4">
          {{ t("forgot.subtitle") }}
        </p>
      </div>

      <!-- Step 1: request reset -->
      <div v-if="step === 1">
        <form class="space-y-5" @submit.prevent="handleInit" novalidate>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t("forgot.phoneLabel") }}
            </label>
            <div class="flex gap-3">
              <CountryCodePicker v-model="countryCode" />
              <input
                v-model="phone"
                type="tel"
                autocomplete="tel"
                :placeholder="t('forgot.phonePlaceholder')"
                class="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
              />
            </div>
            <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
          </div>
          <div id="recaptcha-container"></div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full h-10 bg-slate-950 text-white font-semibold hover:opacity-90 transition"
          >
            {{ isSubmitting ? t("forgot.sending") : t("forgot.send") }}
          </button>
        </form>

        <!-- Footer -->
        <div class="!mt-5 text-center text-sm text-gray-500">
          {{ t("forgot.haveAccount") }}
          <button
            @click="goToLogin"
            class="font-semibold text-slate-900 hover:underline"
          >
            {{ t("forgot.back") }}
          </button>
        </div>
      </div>

      <form
        v-else-if="step === 2"
        class="space-y-5"
        @submit.prevent="handleVerifyOtp"
        novalidate
      >
        <p class="text-sm text-gray-500">
          {{ t("forgot.otpSent", { phone }) }}
        </p>
        <input
          v-model="otpCode"
          inputmode="numeric"
          autocomplete="one-time-code"
          :placeholder="t('forgot.otpPlaceholder')"
          class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
        />
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full h-10 bg-slate-950 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {{ isSubmitting ? t("forgot.verifying") : t("forgot.verify") }}
        </button>
      </form>

      <form
        v-else-if="step === 3"
        class="space-y-5"
        @submit.prevent="handleComplete"
        novalidate
      >
        <input
          v-model="password"
          type="password"
          autocomplete="new-password"
          :placeholder="t('forgot.newPassword')"
          class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
        />
        <input
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="t('forgot.confirmPassword')"
          class="w-full h-10 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent !px-3"
        />
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full h-10 bg-slate-950 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {{ isSubmitting ? t("forgot.resetting") : t("forgot.resetPassword") }}
        </button>
      </form>

      <!-- Step 4: success -->
      <div v-else>
        <div
          class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-7 text-green-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-slate-900 text-center">
          {{ t("forgot.successTitle") }}
        </h2>

        <p class="text-sm leading-6 text-gray-500 text-center">
          {{ t("forgot.successSubtitle") }}
        </p>

        <button
          @click="goToLogin"
          class="mt-6 w-full h-10 bg-slate-950 text-white font-semibold hover:opacity-90 transition"
        >
          {{ t("forgot.done") }}
        </button>
      </div>

      <p v-if="error && step !== 1" class="mt-4 text-sm text-red-500">
        {{ error }}
      </p>
    </div>
  </div>
</template>
