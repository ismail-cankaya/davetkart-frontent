# `kurumsal/KurumsalPlak/index.tsx` — Vinil Plak

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-plak`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Çelik mavisi etiket kobalta; etiket yazısı kâğıt beyazı (6.58:1).

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `PlakHero` (ortak, kobalt etiket, 42 s dönüş) |
| Ton / zemin | koyu `#0D0F13` |
| Sinyal | kobalt ışığı |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kobalt radyal degrade, hale, kadraj |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Etiket adı `line-clamp-2`: uzun ad iki satırda kesilir (ortak) |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
