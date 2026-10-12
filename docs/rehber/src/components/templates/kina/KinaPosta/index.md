# `src/components/templates/kina/KinaPosta/index.tsx` — Posta Damgası

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-posta'`), `src/data.ts` (`kina-posta` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Al/kına çizgili uçak postası zarfı, sırma pul, al damga.

Hero: PostaHero (ortak) — `stripe={[al, kına]}`, `stamp="#d8a24a"`, `postmark="#871a15"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#b8434f`) | `KINA_POSTA` |
| Hero parametreleri | gül `#c2354f` / petrol `#1f6f6a` şerit, altın pul | al/kına şerit, sırma pul, al damga |

Vurgu rengi: `#b8434f` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.72 | accent/zemin |
| Hero | — | metin kart yüzeyinde; bölüm `surface` çifti geçerli |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Petrol/mavi şerit kalktı: sünnetin sax mavisiyle karışmaz.
