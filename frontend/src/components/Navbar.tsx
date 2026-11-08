import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Shield, Sparkles } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  const { user, logout, isAdmin } = useAuth();

  const userInitial = user?.displayName
    ? user.displayName.trim().charAt(0).toUpperCase()
    : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <header className="bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 shadow-xl shadow-black/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-16 py-3 flex items-center justify-between gap-4">
        <button 
          onClick={onGoHome}
          aria-label="Go to Paradox dashboard"
          className="flex items-center gap-3 text-left group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 group-hover:shadow-blue-600/50 transition-all ring-1 ring-white/20">
            <BookOpen className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-white leading-tight flex items-center gap-2">
              <span className="tracking-tight text-base sm:text-lg">Paradox</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                ECET C23
              </span>
              {isAdmin && (
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-400" /> ADMIN
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AP & TS Diploma Preparation</span>
            </p>
          </div>
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-slate-900/80 border border-slate-800 shadow-inner">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/20 ring-1 ring-white/20">
                {userInitial}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-200 leading-tight max-w-[130px] truncate">
                  {user.displayName || user.email.split('@')[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-medium leading-none">
                  {isAdmin ? 'Administrator' : 'DCME Aspirant'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="min-h-10 flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-rose-300 bg-slate-900/80 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 px-3.5 py-2 rounded-xl transition-all font-semibold cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
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
