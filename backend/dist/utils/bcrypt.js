import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
export const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
//# sourceMappingURL=bcrypt.js.map