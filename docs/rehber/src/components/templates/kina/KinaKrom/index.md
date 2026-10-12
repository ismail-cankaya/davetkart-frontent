# `src/components/templates/kina/KinaKrom/index.tsx` — Bakır Tepsi

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-krom'`), `src/data.ts` (`kina-krom` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına tepsisinin dövme bakırı: sıcak iridesan yansıma, köşede çekiç halkaları, sola yaslı bakır degradeli iri adlar.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `align="start"`, `timer="satir"`, `damga={DAMGA_KINA}`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (gül-krom `#f0b9a0` / `#d98fa8`) | `KINA_KROM` (bakır degrade başlık) |
| Hero | `Summary` | KinaHero, afiş düzeni, satır sayaç |
| Atmosfer | krom | `Iridescent` (soft-light, hue 330°) + `CekicIzi` halkaları + `streaks` |

Vurgu rengi: `#f0b9a0` → `#f4b48c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.18 | input placeholder |
| Hero | 7.80 | gövde / `#221611` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `Iridescent` | `[data-atmosphere]` |
| Parçacıklar | durağan kare |

## 5. Görsel öz-kontrol

`bg-clip-text` başlıkta okuma gölgesi verilmez (KinaHero). Koyu ve sola yaslı tek şablon.
