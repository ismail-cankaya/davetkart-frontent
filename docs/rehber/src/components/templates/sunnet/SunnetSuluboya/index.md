# `src/components/templates/sunnet/SunnetSuluboya/index.tsx` — Suluboya

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-suluboya`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `SuluboyaHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_SULUBOYA (açık)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#fdfeff → #eff2fb` |
| Önceki görünüm | gök mavisi, deniz yeşili, altın |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `washes` | `[#8ea2ea, #ee8f9c, #f2cf74]` | Pelerin, kuşak, sırma tonlarının sulandırılmışı |
| `seed` | 31 | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Lekeler metnin arkasında multiply; pembe leke ad üstüne denk gelirse 360 px'te bakılacak.
