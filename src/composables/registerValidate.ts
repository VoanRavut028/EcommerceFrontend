export const emailValidate = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
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
    errors.name = "Please enter your first and last name.";
  }
  if (!emailValidate(payload.email)) {
    errors.email = "Please enter a valid email.";
  }
  if (!passwordValidate(payload.password)) {
    errors.password = "Password must be at least 8 characters.";
  }

  return {
    valid: !errors.name && !errors.email && !errors.password,
    errors,
  };
};

export const validateLogin = (payload: { email: string; password: string }) => {
  const errors = {
    email: "",
    password: "",
  };

  if (!emailValidate(payload.email)) {
    errors.email = "Please enter a valid email.";
  }
  if (!passwordValidate(payload.password)) {
    errors.password = "Password must be at least 8 characters.";
  }

  return {
    valid: !errors.email && !errors.password,
    errors,
  };
};
