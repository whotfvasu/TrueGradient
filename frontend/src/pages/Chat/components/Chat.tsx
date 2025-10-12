const Chat = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* AI Chat Icon */}
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
};

export default Chat;
