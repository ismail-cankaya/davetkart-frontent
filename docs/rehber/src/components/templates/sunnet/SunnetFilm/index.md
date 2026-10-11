# `src/components/templates/sunnet/SunnetFilm/index.tsx` — Film Şeridi

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-film`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `FilmHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_FILM (koyu)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#18205a → #0c1236` + nar Halo (%12) |
| Önceki görünüm | gece mavisi + deniz yeşili `#5fb8a8` |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `strip` | `#151c4a` | Şerit gövdesi |
| `frame` | `#0e1440` | Kare zemini |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Nar vurgu (`#ff8a96`) küçük zaman kodunda; 360 px'te kare sırası bakılacak.
