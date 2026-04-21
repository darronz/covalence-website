import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://covalence.app',
  output: 'static',
  build: {
    assets: '_assets',
  },
  integrations: [
    expressiveCode({ themes: ['night-owl', 'night-owl-light'] }),
    starlight({
      title: 'Covalence',
      description: 'Persistent memory for any AI client — local, private, zero configuration.',
      customCss: ['./src/styles/starlight.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'Covalence Blog',
            href: '/posts/rss.xml',
          },
        },
      ],
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
