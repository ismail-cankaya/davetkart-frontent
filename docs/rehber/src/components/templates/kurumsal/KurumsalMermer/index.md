# `kurumsal/KurumsalMermer/index.tsx` — Mermer & Rölyef

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-mermer`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Gök mavisi vurgu platine; damarlar `#9AA3AE`. Gala dili: serif korundu.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `MermerHero` (ortak) |
| Ton / zemin | koyu `#0E1013` |
| Sinyal | platin |
| Bölüm başlıkları | serif (Playfair) |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Grafit degrade (taş hero'nun kendisinde) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Uzun ad `text-[1.6rem]` ile sarar |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
