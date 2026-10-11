# `kurumsal/KurumsalTerrazzo/index.tsx` — Terrazzo

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-terrazzo`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Çakıllar grafit, kobalt, kobalt ışığı, platin, beton ve tek tük işaret kırmızısı. Terrazzo'nun yuvarlak dili korunur: köşe "serbest", bölüm kartları 24 px kalır.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `TerrazzoHero` (ortak) |
| Ton / zemin | açık `#EFEFEB` |
| Sinyal | kobalt |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | serbest |
| Hero sahnesi | Hero opak taş (arka plan yok) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Taş kartı `max-w-[21rem]` |
| 768 px | Düşük risk |
| 1280 px | Bölüm kartlarının 24 px köşesi kategorinin geri kalanından yumuşak (bilinçli) |
