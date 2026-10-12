# `src/components/templates/kina/KinaKagit/index.tsx` — Kağıt & Mühür

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-kagit'`), `src/data.ts` (`kina-kagit` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç kâğıdı, al mühür.

Hero: PaperHero (ortak) — `paper="#fcf3ea"`, `sealColor="#b0241c"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (gül `#9c2436`) | `KINA_KAGIT` |
| Hero parametreleri | varsayılan fildişi | avuç kâğıdı, al mühür |

Vurgu rengi: `#9c2436` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.25 | accent/zemin |
| Hero | 6.51 | gövde / `#ece4dc` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Mühür kartın alt kenarında; tarihe değmiyor.
