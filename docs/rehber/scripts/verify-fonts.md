# `scripts/verify-fonts.ts` · `npm run verify:fonts`

> **Faz:** 19.17 — `SEC-12` · **Karar:** K226 · `npm run verify` zincirinde, `verify:render`'dan önce

| Denetim | Kırmızı olursa |
|---|---|
| `dist/` (js/css/html) içinde `fonts.googleapis.com` / `fonts.gstatic.com` yok | Biri Google'a geri bağlamış (ör. `@import`) |
| `src/` içinde aynı adresler yok | Kaynakta dış font adresi |
| `fonts.css` / `templates.css`'teki her `url()` `public/` altında var | Eksik woff2 |
| Her `public/fonts/<aile>/` klasöründe `LICENSE` | Lisanssız font |
| Kodun istediği her aile (`const FONT(S)`, `useTemplateFont('…')`, `fontlar.ts` yığınları) yerel olarak tanımlı | Yeni şablon tanımsız aile istiyor: yedek fontla çizilirdi |

`dist/` gerekir: `npm run check` önce derler. Tek başına: `npm run build && npm run verify:fonts`.

**Mutant (23 Kasım 2026):** `index.css`'e Google `@import` satırı geri kondu → 2 hata (`dist/assets/index-*.css`, `src/index.css`).
