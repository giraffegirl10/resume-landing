import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set SITE_URL to your deployed origin to enable canonical metadata.
  site: process.env.SITE_URL,
  output: 'static',
});
