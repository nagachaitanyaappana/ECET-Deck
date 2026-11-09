package com.ecetdesk.app;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@CapacitorPlugin(name = "AppInstaller")
public class AppInstallerPlugin extends Plugin {

    private volatile boolean isDownloading = false;

    @PluginMethod
    public void canRequestInstall(PluginCall call) {
        JSObject ret = new JSObject();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ret.put("value", getContext().getPackageManager().canRequestPackageInstalls());
        } else {
            ret.put("value", true);
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void openInstallPermissionSettings(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                intent.setData(Uri.parse("package:" + getContext().getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                call.resolve();
            } catch (Exception ex) {
                call.reject("Could not open install settings: " + ex.getMessage());
            }
        } else {
            call.resolve();
        }
    }

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String downloadUrl = call.getString("url");
        if (downloadUrl == null || downloadUrl.isBlank()) {
            call.reject("URL is required");
            return;
        }

        if (isDownloading) {
            call.reject("A download is already in progress");
            return;
        }

        isDownloading = true;

        new Thread(() -> {
            InputStream in = null;
            FileOutputStream out = null;
            HttpURLConnection conn = null;
            try {
                conn = openConnectionWithRedirects(downloadUrl);
                int responseCode = conn.getResponseCode();
                if (responseCode != HttpURLConnection.HTTP_OK) {
                    throw new IOException("Server returned HTTP " + responseCode);
                }

                int fileLength = conn.getContentLength();
                in = conn.getInputStream();

                File cacheDir = getContext().getCacheDir();
                File apkFile = new File(cacheDir, "ecet-deck-update.apk");
                if (apkFile.exists()) {
                    apkFile.delete();
                }

                out = new FileOutputStream(apkFile);
                byte[] buffer = new byte[8192];
                long totalBytesRead = 0;
                int bytesRead;
                long lastNotifyTime = 0;

                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                    totalBytesRead += bytesRead;

                    long now = System.currentTimeMillis();
                    if (now - lastNotifyTime > 150 || (fileLength > 0 && totalBytesRead == fileLength)) {
                        lastNotifyTime = now;
                        int percent = fileLength > 0 ? (int) ((totalBytesRead * 100) / fileLength) : -1;
                        notifyProgress(percent, totalBytesRead, fileLength);
                    }
                }

                out.flush();
                out.close();
                out = null;

                notifyProgress(100, totalBytesRead, fileLength > 0 ? fileLength : totalBytesRead);

                // Trigger Android Package Installer
                triggerInstall(apkFile, call);

            } catch (Exception e) {
                JSObject errorData = new JSObject();
                errorData.put("status", "error");
                errorData.put("message", e.getMessage());
                notifyListeners("downloadStatus", errorData);
                call.reject("Download failed: " + e.getMessage());
            } finally {
                isDownloading = false;
                if (in != null) try { in.close(); } catch (Exception ignored) {}
                if (out != null) try { out.close(); } catch (Exception ignored) {}
                if (conn != null) try { conn.disconnect(); } catch (Exception ignored) {}
            }
        }).start();
    }

    private void notifyProgress(int percent, long currentBytes, long totalBytes) {
        JSObject data = new JSObject();
        data.put("percent", Math.min(100, Math.max(0, percent)));
        data.put("currentBytes", currentBytes);
        data.put("totalBytes", totalBytes);
        notifyListeners("downloadProgress", data);
    }

    private void triggerInstall(File apkFile, PluginCall call) {
        Context context = getContext();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!context.getPackageManager().canRequestPackageInstalls()) {
                JSObject permRequired = new JSObject();
                permRequired.put("status", "requires_permission");
                notifyListeners("downloadStatus", permRequired);

                Intent settingsIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                settingsIntent.setData(Uri.parse("package:" + context.getPackageName()));
                settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(settingsIntent);

                call.resolve(permRequired);
                return;
            }
        }

        try {
            Uri apkUri = FileProvider.getUriForFile(
                context,
                context.getPackageName() + ".fileprovider",
                apkFile
            );

            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            context.startActivity(installIntent);

            JSObject res = new JSObject();
            res.put("status", "installing");
            notifyListeners("downloadStatus", res);
            call.resolve(res);
        } catch (Exception ex) {
            call.reject("Could not launch package installer: " + ex.getMessage());
        }
    }

    private HttpURLConnection openConnectionWithRedirects(String initialUrl) throws IOException {
        String currentUrl = initialUrl;
        for (int i = 0; i < 5; i++) {
            URL url = new URL(currentUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", "ECET-Deck-Android-Installer");
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(30000);
            conn.setInstanceFollowRedirects(false);

            int status = conn.getResponseCode();
            if (status == HttpURLConnection.HTTP_MOVED_TEMP ||
                status == HttpURLConnection.HTTP_MOVED_PERM ||
                status == 307 || status == 308) {
                String newUrl = conn.getHeaderField("Location");
                conn.disconnect();
                if (newUrl != null && !newUrl.isEmpty()) {
                    currentUrl = newUrl;
                    continue;
                }
            }
            return conn;
        }
        throw new IOException("Too many redirects: " + initialUrl);
    }
}
