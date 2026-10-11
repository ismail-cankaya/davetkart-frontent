# `kurumsal/KurumsalSuluboya/index.tsx` — Suluboya

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-suluboya`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Çelik/adaçayı/kum lekeleri kobalt ışığı, platin ve soluk çivite döndü. Kesim işaretleri boyanın bir prova kâğıdında olduğunu söyler.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `SuluboyaHero` (ortak) |
| Ton / zemin | açık `#F4F4F1` |
| Sinyal | kobalt |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt degrade, kadraj |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Lekeler metnin arkasında; çarpma karışımı (multiply) koyu metni koyulaştırır |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
