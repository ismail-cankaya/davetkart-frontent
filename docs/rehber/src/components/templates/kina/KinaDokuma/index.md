# `src/components/templates/kina/KinaDokuma/index.tsx` — Dokuma

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-dokuma'`), `src/data.ts` (`kina-dokuma` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç tonunda dokuma; atkı ipleri al, kına turuncusu ve zeytin, çözgü kına tozu.

Hero: DokumaHero (ortak) — `threads={[al, kına, zeytin]}`, `weave="#c9a07c"`, `stitch="#7a4532"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (mor `#8a4f7a`) | `KINA_DOKUMA` |
| Hero parametreleri | gül/petrol/altın ipler, mor dikiş | al/kına/zeytin ipler, kahve dikiş |

Vurgu rengi: `#8a4f7a` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.46 | accent/zemin |
| Hero | 7.61 | gövde / `#fcf3e9` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Kilim kenarları kartın üstünde ve altında; metne değmiyor.
