# `kurumsal/KurumsalCizgi/index.tsx` — Tek Çizgi

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-cizgi`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Lacivert hat kobalta döndü; çizim 2.6 → 2.2 s (kategorinin kısa hareketi). Kadraj çizginin "ölçülmüş" olduğunu söyler.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `HatHero` (ortak, `drawDuration={2.2}`) |
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
| 360 px | Çizgi uzun adın etrafından dolanır; satır sayısı arttıkça kıvrım sıklaşır |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
