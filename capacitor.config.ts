import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dhiway.digiattest',
  appName: 'digiattest',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;
