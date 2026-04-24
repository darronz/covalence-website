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
        // Starlight already emits canonical, og:title, og:type, og:url, og:description,
        // og:site_name, og:locale, twitter:card, and meta description on every /docs/* page.
        // This array only adds the 4 tags Starlight does NOT auto-emit — og:image
        // (+ dimensions) and twitter:image — so /docs/* reaches parity with Base.astro's
        // SEO head block without duplicate emission. Starlight's mergeHead() dedupes by
        // name/property so same-key tags are safe, but delta-only keeps the config readable.
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://covalence.app/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '627' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://covalence.app/og-image.png' } },
      ],
      social: [],
      sidebar: [
        { label: 'Getting Started', slug: 'docs/getting-started' },
        { label: 'Spaces', slug: 'docs/spaces' },
        { label: 'Core Memories', slug: 'docs/core-memories' },
        { label: 'Under the Hood', slug: 'docs/under-the-hood' },
        { label: 'MCP Tools', slug: 'docs/mcp-tools' },
        { label: 'AI Instruction', slug: 'docs/ai-instruction' },
        { label: 'Keyboard Shortcuts', slug: 'docs/keyboard-shortcuts' },
      ],
    }),
  ],
});
