export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}
export interface GeminiResponse {
    content: string;
    tokensUsed: number;
}
export declare class GeminiService {
    private static model;
    static generateResponse(userMessage: string): Promise<GeminiResponse>;
    static generateResponseWithContext(messages: ChatMessage[]): Promise<GeminiResponse>;
    static generateResponseWithSystem(userMessage: string, systemInstruction?: string): Promise<GeminiResponse>;
    private static estimateTokens;
    static validateApiKey(): Promise<boolean>;
    static getModelInfo(): {
        model: string;
        provider: string;
        hasApiKey: boolean;
    };
}
//# sourceMappingURL=geminiService.d.ts.map