<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { auth } from "@/firebase/index";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { normalizePhone } from "@/composables/registerValidate";
const { t } = useI18n();
const useStore = useAuthStore();
let confirmationResult: any = null;
let recaptchaVerifier: any = null;
const steps = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Verify" },
  { id: 3, label: "Password" },
];

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "",
  phone: "",
  otp: "",
  password: "",
  confirmPassword: "",
});

const currentStep = ref(1);
const isSubmitting = ref(false);
const otpError = ref("");
const resendCooldown = ref(30);
const isComplete = ref(false);

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});
onMounted(() => {
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
  });
});
const stepTitle = computed(() => {
  if (currentStep.value === 1) return t("registerFlow.step1Title");
  if (currentStep.value === 2) return t("registerFlow.step2Title");
  return t("registerFlow.step3Title");
});

const stepSubtitle = computed(() => {
  if (currentStep.value === 1) return t("registerFlow.step1Subtitle");
  if (currentStep.value === 2) return t("registerFlow.step2Subtitle");
  return t("registerFlow.step3Subtitle");
});

const submitLabel = computed(() => {
  if (isSubmitting.value) {
    if (currentStep.value === 1) return t("registerFlow.loadingStep1");
    if (currentStep.value === 2) return t("registerFlow.loadingStep2");
    return t("registerFlow.loadingStep3");
  }

  if (currentStep.value === 1) return t("registerFlow.continue");
  if (currentStep.value === 2) return t("registerFlow.verify");
  return t("registerFlow.completeRegistration");
});

const passwordStrength = computed(() => {
  const value = form.password || "";
  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (!value)
    return {
      score: 0,
      label: t("registerFlow.passwordStrengthNone"),
      color: "text-slate-400",
      bar: "bg-slate-200",
    };
  if (score <= 1)
    return {
      score: 1,
      label: t("registerFlow.passwordStrengthWeak"),
      color: "text-red-500",
      bar: "bg-red-500",
    };
  if (score === 2)
    return {
      score: 2,
      label: t("registerFlow.passwordStrengthFair"),
      color: "text-amber-500",
      bar: "bg-amber-500",
    };
  if (score === 3)
    return {
      score: 3,
      label: t("registerFlow.passwordStrengthGood"),
      color: "text-blue-500",
      bar: "bg-blue-500",
    };
  return {
    score: 4,
    label: t("registerFlow.passwordStrengthStrong"),
    color: "text-emerald-500",
    bar: "bg-emerald-500",
  };
});

const strengthLabel = computed(() => passwordStrength.value.label);
const strengthColor = computed(() => passwordStrength.value.color);
const strengthColorBar = computed(() => passwordStrength.value.bar);
const strengthScore = computed(() => passwordStrength.value.score);

const emit = defineEmits<{
  close: [value: boolean];
  openLogin: [value: boolean];
}>();

const handleClosePopup = () => {
  emit("close", false);
};

const switchToLogin = () => {
  emit("openLogin", false);
};

const clearStepErrors = () => {
  errors.firstName = "";
  errors.lastName = "";
  errors.email = "";
  errors.phone = "";
  errors.password = "";
  errors.confirmPassword = "";
  otpError.value = "";
};

const validateStepOne = () => {
  clearStepErrors();
  let valid = true;

  if (!form.firstName.trim()) {
    errors.firstName = t("registerFlow.validation.firstNameRequired");
    valid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = t("registerFlow.validation.lastNameRequired");
    valid = false;
  }

  if (!form.email.trim()) {
    errors.email = t("registerFlow.validation.emailRequired");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t("registerFlow.validation.emailInvalid");
    valid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = t("registerFlow.validation.phoneRequired");
    valid = false;
  } else {
    const normalizedPhone = normalizePhone(form.phone);

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      errors.phone = t("registerFlow.validation.phoneInvalid");
      valid = false;
    } else {
      form.phone = normalizedPhone;
    }
  }

  return valid;
};

const validateStepTwo = () => {
  otpError.value = "";

  if (!/^[0-9]{6}$/.test(form.otp.trim())) {
    otpError.value = t("registerFlow.validation.otpRequired");
    return false;
  }

  return true;
};

const validateStepThree = () => {
  clearStepErrors();
  let valid = true;

  if (!form.password) {
    errors.password = t("registerFlow.validation.passwordRequired");
    valid = false;
  } else if (form.password.length < 8) {
    errors.password = t("registerFlow.validation.passwordMinLength");
    valid = false;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = t(
      "registerFlow.validation.confirmPasswordRequired",
    );
    valid = false;
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = t("registerFlow.validation.passwordsDoNotMatch");
    valid = false;
  }

  return valid;
};
const registrationTicket = ref("");

