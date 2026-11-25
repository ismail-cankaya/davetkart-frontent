# `.github/workflows/e2e.yml` — Kılavuz

> **Faz:** 19 ortak düzeltme (B-E10, 25 Kasım 2026) · **Karar:** K236 (TST-04 §A-1'in "taslak" varsayılanının yerine)

## Ne zaman koşar

- `main`'e açılan her PR'da ve elle (**Actions → e2e → Run workflow**, isteğe bağlı `backend_ref`).
- Her push'ta **değil**: Windows koşucusu + PostgreSQL kurulumu + iki sunucu ~10 dk; `ci.yml` (`npm run check`) her push'ta yeter.

## Nasıl kurar

1. Frontend'i `davetkart-frontent/`'e, backend'i `davetkart-backend-php-laravel/`'e çeker (yerel klasör düzeniyle aynı:
   `scripts/e2e/backend.ps1` backend'i `../davetkart-backend-php-laravel`'de arar).
2. Backend dalı: `backend_ref` girildiyse o; yoksa frontend'le **aynı adlı** dal (ör. `faz-19-fix`), o da yoksa `main`.
3. PostgreSQL 18 (Chocolatey, parola `postgres`), PHP 8.5, `composer install`, `.env.example` → `.env` (+ `DB_PASSWORD`).
4. `npm ci` → Chromium → `npm run e2e` (Playwright iki sunucuyu kendisi açar: `backend.ps1` veritabanını sıfırlar).
5. Kırmızıysa `playwright-report/` ve `test-results/` artefakt olarak yüklenir.

## İsmail'e kalan (B-İ13)

- Backend deposu özelse: backend'e okuma izni olan ince ayarlı bir token oluştur, frontend deposunda
  `BACKEND_REPO_TOKEN` sırrı olarak kaydet. Yoksa `github.token` başka depoyu okuyamaz ve ikinci checkout düşer.
- İlk koşu GitHub'da **denenmedi** (push yapılmadı). İlk PR'da Actions sekmesinde izle; Windows koşucusunda
  Chocolatey PostgreSQL kurulumu ya da `php 8.5` sürümü sorun çıkarırsa burada düzeltilir.

## Neden Windows

`playwright.config.ts` `powershell -File scripts/e2e/backend.ps1` çağırır; Ubuntu'da `powershell` yok (`pwsh` var) ve
betik Windows yollarına (`C:\Program Files\PostgreSQL`) düşebiliyor. Linux'a geçmek betiği taşımayı gerektirir.
