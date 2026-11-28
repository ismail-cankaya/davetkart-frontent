# `scripts/text-slots/`

Faz 24.

| Betik | Komut | Ne |
|---|---|---|
| `export.ts` | `npm run text-slots:export` | `tr.json`'dan `src/contracts/text-slots.json`'ı üretir. Var olan anahtarın `maxLength`/`multiline` değeri korunur, yeni anahtara en uzun varsayılan × 1,6 önerilir. Çıktı backend'e aynen kopyalanır |
| `baseline.ts` | `npm run text-slots:baseline` | Şablonlarda koda gömülü kalan metin sayısını dosya başına `baseline.json`'a yazar. Yalnızca metin taşıdıktan sonra: tavan iner, çıkamaz |
| `scan.ts` | — | Gömülü metin tarayıcısı (TypeScript AST): JSX metni, `aria-label`/`title`/`alt`/`placeholder`/`label`, Türkçe harfli ya da cümle gibi dize sabitleri |
| `snapshot.tsx` | `node scripts/run-check.mjs scripts/text-slots/snapshot.tsx <klasör>` | Bütün şablonları her kategorisinde, bütün modüller açık, zarflı/zarfsız HTML'e çizer (sabit saat ve tohum). Taşımadan önce ve sonra alınan klasörler karşılaştırılır (`<!-- -->` ayraçları hariç birebir aynı olmalı) |