const handleStepSubmit = async () => {
  if (currentStep.value === 1) {
    if (!validateStepOne()) return;

    isSubmitting.value = true;

    try {
      await useStore.signupInit(
        form.firstName,
        form.lastName,
        form.email,
        form.phone,
      );
      confirmationResult = await signInWithPhoneNumber(
        auth,
        form.phone,
        recaptchaVerifier,
      );
      currentStep.value = 2;
      startResendCooldown();
    } catch (err) {
      console.error(err);
    } finally {
      isSubmitting.value = false;
    }

    return;
  }

  if (currentStep.value === 2) {
    if (!validateStepTwo()) return;

    isSubmitting.value = true;

    try {
      const userCredential = await confirmationResult.confirm(form.otp);
      const idToken = await userCredential.user.getIdToken();

      const response = await useStore.signupVerifyOtp(idToken, form.phone);

      registrationTicket.value = response.data.registrationTicket;

      currentStep.value = 3;
    } catch (err) {
    } finally {
      isSubmitting.value = false;
    }

    return;
  }

  if (!validateStepThree()) return;

  isSubmitting.value = true;

  try {
    await useStore.signupComplete(
      registrationTicket.value,
      form.password,
    );
    isComplete.value = true;
  } catch (err) {
  } finally {
    isSubmitting.value = false;
  }
};

const goToStep = (step: number) => {
  currentStep.value = step;
  otpError.value = "";
};

const goBack = () => {
  if (currentStep.value > 1) currentStep.value -= 1;
  otpError.value = "";
};

const startResendCooldown = () => {
  resendCooldown.value = 30;
  const timer = window.setInterval(() => {
    resendCooldown.value -= 1;
    if (resendCooldown.value <= 0) {
      window.clearInterval(timer);
    }
  }, 1000);
};

