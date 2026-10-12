# `src/components/templates/kina/KinaCizgi/index.tsx` — Tek Çizgi

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-cizgi'`), `src/data.ts` (`kina-cizgi` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Açık avuç kâğıdı, kuru kına yaprağı zeytini hat. Kategorinin kırmızısız, en sade çizgisi.

Hero: HatHero (ortak, değişmedi).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (petrol `#1f6f6a`) | `KINA_CIZGI` (zeytin `#565a1f`) |

Vurgu rengi: `#1f6f6a` → `#565a1f`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.97 | input placeholder |
| Hero | 7.01 | gövde / `#f8eee2` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Hat çizimi | Ortak dosyada |

## 5. Görsel öz-kontrol

Zeytin hat kategoriyi kırmızısız da tanınır kılıyor.
