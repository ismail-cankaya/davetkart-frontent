# `kurumsal/KurumsalHerbaryum/index.tsx` — Herbaryum

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-herbaryum`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Bitki örneği yeşil yerine kobalt mürekkeple basılır (siyanotip baskı); bant platin. Föy kurum arşivinin bir kaydı gibi okunur.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `HerbaryumHero` (ortak) |
| Ton / zemin | açık `#F1F1ED` |
| Sinyal | kobalt (siyanotip) |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt degrade |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Föy etiketi 7 px (7.27:1) |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
