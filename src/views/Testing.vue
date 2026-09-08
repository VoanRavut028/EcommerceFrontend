<template>
  <div class="signup-container">
    <h2>Create account</h2>

    <!-- STEP 1: name, email, phone -->
    <form v-if="step === 1" @submit.prevent="handleInit">
      <input v-model="form.first_name" placeholder="First name" required />
      <input v-model="form.last_name" placeholder="Last name" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.phone_number" placeholder="+855..." required />
      <div id="recaptcha-container"></div>
      <button :disabled="loading" type="submit">
        {{ loading ? "Sending OTP..." : "Continue" }}
      </button>
    </form>

    <!-- STEP 2: enter OTP code -->
    <form v-else-if="step === 2" @submit.prevent="handleVerifyOtp">
      <p>Enter the code sent to {{ form.phone_number }}</p>
      <input v-model="otpCode" placeholder="6-digit code" required />
      <button :disabled="loading" type="submit">
        {{ loading ? "Verifying..." : "Verify code" }}
      </button>
    </form>

    <!-- STEP 3: set password -->
    <form v-else-if="step === 3" @submit.prevent="handleComplete">
      <input
        v-model="password"
        type="password"
        placeholder="Create password"
        required
      />
      <button :disabled="loading" type="submit">
        {{ loading ? "Creating account..." : "Complete signup" }}
      </button>
    </form>

    <!-- DONE -->
    <div v-else-if="step === 4">
      <p>Account created successfully.</p>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/index";
import { useAuthStore } from "@/stores/auth";
const step = ref(1);
const loading = ref(false);
const errorMessage = ref("");
const useStore = useAuthStore();
const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
});

const otpCode = ref("");
const password = ref("");

// State carried between steps — NOT shown to the user, just held in memory
let confirmationResult = null;
let registrationTicket = null;
let recaptchaVerifier = null;

onMounted(() => {
  // Invisible-by-default is also possible; visible is simpler to debug
  // while you're first getting this working.
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
  });
});

async function handleInit() {
  errorMessage.value = "";
  loading.value = true;
  try {
    // Step 1 — create the PendingRegister record on your backend
    await useStore.signupInit(form.value);

    // Then trigger Firebase phone auth — sends the real SMS
    confirmationResult = await signInWithPhoneNumber(
      auth,
      form.value.phone_number,
      recaptchaVerifier,
    );

    step.value = 2;
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function handleVerifyOtp() {
  errorMessage.value = "";
  loading.value = true;
  try {
    // Confirm the code with Firebase — this is what actually validates the OTP
    const userCredential = await confirmationResult.confirm(otpCode.value);
    const idToken = await userCredential.user.getIdToken();

    // Send that token to YOUR backend, which re-verifies it via Admin SDK
    const result = await useStore.signupVerifyOtp({
      idToken,
      phone_number: form.value.phone_number,
    });

    registrationTicket = result.registrationTicket;
    step.value = 3;
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function handleComplete() {
  errorMessage.value = "";
  loading.value = true;
  try {
    const result = await useStore.signupComplete({
      registrationTicket,
      password: password.value,
    });

    // ASSUMPTION: I don't know your app's actual token-storage convention
    // (e.g. Pinia store, httpOnly cookie via a separate backend call, etc.)
    // — this is a placeholder. Replace with however your app is meant to
    // persist the session.
    localStorage.setItem("accessToken", result.accessToken);

    step.value = 4;
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
input,
button {
  padding: 10px;
  font-size: 14px;
}
.error {
  color: #c00;
  font-size: 13px;
}
</style>
