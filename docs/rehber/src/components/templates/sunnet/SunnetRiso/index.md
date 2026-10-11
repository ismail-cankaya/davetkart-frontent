# `src/components/templates/sunnet/SunnetRiso/index.tsx` — Risograph Poster

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-riso`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `RisoHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_RISO (açık, krem baskı kağıdı)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#f9f7f0 → #f0ede2` |
| Önceki görünüm | elektrik mavisi + sarı |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `—` | parametresiz | İki mürekkep tema token'ından: `accentBg` sax daire, `accentSoft` pirinç leke (%45) |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Riso kağıdı bilinçli olarak sıcak krem (baskı kağıdı); ailenin tek sıcak zemini.
