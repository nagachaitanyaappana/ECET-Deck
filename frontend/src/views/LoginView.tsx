import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest, ApiError, getApiBaseUrl, setApiBaseUrl } from '../api/client';
import type { AuthResponse } from '../types';
import {
  BookOpen, LogIn, UserPlus, AlertCircle, CheckCircle,
  Settings, Server, Sparkles, Target, TrendingUp
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(() => getApiBaseUrl());

  const handleSaveServerUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(customServerUrl);
    setSuccess('Server URL saved. You can now sign in.');
    setShowServerConfig(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (tab === 'login') {
        const response = await apiRequest<AuthResponse>('/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        login(response);
      } else {
        await apiRequest<{ userId: string }>('/api/v1/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, displayName }),
        });
        setSuccess('Account created successfully. Signing you in...');
        const loginRes = await apiRequest<AuthResponse>('/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        login(loginRes);
      }
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Network error. Check that the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-story" aria-label="About Paradox ECET Deck">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lime-200 ring-1 ring-white/15">
            <BookOpen className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight">Paradox <span className="text-lime-200">ECET Deck</span></span>
            <span className="mt-0.5 block text-xs text-white/60">A smarter way to prepare</span>
          </span>
        </div>

        <div className="login-story-content">
          <span className="login-eyebrow"><Sparkles className="h-3.5 w-3.5" /> Your ECET preparation space</span>
          <h1>Make every<br />practice session <span>count.</span></h1>
          <p className="login-story-copy">
            Build confidence one question at a time. Practice with mock tests and previous-year papers, then use your own progress to decide what to work on next.
          </p>
          <div className="login-feature-list">
            <div className="login-feature"><span className="login-feature-icon"><BookOpen className="h-4 w-4" /></span> Practice tests built around the ECET pattern</div>
            <div className="login-feature"><span className="login-feature-icon"><Target className="h-4 w-4" /></span> Previous-year question challenges</div>
            <div className="login-feature"><span className="login-feature-icon"><TrendingUp className="h-4 w-4" /></span> Track your progress and focus areas</div>
          </div>
        </div>

        <div className="login-story-footer">PREPARE. PRACTICE. PROGRESS.</div>
      </section>

      <section className="login-form-side">
        <div className="w-full max-w-md">
          <div className="login-mobile-brand">
            <span className="brand-mark"><BookOpen className="h-5 w-5" /></span>
            <span><span className="block text-sm font-extrabold tracking-tight text-slate-900">Paradox ECET Deck</span><span className="block text-[11px] text-slate-500">Prepare. Practice. Progress.</span></span>
          </div>

          <div className="login-card">
            <div className="mb-2">
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-700">Welcome</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                {tab === 'login' ? 'Good to see you again.' : 'Create your account.'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {tab === 'login' ? 'Sign in to continue your ECET preparation.' : 'Join your private ECET preparation group.'}
              </p>
            </div>

            <div className="login-tabs">
              <button type="button" onClick={() => { setTab('login'); setError(null); }} className={tab === 'login' ? 'active' : ''}>
                <LogIn className="h-4 w-4" /> Sign in
              </button>
              <button type="button" onClick={() => { setTab('register'); setError(null); }} className={tab === 'register' ? 'active' : ''}>
                <UserPlus className="h-4 w-4" /> Register
              </button>
            </div>

            {error && (
              <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
              </div>
            )}
            {success && (
              <div role="status" className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label htmlFor="displayName">Full name</label>
                  <input id="displayName" type="text" required autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter your name" className="w-full px-4 py-3 text-sm" />
                </div>
              )}
              <div>
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 text-sm" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" required minLength={tab === 'register' ? 10 : 1} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={tab === 'register' ? 'At least 10 characters' : 'Enter your password'} className="w-full px-4 py-3 text-sm" />
                {tab === 'register' && <p className="mt-1.5 text-[11px] text-slate-400">Use at least 10 characters.</p>}
              </div>
              <button type="submit" disabled={loading} className="submit-button flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-55">
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : tab === 'login' ? <><LogIn className="h-4 w-4" /> Sign in to your account</> : <><UserPlus className="h-4 w-4" /> Create account</>}
              </button>
            </form>

            <div className="login-meta">
              <span>Private group for DCME diploma candidates.</span>
              <button type="button" onClick={() => setShowServerConfig(!showServerConfig)} className="inline-flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-emerald-700" title="Configure backend server URL">
                <Settings className="h-3.5 w-3.5" /> Server
              </button>
            </div>

            {showServerConfig && (
              <form onSubmit={handleSaveServerUrl} className="server-panel space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Server className="h-4 w-4 text-emerald-700" /> Backend API address</div>
                <p className="text-[11px] leading-relaxed text-slate-500">For a mobile or desktop client, enter your hosted server URL or local Wi-Fi address. Leave blank to use the current origin.</p>
                <input type="text" placeholder="https://your-api.example.com" value={customServerUrl} onChange={e => setCustomServerUrl(e.target.value)} className="w-full px-3 py-2 text-xs" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowServerConfig(false)} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Cancel</button>
                  <button type="submit" className="rounded-lg bg-emerald-800 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-900">Save address</button>
                </div>
              </form>
            )}
          </div>
          <p className="mt-5 text-center text-[11px] text-slate-400">A focused workspace for consistent preparation.</p>
        </div>
      </section>
    </div>
  );
};
