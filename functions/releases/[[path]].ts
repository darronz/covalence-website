import { buildDataPoint } from '../analytics';

export const onRequest: PagesFunction<Env> = async (context) => {
  // Extract the path segments from the catch-all param
  const pathSegments = context.params.path;
  // [[path]] gives string | string[] — normalize
  const key = Array.isArray(pathSegments)
    ? pathSegments.join('/')
    : pathSegments || '';

  if (!key) {
    return new Response('Not Found', { status: 404 });
  }

  const object = await context.env.RELEASES_BUCKET.get(key);

  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);

  // Cache releases for 24 hours — immutable artifacts (versioned filenames)
  headers.set('Cache-Control', 'public, max-age=86400');

  // Content-type fallback if R2 metadata doesn't have it
  if (!headers.has('Content-Type')) {
    if (key.endsWith('.dmg')) {
      headers.set('Content-Type', 'application/octet-stream');
    } else if (key.endsWith('.delta')) {
      headers.set('Content-Type', 'application/octet-stream');
    } else if (key.endsWith('.xml')) {
      headers.set('Content-Type', 'application/xml');
    } else if (key.endsWith('.html')) {
      headers.set('Content-Type', 'text/html; charset=utf-8');
    } else if (key.endsWith('.md')) {
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
    }
  }

  // Non-blocking analytics write
  context.waitUntil(
    Promise.resolve().then(() => {
      context.env.RELEASE_ANALYTICS.writeDataPoint(
        buildDataPoint({
          fileName: key,
          responseSize: object.size,
          request: context.request,
        })
      );
    })
  );

  return new Response(object.body, { status: 200, headers });
};
