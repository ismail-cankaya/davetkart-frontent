# `src/components/templates/sunnet/SunnetDokuma/index.tsx` — Dokuma

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-dokuma`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `DokumaHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_DOKUMA (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fafbfe → #eceef7` |
| Önceki görünüm | krem zemin, çini mavisi/kiremit/yeşil iplik |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `threads` | `[#2348c6, #c3263c, #e9b23a]` | Kilim şeridi pelerin/kuşak/sırma ile dokunur |
| `weave` | `#a7b0d4` | Zemin dokusu soğuk gri-mavi (eski krem yerine) |
| `stitch` | `#c3263c` | Kesikli kenar kuşak kırmızısı |
| `seed` | 37 | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Pirinç iplik açık zeminde düşük kontrastlı — yalnızca süs; 360 px'te şerit yoğunluğu bakılacak.
