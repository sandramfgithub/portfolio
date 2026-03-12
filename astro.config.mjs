// @ts-check

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-expect-error Astro 6 and @tailwindcss/vite currently disagree at
    // type level because Astro ships Vite from a vendored path.
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@react-pdf/renderer'],
    },
  },
  integrations: [react()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
