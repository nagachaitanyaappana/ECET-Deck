import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest, ApiError, getApiBaseUrl, setApiBaseUrl } from '../api/client';
import type { AuthResponse } from '../types';
import {
  AlertCircle, BookOpen, CheckCircle2, Eye, EyeOff, Link2, Lock, LogIn,
  Mail, Save, Server, Settings, ShieldCheck, Sparkles, User, UserPlus, X,
} from 'lucide-react';

type AuthMode = 'login' | 'register';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(() => getApiBaseUrl());

  const switchMode = (mode: AuthMode) => {
    setTab(mode);
    setError(null);
    setSuccess(null);
  };

  const handleSaveServerUrl = (event: React.FormEvent) => {
    event.preventDefault();
    setApiBaseUrl(customServerUrl);
    setSuccess('Server address saved. You can now sign in.');
    setShowServerConfig(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        setSuccess('Account created successfully. Signing you in…');
        const response = await apiRequest<AuthResponse>('/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        login(response);
      }
    } catch (err: unknown) {
      setError(err instanceof ApiError
        ? err.message
        : 'Unable to reach the server. Check your connection and API server address.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-[#e3e6f2] bg-[#f7f8fd] py-3 pl-11 pr-4 text-sm text-[#131b2e] placeholder:text-[#9999ad] outline-none transition hover:bg-white focus:border-[#6358e8] focus:bg-white focus:ring-4 focus:ring-[#6358e8]/10';
  const labelClass = 'mb-1.5 block text-[13px] font-semibold text-[#27283d]';

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]" style={{ fontFamily: '"Source Sans 3", sans-serif' }}>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-[#e9e8f2] bg-[#faf8ff]/90 shadow-[0_1px_8px_rgba(20,20,50,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4f46e5] text-white">
              <BookOpen size={18} />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-[#17182d]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Paradox ECET
            </span>
          </div>
          <span className="hidden items-center gap-2 rounded-full bg-[#eeedff] px-3 py-1.5 text-[11px] font-semibold text-[#5148c8] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#26a879]" />
            Student assessment portal
          </span>
        </div>
      </header>

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-8 pt-24 sm:px-6">
        <div aria-hidden="true" className="pointer-events-none absolute -top-36 left-1/2 h-[430px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4f46e5]/20 via-[#756df1]/10 to-transparent blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-0 h-[350px] w-[500px] rounded-full bg-gradient-to-t from-[#7770e8]/15 to-transparent blur-3xl" />

        <section className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e4e1ff] bg-[#eeedff]/75 px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#5148c8] shadow-sm backdrop-blur">
            <Sparkles size={14} />
            AP &amp; TS ECET · DIPLOMA PREPARATION
          </div>

          <div className="mb-3.5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#4f46e5] via-[#4338ca] to-[#3130c0] text-white shadow-xl shadow-indigo-500/25">
            <BookOpen size={27} />
          </div>

          <h1 className="text-center text-[32px] font-bold leading-tight tracking-[-0.04em] text-[#17182d] sm:text-[38px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
            Paradox ECET Deck
          </h1>
          <p className="mb-6 mt-1.5 max-w-xs text-center text-sm leading-6 text-[#68697e]">
            Master DCME, Mathematics, Physics &amp; Chemistry with focused practice and mock exams.
          </p>

          <div className="w-full rounded-[26px] border border-white/80 bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(42,39,100,0.12)] backdrop-blur-xl sm:px-8 sm:py-7">
            <div className="mb-6 flex rounded-xl bg-[#f1f1fa] p-1">
              <button type="button" onClick={() => switchMode('login')} aria-pressed={tab === 'login'}
                className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-2 text-[13px] font-bold transition ${tab === 'login' ? 'bg-white text-[#4338ca] shadow-sm' : 'text-[#696a80] hover:text-[#25263c]'}`}>
                <LogIn size={16} /> Sign In
              </button>
              <button type="button" onClick={() => switchMode('register')} aria-pressed={tab === 'register'}
                className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-2 text-[13px] font-bold transition ${tab === 'register' ? 'bg-white text-[#4338ca] shadow-sm' : 'text-[#696a80] hover:text-[#25263c]'}`}>
                <UserPlus size={16} /> Create Account
              </button>
            </div>

            {error && (
              <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{error}</span>
              </div>
            )}
            {success && (
              <div role="status" className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" /><span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className={labelClass} htmlFor="display-name">Full Name</label>
                  <div className="relative">
                    <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85869c]" />
                    <input id="display-name" className={inputClass} type="text" required autoComplete="name" value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder="Enter your full name" />
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass} htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85869c]" />
                  <input id="email" className={inputClass} type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="student@example.com" />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#27283d]" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85869c]" />
                  <input id="password" className={`${inputClass} pr-12`} type={showPassword ? 'text' : 'password'} required minLength={tab === 'register' ? 10 : 1} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} placeholder={tab === 'register' ? 'At least 10 characters' : 'Enter your password'} />
                  <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#85869c] hover:text-[#4338ca]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {tab === 'register' && <p className="mt-1.5 text-[11px] text-[#85869c]">Use at least 10 characters.</p>}
              </div>

              <button type="submit" disabled={loading}
                className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#4338ca] to-[#3130c0] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : <><ShieldCheck size={17} /> {tab === 'login' ? 'Sign In to ECET Deck' : 'Register Student Account'}</>}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f6f6fc] px-3 py-3 text-[10px] font-semibold text-[#62637a]">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#07865c]" /> 200-Q Timed Mocks</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#07865c]" /> Untimed Daily Tests</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#07865c]" /> C23 Syllabus</span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeef5] pt-4 text-[10px] text-[#85869c]">
              <span>Private study space for DCME students.</span>
              <button type="button" onClick={() => setShowServerConfig(value => !value)} className="flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-[#6664a0] transition hover:bg-[#eeedff] hover:text-[#4338ca]">
                <Settings size={14} /> Server
              </button>
            </div>

            {showServerConfig && (
              <form onSubmit={handleSaveServerUrl} className="mt-4 rounded-2xl border border-[#e5e4f2] bg-[#f3f3fc] p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-bold text-[#292a43]"><Server size={15} className="text-[#5148c8]" /> Backend API Server URL</div>
                <p className="mb-3 text-[11px] leading-5 text-[#73748a]">For a mobile or desktop build, enter the hosted API address or your computer's local network address.</p>
                <div className="relative">
                  <Link2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#85869c]" />
                  <input aria-label="Backend API Server URL" className="w-full rounded-lg border border-[#e1e1ed] bg-white py-2.5 pl-9 pr-3 text-xs text-[#292a43] outline-none focus:border-[#6358e8] focus:ring-4 focus:ring-[#6358e8]/10" type="url" value={customServerUrl} onChange={event => setCustomServerUrl(event.target.value)} placeholder="https://your-api.example.com" />
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowServerConfig(false)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-[#68697e] hover:bg-white"><X size={13} /> Cancel</button>
                  <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-[#4338ca] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#3730a3]"><Save size={13} /> Save URL</button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold text-[#77788d]">
            <span className="h-2 w-2 rounded-full bg-[#16a36d]" />
            Secure access to your ECET preparation workspace
          </div>
        </section>
      </main>
    </div>
  );
};
