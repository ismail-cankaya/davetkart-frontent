# `kurumsal/KurumsalBlueprint/index.tsx` — Teknik Çizim

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-blueprint`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Petrol paftadan kobalt gecesine; turkuaz vurgu "kırmızı kalem" revizyon rengine döndü. Bölümler sıfır köşe.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `BlueprintHero` (ortak) |
| Ton / zemin | kobalt gece `#0F1A5C` |
| Sinyal | kırmızı kalem `#FF8A6B` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | sert |
| Hero sahnesi | Paftanın kendi ızgarası (hero) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | 6.5 px etiketler (%55 opaklık, 4.94:1) en küçük metin |
| 768 px | Düşük risk |
| 1280 px | Pafta kadrajı geniş ekranda boş kalabilir |
