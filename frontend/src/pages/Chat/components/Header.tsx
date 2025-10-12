import type { AuthContext } from "../../../Contexts/AuthContext";
import { BellIcon } from "@heroicons/react/24/outline";
import UserDropdown from "./UserDropdown";

const Header = ({
  user,
  onSignOut,
}: {
  user: AuthContext["user"];
  onSignOut: AuthContext["signout"];
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-slate-200">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">AI Chat</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#e8f4ff] px-3 py-1.5 rounded-full shadow-sm border-[1px] border-[#b3d9ff]">
          <img className="w-6" src="/credits.svg" alt="" />
          <span className="text-sm font-medium text-blue-600">
            {user?.credits}
          </span>
        </div>

        <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <UserDropdown user={user} onSignOut={onSignOut} />
      </div>
    </header>
  );
};

export default Header;
