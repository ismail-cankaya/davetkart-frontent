// npm run perf (FE-53, K228): serves dist/ like deploy/nginx/davetkart.conf (gzip, /assets/ immutable,
// SPA fallback) and proxies /api, /storage to the e2e backend. `vite preview` does not compress, so
// transfer sizes (and LCP on a throttled link) would be ~3x worse than production.
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createGzip } from 'node:zlib';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const PORT = Number(arg('port', 4180));
const BACKEND = Number(arg('backend', 8020));
const DIST = resolve('dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.txt': 'text/plain', '.ico': 'image/x-icon',
};
const GZIP = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt']);

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/storage/')) {
    const upstream = http.request(
      { host: '127.0.0.1', port: BACKEND, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${BACKEND}` } },
      (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); },
    );
    upstream.on('error', () => { res.writeHead(502); res.end(); });
    req.pipe(upstream);
    return;
  }
  let file = normalize(join(DIST, decodeURIComponent(url.pathname)));
  if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) {
    if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/')) { res.writeHead(404); res.end(); return; }
    file = join(DIST, 'index.html');
  }
  const ext = extname(file);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
  if (url.pathname.startsWith('/assets/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  else if (url.pathname.startsWith('/fonts/')) headers['Cache-Control'] = 'public, max-age=2592000';
  else if (file.endsWith('index.html')) headers['Cache-Control'] = 'no-cache';
  const gz = GZIP.has(ext) && /gzip/.test(req.headers['accept-encoding'] ?? '') && statSync(file).size >= 1024;
  if (gz) { headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding'; }
  else headers['Content-Length'] = statSync(file).size;
  res.writeHead(200, headers);
  (gz ? createReadStream(file).pipe(createGzip({ level: 6 })) : createReadStream(file)).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`perf server: http://127.0.0.1:${PORT} (dist, gzip) → api :${BACKEND}`));
