# `kurumsal/KurumsalNetwork/index.tsx` — Dinamik Ağ (Sinematik)

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-network`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Varsayılan `Summary` yerine Künye hero. Mavi–mor fiber ağ kobalt/kâğıt beyazına döndü; ağın ağırlığı sağ üste toplandı, künye solda.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | Künye (`KurumsalHero`, `align="start"`) |
| Ton / zemin | koyu `#0B0D12` |
| Sinyal | kobalt ışığı |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kobalt radyal degrade, kayıt ızgarası (sağ üst), kobalt hale, ağ parçacıkları, kadraj |

Hero ayrıntısı (ad ayrımı, künye, ölçü kademeleri): [parts/KurumsalHero](../parts/KurumsalHero.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ağ çizgileri gövde metninin arkasından geçer (scrim 0.32) |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
