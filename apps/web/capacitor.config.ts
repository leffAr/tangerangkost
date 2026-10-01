import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tangerangkost.app',
  appName: 'TangerangKost',
  webDir: 'out',
  server: {
    url: 'https://tangerangkost-web.vercel.app',
    cleartext: true
  }
};

export default config;
