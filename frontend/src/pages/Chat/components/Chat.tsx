import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
import { type Message } from "../../../hooks/useChat";

interface ChatProps {
  chatState: {
    currentConversation: any;
    isSending: boolean;
    isLoading: boolean;
  };
}

const Chat = ({ chatState }: ChatProps) => {
  const { currentConversation, isSending, isLoading } = chatState;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isSending]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <div className="flex items-center justify-center">
            <img className="w-20" src="/chat.svg" alt="" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Welcome to AI Chat
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Start a conversation with our AI assistant. Ask questions, get help
            with tasks, or explore ideas together.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-semibold text-slate-900">
          {currentConversation.title || "New Conversation"}
        </h2>
        <p className="text-sm text-slate-500">
          {currentConversation.messages?.length || 0} messages
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {currentConversation.messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-slate-100 rounded-full">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-slate-500">Start the conversation</p>
              <p className="text-sm text-slate-400 mt-1">
                Type a message below to begin
              </p>
            </div>
          </div>
        ) : (
          currentConversation.messages?.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.role === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-slate">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            code: ({ children }) => (
                              <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-slate-100 p-3 rounded-lg overflow-x-auto my-2">
                                {children}
                              </pre>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-lg font-bold mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-base font-bold mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-bold mb-1">
                                {children}
                              </h3>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-2 space-y-1">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-2 space-y-1">
                                {children}
                              </ol>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span>{message.content}</span>
                    )}
                  </div>
                </div>

                <div
                  className={`flex items-center mt-1 space-x-2 text-xs text-slate-500 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{formatTime(message.createdAt)}</span>
                  {message.role === "assistant" && message.tokenUsed > 0 && (
                    <>
                      <span>•</span>
                      <span>{message.tokenUsed} tokens</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-slate-500">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;