const resendCode = async () => {
  if (resendCooldown.value > 0) return;

  otpError.value = "";
  form.otp = "";
  await new Promise((resolve) => setTimeout(resolve, 250));
  startResendCooldown();
};
</script>
<template>
  <div class="flex items-center flex-col justify-center bg-slate-50 px-10">
    <div class="w-md h-fit bg-white shadow-lg !p-10 relative text-black">
      <button
        type="button"
        @click="handleClosePopup"
        class="absolute right-4 top-4 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        :aria-label="t('registerFlow.close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        v-if="isComplete"
        class="flex flex-col items-center py-6 text-center"
      >
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12.5l4.2 4.2L19 2.7" />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-slate-900">
          {{ t("registerFlow.successTitle") }}
        </h2>
        <p class="mt-2 max-w-sm text-sm text-slate-600">
          {{ t("registerFlow.successSubtitle") }}
        </p>

        <button
          type="button"
          @click="switchToLogin"
          class="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {{ t("registerFlow.goToLogin") }}
        </button>
      </div>

      <div v-else>
        <div class="mb-6 pt-8">
          <div
            class="mb-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
          >
            <span>{{ t("registerFlow.accountSetup") }}</span>
            <span>{{ currentStep }}/3</span>
          </div>

          <!-- <div class="flex items-center gap-2">
            <div v-for="step in steps" :key="step.id" class="flex-1">
              <div
                :class="[
                  'h-2 rounded-full transition-all duration-200',
                  currentStep >= step.id ? 'bg-slate-900' : 'bg-slate-200',
                ]"
              />
            </div>
          </div> -->
        </div>

        <header class="mb-6">
          <p class="text-sm font-medium text-slate-500">
            {{ t("registerFlow.stepLabel") }} {{ currentStep }}
          </p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {{ stepTitle }}
          </h1>
          <p class="mt-2 text-sm text-slate-500">
            {{ stepSubtitle }}
          </p>
        </header>

        <form @submit.prevent="handleStepSubmit" novalidate>
          <div v-if="currentStep === 1" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  {{ t("registerFlow.firstName") }}
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  :placeholder="t('registerFlow.firstNamePlaceholder')"
                  class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  :class="{ 'border-red-300': errors.firstName }"
                />
                <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">
                  {{ errors.firstName }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  {{ t("registerFlow.lastName") }}
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  :placeholder="t('registerFlow.lastNamePlaceholder')"
                  class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  :class="{ 'border-red-300': errors.lastName }"
                />
                <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">
                  {{ errors.lastName }}
                </p>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">
                {{ t("registerFlow.email") }}
              </label>
              <input
                v-model="form.email"
                type="email"
                :placeholder="t('registerFlow.emailPlaceholder')"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                :class="{ 'border-red-300': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">
                {{ t("registerFlow.phoneNumber") }}
              </label>
              <div class="flex gap-3">
                <!-- <select
                  v-model="form.countryCode"
                  class="h-11 w-24 rounded-xl border border-slate-200 bg-slate-50 px-2 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                >
                  <option
                    v-for="option in countryCodes"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select> -->

                <input
                  v-model="form.phone"
                  type="tel"
                  :placeholder="t('registerFlow.phonePlaceholder')"
                  class="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  :class="{ 'border-red-300': errors.phone }"
                />
              </div>
              <p v-if="errors.phone" class="mt-1 text-xs text-red-500">
                {{ errors.phone }}
              </p>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="space-y-5">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                {{ t("registerFlow.verificationSentTo") }}
              </p>
              <div class="mt-2 flex items-center justify-between gap-3">
                <p class="text-base font-semibold text-slate-900">
                  {{ form.countryCode }} {{ form.phone }}
                </p>
                <button
                  type="button"
                  @click="goToStep(1)"
                  class="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
                >
                  {{ t("registerFlow.edit") }}
                </button>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">
                {{ t("registerFlow.otpLabel") }}
              </label>
              <input
                v-model="form.otp"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="123456"
                class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-center text-lg font-semibold tracking-[0.5em] outline-none transition focus:border-slate-400 focus:bg-white"
                :class="{ 'border-red-300': otpError }"
              />
              <p v-if="otpError" class="mt-2 text-xs text-red-500">
                {{ otpError }}
              </p>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">{{
                t("registerFlow.noCodeQuestion")
              }}</span>
              <button
                type="button"
                :disabled="resendCooldown > 0"
                @click="resendCode"
                class="font-medium text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {{
                  resendCooldown > 0
                    ? t("registerFlow.resendIn", { seconds: resendCooldown })
                    : t("registerFlow.resendCode")
                }}
              </button>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">
                {{ t("registerFlow.password") }}
              </label>
              <input
                v-model="form.password"
                type="password"
                :placeholder="t('registerFlow.passwordPlaceholder')"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                :class="{ 'border-red-300': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-xs text-red-500">
                {{ errors.password }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">
                {{ t("registerFlow.confirmPassword") }}
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                :placeholder="t('registerFlow.confirmPasswordPlaceholder')"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                :class="{ 'border-red-300': errors.confirmPassword }"
              />
              <p
                v-if="errors.confirmPassword"
                class="mt-1 text-xs text-red-500"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div
                class="mb-2 flex items-center justify-between text-xs text-slate-500"
              >
                <span>{{ t("registerFlow.passwordStrength") }}</span>
                <span class="font-medium" :class="strengthColor">
                  {{ strengthLabel }}
                </span>
              </div>
              <div class="flex gap-2">
                <span
                  v-for="bar in 4"
                  :key="bar"
                  class="h-2 flex-1 rounded-full"
                  :class="
                    bar <= strengthScore ? strengthColorBar : 'bg-slate-200'
                  "
                />
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col items-center gap-3">
            <div class="flex flex-row gap-[50%] justify-center">
              <button
                v-if="currentStep > 1"
                type="button"
                @click="goBack"
                class="h-11 flex-1 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ t("registerFlow.back") }}
              </button>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="h-11 flex-1 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  v-if="isSubmitting"
                  class="inline-flex items-center justify-center gap-2"
                >
                  <svg
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
                  {{ submitLabel }}
                </span>
                <span v-else>{{ submitLabel }}</span>
              </button>
            </div>
            <div>
              <div id="recaptcha-container"></div>
            </div>
          </div>
        </form>

        <div class="mt-6 space-y-3">
          <div class="relative flex items-center justify-center">
            <div class="h-px flex-1 bg-slate-200"></div>
            <span
              class="px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400"
            >
              {{ t("registerFlow.socialDivider") }}
            </span>
            <div class="h-px flex-1 bg-slate-200"></div>
          </div>

          <button
            type="button"
            @click="handleSocialSignup('google')"
            class="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              class="h-5 w-5"
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
            <span>{{ t("registerFlow.googleSignup") }}</span>
          </button>

          <button
            type="button"
            @click="handleSocialSignup('github')"
            class="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M12 2C6.48 2 2 6.58 2 12.22c0 4.51 2.87 8.33 6.84 9.68.5.1.66-.22.66-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.54 1.05 1.54 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.33 4.8-4.56 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.67.49A10.25 10.25 0 0 0 22 12.22C22 6.58 17.52 2 12 2z"
              />
            </svg>
            <span>{{ t("registerFlow.githubSignup") }}</span>
          </button>
        </div>

        <div class="mt-5 text-center text-sm text-slate-500">
          {{ t("registerFlow.haveAccount") }}
          <button
            type="button"
            @click="switchToLogin"
            class="ml-1 font-semibold text-slate-900 hover:underline"
          >
            {{ t("registerFlow.login") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
