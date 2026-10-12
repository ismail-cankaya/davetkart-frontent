# `src/components/templates/kina/KinaMonogram/index.tsx` — Varak Monogram

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-monogram'`), `src/data.ts` (`kina-monogram` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına kahvesi karton, bakır varak.

Hero: MonogramHero (ortak) — `paper="#4a1a0e"`, `edge="#e0955a"`, `foil` bakır üçlüsü, `stock="dark"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (altın `#d4ad5c`, bordo zemin) | `KINA_MONOGRAM` (bakır) |
| Hero parametreleri | bordo karton, altın varak | kına kahvesi karton, bakır varak |

Vurgu rengi: `#d4ad5c` → `#eea56c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 6.37 | input placeholder |
| Hero | 6.23 | gövde / `#562c22` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Altın yerine bakır: koyu+altın varsayılanından ayrışma.
