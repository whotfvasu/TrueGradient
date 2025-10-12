import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const Input = () => {
  const [message, setMessage] = useState("");
  const maxLength = 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full bg-white border-t border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            maxLength={maxLength}
            rows={1}
            className="w-full px-4 py-3 pr-14 resize-none border-none outline-none rounded-2xl placeholder-slate-400 text-slate-900 min-h-[52px] max-h-32 overflow-y-auto"
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
            disabled={!message.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </form>


      <div className="flex items-center justify-between mt-3 px-2 max-w-4xl mx-auto">
        <p className="text-sm text-slate-500">
          Press Enter to send, Shift+Enter for new line
        </p>
        <p className="text-sm text-slate-500">
          {message.length}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default Input;
