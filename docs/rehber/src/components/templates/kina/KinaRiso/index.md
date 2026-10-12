# `src/components/templates/kina/KinaRiso/index.tsx` — Risograph Poster

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-riso'`), `src/data.ts` (`kina-riso` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç kâğıdına iki mürekkep, kına turuncusu ve kuru kına yaprağı zeytini; üst üste bindikleri yer kahve.

Hero: RisoHero (ortak, değişmedi).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (kırmızı `#e04b2e` + petrol) | `KINA_RISO` (turuncu + zeytin) |

Vurgu rengi: `#e04b2e` → `#a8400f`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.86 | accent/zemin |
| Hero | 6.99 | gövde / `#f3e4d2` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Başlığın kayık riso gölgesi ortak hero'nun.
