export type FileType = 'dmg' | 'delta' | 'appcast' | 'release-notes' | 'other';

export function classifyFile(name: string): FileType {
  if (name.endsWith('.dmg')) return 'dmg';
  if (name.endsWith('.delta')) return 'delta';
  if (name === 'appcast.xml') return 'appcast';
  if (name.endsWith('.md') || name.endsWith('.html')) return 'release-notes';
  return 'other';
}

export function extractVersion(name: string): string {
  // Covalence-1.4.0.dmg -> "1.4.0"
  const dmgMatch = name.match(/Covalence-(\d+\.\d+\.\d+)/);
  if (dmgMatch) return dmgMatch[1];
  // Covalence10-8.delta -> "10-8"
  const deltaMatch = name.match(/Covalence(\d+-\d+)\.delta/);
  if (deltaMatch) return deltaMatch[1];
  return '';
}

export function parseMacOSVersion(ua: string): string {
  const match = ua.match(/macOS\s+([\d.]+)/);
  return match ? match[1] : '';
}

export interface AnalyticsParams {
  fileName: string;
  responseSize: number;
  request: Request;
}

export function buildDataPoint(params: AnalyticsParams): AnalyticsEngineDataPoint {
  const { fileName, responseSize, request } = params;
  const ua = request.headers.get('user-agent') || '';
  const cf = (request as Request & { cf?: IncomingRequestCfProperties }).cf;

  return {
    blobs: [
      fileName,                          // blob1: file name
      classifyFile(fileName),            // blob2: file type
      extractVersion(fileName),          // blob3: version
      cf?.country || '',                 // blob4: country
      ua.slice(0, 256),                  // blob5: user agent (truncated)
      parseMacOSVersion(ua),             // blob6: macOS version
    ],
    doubles: [responseSize],             // double1: response size bytes
    indexes: [fileName],                 // sampling key
  };
}
