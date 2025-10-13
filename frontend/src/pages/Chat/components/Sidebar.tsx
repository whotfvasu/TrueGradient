import { ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  ChevronLeftIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface SidebarProps {
  chatState: {
    conversations: any[];
    currentConversation: any;
    createConversation: () => Promise<any>;
    selectConversation: (conversation: any) => void;
    isLoading: boolean;
  };
}

const Sidebar = ({ chatState }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const {
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    isLoading,
  } = chatState;

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleNewChat = async () => {
    await createConversation();
  };

  const handleSelectConversation = (conversation: any) => {
    selectConversation(conversation);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <>
      {expanded ? (
        <div className="w-80 h-full bg-white border-r border-slate-200 flex flex-col">
          <div className="flex items-center justify-between p-4 flex-shrink-0">
            <h2 className="text-lg pl-2 pt-4 font-semibold text-slate-900">
              Conversations
            </h2>
            <button onClick={handleClick} className="pr-1 pt-4 rounded-lg">
              <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="p-4 flex-shrink-0">
            <button
              onClick={handleNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ChatBubbleLeftIcon className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-slate-500 text-base text-center">
                  No conversations yet
                </p>
                <p className="text-slate-400 text-sm text-center mt-1">
                  Start a new chat to begin
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      currentConversation?.id === conversation.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-slate-50 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate text-sm">
                          {conversation.title || "New Conversation"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(conversation.updatedAt)}
                        </p>
                      </div>
                      {currentConversation?.id === conversation.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-16 h-full bg-white border-r border-slate-200 flex flex-col">
          <div className="flex items-center justify-center p-4 flex-shrink-0">
            <button onClick={handleClick} className="pr-1 pt-4 rounded-lg">
              <ChevronRightIcon className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <button
            onClick={handleNewChat}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium mx-3 p-2 rounded-2xl flex items-center justify-center transition-colors"
          >
            <PlusIcon className="w-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
