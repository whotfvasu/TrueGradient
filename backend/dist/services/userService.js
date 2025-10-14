import { prisma } from "../lib/prisma.js";
export class UserService {
    static async getUserStats(userId) {
        const [user, conversationCount, totalMessages, tokensUsed] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    credits: true,
                    createdAt: true,
                },
            }),
            prisma.conversation.count({
                where: { userId },
            }),
            prisma.message.count({
                where: {
                    conversation: {
                        userId,
                    },
                },
            }),
            prisma.message.aggregate({
                where: {
                    conversation: {
                        userId,
                    },
                },
                _sum: {
                    tokensUsed: true,
                },
            }),
        ]);
        if (!user) {
            throw new Error("User not found");
        }
        const totalTokensUsed = tokensUsed._sum.tokensUsed || 0;
        const averageTokensPerMessage = totalMessages > 0 ? Math.round(totalTokensUsed / totalMessages) : 0;
        return {
            user,
            stats: {
                totalConversations: conversationCount,
                totalMessages,
                tokensUsed: totalTokensUsed,
                averageTokensPerMessage,
            },
        };
    }
    static async getUserCredits(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                credits: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return {
            id: user.id,
            username: user.username,
            credits: user.credits,
            lastUpdated: user.updatedAt,
        };
    }
    static async addCredits(userId, amount, reason) {
        if (amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
        if (amount > 10000) {
            throw new Error("Cannot add more than 10,000 credits at once");
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: {
                    increment: amount,
                },
            },
            select: {
                id: true,
                username: true,
                credits: true,
                updatedAt: true,
            },
        });
        console.log(`Credits added: ${amount} to user ${updatedUser.username}${reason ? ` (${reason})` : ""}`);
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            credits: updatedUser.credits,
            lastUpdated: updatedUser.updatedAt,
        };
    }
    static async deductCredits(userId, amount, reason) {
        if (amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
        // First check if user has enough credits
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true, username: true },
        });
        if (!currentUser) {
            throw new Error("User not found");
        }
        if (currentUser.credits < amount) {
            throw new Error(`Insufficient credits. Required: ${amount}, Available: ${currentUser.credits}`);
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: {
                    decrement: amount,
                },
            },
            select: {
                id: true,
                username: true,
                credits: true,
                updatedAt: true,
            },
        });
        console.log(`Credits deducted: ${amount} from user ${updatedUser.username}${reason ? ` (${reason})` : ""}`);
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            credits: updatedUser.credits,
            lastUpdated: updatedUser.updatedAt,
        };
    }
    static async hasEnoughCredits(userId, requiredAmount) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user.credits >= requiredAmount;
    }
    static async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
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
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    static async updateUserProfile(userId, data) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (data.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                throw new Error("Email is already taken by another user");
            }
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                email: data.email,
            },
            select: {
                id: true,
                username: true,
                email: true,
                credits: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    static async getUserActivity(userId, limit = 10) {
        const [recentConversations, recentMessages] = await Promise.all([
            prisma.conversation.findMany({
                where: { userId },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { messages: true },
                    },
                },
                orderBy: { updatedAt: "desc" },
                take: limit,
            }),
            prisma.message.findMany({
                where: {
                    conversation: { userId },
                    role: "user",
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    conversation: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }),
        ]);
        return {
            recentConversations,
            recentMessages,
        };
    }
    static async deleteUser(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });
        if (!user) {
            throw new Error("User not found");
        }
        await prisma.user.delete({
            where: { id: userId },
        });
        console.log(`User deleted: ${user.username}`);
        return { message: "User account deleted successfully" };
    }
    static async getTotalUserCount() {
        return await prisma.user.count();
    }
    static async getUsersWithLowCredits(threshold = 100) {
        return await prisma.user.findMany({
            where: {
                credits: {
                    lt: threshold,
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                credits: true,
                updatedAt: true,
            },
            orderBy: {
                credits: "asc",
            },
        });
    }
    static async bulkAddCredits(userIds, amount, reason) {
        if (amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
        const result = await prisma.user.updateMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            data: {
                credits: {
                    increment: amount,
                },
            },
        });
        console.log(`Bulk credits added: ${amount} to ${result.count} users${reason ? ` (${reason})` : ""}`);
        return {
            message: `Credits added to ${result.count} users`,
            usersUpdated: result.count,
            creditsAdded: amount,
        };
    }
}
//# sourceMappingURL=userService.js.map