# `src/components/templates/kina/KinaDeco/index.tsx` — Art Deco Gala

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-deco'`), `src/data.ts` (`kina-deco` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına kahvesi zemin, bakır yelpaze. Üç Deco'dan ayrışma metalle: düğün inci, nişan platin, kına bakır.

Hero: DecoHero (ortak) — `metal={BAKIR}` (bakır rgb).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (altın `#cf9f4e`) | `KINA_DECO` (bakır degrade düğme) |
| Atmosfer | altın | `Sunburst` + `GoldSheen` bakır tonunda |

Vurgu rengi: `#cf9f4e` → `#eaa676`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.26 | input placeholder |
| Hero | 7.05 | gövde / `#2c160d` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `Sunburst`, `GoldSheen` | `[data-atmosphere]` |

## 5. Görsel öz-kontrol

Yelpaze ışınları metin sütununun arkasında soluk (0.18).
