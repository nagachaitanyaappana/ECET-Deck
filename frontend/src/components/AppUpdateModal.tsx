import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { DownloadCloud, Sparkles, X, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';

export const CURRENT_APP_VERSION = '1.1.0';

export interface AppVersionInfo {
  latestVersion: string;
  versionCode: number;
  apkUrl: string;
  releaseNotes: string;
  minSupportedVersion: string;
}

interface AppInstallerPlugin {
  canRequestInstall(): Promise<{ value: boolean }>;
  openInstallPermissionSettings(): Promise<void>;
  downloadAndInstall(options: { url: string }): Promise<{ status: string }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (data: { percent: number; currentBytes: number; totalBytes: number }) => void
  ): Promise<any>;
  addListener(
    eventName: 'downloadStatus',
    listenerFunc: (data: { status: string; message?: string }) => void
  ): Promise<any>;
  removeAllListeners(): Promise<void>;
}

const AppInstaller = registerPlugin<AppInstallerPlugin>('AppInstaller');

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

  // In-App Download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [currentBytes, setCurrentBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [requiresPermission, setRequiresPermission] = useState(false);

  useEffect(() => {
    checkVersion();
  }, [manualCheck]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let progressSub: any;
    let statusSub: any;

    const setupListeners = async () => {
      progressSub = await AppInstaller.addListener('downloadProgress', (data) => {
        setDownloadPercent(data.percent);
        setCurrentBytes(data.currentBytes);
        setTotalBytes(data.totalBytes);
      });

      statusSub = await AppInstaller.addListener('downloadStatus', (data) => {
        if (data.status === 'installing') {
          setDownloadStatus('installing');
          setDownloadError(null);
        } else if (data.status === 'requires_permission') {
          setRequiresPermission(true);
          setDownloadStatus('permission_needed');
        } else if (data.status === 'error') {
          setDownloadError(data.message || 'Download failed');
          setIsDownloading(false);
        }
      });
    };

    setupListeners();

    return () => {
      if (progressSub?.remove) progressSub.remove();
      if (statusSub?.remove) statusSub.remove();
    };
  }, []);

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
    if (isDownloading) return; // Prevent dismissing while downloading
    if (versionInfo) {
      sessionStorage.setItem(`dismissed_update_${versionInfo.latestVersion}`, 'true');
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleDownload = async () => {
    if (!versionInfo?.apkUrl) return;

    // If running inside Android APK via Capacitor
    if (Capacitor.isNativePlatform()) {
      setIsDownloading(true);
      setDownloadPercent(0);
      setDownloadError(null);
      setDownloadStatus('downloading');
      setRequiresPermission(false);

      try {
        await AppInstaller.downloadAndInstall({ url: versionInfo.apkUrl });
      } catch (err: any) {
        setDownloadError(err.message || 'In-app download failed');
        setIsDownloading(false);
      }
    } else {
      // Browser fallback
      window.open(versionInfo.apkUrl, '_blank');
      handleDismiss();
    }
  };

  const handleOpenPermissionSettings = async () => {
    try {
      await AppInstaller.openInstallPermissionSettings();
    } catch (e: any) {
      setDownloadError(e.message || 'Could not open settings');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative overflow-hidden">
        {/* Close Button */}
        {!isDownloading && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

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
                <DownloadCloud className={`w-6 h-6 ${isDownloading ? 'animate-pulse' : 'animate-bounce'}`} />
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

            {versionInfo?.releaseNotes && !isDownloading && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 max-h-36 overflow-y-auto">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  What's New in this update:
                </span>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-sans">
                  {versionInfo.releaseNotes}
                </p>
              </div>
            )}

            {/* In-App Download Progress State */}
            {isDownloading && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    {downloadStatus === 'installing'
                      ? 'Launching Android Installer…'
                      : downloadPercent >= 100
                      ? 'Preparing Package…'
                      : `Downloading (${downloadPercent}%)`}
                  </span>
                  {totalBytes > 0 && (
                    <span className="text-[11px] text-slate-500 font-normal">
                      {(currentBytes / (1024 * 1024)).toFixed(1)} / {(totalBytes / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  )}
                </div>

                <div className="w-full bg-blue-200/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${Math.min(100, Math.max(5, downloadPercent))}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 text-center">
                  {downloadStatus === 'installing'
                    ? 'Please tap "Update" on the Android system prompt.'
                    : 'Downloading directly inside ECET Desk…'}
                </p>
              </div>
            )}

            {/* Permission Needed Card */}
            {requiresPermission && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Permission Required</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Android requires permission to install apps outside the store. Please allow "Install unknown apps" for ECET Desk, then tap install.
                </p>
                <button
                  type="button"
                  onClick={handleOpenPermissionSettings}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Enable Install Permission
                </button>
              </div>
            )}

            {/* Error Card */}
            {downloadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-2">
                <p>Failed to download update: {downloadError}</p>
                {versionInfo?.apkUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(versionInfo.apkUrl, '_blank')}
                    className="underline font-bold text-red-800"
                  >
                    Download via browser instead
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!isDownloading && (
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
                  <DownloadCloud className="w-4 h-4" />
                  <span>Update Now</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
