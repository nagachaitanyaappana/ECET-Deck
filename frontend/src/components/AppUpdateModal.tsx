import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { DownloadCloud, Sparkles, X, CheckCircle, ExternalLink } from 'lucide-react';

export const CURRENT_APP_VERSION = '1.0.0';

export interface AppVersionInfo {
  latestVersion: string;
  versionCode: number;
  apkUrl: string;
  releaseNotes: string;
  minSupportedVersion: string;
}

export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const parts2 = v2.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < len; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

interface AppUpdateModalProps {
  manualCheck?: boolean;
  onClose?: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({ manualCheck, onClose }) => {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpToDateNotice, setIsUpToDateNotice] = useState(false);

  useEffect(() => {
    checkVersion();
  }, [manualCheck]);

  const checkVersion = async () => {
    try {
      const data = await apiRequest<AppVersionInfo>('/api/v1/app/version');
      setVersionInfo(data);

      const hasUpdate = compareVersions(data.latestVersion, CURRENT_APP_VERSION) > 0;
      const dismissedKey = `dismissed_update_${data.latestVersion}`;
      const isDismissed = sessionStorage.getItem(dismissedKey) === 'true';

      if (hasUpdate && (!isDismissed || manualCheck)) {
        setIsOpen(true);
        setIsUpToDateNotice(false);
      } else if (manualCheck && !hasUpdate) {
        setIsUpToDateNotice(true);
        setIsOpen(true);
      }
    } catch {
      if (manualCheck) {
        setIsUpToDateNotice(false);
        setIsOpen(false);
      }
    }
  };

  const handleDismiss = () => {
    if (versionInfo) {
      sessionStorage.setItem(`dismissed_update_${versionInfo.latestVersion}`, 'true');
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleDownload = () => {
    if (!versionInfo?.apkUrl) return;
    window.open(versionInfo.apkUrl, '_blank');
    handleDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isUpToDateNotice ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">App is Up to Date</h3>
            <p className="text-xs text-slate-600">
              You are currently using the latest version of ECET Desk (v{CURRENT_APP_VERSION}).
            </p>
            <button
              onClick={handleDismiss}
              className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <DownloadCloud className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 mb-1">
                  <Sparkles className="w-3 h-3" /> Update Available
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  New Version v{versionInfo?.latestVersion}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              A newer build of ECET Desk is ready with performance upgrades, new exams, and UI improvements.
            </p>

            {versionInfo?.releaseNotes && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  What's New in this update:
                </span>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-sans">
                  {versionInfo.releaseNotes}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Later
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Update Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
