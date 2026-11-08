import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest, ApiError, getApiBaseUrl, setApiBaseUrl } from '../api/client';
import type { AuthResponse } from '../types';
import { BookOpen, LogIn, UserPlus, AlertCircle, CheckCircle, Settings, Server, ArrowRight, Sparkles, Eye, EyeOff, Mail, KeyRound, ArrowLeft } from 'lucide-react';

type AuthStep = 'credentials' | 'verify-email' | 'verify-login' | 'forgot' | 'reset';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<AuthStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(() => getApiBaseUrl());

  const clearMessages = () => { setError(null); setSuccess(null); };
  const handleSaveServerUrl = (e: React.FormEvent) => {
    e.preventDefault(); setApiBaseUrl(customServerUrl);
    setSuccess('Server URL saved. You can now sign in.'); setShowServerConfig(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setLoading(true);
    try {
      if (step === 'credentials' && tab === 'register') {
        const response = await apiRequest<{ message: string }>('/api/v1/auth/register', {
          method: 'POST', body: JSON.stringify({ email, password, displayName }),
        });
        setStep('verify-email'); setSuccess(response.message);
      } else if (step === 'credentials' && tab === 'login') {
        const response = await apiRequest<{ message: string }>('/api/v1/auth/login', {
          method: 'POST', body: JSON.stringify({ email, password }),
        });
        setStep('verify-login'); setSuccess(response.message);
      } else if (step === 'verify-email') {
        const response = await apiRequest<{ message: string }>('/api/v1/auth/verify-email', {
          method: 'POST', body: JSON.stringify({ email, code }),
        });
        setStep('credentials'); setTab('login'); setCode(''); setSuccess(response.message + ' Sign in to receive your login code.');
      } else if (step === 'verify-login') {
        const response = await apiRequest<AuthResponse>('/api/v1/auth/verify-login', {
          method: 'POST', body: JSON.stringify({ email, code }),
        });
        login(response);
      } else if (step === 'forgot') {
        const response = await apiRequest<{ message: string }>('/api/v1/auth/forgot-password', {
          method: 'POST', body: JSON.stringify({ email }),
        });
        setStep('reset'); setSuccess(response.message);
      } else if (step === 'reset') {
        const response = await apiRequest<{ message: string }>('/api/v1/auth/reset-password', {
          method: 'POST', body: JSON.stringify({ email, code, newPassword }),
        });
        setStep('credentials'); setTab('login'); setCode(''); setNewPassword(''); setSuccess(response.message);
      }
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Network error. Check that the backend server is running and email is configured.');
    } finally { setLoading(false); }
  };

  const backToCredentials = () => { setStep('credentials'); setCode(''); setNewPassword(''); clearMessages(); };
  const title = step === 'verify-email' ? 'Verify your email.' : step === 'verify-login' ? 'One more step.' :
    step === 'forgot' ? 'Recover your account.' : step === 'reset' ? 'Choose a new password.' :
    tab === 'login' ? 'Welcome back.' : 'Create your space.';
  const subtitle = step === 'verify-email' ? 'Enter the 6-digit code we sent to your email.' :
    step === 'verify-login' ? 'Enter your email sign-in code to continue securely.' :
    step === 'forgot' ? 'We will send a recovery code if your account is eligible.' :
    step === 'reset' ? 'Enter the recovery code and choose a new password.' :
    tab === 'login' ? 'Pick up where your preparation left off.' : 'Set up your account and get ready to practice.';

  return (
    <main className="auth-screen">
      <div className="auth-orbit auth-orbit-one" aria-hidden="true" /><div className="auth-orbit auth-orbit-two" aria-hidden="true" />
      <div className="auth-wrap">
        <a className="auth-brand" href="/" aria-label="Paradox ECET Deck home">
          <span className="auth-brand-icon"><BookOpen size={23} strokeWidth={2.2} /></span>
          <span><strong>Paradox <em>ECET Deck</em></strong><small>PREPARE · PRACTICE · PROGRESS</small></span>
        </a>
        <section className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-kicker"><Sparkles size={13} /> YOUR PREPARATION STARTS HERE</span>
            <h1>{title}</h1><p>{subtitle}</p>
          </div>

          {step === 'credentials' && <div className="auth-switch" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={tab === 'login'} onClick={() => { setTab('login'); clearMessages(); }} className={tab === 'login' ? 'selected' : ''}><LogIn size={16} /> Sign in</button>
            <button type="button" role="tab" aria-selected={tab === 'register'} onClick={() => { setTab('register'); clearMessages(); }} className={tab === 'register' ? 'selected' : ''}><UserPlus size={16} /> Create account</button>
          </div>}

          {error && <div role="alert" className="auth-alert auth-error"><AlertCircle size={17} /><span>{error}</span></div>}
          {success && <div role="status" className="auth-alert auth-success"><CheckCircle size={17} /><span>{success}</span></div>}

          <form onSubmit={submit} className="auth-form">
            {step === 'credentials' && <>
              {tab === 'register' && <div className="auth-field"><label htmlFor="displayName">Your name</label><input id="displayName" type="text" required autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter your full name" /></div>}
              <div className="auth-field"><label htmlFor="email">Email address</label><input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div className="auth-field"><label htmlFor="password">Password</label><div className="auth-password-wrap"><input id="password" type={showPassword ? 'text' : 'password'} required minLength={tab === 'register' ? 10 : 1} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={tab === 'register' ? 'At least 10 characters' : 'Enter your password'} /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{tab === 'register' && <small>Use at least 10 characters.</small>}</div>
              {tab === 'login' && <button type="button" className="text-sm font-semibold text-lime-700 hover:text-lime-800 self-end" onClick={() => { setStep('forgot'); clearMessages(); }}>Forgot password?</button>}
            </>}
            {(step === 'verify-email' || step === 'verify-login' || step === 'reset') && <>
              <div className="auth-field"><label htmlFor="email-code">Email address</label><input id="email-code" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="auth-field"><label htmlFor="otp-code">6-digit verification code</label><input id="otp-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="000000" autoComplete="one-time-code" /></div>
              {step === 'reset' && <div className="auth-field"><label htmlFor="new-password">New password</label><div className="auth-password-wrap"><input id="new-password" type={showNewPassword ? 'text' : 'password'} minLength={10} maxLength={100} required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 10 characters" autoComplete="new-password" /><button type="button" className="auth-password-toggle" onClick={() => setShowNewPassword(v => !v)} aria-label={showNewPassword ? 'Hide password' : 'Show password'}>{showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>}
            </>}
            {step === 'forgot' && <div className="auth-field"><label htmlFor="recovery-email">Email address</label><input id="recovery-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>}
            <button type="submit" disabled={loading} className="auth-submit">{loading ? <span className="auth-spinner" /> : <>{step === 'credentials' ? (tab === 'login' ? 'Continue to dashboard' : 'Create account') : step === 'verify-email' ? 'Verify email' : step === 'verify-login' ? 'Verify and sign in' : step === 'forgot' ? 'Send recovery code' : 'Reset password'} <ArrowRight size={17} /></>}</button>
          </form>
          {step !== 'credentials' && <button type="button" onClick={backToCredentials} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft size={15} /> Back to sign in</button>}
          <div className="auth-bottom"><span>Private study space for DCME candidates</span><button type="button" onClick={() => setShowServerConfig(!showServerConfig)}><Settings size={14} /> Server settings</button></div>
          {showServerConfig && <form onSubmit={handleSaveServerUrl} className="auth-server-panel"><strong><Server size={15} /> Backend API address</strong><p>Enter your hosted server URL or local Wi-Fi address. Leave blank to use the current origin.</p><input type="text" aria-label="Backend API address" placeholder="https://your-api.example.com" value={customServerUrl} onChange={e => setCustomServerUrl(e.target.value)} /><div><button type="button" onClick={() => setShowServerConfig(false)}>Cancel</button><button type="submit">Save address</button></div></form>}
        </section>
        <p className="auth-footnote">A little progress every day adds up.</p>
      </div>
    </main>
  );
};
