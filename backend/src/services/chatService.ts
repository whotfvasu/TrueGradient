import { prisma } from "../lib/prisma.js";
import { GeminiService, ChatMessage } from "./geminiService.js";
import { UserService } from "./userService.js";

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

export class ChatService {
  static async createConversation(data: CreateConversationData) {
    return await prisma.conversation.create({
      data: {
        title: data.title || null,
        userId: data.userId,
      },
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getUserConversations(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [conversations, totalCount] = await Promise.all([
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
        skip,
        take: limit,
      }),
      prisma.conversation.count({
        where: { userId },
      }),
    ]);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  static async getConversationWithMessages(
    userId: string,
    conversationId: string
  ) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            tokensUsed: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    return conversation;
  }

  static async sendMessage(
    data: SendMessageData
  ): Promise<SendMessageResponse> {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: data.conversationId,
        userId: data.userId,
      },
      include: {
        messages: {
          select: {
            role: true,
            content: true,
          },
          orderBy: { createdAt: "asc" },
          take: 10,
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    const contextLength = conversation.messages.reduce(
      (acc, msg) => acc + msg.content.length,
      0
    );
    const estimatedTokens = Math.ceil(
      (contextLength + data.content.length) / 3
    );
    const maxTokensForResponse = Math.min(estimatedTokens * 3, 800);

    const hasCredits = await UserService.hasEnoughCredits(
      data.userId,
      maxTokensForResponse
    );
    if (!hasCredits) {
      const userCredits = await UserService.getUserCredits(data.userId);
      throw new Error(
        `Insufficient credits. Required: ~${maxTokensForResponse}, Available: ${userCredits.credits}`
      );
    }

    const userMessage = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: "user",
        content: data.content.trim(),
        tokensUsed: 0,
      },
      select: {
        id: true,
        role: true,
        content: true,
        tokensUsed: true,
        createdAt: true,
      },
    });

    try {
      const contextMessages: ChatMessage[] = [
        ...conversation.messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: data.content.trim(),
        },
      ];

      const aiResponse = await GeminiService.generateResponseWithContext(
        contextMessages
      );
      const actualTokensUsed = Math.min(aiResponse.tokensUsed, 800);

      const aiMessage = await prisma.message.create({
        data: {
          conversationId: data.conversationId,
          role: "assistant",
          content: aiResponse.content,
          tokensUsed: actualTokensUsed,
        },
        select: {
          id: true,
          role: true,
          content: true,
          tokensUsed: true,
          createdAt: true,
        },
      });

      const updatedUser = await UserService.deductCredits(
        data.userId,
        actualTokensUsed,
        `AI response in conversation ${data.conversationId}`
      );

      if (!conversation.title) {
        const title =
          data.content.trim().substring(0, 50) +
          (data.content.length > 50 ? "..." : "");
        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: { title },
        });
      }

      await prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });

      return {
        userMessage,
        aiMessage,
        creditsUsed: actualTokensUsed,
        remainingCredits: updatedUser.credits,
      };
    } catch (error) {
      console.error("AI response generation failed:", error);

      const fallbackMessage = await prisma.message.create({
        data: {
          conversationId: data.conversationId,
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again.",
          tokensUsed: 10,
        },
        select: {
          id: true,
          role: true,
          content: true,
          tokensUsed: true,
          createdAt: true,
        },
      });

      const updatedUser = await UserService.deductCredits(
        data.userId,
        10,
        "Error response"
      );

      return {
        userMessage,
        aiMessage: fallbackMessage,
        creditsUsed: 10,
        remainingCredits: updatedUser.credits,
      };
    }
  }

  static async deleteConversation(userId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { message: "Conversation deleted successfully" };
  }

  static async updateConversationTitle(
    userId: string,
    conversationId: string,
    title: string
  ) {
    const result = await prisma.conversation.updateMany({
      where: {
        id: conversationId,
        userId,
      },
      data: {
        title: title.trim(),
      },
    });

    if (result.count === 0) {
      throw new Error("Conversation not found or access denied");
    }

    return { message: "Conversation updated successfully" };
  }
}
