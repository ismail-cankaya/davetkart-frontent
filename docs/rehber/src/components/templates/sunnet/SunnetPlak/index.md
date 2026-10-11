# `src/components/templates/sunnet/SunnetPlak/index.tsx` — Vinil Plak

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-plak`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `PlakHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_PLAK (koyu)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: kraliyet gecesi radyal + pirinç Halo (%14) |
| Önceki görünüm | kehribar etiket `#c47a2f` |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `label` | `#c3263c` | Etiket kuşak kırmızısı |
| `labelInk` | `#fff4dc` | Etiket yazısı, 5.25:1 |
| `spinDuration` | 46 | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Etiket yazısı küçük; 360 px'te plak çapı ve etiket okunurluğu bakılacak.
