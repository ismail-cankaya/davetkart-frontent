# `src/components/templates/sunnet/SunnetTerrazzo/index.tsx` — Terrazzo

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-terrazzo`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `TerrazzoHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_TERRAZZO (açık, yuvarlak dil)` — `sunnet/themes.ts` |
| Arka plan | yok — hero kendi harcını çizer (değişmedi) |
| Önceki görünüm | deniz yeşili çakıl + altın kırıntı |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `chips` | `[#2348c6, #c3263c, #e9b23a, #dfe6fb, #101a4a]` | Pelerin, kuşak, sırma, saten, mürekkep çakılları |
| `slab` | `#f4f6fc` | Şeker beyazı harç |
| `seed` | 41 | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Koyu lacivert çakıllar küçük; 1280 px'te yoğunluk bakılacak.
