export interface SignupData {
    username: string;
    email?: string;
    password: string;
}
export interface SigninData {
    username: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        username: string;
        email: string | null;
        credits: number;
        createdAt: Date;
    };
    token: string;
}
export declare class AuthService {
    static validateSignupData(data: SignupData): {
        isValid: boolean;
        errors: string[];
    };
    static checkUserExists(username: string, email?: string): Promise<{
        username: string;
        id: string;
        email: string | null;
        passwordHash: string;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    static createUser(data: SignupData): Promise<AuthResponse>;
    static findUserByUsername(username: string): Promise<{
        username: string;
        id: string;
        email: string | null;
        passwordHash: string;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    static verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    static createAuthResponse(user: any): AuthResponse;
    static findUserById(userId: string): Promise<{
        username: string;
        id: string;
        email: string | null;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    static signup(data: SignupData): Promise<AuthResponse>;
    static signin(data: SigninData): Promise<AuthResponse>;
    static getProfile(userId: string): Promise<{
        username: string;
        id: string;
        email: string | null;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=authService.d.ts.map