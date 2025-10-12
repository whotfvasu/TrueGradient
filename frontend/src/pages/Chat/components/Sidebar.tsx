import { ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  ChevronLeftIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const handleClick = () => {
    setExpanded(!expanded);
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
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              <PlusIcon className="w-5 h-5" />
              New Chat
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ChatBubbleLeftIcon className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-slate-500 text-base">No conversations yet</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-16 h-full bg-white border-r border-slate-200 flex flex-col">
          <div className="flex items-center justify-center p-4 flex-shrink-0">
            <button onClick={handleClick} className="pr-1 pt-4 rounded-lg">
              <ChevronRightIcon className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <button className=" bg-blue-600 hover:bg-blue-700 text-white font-medium mx-3 p-2  rounded-2xl flex items-center justify-center  transition-colors">
            <PlusIcon className="w-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
