# `src/components/templates/sunnet/SunnetCizgi/index.tsx` — Tek Çizgi

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-cizgi`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `HatHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_CIZGI (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fcfcfe → #eef0f8` |
| Önceki görünüm | açık gök kağıdı, bordo `#8c3b4a` hat |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `—` | parametresiz | Kartuş çizgisi `theme.accent` (nar `#b8233a`) ile çizilir. |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Kartuşun nar çizgisi 1280 px'te ince kalabilir; çizim süresi (2.6 s) değişmedi.
