# `kurumsal/KurumsalPano/index.tsx` — Mekanik Pano

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-pano`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

`PanoHero` ad satırını 20 karakterde keser ve tam metni ekran okuyucuya vermez. "Kurum & Etkinlik" hemen her zaman bu sınırı aşıyordu ("NOVA TEKNOLOJİ & GEL"). Panoya yalnızca etkinlik adı verilir (`splitHostAndEvent`); tam ad zarfta ve alt imzada kalır.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `PanoHero` (ortak) — ad satırına yalnızca etkinlik adı |
| Ton / zemin | koyu `#0D0F13` |
| Sinyal | işaret `#FF6A4D` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Grafit degrade, kobalt hale, kadraj |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | 20 karakteri aşan etkinlik adı yine kesilir (ortak hero sınırı) |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
