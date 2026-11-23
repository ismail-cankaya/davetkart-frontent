# `scripts/e2e/backend.ps1`

> **Faz:** 19.22 — `TST-04` · **Karar:** K225 · **Çağıran:** `playwright.config.ts` (`webServer`)

## Ne yapar (sırayla)

1. **Ad denetimi (fail-closed):** yalnızca `davetkart_e2e` ya da `davetkart_e2e_<ek>`. Betik veritabanı
   **siler**; geliştirme (`davetkart`) ya da hat test veritabanı (`davetkart_test_hat_b`) asla kabul edilmez.
2. Backend'de `bootstrap/cache/config.php` varsa durur: önbellekli config ortam değişkenlerini yok sayar.
3. `.env`'den yalnızca PostgreSQL bağlantısını okur (`PGPASSWORD` süreç içinde, ekrana yazılmaz);
   `DROP DATABASE … WITH (FORCE)` + `CREATE DATABASE`.
4. Süreç ortamı (`phpdotenv` var olan değişkeni ezmez, `.env`'e dokunulmaz):
   `DB_DATABASE`, `APP_URL`/`FRONTEND_URL` = preview adresi, `PAYMENT_PROVIDER=fake`,
   `PAYMENT_METHODS=card,gift_code`, `QUEUE_CONNECTION=sync`, `MAIL_MAILER=log`, `CACHE_STORE=database`
   (hız sınırı sayaçları da e2e veritabanında), `AI_PROVIDER=null`.
5. `migrate --force` → `gift-codes:create E2EHEDIYE100 --benefit=percent --percent=100 --max-uses=1000`
   (her plana yüzde yüz: yolculuk hangi planı önerirse önersin ücretsiz etkinleşir).
6. `php artisan serve --host=127.0.0.1 --port=8020 --no-reload` (ön planda; Playwright koşu sonunda kapatır).

## Parametreler

`-Port` · `-Database` · `-BackendPath` (varsayılan: hat klasöründeki backend) · `-PreviewOrigin` · `-GiftCode`.
Elle: `powershell -File scripts/e2e/backend.ps1 -Port 8020` → `http://127.0.0.1:8020/up`.

## Sık hata

- `psql` PATH'te yoksa `C:\Program Files\PostgreSQL\<n>\bin` aranır.
- E-posta doğrulaması (SEC-09) gelince bağlantı `MAIL_MAILER=log` ya da `array`'den okunur; kanca
  `e2e/support/flows.ts` → `verifyEmailIfRequired`.
