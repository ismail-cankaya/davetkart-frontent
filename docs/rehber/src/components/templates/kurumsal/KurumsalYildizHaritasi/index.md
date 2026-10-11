# `kurumsal/KurumsalYildizHaritasi/index.tsx` — Yıldız Haritası

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-yildiz-haritasi`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Çelik mavisi çizgiler kobalt ışığına; zemine kayıt ızgarası eklendi: takımyıldız bir veri haritası gibi okunur.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `YildizHero` (ortak) |
| Ton / zemin | koyu `#080A11` |
| Sinyal | kobalt ışığı |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kobalt radyal degrade, koordinat ızgarası, kobalt hale |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Düşük risk |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
