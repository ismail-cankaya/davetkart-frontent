# `src/components/templates/sunnet/SunnetBlueprint/index.tsx` — Teknik Çizim

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-blueprint`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `BlueprintHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_BLUEPRINT (koyu, köşesiz)` — `sunnet/themes.ts` |
| Arka plan | yok — hero kendi ozalitini çizer (değişmedi) |
| Önceki görünüm | petrol yeşili ozalit + sarı |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `paper` | `#132a7a` | Ozalit pelerin mavisine döner (eski petrol yeşili) |
| `line` | `#e6ecff` | Çizgi mürekkebi, kağıtta 10.86:1 |
| `accent` | `#f2c14e` | Fener pirinci, 7.63:1 |
| `sheetCode` | "SN-07" | Antet kodu (sünnet 7 yaş geleneğine selam) |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Antet tablosundaki "Proje" hücresi zarf etiketini taşır; 360 px'te kırpılma bakılacak.
