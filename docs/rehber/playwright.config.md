# `playwright.config.ts` · `npm run e2e` · `vite.config.ts` (proxy)

> **Faz:** 19.22 — `TST-04` · **Karar:** K224 · **Bağımlılık:** `@playwright/test` 1.61.1 (tam sürüm, yalnızca geliştirme)

## Neden

Backend testleri kendi gövdeleriyle, frontend `verify:*` betikleri sahte taşıma katmanıyla yeşil.
İki tarafın **aynı şeyi anladığını** hiçbir kapı kanıtlamıyordu: backend testinin sabitlemediği bir alan
değişirse ikisi de yeşil kalır. Üç Playwright yolculuğu gerçek backend + derlenmiş frontend'i koşturur.

## Ne yapar

| Parça | Değer |
|---|---|
| Backend | `scripts/e2e/backend.ps1` → `davetkart_e2e` sıfırdan, `php artisan serve` **8020** (`/up` beklenir) |
| Frontend | `npm run build` + `vite preview` **4180**; `DAVETKART_API_PROXY` `/api` ve `/storage`'ı 8020'ye yollar |
| Tarayıcı | Yalnızca Chromium (`Desktop Chrome`), `tr-TR` |
| Sıra | `publish` projesi → `after-publish` (`guest-rsvp`, `paywall-after-publish`) ona bağımlı; `workers: 1` |
| Çıktı | `test-results/`, `playwright-report/`, `e2e/.state/` (hepsi `.gitignore`'da) |

Portlar `E2E_BACKEND_PORT` / `E2E_PREVIEW_PORT` ile değişir (hat B: 8020/4180). `reuseExistingServer: false`:
her koşu veritabanını yeniden kurar; port doluysa koşu başlamaz (eski bir `php artisan serve` açık kalmış olabilir).

`npm run check`'e **girmez** (§A-1 varsayılanı): PostgreSQL + PHP + ~1 dk ister. CI: `.github/workflows/e2e.yml` (K236, B-E10: `main`'e PR'larda ve elle; [kılavuz](.github/workflows/e2e.md)).

## Nasıl koşulur

1. PostgreSQL açık; `davetkart-backend-php-laravel` hat klasöründe, `vendor/` kurulu, config önbelleği yok.
2. Chromium: `npx playwright install chromium` (önbellekte `chromium-1228` varsa gerekmez).
3. `npm run e2e` · rapor: `npm run e2e:report` · tek yolculuk: `npm run e2e -- --project=publish`.

## Sık hata

- `vite.config.ts` proxy'si eskiden 8000'e sabitti; `vite preview` aynı proxy'yi kullanır. Değişken yoksa 8000 kalır.
- Başarısız koşudan sonra `test-results/<test>/trace.zip` → `npx playwright show-trace <yol>`.
