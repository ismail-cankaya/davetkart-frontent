# `src/components/templates/kina/KinaTerrazzo/index.tsx` — Terrazzo

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-terrazzo'`), `src/data.ts` (`kina-terrazzo` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç levha, al/kına/sırma/zeytin/kahve çakıllar.

Hero: TerrazzoHero (ortak) — `chips` beşlisi, `slab="#f8ebdf"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#c1272d`) | `KINA_TERRAZZO` (hap düğme) |
| Hero parametreleri | kırmızı/turuncu/kahve/bej çakıl | al/kına/sırma/zeytin/kahve çakıl |

Vurgu rengi: `#c1272d` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.59 | accent/zemin |
| Hero | 6.46 | gövde / `#eae4d7` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Çakıl düşüşü | Ortak dosyada |

## 5. Görsel öz-kontrol

Çakıllar kartın dışında.
