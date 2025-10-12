import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiResponse {
  content: string;
  tokensUsed: number;
}

export class GeminiService {
  private static model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-pro",
  });

  static async generateResponse(userMessage: string): Promise<GeminiResponse> {
    try {
      const result = await this.model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      const estimatedTokens = this.estimateTokens(userMessage + text);

      return {
        content: text,
        tokensUsed: estimatedTokens,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  static async generateResponseWithContext(
    messages: ChatMessage[]
  ): Promise<GeminiResponse> {
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
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate AI response with context");
    }
  }

  static async generateResponseWithSystem(
    userMessage: string,
    systemInstruction?: string
  ): Promise<GeminiResponse> {
    try {
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
        systemInstruction:
          systemInstruction || "You are a helpful AI assistant.",
      });

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      const estimatedTokens = this.estimateTokens(userMessage + text);

      return {
        content: text,
        tokensUsed: estimatedTokens,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  private static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  static async validateApiKey(): Promise<boolean> {
    try {
      const result = await this.model.generateContent("Hello");
      return !!result.response;
    } catch (error) {
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
