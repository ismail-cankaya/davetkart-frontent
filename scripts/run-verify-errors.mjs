/**
 * `verify-error-contract.ts`'i Node altında çalıştırır.
 *
 * Denetim gerçek uygulama modüllerini (`src/utils/toDisplayError.ts`,
 * `src/i18n.ts`) içeri alır — mantığı kopyalayan bir taklit değil, kullanıcıya
 * giden kodun ta kendisi sınanır. Bunun tek bedeli `import.meta.env`'dir:
 * onu Vite sağlar, Node sağlamaz. esbuild derleme sırasında yerine koyar.
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outfile = path.join(root, 'node_modules/.cache/verify-errors.cjs');

await build({
  entryPoints: [path.join(root, 'scripts/verify-error-contract.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  // Bağımlılıklar Node'un kendi çözümlemesine bırakılır; axios gibi paketler
  // ESM çıktısına gömüldüğünde `require()` çağrıları kırılır.
  packages: 'external',
  define: { 'import.meta.env': JSON.stringify({ VITE_API_BASE_URL: '/api' }) },
  outfile,
  logLevel: 'error',
});

createRequire(import.meta.url)(outfile);
