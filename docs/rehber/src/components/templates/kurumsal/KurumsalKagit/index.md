# `kurumsal/KurumsalKagit/index.tsx` — Kağıt & Mühür

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-kagit`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Koyu yeşil mühür koyu kobalta döndü: kategorinin sinyali mumda da sürer. Resmî kayıt serifi korundu.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `PaperHero` (ortak, `sealColor="#2233C2"`) |
| Ton / zemin | açık `#F1F1ED` |
| Sinyal | koyu kobalt `#2233C2` |
| Bölüm başlıkları | serif (Playfair) |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt radyal degrade |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | `PaperHero` başlığında `break-words` yok: 15+ harfli tek kelime taşabilir (ortak) |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
