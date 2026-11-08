import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Shield, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <button onClick={onGoHome} aria-label="Go to Paradox dashboard" className="brand-button">
          <span className="brand-mark"><BookOpen className="w-5 h-5" strokeWidth={2.4} /></span>
          <span className="nav-brand-copy">
            <span className="brand-name">Paradox <span>ECET Deck</span></span>
            <span className="brand-tagline">PREPARE · PRACTICE · PROGRESS</span>
          </span>
        </button>

        {user && (
          <div className="nav-actions">
            <div className="nav-workspace">
              <span className="nav-status-dot" />
              <span>{isAdmin ? 'Admin workspace' : 'Student workspace'}</span>
              {isAdmin && <span className="nav-admin-badge"><Shield size={12} /> ADMIN</span>}
            </div>
            <span className="nav-divider" aria-hidden="true" />
            <button onClick={logout} className="logout-button" title="Sign out" aria-label="Sign out">
              <LogOut size={16} /><span>Sign out</span><ArrowUpRight className="nav-logout-arrow" size={13} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
