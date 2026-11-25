# `scripts/verify-bundle.ts` · `npm run verify:bundle`

> **Faz:** 19.24 — `FE-10` · **Karar:** K227 · `npm run verify` zincirinde (`verify:fonts`'tan sonra; `dist/` gerekir)

| Denetim | Bütçe (ham) | Ölçüm (23 Kasım 2026) |
|---|---|---|
| İlk yükleme: `index.html` giriş betiği + statik içe aktardığı parçalar | 720 kB | 698.8 kB (gzip 227.1) · önce 1 576.8 kB (gzip 420.8) |
| Misafir sayfası (şablon hariç): ilk yükleme + `InvitePage` parçası ve statik bağımlılıkları | **800 kB** (K237; önce 900) | 790.2 kB (gzip 250.6) · B-E5 öncesi 884.3 |
| `TemplateRenderer` kategori barrel'ını (`./dugun` …) statik içe aktarmıyor | — | ✓ |
| Barrel'lardaki her şablonun `THEME_PRESETS`'te tembel girdisi var (yeni şablon unutulmasın) | — | 307/307 |

**Neden 400 kB değil (§A-1 varsayılanı):** ilk yüklemede yalnızca kütüphaneler ~480 kB (react-dom 181,
react-router 94, motion 144, axios 52, i18next 80). Bütçe ölçümün ~%3 üstünde bir **cırcır**: büyüme kırmızı.
Düşürmek için sıradaki adımlar: `motion`'ı ilk yüklemeden çıkarmak, misafir sayfasından kataloğu ayırmak
(`TemplateRenderer` renk haritası, `InvitePage` `resolvePresetId`), CSS bölme. Bütçe düşünce sayıyı da düşür.

**Mutant (23 Kasım 2026):** `TemplateRenderer`'a `import { DugunSade } from './dugun'` + statik girdi →
3 hata (barrel kuralı, tembel girdi eksik, misafir sayfası 964.8 kB).

## B-E5 (25 Kasım 2026)

Misafir sayfasının kapanışında `templateCatalog-*.js` parçası varsa kırmızı: `InvitePage` ve `TemplateRenderer` kataloğu değil
üretilmiş `src/templatePresetColors.ts`'i kullanır.

**K237 (B-E6, 25 Kasım 2026):** cırcır sürüyor (K-4 varsayılanı); misafir sınırı B-E5 kazancından sonra 800 kB'a indi, ilk yükleme 720 kB'ta kaldı (712.0 ölçüldü). Sınır yalnızca gerçek bir kazançtan sonra iner, yükselmez.
