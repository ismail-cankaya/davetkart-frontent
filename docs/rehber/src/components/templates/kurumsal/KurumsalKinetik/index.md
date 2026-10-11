# `kurumsal/KurumsalKinetik/index.tsx` — Kinetik Tipografi

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-kinetik`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Grotesk çekirdek; üst şerit "DAVET" yerine "ETKİNLİK" akıtır. Turuncu işaret kırmızısına çekildi.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `KinetikHero` (ortak, `topWord="ETKİNLİK"`) |
| Ton / zemin | koyu `#0D0F13` |
| Sinyal | işaret `#FF6A4D` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Grafit degrade, işaret hale, kadraj |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Şeritler eğik; çekirdek metin şeritlerin arasında |
| 768 px | Düşük risk |
| 1280 px | Şerit kelimesi geniş ekranda çok tekrar eder |
