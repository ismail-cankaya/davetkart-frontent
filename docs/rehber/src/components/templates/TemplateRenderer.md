# `templates/TemplateRenderer.tsx` — preset kimliği → bileşen

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
