import { Request, Response } from "express";
import { ChatService } from "../services/chatService";

export const createConversation = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { title } = req.body;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const conversation = await ChatService.createConversation({
    userId,
    title,
  });

  res.status(201).json({
    message: "Conversation created successfully",
    conversation,
  });
};

export const getConversations = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const result = await ChatService.getUserConversations(userId, page, limit);

  res.json(result);
};

export const getConversation = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const conversation = await ChatService.getConversationWithMessages(
    userId,
    conversationId
  );

  res.json({ conversation });
};

export const sendMessage = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;
  const { content } = req.body;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid input",
      message: "Message content is required",
    });
  }

  const result = await ChatService.sendMessage({
    userId,
    conversationId,
    content,
  });

  const updatedConversation = await ChatService.getConversationWithMessages(
    userId,
    conversationId
  );

  res.status(201).json({
    message: "Message sent successfully",
    userMessage: result.userMessage,
    aiMessage: result.aiMessage,
    creditsUsed: result.creditsUsed,
    remainingCredits: result.remainingCredits,
    conversation: {
      id: updatedConversation.id,
      title: updatedConversation.title,
      createdAt: updatedConversation.createdAt,
      updatedAt: updatedConversation.updatedAt,
    },
  });
};

export const deleteConversation = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const result = await ChatService.deleteConversation(userId, conversationId);

  res.json(result);
};

export const updateConversation = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;
  const { title } = req.body;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid input",
      message: "Title is required",
    });
  }

  const result = await ChatService.updateConversationTitle(
    userId,
    conversationId,
    title
  );

  res.json(result);
};
