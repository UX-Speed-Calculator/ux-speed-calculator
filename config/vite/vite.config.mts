import { solidStart } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export -- Vite config requires a default export
export default defineConfig({
  plugins: [solidStart({}), nitro(), tailwindcss()],
  nitro: {
    preset: 'cloudflare_module',
  },
});
