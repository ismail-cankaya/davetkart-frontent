# `src/components/templates/kina/KinaHerbaryum/index.tsx` — Lawsonia

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-herbaryum'`), `src/data.ts` (`kina-herbaryum` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına bitkisinin (Lawsonia inermis) kurutulmuş yaprağı herbaryum kâğıdında; zeytin numune, sırma bant.

Hero: HerbaryumHero (ortak) — `specimen="#666a2c"`, `tape` sırma, `accession="Lawsonia · No. 014"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#b8434f`) | `KINA_HERBARYUM` (zeytin vurgu) |
| Hero parametreleri | kahverengi numune `#8a6a3a`, `No. 014` | zeytin numune, sırma bant, `Lawsonia · No. 014` |

Vurgu rengi: `#b8434f` → `#565a1f`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.84 | accent/zemin |
| Hero | — | metin kart yüzeyinde; bölüm `surface` çifti geçerli |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Çerçeve çizimi | Ortak hero'da |

## 5. Görsel öz-kontrol

Metin kartta; hero zemini ölçümü kart yüzeyine düşüyor.
