import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://covalence.app',
  output: 'static',
  build: {
    assets: '_assets',
  },
  integrations: [
    starlight({
      title: 'Covalence',
      description: 'Persistent memory for any AI client — local, private, zero configuration.',
      customCss: ['./src/styles/starlight.css'],
      social: [],
      sidebar: [
        { label: 'Getting Started', slug: 'docs/getting-started' },
        { label: 'Spaces', slug: 'docs/spaces' },
        { label: 'Core Memories', slug: 'docs/core-memories' },
        { label: 'MCP Tools', slug: 'docs/mcp-tools' },
        { label: 'AI Instruction', slug: 'docs/ai-instruction' },
        { label: 'Keyboard Shortcuts', slug: 'docs/keyboard-shortcuts' },
      ],
    }),
  ],
});
