# `kurumsal/KurumsalFilm/index.tsx` — Film Şeridi

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-film`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Gök mavisi vurgu kobalt ışığına; şerit grafit tonlarına çekildi.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `FilmHero` (ortak) |
| Ton / zemin | koyu `#0D0F13` |
| Sinyal | kobalt ışığı |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Grafit degrade, kobalt hale, kadraj (cetvelsiz) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Kareler dar; uzun ad `text-[1.7rem]` ile sarar |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
