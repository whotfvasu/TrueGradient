import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../../Contexts/AuthContext";
import toast from "react-hot-toast";

interface InputProps {
  chatState: {
    currentConversation: any;
    sendMessage: (conversationId: string, content: string) => Promise<any>;
    createConversation: () => Promise<any>;
    isSending: boolean;
  };
}

const Input = ({ chatState }: InputProps) => {
  const [message, setMessage] = useState("");
  const maxLength = 2000;

  const { currentConversation, sendMessage, createConversation, isSending } =
    chatState;
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (user && user.credits < 10) {
      toast.error("Insufficient credits to send message");
      return;
    }

    try {
      let conversationId = currentConversation?.id;
      if (!conversationId) {
        const newConversation = await createConversation();
        if (!newConversation) {
          toast.error("Failed to create conversation");
          return;
        }
        conversationId = newConversation.id;
      }

      if (conversationId) {
        await sendMessage(conversationId, message.trim());
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = isSending || !!(user && user.credits < 10);
  const isSubmitDisabled = !message.trim() || isDisabled;

  return (
    <div className="w-full bg-white border-t border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              user && user.credits < 10
                ? "Insufficient credits to send message"
                : "Ask me anything..."
            }
            maxLength={maxLength}
            rows={1}
            disabled={isDisabled}
            className="w-full px-4 py-3 pr-14 resize-none border-none outline-none rounded-2xl placeholder-slate-400 text-slate-900 min-h-[52px] max-h-32 overflow-y-auto disabled:bg-slate-50 disabled:cursor-not-allowed"
            style={{
              resize: "none",
              scrollbarWidth: "thin",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between mt-3 px-2 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-slate-500">
            Press Enter to send, Shift+Enter for new line
          </p>
          {user && (
            <p className="text-sm text-slate-500">
              Credits:{" "}
              <span className="font-medium text-blue-600">{user.credits}</span>
            </p>
          )}
        </div>
        <p className="text-sm text-slate-500">
          {message.length}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default Input;
