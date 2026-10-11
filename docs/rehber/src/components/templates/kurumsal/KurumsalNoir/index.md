# `kurumsal/KurumsalNoir/index.tsx` — Noir Minimal

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-noir`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Çelik grisi vurgu platine; kadrajda yalnızca dört kesim işareti. Efekt bütçesi yine en düşük.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `NoirHero` (ortak) |
| Ton / zemin | koyu `#0B0C0E` |
| Sinyal | platin |
| Bölüm başlıkları | serif (Cormorant) |
| Köşe (`kurumsalTheme`) | sert |
| Hero sahnesi | Grafit radyal degrade, platin hale, kadraj (cetvelsiz) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | `NoirHero` kelimeleri bölünmez (`inline-block`): 13+ harfli tek kelime `2.75rem`'de taşma sınırında (ortak) |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
