import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

// Build frame for the exported kb: .svx pages through mdsvex, the `runbook` layout, `#lib` → src/lib.
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) } })],
  kit: {
    adapter: adapter({ pages: process.env.OUT_DIR ?? 'rendered', assets: process.env.OUT_DIR ?? 'rendered' }),
    paths: { base: process.env.BASE_PATH ?? '' },
    alias: { '#lib': 'src/lib' },
    prerender: { entries: ['*'], handleHttpError: 'warn' }
  }
};
