# `src/components/templates/sunnet/SunnetKinetik/index.tsx` — Kinetik Tipografi

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-kinetik`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `KinetikHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_KINETIK (koyu, doygun sax zemin)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#2540c0 → #14237a` + pirinç Halo (%12) |
| Önceki görünüm | kobalt zemin + mercan |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `topWord` | "MAŞALLAH" | Üst şeritte kuşağın nakışı gibi tekrar eder (eski "SÜNNET") |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Zemin kategorinin en doygun mavisi; bölüm kartları `#0e1a66/40` cam. 1280 px'te şerit hızı bakılacak.
