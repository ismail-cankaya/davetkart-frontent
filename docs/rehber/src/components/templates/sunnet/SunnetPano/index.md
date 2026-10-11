# `src/components/templates/sunnet/SunnetPano/index.tsx` — Mekanik Pano

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-pano`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `PanoHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_PANO (koyu)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#17215e → #070b26` + turkuaz Halo (%14) |
| Önceki görünüm | gece mavisi + yeşim `#4fa88f` |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `flap` | `#141c52` | Kanat gövdesi |
| `ink` | `#f5f7fd` | Kanat yazısı, 14.88:1 |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Kanat sayısı üst sınırı uzun adı kırpar (ortak davranış); 360 px'te "Emir Kerem & Yılmaz Ailesi" bakılacak.
