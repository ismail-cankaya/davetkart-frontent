# `kurumsal/KurumsalDeco/index.tsx` — Art Deco Gala

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-deco`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Zümrüt + şampanya altını varsayılanından platin galaya. `DecoHero` çerçevesini sabit altınla çizdiği için hero kabı `[&_[aria-hidden=true]]:grayscale` taşır: yalnızca dekoratif katmanlar gri tonlanır.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `DecoHero` (ortak) |
| Ton / zemin | kobalt gece `#0A0C14` |
| Sinyal | platin `#C5CBD3` |
| Bölüm başlıkları | serif (Cormorant) |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Platin yelpaze (`Sunburst`), platin parlama (`GoldSheen`) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Cormorant büyük harf + harf aralığı: uzun ad 4+ satır |
| 768 px | Tarayıcıda çerçevenin gerçekten platin göründüğünü doğrula (filtre) |
| 1280 px | Düşük risk |
