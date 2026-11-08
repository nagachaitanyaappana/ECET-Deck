import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Shield } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <button
          onClick={onGoHome}
          aria-label="Go to Paradox dashboard"
          className="brand-button group rounded-xl focus-visible:outline-none"
        >
          <span className="brand-mark transition-transform group-hover:-rotate-3">
            <BookOpen className="w-5 h-5" strokeWidth={2.4} />
          </span>
          <span>
            <span className="brand-name flex items-center gap-2">
              Paradox <span className="text-emerald-700">ECET Deck</span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-amber-700">
                  <Shield className="h-3 w-3" /> ADMIN
                </span>
              )}
            </span>
            <span className="brand-tagline block">Prepare. Practice. Progress.</span>
          </span>
        </button>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="role-pill hidden sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {isAdmin ? 'Administrator' : 'Student workspace'}
            </div>
            <button
              onClick={logout}
              className="logout-button inline-flex min-h-10 items-center gap-2 cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
