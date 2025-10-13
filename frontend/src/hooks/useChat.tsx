import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  tokenUsed: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export const useChat = () => {
  const { token, updateCredits } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  const loadConversations = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await api.getConversations(token);
      setConversations(response.conversations || []);
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = async (title?: string) => {
    if (!token) return;
    try {
      const response = await api.createConversation(token, title);
      const newConversation = response.conversation;

      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      toast.success("New conversation created!");
      return newConversation;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create conversation");
      return null;
    }
  };

  const loadConversation = async (conversationId: string) => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await api.getConversation(token, conversationId);
      setCurrentConversation(response.conversation);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const sendMessage = async (conversationId: string, content: string) => {
    if (!token) return;

    try {
      setIsSending(true);
      const response = await api.sendMessage(token, conversationId, content);

      setCurrentConversation((prev) => {
        if (prev?.id === conversationId) {
          return {
            ...prev,
            title: response.conversation?.title || prev.title,
            updatedAt: response.conversation?.updatedAt || prev.updatedAt,
            messages: [
              ...(prev.messages || []),
              response.userMessage,
              response.aiMessage,
            ],
          };
        } else {
          return {
            id: conversationId,
            title: response.conversation?.title || "New Conversation",
            createdAt:
              response.conversation?.createdAt || new Date().toISOString(),
            updatedAt:
              response.conversation?.updatedAt || new Date().toISOString(),
            messages: [response.userMessage, response.aiMessage],
          };
        }
      });

      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => conv.id === conversationId
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            title: response.conversation?.title || updated[existingIndex].title,
            updatedAt:
              response.conversation?.updatedAt || new Date().toISOString(),
          };
          return updated;
        }
        return prev;
      });

      updateCredits(response.remainingCredits);

      return response;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Insufficient credits")
      ) {
        toast.error("Insufficient credits to send message");
      } else {
        toast.error("Failed to send message");
      }

      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    if (!conversation.messages) {
      loadConversation(conversation.id);
    }
  };
  return {
    conversations,
    currentConversation,
    isLoading,
    isSending,
    loadConversations,
    createConversation,
    loadConversation,
    sendMessage,
    selectConversation,
    setCurrentConversation,
  };
};
