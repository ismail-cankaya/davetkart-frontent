/**
 * Gömülü metin tavanını yazar — `npm run text-slots:baseline` (Faz 24).
 * Yalnızca metin TAŞINDIKTAN sonra koşulur: tavan inebilir, çıkamaz (`verify:text-slots`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { countByFile, scanHardcodedTexts } from './scan';

const root = path.resolve(process.cwd(), 'src/components/templates');
const counts = countByFile(scanHardcodedTexts(root));
const total = Object.values(counts).reduce((a, b) => a + b, 0);
fs.writeFileSync(path.resolve(process.cwd(), 'scripts/text-slots/baseline.json'), JSON.stringify({ total, files: counts }, null, 2) + '\n');
console.log(`Gömülü metin tavanı: ${total} (${Object.keys(counts).length} dosya) → scripts/text-slots/baseline.json`);
