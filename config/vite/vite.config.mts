import { solidStart } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export -- Vite config requires a default export
export default defineConfig({
  nitro: {
    preset: 'cloudflare-module',
    // Levels were previously named steps; keep old /stepN links working
    routeRules: Object.fromEntries(
      [2, 3, 4, 5, 6, 7].map((level) => [
        `/step${level}`,
        { redirect: { status: 301, to: `/level${level}` } },
      ]),
    ),
  },
  plugins: [solidStart({}), nitro(), tailwindcss()],
});
