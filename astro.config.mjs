import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://covalence.app',
  output: 'static',
  build: {
    assets: '_assets',
  },
});
