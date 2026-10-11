# `src/components/templates/sunnet/SunnetHerbaryum/index.tsx` — Herbaryum

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-herbaryum`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `HerbaryumHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_HERBARYUM (açık, köşeli düğme)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fbfdfd → #eaf2f4` |
| Önceki görünüm | yeşilimsi föy, `#4f7a6a` yeşil mürekkep |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `sheet` | `#f2f7f8` | Föy |
| `tape` | `rgba(42,167,184,0.28)` | Turkuaz bant |
| `specimen` | `#0d6f80` | Nazar turkuazı mürekkep |
| `label` | `#ffffff` | Etiket kartı |
| `accession` | "No. 001" | İlk şenlik — eski "No. 033" |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Turkuaz mürekkep (`#0d6f80`) bölüm zemininde 5.08:1 — kategorideki en dar açık zemin çifti.
