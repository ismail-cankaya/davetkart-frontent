# `nisan/NisanSozMektubu` — "Söz Mektubu"

> **ID:** `nisan-soz-mektubu` · **Aile:** Kâğıt / el yapımı ([KAGIT-KONSEPTI](../../../../../tasarim/KAGIT-KONSEPTI.md))
> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Fikir

Söz kesilen akşam için elle yazılmış, **ikiye katlanmış** ve gül renkli mumla mühürlenmiş bir mektup.
Ailenin "fildişi + mum mühür + kaligrafi" yorumu.

| | |
|---|---|
| Set | masa `pamuk`, kart `fildisi`, mürekkep `is`, vurgu `gul`, mum `gul`, doku `lif` |
| Adlar | Pinyon Script (resmî bakır gravür), `Adlar` 46 px |
| Gövde / ara başlık | EB Garamond / Cormorant Garamond |
| Süs | Tek kat izi + tek mum mühür |

## 2. Düzen

- Ana kart (`KagitLevha`, tırtıklı, `tohum` 23) ekranın ortasında, kenarlarında boşluk.
- **Kat izi her zaman iki yarının sınırında.** Kart `grid-rows-2` ile iki eşit yarıya bölünür:
  üstte başlık + adlar, altta alt başlık + tarih + mekân. Kat izi kartın %50'sindedir, iki yarı
  eşit olduğu için hiçbir satırın üstünden geçmez. Bedeli: içerikleri dengesiz olduğunda kısa
  yarıda boşluk kalır (uzun veriyle ~90 px).
- **Alt yarı boşsa kart katlanmaz** (alt başlık, tarih, mekân yok): yarım sayfa boş kalmaz.
- Mühür kartın alt kenarına biner (`-bottom-8`); harfleri `basHarfler(names)`.
- Geri sayım açıksa kartın altında üç ek kart (`KagitSayac`).

## 3. Hareket

Kart kayar 0–0.6 s → başlık 0.15 s'de, adlar font hazır olunca (≤ 0.5 s bekler) belirir →
alt yarı 0.3 s → mühür 0.55–0.79 s basılır → sayaç 0.55 s. Son öğe 0.79 s'de yerinde.
Hareketi azaltta yalnızca opaklık.

## 4. Erişilebilirlik

Ölçülen en düşük metin çifti 7.85 (gövde / pamuk masa, lif ×0.937). Mühür `aria-hidden`; adlar
gerçek metin (`h1`). Zarf: mühür düğmesi 72 px, Tab ile ilk adımda odak, Enter açar (denendi).

## 5. Sınırlar

- Uzun veride (50 karakter ad + 180 karakter mekân + 255 karakter alt başlık) kart 360 × 780
  ekranın boyunu aşar; mühür ve sayaç kaydırınca görünür.
