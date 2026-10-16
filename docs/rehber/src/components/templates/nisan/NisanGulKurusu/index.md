# `nisan/NisanGulKurusu` — "Gül Kurusu"

> **ID:** `nisan-gul-kurusu` · **Aile:** Kâğıt / el yapımı ([KAGIT-KONSEPTI](../../../../../tasarim/KAGIT-KONSEPTI.md))
> **Tarih:** 2026-10-15 · dal `design/kagit` · Çizim: [GulDali](GulDali.md)

---

## 1. Fikir

Gül kurusu kâğıda taşmış suluboya lekeleri ve kartın köşesine iliştirilmiş **tek** bir kurutulmuş
gül dalı. Ailenin "suluboya + kurutulmuş çiçek" yorumu.

| | |
|---|---|
| Set | masa `gul`, kart `fildisi`, mürekkep `gul`, vurgu `gul`, mum `gul` (yalnızca zarf), doku `lif` |
| Adlar | Alex Brush (fırça), `Adlar` 46 px |
| Süs | 3 leke (`gul`, `seftali`, `lavanta`) + `GulDali`; kartta mühür yok |

`NisanSuluboya`'dan farkı: orada hero'nun kendisi suluboyadır (buz mavisi, pudra, adaçayı;
çalışma anında filtre). Burada lekeler kartın altından taşan izlerdir ve önceden üretilmiş maskedir.

## 2. Düzen

- Lekeler **kartı saran kaba** göre konumlanır, ekrana değil: 768 ve 1280 px'te de kartın kenarından taşarlar.
- Kart opaktır; lekeler metnin altına girmez (kontrast leke rengine bağlı değil).
- Kart −1.2° eğik: elle masaya bırakılmış. Eğim CSS `rotate`, giriş hareketi `transform` —
  ikisi birbirini ezmez.
- Gül dalı sol üst köşeden kartın üstüne uzanır. İlk denemede sap başlık satırına değiyordu;
  kartın üst dolgusu `pt-20`'ye çıkarıldı, dal büyütülüp −10° döndürüldü.

## 3. Hareket

Lekeler belirir 0–0.45 s → kart kayar 0.1–0.7 s → başlık 0.25, adlar (font hazırsa) 0.25,
metin 0.35, dal 0.4–0.85 s → sayaç 0.5 s.

## 4. Erişilebilirlik

En düşük metin çifti 5.99 (gövde `gul` / masa `gul`, lif ×0.937). Lekeler ve dal `aria-hidden`.

## 5. Sınırlar

- Dal ve lekeler 360 px'te ekranın kenarından kesilir (bilinçli: kâğıt masaya yayılmış).
