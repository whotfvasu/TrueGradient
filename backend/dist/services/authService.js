import { hashPassword, comparePassword, validatePassword, } from "../utils/bcrypt.js";
import { validateUsername, validateEmail } from "../utils/validation.js";
import { generateToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";
export class AuthService {
    static validateSignupData(data) {
        const usernameValidation = validateUsername(data.username);
        const emailValidation = validateEmail(data.email ?? "");
        const passwordValidation = validatePassword(data.password);
        const errors = [
            ...usernameValidation.errors,
            ...emailValidation.errors,
            ...passwordValidation.errors,
        ];
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    static async checkUserExists(username, email) {
        return await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, ...(email ? [{ email: email }] : [])],
            },
        });
    }
    static async createUser(data) {
        const passwordHash = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email || null,
                passwordHash,
                credits: 1250,
            },
            select: {
                id: true,
                username: true,
                email: true,
                credits: true,
                createdAt: true,
            },
        });
        const token = generateToken({
            userId: user.id,
            username: user.username,
        });
        return { user, token };
    }
    static async findUserByUsername(username) {
        return await prisma.user.findUnique({
            where: { username },
        });
    }
    static async verifyPassword(password, hashedPassword) {
        return await comparePassword(password, hashedPassword);
    }
    static createAuthResponse(user) {
        const token = generateToken({
            userId: user.id,
            username: user.username,
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token,
        };
    }
    static async findUserById(userId) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                credits: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    static async signup(data) {
        const validation = this.validateSignupData(data);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
        }
        const existingUser = await this.checkUserExists(data.username, data.email);
        if (existingUser) {
            const message = existingUser.username === data.username
                ? "Username is already taken"
                : "Email is already registered";
            throw new Error(message);
        }
        return await this.createUser(data);
    }
    static async signin(data) {
        const user = await this.findUserByUsername(data.username);
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordValid = await this.verifyPassword(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }
        return this.createAuthResponse(user);
    }
    static async getProfile(userId) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
//# sourceMappingURL=authService.js.map