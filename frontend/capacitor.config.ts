import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecetdesk.app',
  appName: 'Paradox',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: process.env.CAPACITOR_CLEAR_TEXT === 'true'
  }
};

export default config;
