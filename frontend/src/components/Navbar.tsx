import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Shield } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-16 py-2 flex items-center justify-between gap-3">
        <button 
          onClick={onGoHome}
          aria-label="Go to Paradox dashboard"
          className="flex items-center gap-3 text-left group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              Paradox
              {isAdmin && (
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" /> ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">ECET practice workspace</p>
          </div>
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="font-semibold">{isAdmin ? 'Administrator' : 'Student'}</span>
            </div>
            <button
              onClick={logout}
              className="min-h-10 flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-colors font-semibold cursor-pointer"
              title="Sign out" aria-label="Sign out"
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
