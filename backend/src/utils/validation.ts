export const validateUsername = (
  username: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!username || username.trim().length === 0) {
    errors.push("username required");
  }

  if (username.length < 3) {
    errors.push("username must be at least 3 char long");
  }

  if (username.length > 50) {
    errors.push("username must not exceed 50 char");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push(
      "username can only contain letters, numbers, underscores, and hyphens"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (
  email: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!email) {
    errors.push("email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
