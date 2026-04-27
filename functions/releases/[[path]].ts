import { buildDataPoint } from '../analytics';

export const onRequest: PagesFunction<Env> = async (context) => {
  const pathSegments = context.params.path;
  const key = Array.isArray(pathSegments)
    ? pathSegments.join('/')
    : pathSegments || '';

  if (!key) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const object = await context.env.RELEASES_BUCKET.get(key);

    if (!object) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=86400');

    if (!headers.has('Content-Type')) {
      if (key.endsWith('.dmg') || key.endsWith('.delta')) {
        headers.set('Content-Type', 'application/octet-stream');
      } else if (key.endsWith('.xml')) {
        headers.set('Content-Type', 'application/xml');
      } else if (key.endsWith('.html')) {
        headers.set('Content-Type', 'text/html; charset=utf-8');
      } else if (key.endsWith('.md')) {
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
      }
    }

    context.waitUntil(
      Promise.resolve().then(() => {
        context.env.RELEASE_ANALYTICS?.writeDataPoint(
          buildDataPoint({
            fileName: key,
            responseSize: object.size,
            request: context.request,
          })
        );
      })
    );

    return new Response(object.body, { status: 200, headers });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(`Internal error: ${msg}`, { status: 500 });
  }
};
