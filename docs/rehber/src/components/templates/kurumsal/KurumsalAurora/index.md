# `kurumsal/KurumsalAurora/index.tsx` — Aurora Cam

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-aurora`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Varsayılan `Summary` yerine Künye hero. İndigo–mor aurora kategorinin tek sinyaline (kobalt) indirildi; diğer kategorilerin mor–pembe aurorasından ayrışır. Hero kontrastı için perde 0.52 → 0.38, gövde `#B4B9C9`.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | Künye (`KurumsalHero`, `align="center"`) |
| Ton / zemin | koyu `#08090F` |
| Sinyal | kobalt ışığı `#8F9CFF` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kobalt/kobalt ışığı/platin `AuroraMesh` (0.38), hale, stardust parçacıkları, kesim işaretli kadraj |

Hero ayrıntısı (ad ayrımı, künye, ölçü kademeleri): [parts/KurumsalHero](../parts/KurumsalHero.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Sayaç dört sütunu sıkışık; gün değeri 3 haneyken rakamlar alt sınırda |
| 768 px | Künye `max-w-md` ortada; perde kenarlara yayılır |
| 1280 px | Düşük risk; vinyet kenarları kapatır |
