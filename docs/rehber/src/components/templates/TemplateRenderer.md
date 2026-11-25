# `templates/TemplateRenderer.tsx` — preset kimliği → bileşen

> **FE-10 (Faz 19.24, K227):** 307 şablon artık barrel yerine `lazyTemplate(() => import('./<kategori>/<Ad>'), '<Ad>')` ile tembel; her biri kendi parçasında, misafir yalnızca kendi şablonunu indirir. Yükleme sırasında `TemplateFallback` (şablonun renginde tam ekran), parça yüklenemezse 19.21 `RouteError`. Yeni şablon: barrel + `THEME_PRESETS` girdisi (`verify:bundle` eksiği yakalar).

> **Tarih:** 2026-10-15 · dal `design/kagit` (yalnızca §2 eklendi)

---

## 1. Ne yapar

Davetiyenin `imageTheme`'ini (`templateId`) şablon bileşenine eşler (`THEME_PRESETS`). Adlardaki
saklama ayracını (`& Ali`) `displayNames` ile tek noktada temizler. Kimlik `-` içeriyorsa olduğu
gibi kullanılır; içermiyorsa `<kategori>-<id>` kurulur (yalnızca düğün, kına, nişan).

## 2. Kâğıt / el yapımı ailesi

Her kategori aşamasında üç kayıt eklenir, `// Kâğıt / el yapımı` başlığı altında:

| Kimlik | Bileşen |
|---|---|
| `nisan-soz-mektubu` | `NisanSozMektubu` |
| `nisan-gul-kurusu` | `NisanGulKurusu` |
| `nisan-soz-senedi` | `NisanSozSenedi` |

Kimlikler bileşiktir (`-` içerir), backend `imageTheme`'i yalnızca ≤ 48 karakter diye doğrular;
`preset_tiers`'ta olmadıkları için her planda yayınlanırlar.

## 3. Bilinen sınır

Bütün şablonlar burada eager içe aktarılır: ana paket büyür (kâğıt ailesinin payı Aşama 3
raporunda ölçüldü). Tembel yükleme ayrı bir iş.

## B-E5 (25 Kasım 2026)

Yedek zeminin rengi `PRESET_PRIMARY_COLORS`'tan ([`templatePresetColors`](../../templatePresetColors.md)); katalog içe aktarılmaz.
