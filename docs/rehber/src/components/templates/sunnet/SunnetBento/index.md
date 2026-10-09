# `src/components/templates/sunnet/SunnetBento/index.tsx` — Bento Editorial

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-bento`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `BentoHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_BENTO (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: şeker beyazı degrade + soluk AuroraMesh (sax `164,182,240` / nar `240,176,186` / turkuaz `160,222,230`, %24) |
| Önceki görünüm | gök grisi zemin, deniz mavisi `#1c7d99` vurgu |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `—` | parametresiz | Izgara yalnızca tema token'larını okur; kimlik tema ve mesh renginden gelir. |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Izgara 360 px'te tek, @lg'de üç sütun; hücre kenarları `#dbe1f2` açık zeminde ince — 1280 px'te hücre ayrımı bakılacak.
