// @ts-check

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/about': '/es/about',
    '/projects': '/es/projects',
  },
  vite: {
    // Astro 6 previously needed a type escape here because it vendored Vite.
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
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
