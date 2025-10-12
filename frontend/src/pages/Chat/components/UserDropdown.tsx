import React, { useState, useRef, useEffect } from "react";
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import type { AuthContext } from "../../../Contexts/AuthContext";

interface UserDropdownProps {
  user: AuthContext["user"];
  onSignOut: AuthContext["signout"];
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-1 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.username?.charAt(0).toUpperCase() ?? "U"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-slate-700">
            {user?.username ?? "User"}
          </span>
          <svg
            className={`w-4 h-4 text-slate-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                {user?.username}
              </span>
            </div>
          </div>

          <div className="py-2">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <Cog6ToothIcon className="w-5 h-5 text-slate-400" />
              Settings
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowRightEndOnRectangleIcon className="w-5 h-5 text-slate-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
