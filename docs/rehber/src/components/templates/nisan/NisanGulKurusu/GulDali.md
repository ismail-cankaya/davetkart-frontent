# `nisan/NisanGulKurusu/GulDali.tsx` — kurutulmuş gül dalı

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

**Özgün SVG çizimi** (bu dosyadaki yollar): üç yaprak, dikenli sap, çanak yapraklı bir tomurcuk.
Bir görselden, çizimden ya da hazır ikon setinden alınmadı → telif sorunu yok.

## Teknik

- **İki katman:** mürekkep çizgisi (setin başlık mürekkebi, %55–70) ve suluboya dolgusu
  (`PIGMENTLER.gul`, `PIGMENTLER.adacayi`). Dolgu 2.2 × 1.6 birim kaydırılmıştır: elle boyanmış
  çizimde fırça çizginin tam içine düşmez.
- Dolgular `multiply` ile üst üste biner; tomurcuğun iç yaprağı iki kat boyanmış gibi koyulaşır.
- Yaprak tek bir birim yoldan `translate · rotate · scale` ile üretilir; çizgi kalınlığı
  `vector-effect: non-scaling-stroke` ile sabit kalır.
- Canlandırılmaz (yalnızca kapsayıcının opaklığı).

## Kurallar

Kalıp çiçek kümesi yok: tek dal, kartın köşesinde, metinden uzak (sap başlığa değmemeli — ilk
denemede değdi, düzeltildi).
