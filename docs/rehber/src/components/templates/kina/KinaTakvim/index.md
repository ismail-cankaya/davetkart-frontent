# `src/components/templates/kina/KinaTakvim/index.tsx` — Takvim

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-takvim'`), `src/data.ts` (`kina-takvim` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç kâğıdı yaprak, al mürekkep, bakır spiral, kayısı not kâğıdı.

Hero: TakvimHero (ortak) — `paper`, `ink="#b0241c"`, `metal="#b07a3c"`, `note="#f6c9a8"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#b02a32`) | `KINA_TAKVIM` |
| Hero parametreleri | pirinç spiral `#a07a3c`, pembe not | bakır spiral `#b07a3c`, kayısı not, al mürekkep |

Vurgu rengi: `#b02a32` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.28 | accent/zemin |
| Hero | 5.50 | gövde / `#f6c9a8` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Boş senaryoda ay adı yerine "Takvim" yazıyor (ortak davranış).
