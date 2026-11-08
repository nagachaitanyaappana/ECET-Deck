import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest, ApiError, getApiBaseUrl, setApiBaseUrl } from '../api/client';
import type { AuthResponse } from '../types';
import { BookOpen, LogIn, UserPlus, AlertCircle, CheckCircle, Settings, Server, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="auth-screen">
      <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-two" aria-hidden="true" />
      <div className="auth-wrap">
        <a className="auth-brand" href="/" aria-label="Paradox ECET Deck home">
          <span className="auth-brand-icon"><BookOpen size={23} strokeWidth={2.2} /></span>
          <span><strong>Paradox <em>ECET Deck</em></strong><small>PREPARE · PRACTICE · PROGRESS</small></span>
        </a>

        <section className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-kicker"><Sparkles size={13} /> YOUR PREPARATION STARTS HERE</span>
            <h1>{tab === 'login' ? 'Welcome back.' : 'Create your space.'}</h1>
            <p>{tab === 'login' ? 'Pick up where your preparation left off.' : 'Set up your account and get ready to practice.'}</p>
          </div>

          <div className="auth-switch" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={tab === 'login'} onClick={() => { setTab('login'); setError(null); setSuccess(null); }} className={tab === 'login' ? 'selected' : ''}><LogIn size={16} /> Sign in</button>
            <button type="button" role="tab" aria-selected={tab === 'register'} onClick={() => { setTab('register'); setError(null); setSuccess(null); }} className={tab === 'register' ? 'selected' : ''}><UserPlus size={16} /> Create account</button>
          </div>

          {error && <div role="alert" className="auth-alert auth-error"><AlertCircle size={17} /><span>{error}</span></div>}
          {success && <div role="status" className="auth-alert auth-success"><CheckCircle size={17} /><span>{success}</span></div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {tab === 'register' && <div className="auth-field"><label htmlFor="displayName">Your name</label><input id="displayName" type="text" required autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter your full name" /></div>}
            <div className="auth-field"><label htmlFor="email">Email address</label><input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="auth-field"><label htmlFor="password">Password</label><div className="auth-password-wrap"><input id="password" type={showPassword ? 'text' : 'password'} required minLength={tab === 'register' ? 10 : 1} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={tab === 'register' ? 'At least 10 characters' : 'Enter your password'} /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{tab === 'register' && <small>Use at least 10 characters.</small>}</div>
            <button type="submit" disabled={loading} className="auth-submit">{loading ? <span className="auth-spinner" /> : <>{tab === 'login' ? 'Continue to dashboard' : 'Create account'} <ArrowRight size={17} /></>}</button>
          </form>

          <div className="auth-bottom"><span>Private study space for DCME candidates</span><button type="button" onClick={() => setShowServerConfig(!showServerConfig)}><Settings size={14} /> Server settings</button></div>
          {showServerConfig && <form onSubmit={handleSaveServerUrl} className="auth-server-panel"><strong><Server size={15} /> Backend API address</strong><p>Enter your hosted server URL or local Wi-Fi address. Leave blank to use the current origin.</p><input type="text" aria-label="Backend API address" placeholder="https://your-api.example.com" value={customServerUrl} onChange={e => setCustomServerUrl(e.target.value)} /><div><button type="button" onClick={() => setShowServerConfig(false)}>Cancel</button><button type="submit">Save address</button></div></form>}
        </section>
        <p className="auth-footnote">A little progress every day adds up.</p>
      </div>
    </main>
  );
};
