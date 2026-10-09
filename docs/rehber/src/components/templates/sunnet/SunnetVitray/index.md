# `src/components/templates/sunnet/SunnetVitray/index.tsx` — Vitray Işık

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-vitray`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `VitrayHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_VITRAY (koyu)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: kraliyet gecesi + pirinç GodRays (%24) + nar Halo (%16) + toz |
| Önceki görünüm | zümrüt/altın/çini mavisi |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `glass` | `[#2348c6, #c3263c, #e9b23a]` | Camlar pelerin/kuşak/sırma |
| `glow` | `#f2c14e` | Arkadan vuran ışık |
| `seed` | 43 | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Kırmızı cam ad satırının arkasına düşebilir; ad `#f5f7fd`. 768 px'te kemer içi bakılacak.
