/**
 * Bir doğrulama betiğini Node altında çalıştırır.
 *
 *   node scripts/run-check.mjs scripts/verify-error-contract.ts
 *
 * Betikler gerçek uygulama modüllerini içeri alır — mantığı kopyalayan bir
 * taklit değil, kullanıcıya giden kodun ta kendisi sınanır. Bunun tek bedeli
 * `import.meta.env`'dir: onu Vite sağlar, Node sağlamaz. esbuild derleme
 * sırasında yerine koyar.
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const entry = process.argv[2];

if (!entry) {
  console.error('Kullanım: node scripts/run-check.mjs <betik.ts>');
  process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outfile = path.join(root, 'node_modules/.cache', `${path.basename(entry, '.ts')}.cjs`);

await build({
  entryPoints: [path.resolve(root, entry)],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  // Bağımlılıklar Node'un kendi çözümlemesine bırakılır; axios gibi paketler
  // ESM çıktısına gömüldüğünde `require()` çağrıları kırılır.
  packages: 'external',
  // Store'lar `data.ts` üzerinden şablon kapak görsellerini içeri alır; Node'da
  // bir görselin içeriğine ihtiyaç yok, yalnızca modülün yüklenebilmesine.
  loader: { '.png': 'empty', '.jpg': 'empty', '.svg': 'empty' },
  define: { 'import.meta.env': JSON.stringify({ VITE_API_BASE_URL: '/api' }) },
  outfile,
  logLevel: 'error',
});

createRequire(import.meta.url)(outfile);
