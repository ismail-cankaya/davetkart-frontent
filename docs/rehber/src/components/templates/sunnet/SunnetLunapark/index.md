# `src/components/templates/sunnet/SunnetLunapark/index.tsx` — Lunapark (gece panayırı)

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-lunapark`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi, kontrast betiği, statik önizleme 360

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` | `SehzadeHero` (`canopy`, okuma halesi, nar kuşak) |
| Üst süs | — | `Sacak` (nar / krem dilim, pirinç sırma) — HeroStage `overlay` |
| Siluet, parçacık | külahlı kuleler, kabarcık + konfeti | aynı; kabarcık pirinç/nar/turkuaz/lila, konfeti pirinç/nar/krem |
| Tema | `#0d0a1c` | `SUNNET_LUNAPARK`: `#120f3d` menekşe gece, fener pirinci |

Saçak, Klasik'teki otağ dilinin gece panayırı karşılığı: aynı aygıt, farklı
saat ve renk. İki şablon aynı hero'yu paylaşır ama sahneleri zıt (gündüz
otağı / gece panayırı).

## 2. Bakılacak risk

Konfeti düşer, kabarcık yükselir; saçak parçacıkların üstünde (overlay).
360 px'te sayaç alt kulelerin önüne düşer; kartlar `#2a2273/45` cam.
