import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export class GeminiService {
    static model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-pro",
    });
    static async generateResponse(userMessage) {
        try {
            const result = await this.model.generateContent(userMessage);
            const response = await result.response;
            const text = response.text();
            const estimatedTokens = this.estimateTokens(userMessage + text);
            return {
                content: text,
                tokensUsed: estimatedTokens,
            };
        }
        catch (error) {
            console.error("Gemini API error:", error);
            throw new Error("Failed to generate AI response");
        }
    }
    static async generateResponseWithContext(messages) {
        try {
            const chat = this.model.startChat({
                history: messages.slice(0, -1).map((msg) => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }],
                })),
            });
            const latestMessage = messages[messages.length - 1];
            const result = await chat.sendMessage(latestMessage.content);
            const response = await result.response;
            const text = response.text();
            const conversationText = messages.map((m) => m.content).join(" ") + text;
            const estimatedTokens = this.estimateTokens(conversationText);
            return {
                content: text,
                tokensUsed: estimatedTokens,
            };
        }
        catch (error) {
            console.error("Gemini API error:", error);
            throw new Error("Failed to generate AI response with context");
        }
    }
    static async generateResponseWithSystem(userMessage, systemInstruction) {
        try {
            const model = genAI.getGenerativeModel({
                model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
                systemInstruction: systemInstruction || "You are a helpful AI assistant.",
            });
            const result = await model.generateContent(userMessage);
            const response = await result.response;
            const text = response.text();
            const estimatedTokens = this.estimateTokens(userMessage + text);
            return {
                content: text,
                tokensUsed: estimatedTokens,
            };
        }
        catch (error) {
            console.error("Gemini API error:", error);
            throw new Error("Failed to generate AI response");
        }
    }
    static estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }
    static async validateApiKey() {
        try {
            const result = await this.model.generateContent("Hello");
            return !!result.response;
        }
        catch (error) {
            console.error("Gemini API key validation failed:", error);
            return false;
        }
    }
    static getModelInfo() {
        return {
            model: process.env.GEMINI_MODEL || "gemini-pro",
            provider: "Google Gemini",
            hasApiKey: !!process.env.GEMINI_API_KEY,
        };
    }
}
//# sourceMappingURL=geminiService.js.map