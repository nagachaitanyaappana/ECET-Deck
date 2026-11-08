import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, BookOpen, Shield } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              ECET Desk
              {isAdmin && (
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" /> ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">AP ECET DCME Practice</p>
          </div>
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium truncate max-w-[150px]">{user.displayName}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
