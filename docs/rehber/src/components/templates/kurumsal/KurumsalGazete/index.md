# `kurumsal/KurumsalGazete/index.tsx` — Gazete Manşeti

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-gazete`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Petrol vurgu tek spot renk olarak kobalta döndü. Serif manşet korundu: gazetenin kendi dili.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `GazeteHero` (ortak, `masthead="KURUMSAL BÜLTEN"`) |
| Ton / zemin | açık `#F1F1ED` |
| Sinyal | kobalt (spot renk) |
| Bölüm başlıkları | serif (Playfair) |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt degrade |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Manşet sütunları dar |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
