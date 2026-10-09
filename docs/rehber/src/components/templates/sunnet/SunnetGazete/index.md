# `src/components/templates/sunnet/SunnetGazete/index.tsx` — Gazete Manşeti

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-gazete`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `GazeteHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_GAZETE (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fbfbfd → #eceef5` |
| Önceki görünüm | mavi-gri kağıt, petrol mavisi `#1f6f8c` |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `masthead` | "ŞENLİK GAZETESİ" | Eski "SÜNNET POSTASI", Posta şablonunun adıyla karışıyordu |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Masthead 360 px'te tek satıra sığmalı; 768 px'te sütun dengesi bakılacak.
