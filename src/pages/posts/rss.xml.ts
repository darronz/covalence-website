import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';

// Match releases.astro marked config so bodies render consistently across the site.
marked.setOptions({ gfm: true });

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error(
      'rss.xml.ts: Astro `site` is not configured. Set `site` in astro.config.mjs.'
    );
  }

  const posts = (await getCollection('posts'))
    .sort((a, b) => b.data.pub_date.valueOf() - a.data.pub_date.valueOf())
    .slice(0, 50);

  const items = posts.map((post) => {
    let contentHTML = '';
    try {
      contentHTML = marked.parse(post.body ?? '') as string;
    } catch (err) {
      console.warn(`[rss] marked.parse failed for ${post.id}:`, err);
      contentHTML = `<p>${post.data.description}</p>`;
    }

    return {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pub_date,
      link: `/posts/${post.id}/`,
      content: contentHTML,
      author: post.data.author ?? 'Darron Schall',
    };
  });

  return rss({
    title: 'Covalence Blog',
    description: 'Long-form writing on Covalence — local-first memory, MCP, and the engineering behind it.',
    site: context.site,
    items,
    xmlns: { content: 'http://purl.org/rss/1.0/modules/content/' },
  });
}
