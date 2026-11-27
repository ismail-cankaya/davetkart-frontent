# DavetKart — frontend

Dijital davetiye SaaS'ının tarayıcı tarafı: React 19 + TypeScript (`strict`), Vite 6, Tailwind CSS v4, Zustand, axios,
react-router. Backend ayrı depoda: `../davetkart-backend-php-laravel` (Laravel 13). Kod kılavuzları `docs/rehber/`'de,
kod yolunu birebir yansıtarak (`src/services/api.ts` → `docs/rehber/src/services/api.md` gibi).

## Kurulum

1. **Node 24** (tek kaynak `.nvmrc`; `package.json` `engines` `>=24 <25`, CI de aynı dosyayı okur). `nvm use` ya da
   `nvm use 24` (nvm-windows `.nvmrc` okumaz).
2. Bağımlılıklar: **Vite kapalıyken** `npm ci`. Vite (`npm run dev`) açıkken `npm ci` Windows'ta `node_modules`'ü yarım
   bırakır (`EPERM`); o durumda `npm install`.
3. `.env.example` → `.env` (aşağıda).
4. Backend `php artisan serve` (port 8000) açıkken `npm run dev` → <http://localhost:3000>.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (port 3000). `/api` ve `/storage` istekleri backend'e vekillenir (`vite.config.ts`) |
| `npm run lint` | `tsc --noEmit` (tür denetimi, `strict`) |
| `npm run build` | Üretim derlemesi (`dist/`) + şablon kapakları (`scripts/export-covers.mjs`) |
| **`npm run check`** | Kalite kapısı: `lint` + `build` + `verify` (aşağıdaki 15 betik). Her commit'ten önce |
| `npm run e2e` | Playwright uçtan uca testleri: gerçek backend (`davetkart_e2e` veritabanı, port 8020) + derlenmiş frontend (`vite preview`, port 4180). Dev sunucularına dokunmaz; backend deposu kardeş klasörde olmalı (`scripts/e2e/backend.ps1`). Kılavuz: `docs/rehber/playwright.config.md` |
| `npm run a11y:envelopes` | 373 şablonun zarf ipucu kontrastını axe ile tarar (`scripts/onizleme`) |
| `npm run perf` | Performans ölçümü (`playwright.perf.config.ts`) |

### `verify:*` betikleri (`npm run verify` hepsini sırayla koşar)

Her biri kullanıcıya giden gerçek modülleri Node'da çalıştırır (`scripts/run-check.mjs`); derleme hatası vermeyen
sözleşme kaymalarını yakalar.

| Betik | Sınadığı |
|---|---|
| `verify:errors` | Backend hata kataloğu (`src/contracts/error-codes.json`) ↔ tr/en çevirileri |
| `verify:i18n` | Gömülü Türkçe metin tabanı (yeni metin yalnızca `t()` ile; taban yalnızca azalır) |
| `verify:endpoints` | Servislerin çağırdığı uçlar ↔ backend rotaları |
| `verify:etag` | Koşullu okuma (`If-None-Match`, 304) |
| `verify:time` | Etkinlik saati / zaman dilimi matematiği |
| `verify:state` | Editör ve oturum durumu |
| `verify:content` | Davetiye içeriği (sahte varsayılan yok, boş alan çizilmez) |
| `verify:image` | Tarayıcıda ön küçültme kararları |
| `verify:payment` | Ödeme yardımcıları, dönüş sayfası ve otomatik yayın kararı |
| `verify:gift` | Hediye kodu akışı |
| `verify:pricing` | Fiyat kataloğu (fiyat frontend'de durmaz, backend'den gelir) |
| `verify:plans` | Plan kuralları (`src/contracts/plan-rules.json`) ↔ backend |
| `verify:fonts` | Fontlar kendi alan adımızdan |
| `verify:bundle` | Paket bütçesi, şablonlar ayrı parçalarda |
| `verify:render` | Ekrana çizilen sonuç (statik render) |

## Ortam değişkenleri

`VITE_` ile başlayan her değer derlenmiş JavaScript'e gömülür ve tarayıcıda herkes okur: **buraya sır yazılmaz** (AI ve
ödeme anahtarları yalnızca backend'de).

| Değişken | Örnek | Anlam |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` (`.env.example`) | API kökü. Üretimde site ve API aynı alan adında (`https://davetkart.com/api`); göreli değer yeter |
| `DAVETKART_API_PROXY` | `http://localhost:8000` (varsayılan) | Yalnızca `vite dev`/`vite preview` vekilinin hedefi; `npm run e2e` 8020'ye çevirir |

Üretim derleme ayarları backend deposundaki `deploy/deploy-frontend.sh`'te (sunucuda `.env.production` yok).

## Backend'le ilişki

- **Aynı köken:** tarayıcı yalnızca kendi kökeniyle konuşur; geliştirmede Vite vekili, üretimde Nginx `/api`'yi Laravel'e
  geçirir. CORS gerekmez.
- **Sözleşme dosyaları** backend'den tek yönlü kopyalanır: `src/contracts/error-codes.json` (`php artisan errors:export`),
  `src/contracts/plan-rules.json` (`plans:export`). `verify:*` kaymayı yakalar.
- **AI asistanı** backend üzerinden çalışır (`POST /api/assistant/chat`); frontend'de AI SDK'sı ya da anahtarı yok.
- Hata yanıtları metin değil kod taşır (`{error: {code, …}}`); çeviri frontend'in işi (`src/locales/<dil>/errors.json`).

## Kılavuzlar

- `docs/rehber/`: dosya başına kılavuz (neden böyle yazıldı, sık hatalar).
- Proje kararları, fazlar ve denetimler kod dışı depoda: `../davetkart-docs` (`decisions/DECISION-INDEX.md`).
- Asistan kuralları: `CLAUDE.md`.
