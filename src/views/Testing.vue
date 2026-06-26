<!-- RegisterForm.vue -->
<script setup lang="ts">
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import {
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar,
  noSpaces,
} from "@/validators/customValidators";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const form = reactive<RegisterForm>({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const rules = computed(() => ({
  username: {
    required: helpers.withMessage("Username is required", required),
    minLength: helpers.withMessage(
      "Username must be at least 3 characters",
      minLength(3),
    ),
    maxLength: helpers.withMessage(
      "Username must be at most 20 characters",
      maxLength(20),
    ),
    noSpaces: helpers.withMessage("Username cannot contain spaces", noSpaces),
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
    hasUppercase: helpers.withMessage(
      "Password must contain an uppercase letter",
      hasUppercase,
    ),
    hasLowercase: helpers.withMessage(
      "Password must contain a lowercase letter",
      hasLowercase,
    ),
    hasNumber: helpers.withMessage("Password must contain a number", hasNumber),
    hasSpecialChar: helpers.withMessage(
      "Password must contain a special character",
      hasSpecialChar,
    ),
  },
  confirmPassword: {
    required: helpers.withMessage("Please confirm your password", required),
    sameAsPassword: helpers.withMessage(
      "Passwords do not match",
      sameAs(computed(() => form.password)),
    ),
  },
  acceptTerms: {
    checked: helpers.withMessage(
      "You must accept the terms and conditions",
      (value: boolean) => value === true,
    ),
  },
}));

const v$ = useVuelidate(rules, form);

async function handleSubmit(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  // form is valid — call your register API here
  console.log("Submitting register form:", form);
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Username</label>
      <input v-model="form.username" @blur="v$.username.$touch" type="text" />
      <span
        v-for="error in v$.username.$errors"
        :key="error.$uid"
        class="error"
      >
        {{ error.$message }}
      </span>
    </div>

    <div>
      <label>Email</label>
      <input v-model="form.email" @blur="v$.email.$touch" type="email" />
      <span v-for="error in v$.email.$errors" :key="error.$uid" class="error">
        {{ error.$message }}
      </span>
    </div>

    <div>
      <label>Password</label>
      <input
        v-model="form.password"
        @blur="v$.password.$touch"
        type="password"
      />
      <span
        v-for="error in v$.password.$errors"
        :key="error.$uid"
        class="error"
      >
        {{ error.$message }}
      </span>
    </div>

    <div>
      <label>Confirm Password</label>
      <input
        v-model="form.confirmPassword"
        @blur="v$.confirmPassword.$touch"
        type="password"
      />
      <span
        v-for="error in v$.confirmPassword.$errors"
        :key="error.$uid"
        class="error"
      >
        {{ error.$message }}
      </span>
    </div>

    <div>
      <label>
        <input v-model="form.acceptTerms" type="checkbox" />
        I accept the terms and conditions
      </label>
      <span
        v-for="error in v$.acceptTerms.$errors"
        :key="error.$uid"
        class="error"
      >
        {{ error.$message }}
      </span>
    </div>

    <button type="submit">Register</button>
  </form>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.85em;
  display: block;
}
</style>
