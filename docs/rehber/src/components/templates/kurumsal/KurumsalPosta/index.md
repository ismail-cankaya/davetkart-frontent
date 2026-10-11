# `kurumsal/KurumsalPosta/index.tsx` — Posta Damgası

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-posta`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Şerit işaret kırmızısı + kobalt, pul platin, damga kobalt.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `PostaHero` (ortak) |
| Ton / zemin | açık `#F2F2EE` |
| Sinyal | kobalt; şerit işaret + kobalt |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt degrade, kadraj (cetvelsiz) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Zarf kartı `max-w-[22rem]` |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
