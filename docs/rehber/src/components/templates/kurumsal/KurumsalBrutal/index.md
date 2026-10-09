# `kurumsal/KurumsalBrutal/index.tsx` — Brutal

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-brutal`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Mavi/yeşil ikilisi kobalt + işaret kırmızısına döndü. Zemin tam ızgara; düğmeler kayık gölgeli, sıfır köşe.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `BrutalHero` (ortak) |
| Ton / zemin | açık `#F1F1ED` |
| Sinyal | kobalt + işaret `#F0442A` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | sert |
| Hero sahnesi | Tam yüzey kayıt ızgarası (64 px) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Büyük harf siyah başlık `clamp(2.1rem,13cqw,4rem)`; 37 karakterlik ad 4–5 satır |
| 768 px | Kayık gölge ile ızgara üst üste; okunurluk iyi |
| 1280 px | Düşük risk |
