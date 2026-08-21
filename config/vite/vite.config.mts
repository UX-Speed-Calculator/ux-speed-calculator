import { solidStart } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export -- Vite config requires a default export
export default defineConfig({
  nitro: {
    preset: 'cloudflare_module',
  },
  plugins: [solidStart({}), nitro(), tailwindcss()],
});
