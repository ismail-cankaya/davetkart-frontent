# `src/components/templates/kina/KinaBento/index.tsx` — Bento

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-bento'`), `src/data.ts` (`kina-bento` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç kâğıdı ızgara, al vurgu. Kına gecesi bilgi yoğundur; ızgara bunu hiyerarşiyle taşır.

Hero: BentoHero (ortak, değişmedi).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (altın `#b08442`) | `KINA_BENTO` |
| Atmosfer | — | Soluk `AuroraMesh` (kayısı tonları, 0.2) |

Vurgu rengi: `#b08442` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.78 | input placeholder |
| Hero | — | metin kart yüzeyinde; bölüm `surface` çifti geçerli |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `AuroraMesh` | `[data-atmosphere]` |
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Metin kartlarda; hero zemini ölçümü kart yüzeyine düşüyor (bölüm `surface` çifti).
