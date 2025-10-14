export interface CreateConversationData {
    userId: string;
    title?: string;
}
export interface SendMessageData {
    userId: string;
    conversationId: string;
    content: string;
}
export interface SendMessageResponse {
    userMessage: {
        id: string;
        role: string;
        content: string;
        tokensUsed: number;
        createdAt: Date;
    };
    aiMessage: {
        id: string;
        role: string;
        content: string;
        tokensUsed: number;
        createdAt: Date;
    };
    creditsUsed: number;
    remainingCredits: number;
}
export declare class ChatService {
    static createConversation(data: CreateConversationData): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
    }>;
    static getUserConversations(userId: string, page?: number, limit?: number): Promise<{
        conversations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            _count: {
                messages: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getConversationWithMessages(userId: string, conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        messages: {
            id: string;
            createdAt: Date;
            role: string;
            content: string;
            tokensUsed: number;
        }[];
    }>;
    static sendMessage(data: SendMessageData): Promise<SendMessageResponse>;
    static deleteConversation(userId: string, conversationId: string): Promise<{
        message: string;
    }>;
    static updateConversationTitle(userId: string, conversationId: string, title: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=chatService.d.ts.map