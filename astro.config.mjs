import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { SITE_URL } from './src/config/siteConfig';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  compressHTML: true,
  build: {
    format: 'directory'
  }
});
