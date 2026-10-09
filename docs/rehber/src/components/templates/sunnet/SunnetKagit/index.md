# `src/components/templates/sunnet/SunnetKagit/index.tsx` — Kağıt & Mühür

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-kagit`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `PaperHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_KAGIT (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#eef2fb → #d0d9ef` radyal |
| Önceki görünüm | mavi-gri kağıt, lacivert mühür |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `sealColor` | `#c3263c` | Mum mühür kuşak kırmızısı (eski lacivert) |

## 3. Bakılacak risk (360 / 768 / 1280 px)

PaperHero kağıdı açık temada `#fdfaf3` (ortak); soğuk zemin üstünde hafif sıcak kalır — bilinçli bırakıldı.
