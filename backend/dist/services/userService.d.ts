export interface UserStats {
    user: {
        id: string;
        username: string;
        email: string | null;
        credits: number;
        createdAt: Date;
    };
    stats: {
        totalConversations: number;
        totalMessages: number;
        tokensUsed: number;
        averageTokensPerMessage: number;
    };
}
export interface UserCreditsInfo {
    id: string;
    username: string;
    credits: number;
    lastUpdated: Date;
}
export interface CreditTransaction {
    type: "increment" | "decrement";
    amount: number;
    reason?: string;
}
export declare class UserService {
    static getUserStats(userId: string): Promise<UserStats>;
    static getUserCredits(userId: string): Promise<UserCreditsInfo>;
    static addCredits(userId: string, amount: number, reason?: string): Promise<UserCreditsInfo>;
    static deductCredits(userId: string, amount: number, reason?: string): Promise<UserCreditsInfo>;
    static hasEnoughCredits(userId: string, requiredAmount: number): Promise<boolean>;
    static getUserProfile(userId: string): Promise<{
        username: string;
        id: string;
        email: string | null;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateUserProfile(userId: string, data: {
        email?: string;
    }): Promise<{
        username: string;
        id: string;
        email: string | null;
        credits: number;
        updatedAt: Date;
    }>;
    static getUserActivity(userId: string, limit?: number): Promise<{
        recentConversations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            _count: {
                messages: number;
            };
        }[];
        recentMessages: {
            id: string;
            createdAt: Date;
            conversation: {
                id: string;
                title: string | null;
            };
            content: string;
        }[];
    }>;
    static deleteUser(userId: string): Promise<{
        message: string;
    }>;
    static getTotalUserCount(): Promise<number>;
    static getUsersWithLowCredits(threshold?: number): Promise<{
        username: string;
        id: string;
        email: string | null;
        credits: number;
        updatedAt: Date;
    }[]>;
    static bulkAddCredits(userIds: string[], amount: number, reason?: string): Promise<{
        message: string;
        usersUpdated: number;
        creditsAdded: number;
    }>;
}
//# sourceMappingURL=userService.d.ts.map