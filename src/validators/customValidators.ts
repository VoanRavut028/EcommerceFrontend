// validators/customValidators.ts
import { helpers } from "@vuelidate/validators";

export const hasUppercase = helpers.regex(/[A-Z]/);
export const hasLowercase = helpers.regex(/[a-z]/);
export const hasNumber = helpers.regex(/[0-9]/);
export const hasSpecialChar = helpers.regex(/[!@#$%^&*(),.?":{}|<>]/);
export const noSpaces = helpers.regex(/^\S*$/);
