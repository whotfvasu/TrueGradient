import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useChat } from "../../hooks/useChat";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Input from "./components/Input";

const ChatPage: React.FC = () => {
  const { user, signout } = useAuth();
  const chatState = useChat();

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Header user={user} onSignOut={signout} />

      <div className="flex flex-1 pt-16 overflow-hidden">
        <div className="flex-shrink-0">
          <Sidebar chatState={chatState} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Chat chatState={chatState} />
          </div>

          <div className="flex-shrink-0">
            <Input chatState={chatState} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
