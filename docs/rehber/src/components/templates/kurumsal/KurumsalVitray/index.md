# `kurumsal/KurumsalVitray/index.tsx` — Vitray Işık

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-vitray`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Petrol–çelik–sis camları kobalt, kobalt ışığı ve platine döndü; atriyum penceresi gibi mimari okunur.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `VitrayHero` (ortak) |
| Ton / zemin | koyu `#090B12` |
| Sinyal | kobalt ışığı |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kobalt radyal degrade, platin ışınlar, hale, sis parçacıkları, kadraj (cetvelsiz) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Kemer içi dar; uzun ad 3+ satır |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
