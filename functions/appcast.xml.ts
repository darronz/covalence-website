import { buildDataPoint } from './analytics';

export const onRequest: PagesFunction<Env> = async (context) => {
  const object = await context.env.RELEASES_BUCKET.get('appcast.xml');

  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);

  // Appcast checked frequently by Sparkle — cache 5 minutes
  headers.set('Cache-Control', 'public, max-age=300');
  headers.set('Content-Type', 'application/xml; charset=utf-8');

  // Non-blocking analytics write
  context.waitUntil(
    Promise.resolve().then(() => {
      context.env.RELEASE_ANALYTICS.writeDataPoint(
        buildDataPoint({
          fileName: 'appcast.xml',
          responseSize: object.size,
          request: context.request,
        })
      );
    })
  );

  return new Response(object.body, { status: 200, headers });
};
