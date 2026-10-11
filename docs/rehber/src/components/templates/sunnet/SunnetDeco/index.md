# `src/components/templates/sunnet/SunnetDeco/index.tsx` — Art Deco Gala

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-deco`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `DecoHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_DECO (koyu)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: kraliyet gecesi radyal + pirinç Sunburst (%20) + GoldSheen |
| Önceki görünüm | siyah zemin + şampanya altın, Cormorant |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `—` | parametresiz | Çerçeve ve yelpaze tema token'larından; `theme-cormorant` kaldırıldı (kategori Playfair kullanır) |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Deco altın dili korunur; ayrışma zeminde (siyah → sax gecesi) — kardeş Deco'larla yan yana bakılacak.
