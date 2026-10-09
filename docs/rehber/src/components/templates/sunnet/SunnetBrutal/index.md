# `src/components/templates/sunnet/SunnetBrutal/index.tsx` — Brutal

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-brutal`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `BrutalHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_BRUTAL (açık, köşesiz)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: düz `#f5f7fd`, parallax kapalı |
| Önceki görünüm | buz mavisi zemin, deniz yeşili `#0d8f7a` + sarı |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `ink` | `#101a4a` (lacivert) | Çerçeve ve sert gölge |
| `accent` | `#c3263c` (nar) | Sert gölge ve sayaç blokları |
| `accent2` | `#e9b23a` (pirinç) | Mesaj bloğu ve rozet |
| `onAccent` | `#ffffff` | Nar üstü 5.73:1 |
| `onAccent2` | `#101a4a` | Pirinç üstü 8.59:1 |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Uzun ad + aile adı (ör. "Emir Kerem & Yılmaz Ailesi") 360 px'te dört satıra kırılır; blok yüksekliği bakılacak.
