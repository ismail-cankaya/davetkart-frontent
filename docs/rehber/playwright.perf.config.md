# `playwright.perf.config.ts` · `npm run perf` · `e2e/perf/vitals.perf.ts` · `scripts/perf/server.mjs`

> **Faz:** 19.25 — `FE-53` · **Karar:** K228 · `npm run check`'e **girmez** (§A-2: yavaş, ortama duyarlı)

## Ne yapar

1. e2e ortamını kurar (`scripts/e2e/backend.ps1`, `davetkart_e2e` sıfırdan) ve `publish` yolculuğuyla misafir sayfası için davetiye yayınlar.
2. `npm run build` + `scripts/perf/server.mjs` (4180): `dist/`'i Nginx gibi sunar (gzip, `/assets/` immutable, `/fonts/` 30 gün), `/api`'yi 8020'ye geçirir. `vite preview` sıkıştırmaz: aktarım ~3 kat, kısıtlı ağda LCP yanlış olurdu.
3. Dört sayfa (`/`, `/invite/<id>`, `/login`, `/pricing`) × 3 koşu, ortanca. Koşul denetimle aynı: 390×844, CPU 4×, 1,6 Mbps / 750 kbps / 150 ms (CDP).
4. `perf-results/vitals.json` (gitignore'da): LCP, CLS, FCP, TBT, aktarım, **LCP öğesi** ve **kayan öğeler** (teşhis için).

## Bütçe (§A-1)

Misafir sayfası LCP < 3000 ms · dört sayfada CLS < 0,1 (`expect.soft`: hepsi ölçülür, sonra kırmızı).

## Ölçüm (23 Kasım 2026, ortanca)

| Sayfa | LCP önce → sonra | CLS önce → sonra |
|---|---|---|
| Ana sayfa | 4604 → 4752 ms | 0,176 → 0 |
| Misafir | 2808 → 2752 ms | 0 → 0 |
| Giriş | 2924 → 3640 ms | 0,329 → 0 |
| Fiyatlar | 4088 → 3924 ms | 0,626 → 0,014 |

LCP koşudan koşuya ±400 ms oynar (yerel makine, başsız Chromium); bütçe yalnızca misafir LCP'sinde.

## Sık hata

- Port dolu (8020/4180): eski `php artisan serve`/sunucu açık kalmış.
- Yolculuk e-posta doğrulamada düşerse: `scripts/e2e/backend.ps1` `LOG_CHANNEL=single` (bağlantı `laravel.log`'dan okunur).
