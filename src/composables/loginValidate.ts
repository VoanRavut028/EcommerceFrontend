import { isValidPhoneNumber } from "libphonenumber-js";

export const phoneValidate = (phone: string): boolean => {
  return isValidPhoneNumber(phone.trim(), "KH");
};
export const passwordValidate = (password: string): boolean => {
  return password.trim().length >= 8;
};

export const nameValidate = (name: string): boolean => {
  return name.trim().split(" ").filter(Boolean).length >= 2;
};

export const validateRegister = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const errors = {
    name: "",
    email: "",
    password: "",
  };

  const fullName =
    `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
  if (!nameValidate(fullName)) {
    errors.name = "Please enter your first and last name";
  }
  if (!phoneValidate(payload.email)) {
    errors.email = "Must be a valid phone number";
  }
  if (!passwordValidate(payload.password)) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    valid: !errors.name && !errors.email && !errors.password,
    errors,
  };
};

export const validateLogin = (
  payload: { phone: string; password: string },
  messages = {
    phoneInvalid: "Must be a valid phone number",
    passwordRequired: "Required",
  },
) => {
  const errors = {
    phone: "",
    password: "",
  };
  if (!phoneValidate(payload.phone)) {
    errors.phone = messages.phoneInvalid;
  }

  if (!payload.password.trim()) {
    errors.password = messages.passwordRequired;
  }
  return {
    valid: !errors.phone && !errors.password,
    errors,
  };
};
