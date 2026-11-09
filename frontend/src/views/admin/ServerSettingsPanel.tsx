import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client';
import { CheckCircle2, KeyRound, RefreshCw, Save, Server, ShieldCheck, Trash2, AlertTriangle, Mail, DownloadCloud } from 'lucide-react';

type RuntimeSettings = {
  provider: string;
  apiKeyConfigured: boolean;
  apiKeySource: string;
  model: string;
  modelSource: string;
  brevoApiKeyConfigured: boolean;
  brevoApiKeySource: string;
  encryptionKeyConfigured: boolean;
  latestVersion?: string;
  versionSource?: string;
  apkUrl?: string;
  apkUrlSource?: string;
  releaseNotes?: string;
};

export const ServerSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<RuntimeSettings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [brevoApiKey, setBrevoApiKey] = useState('');
  const [model, setModel] = useState('openrouter/free');
  const [latestVersion, setLatestVersion] = useState('1.1.0');
  const [apkUrl, setApkUrl] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearingBrevo, setClearingBrevo] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const value = await apiRequest<RuntimeSettings>('/api/v1/admin/settings');
      setSettings(value);
      if (value.model) setModel(value.model);
      if (value.latestVersion) setLatestVersion(value.latestVersion);
      if (value.apkUrl) setApkUrl(value.apkUrl);
      if (value.releaseNotes) setReleaseNotes(value.releaseNotes);
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Could not load server settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await apiRequest('/api/v1/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          apiKey: apiKey.trim() || null, clearApiKey: false, model: model.trim(),
          brevoApiKey: brevoApiKey.trim() || null, clearBrevoApiKey: false,
          latestVersion: latestVersion.trim() || null,
          apkUrl: apkUrl.trim() || null,
          releaseNotes: releaseNotes.trim() || null
        })
      });
      setApiKey('');
      setBrevoApiKey('');
      setNotice({ type: 'success', text: 'Settings saved securely. New AI models, email keys, and app update versions are now live.' });
      await load();
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Could not save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const clearOverride = async (provider: 'openrouter' | 'brevo') => {
    const isBrevo = provider === 'brevo';
    if (!confirm(isBrevo
      ? 'Remove the dashboard Brevo API key? The backend will fall back to BREVO_API_KEY from the environment, if configured.'
      : 'Remove the dashboard OpenRouter API key? The backend will fall back to OPENROUTER_API_KEY from the environment, if configured.')) return;
    if (isBrevo) setClearingBrevo(true); else setClearing(true);
    setNotice(null);
    try {
      await apiRequest('/api/v1/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          clearApiKey: !isBrevo, apiKey: null, model,
          clearBrevoApiKey: isBrevo, brevoApiKey: null
        })
      });
      setNotice({ type: 'success', text: isBrevo
        ? 'Dashboard Brevo key removed. Environment configuration will be used if present.'
        : 'Dashboard OpenRouter key removed. Environment configuration will be used if present.' });
      await load();
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Could not remove the key override.' });
    } finally {
      setClearing(false);
      setClearingBrevo(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm text-slate-900">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center"><Server className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg font-bold">Server & API Provider Settings</h2>
              <p className="text-xs text-slate-500 mt-1">Manage the API credentials used by Paradox services.</p>
            </div>
          </div>
          <button onClick={() => void load()} disabled={loading} className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50" aria-label="Refresh settings">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {notice && <div role="status" className={`mb-5 rounded-xl p-3 text-sm border ${notice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{notice.text}</div>}

        {loading && !settings ? <p className="text-sm text-slate-500 py-8 text-center">Loading configuration…</p> : (
          <form onSubmit={save} className="space-y-5">
            <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-lime-800 mt-0.5 shrink-0" />
              <div><p className="text-sm font-bold text-lime-950">Protected configuration</p><p className="text-xs text-lime-900 mt-1">API keys are encrypted before storage and are never returned to the browser.</p></div>
            </div>

            {!settings?.encryptionKeyConfigured && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>SETTINGS_ENCRYPTION_KEY_BASE64 is not configured on the server. Add a dedicated 32-byte key to the environment before saving dashboard API keys.</span>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
              <div className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-bold">OpenRouter</h3></div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">OpenRouter API key</label>
                <input type="password" autoComplete="new-password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder={settings?.apiKeyConfigured ? 'Saved key is hidden — enter a new key to replace it' : 'sk-or-v1-…'} className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500/30" />
                <p className="text-[11px] text-slate-500 mt-2">Status: <span className={settings?.apiKeyConfigured ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>{settings?.apiKeyConfigured ? 'Configured' : 'Not configured'}</span> · Source: {settings?.apiKeySource || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">OpenRouter model</label>
                <input required maxLength={120} value={model} onChange={e => setModel(e.target.value)} placeholder="openai/gpt-4o-mini" className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500/30" />
                <p className="text-[11px] text-slate-500 mt-2">Model: {settings?.modelSource || 'Default'} · Changes apply to the next generation request.</p>
              </div>
              <button type="button" onClick={() => void clearOverride('openrouter')} disabled={clearing || !settings?.apiKeyConfigured || settings.apiKeySource !== 'Admin dashboard'} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 disabled:opacity-40">
                <Trash2 className="w-4 h-4" />{clearing ? 'Removing…' : 'Remove OpenRouter dashboard key'}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-bold">Brevo Transactional Email</h3></div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Brevo API key</label>
                <input type="password" autoComplete="new-password" value={brevoApiKey} onChange={e => setBrevoApiKey(e.target.value)} placeholder={settings?.brevoApiKeyConfigured ? 'Saved key is hidden — enter a new key to replace it' : 'Paste your Brevo API v3 key'} className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500/30" />
                <p className="text-[11px] text-slate-500 mt-2">Status: <span className={settings?.brevoApiKeyConfigured ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>{settings?.brevoApiKeyConfigured ? 'Configured' : 'Not configured'}</span> · Source: {settings?.brevoApiKeySource || 'Unknown'}</p>
                <p className="text-[11px] text-slate-500 mt-1">Used for email verification, login codes, password resets, and admin notifications.</p>
              </div>
              <button type="button" onClick={() => void clearOverride('brevo')} disabled={clearingBrevo || !settings?.brevoApiKeyConfigured || settings.brevoApiKeySource !== 'Admin dashboard'} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 disabled:opacity-40">
                <Trash2 className="w-4 h-4" />{clearingBrevo ? 'Removing…' : 'Remove Brevo dashboard key'}
              </button>
            </div>

            {/* In-App Updater & Android Release Manager */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/20 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Android In-App Updater & Releases</h3>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {settings?.versionSource || 'GitHub Releases (Automatic)'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Latest Version Name</label>
                  <input
                    type="text"
                    value={latestVersion}
                    onChange={(e) => setLatestVersion(e.target.value)}
                    placeholder="1.1.0"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Leave blank to auto-sync latest version from GitHub Releases.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">APK Download URL</label>
                  <input
                    type="url"
                    value={apkUrl}
                    onChange={(e) => setApkUrl(e.target.value)}
                    placeholder="https://.../app-debug.apk"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Leave blank to use the permanent GitHub latest APK URL.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Release Notes (displayed to students)</label>
                <textarea
                  rows={3}
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                  placeholder="• Features added in this update..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button type="submit" disabled={saving || loading || (!settings?.encryptionKeyConfigured && (apiKey.trim().length > 0 || brevoApiKey.trim().length > 0))} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 text-white text-xs font-bold disabled:opacity-50">
                <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
        <h3 className="text-sm font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-700" /> Environment-only settings</h3>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">Database credentials, JWT signing secret, server port, sender email, and first-admin bootstrap credentials stay in the deployment environment or local .env file. They are intentionally not editable from the browser.</p>
        <p className="text-xs text-slate-600 mt-2">Removing a dashboard API key returns to its corresponding environment variable.</p>
      </div>
    </section>
  );
};
