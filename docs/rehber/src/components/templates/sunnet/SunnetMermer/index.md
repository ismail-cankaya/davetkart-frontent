# `src/components/templates/sunnet/SunnetMermer/index.tsx` — Mermer & Rölyef

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-mermer`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `MermerHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_MERMER (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fbfcfe → #eceff7` |
| Önceki görünüm | gri taş, `#8f9ba5` damar |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `slab` | `#fbfcff → #e1e6f4` | Soğuk beyaz taş |
| `vein` | `#8d9bd0` | Sax damar |
| `polish` | `light` | Değişmedi |
| `seed` | 11 | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Damarlar metnin arkasından geçer; 360 px'te ad satırıyla çakışma bakılacak.
