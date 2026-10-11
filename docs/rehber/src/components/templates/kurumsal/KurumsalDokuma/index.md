# `kurumsal/KurumsalDokuma/index.tsx` — Dokuma

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-dokuma`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Petrol/kum/haki iplikler kobalt/grafit/platine döndü; atkı beton grisi.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `DokumaHero` (ortak) |
| Ton / zemin | açık `#F1F1ED` |
| Sinyal | kobalt |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt degrade, kadraj (cetvelsiz) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Kart `max-w-[21rem]`; uzun ad kart içinde 3 satır |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
