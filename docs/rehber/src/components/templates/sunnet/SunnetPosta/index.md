# `src/components/templates/sunnet/SunnetPosta/index.tsx` — Posta Damgası

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-posta`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `PostaHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_POSTA (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fcfdff → #edf0fa` |
| Önceki görünüm | mavi + bakır şerit, açık yeşil pul |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `stripe` | `[#2348c6, #c3263c]` | Uçak postası şeridi pelerin + kuşak |
| `stamp` | `#e9b23a` | Pul pirinç |
| `postmark` | `#101a4a` | Damga lacivert |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Pul zemini pirinç; pulun içindeki süsün rengi ortak hero'nun seçimidir — 768 px'te pul içi kontrastı bakılacak.
