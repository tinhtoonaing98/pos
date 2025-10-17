// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tin.pos',       // change if you want
  appName: 'POS Android',     // app name shown on device
  webDir: 'dist',             // Vite build output
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  },
};

export default config;
