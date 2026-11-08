import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client';
import { CheckCircle2, KeyRound, RefreshCw, Save, Server, ShieldCheck, Trash2 } from 'lucide-react';

type RuntimeSettings = {
  provider: string;
  apiKeyConfigured: boolean;
  apiKeySource: string;
  model: string;
  restartRequired: boolean;
};

export const ServerSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<RuntimeSettings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('openai/gpt-4o-mini');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const value = await apiRequest<RuntimeSettings>('/api/v1/admin/settings');
      setSettings(value);
      setModel(value.model);
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Could not load server settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setNotice(null);
    try {
      await apiRequest('/api/v1/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ apiKey: apiKey.trim() || null, clearApiKey: false, model: model.trim() })
      });
      setApiKey('');
      setNotice({ type: 'success', text: 'Settings saved. New AI generation requests will use these values immediately.' });
      await load();
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Could not save settings.' });
    } finally { setSaving(false); }
  };

  const clearOverride = async () => {
    if (!confirm('Remove the dashboard API key override? The backend will fall back to OPENROUTER_API_KEY from the environment, if configured.')) return;
    setClearing(true); setNotice(null);
    try {
      await apiRequest('/api/v1/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ clearApiKey: true, model, apiKey: null })
      });
      setNotice({ type: 'success', text: 'Dashboard key override removed. Environment configuration will be used if present.' });
      await load();
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Could not remove the key override.' });
    } finally { setClearing(false); }
  };

  return (
    <section className="space-y-5">
      <div className="bg-white/95 rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl text-slate-900">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center"><Server className="w-5 h-5" /></div>
            <div><h2 className="text-lg font-bold">Server & AI Provider Settings</h2><p className="text-xs text-slate-500 mt-1">Manage safe, runtime-editable application configuration.</p></div>
          </div>
          <button onClick={() => void load()} disabled={loading} className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50" aria-label="Refresh settings"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>

        {notice && <div className={`mb-5 rounded-xl p-3 text-sm border ${notice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{notice.text}</div>}

        {loading && !settings ? <p className="text-sm text-slate-500 py-8 text-center">Loading configuration…</p> : (
          <form onSubmit={save} className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
              <div><p className="text-sm font-bold text-emerald-900">Protected configuration</p><p className="text-xs text-emerald-800 mt-1">The API key is encrypted before it is stored. It is never returned to the browser or displayed after saving.</p></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">OpenRouter API key</label>
                <div className="relative"><KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input type="password" autoComplete="new-password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder={settings?.apiKeyConfigured ? 'Saved key is hidden — enter a new key to replace it' : 'sk-or-v1-…'} className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                <p className="text-[11px] text-slate-500 mt-2">Status: <span className={settings?.apiKeyConfigured ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>{settings?.apiKeyConfigured ? 'Configured' : 'Not configured'}</span> · Source: {settings?.apiKeySource || 'Unknown'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">OpenRouter model</label>
                <input required maxLength={120} value={model} onChange={e => setModel(e.target.value)} placeholder="openai/gpt-4o-mini" className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <p className="text-[11px] text-slate-500 mt-2">Use a model identifier supported by OpenRouter. Changes apply to the next generation request.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => void clearOverride()} disabled={clearing || !settings?.apiKeyConfigured} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 disabled:opacity-40"><Trash2 className="w-4 h-4" />{clearing ? 'Removing…' : 'Remove key override'}</button>
              <button type="submit" disabled={saving || loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50"><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save settings'}</button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5 text-slate-200">
        <h3 className="text-sm font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Environment-only settings</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">Database URL and credentials, JWT signing secret, server port, and first-admin bootstrap credentials stay in the deployment environment or local .env file. They are intentionally not exposed here because changing them from the browser could break the server or compromise account security.</p>
        <p className="text-xs text-slate-400 mt-2">The dashboard API key override takes priority over OPENROUTER_API_KEY. Removing the override returns to the environment value.</p>
      </div>
    </section>
  );
};
