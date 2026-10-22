# `nisan/kitap/NisanKitapKurdele/KurdeleliAdlar.tsx` — kesik kurdeleli adlar

> **Tarih:** 2026-10-22 · dal `design/kitap`

---

## 1. Yapı

Tek `h1`: ilk ad · kurdele satırı (sol yarı, `&`, sağ yarı) · ikinci ad. Satırlar arasında boşluk
karakteri var; ekran okuyucu "A & B" okur. Kurdele yarıları `aria-hidden`.

| Parça | Değer |
|---|---|
| Yazı boyu | `adlarBoyu(adlar, 64, 13.5)` — 360 px'te 48.6 px; satırın `em`'i buna bağlı |
| Kurdele | 14 px, kurdele `#8C2F2F`, üst-alt kenarda %22 siyah kılçizgi — `Ayrac` ile aynı kumaş |
| Kesik | `clip-path` ile 9 px kırlangıç kuyruğu, iç uçlarda |
| Boşluk | `&` (0.7 em, Caslon Text italik, kurdele rengi) + iki yanda 0.36 em |
| Genişlik | `margin-left: calc(50% − 50cqi − 0.5em)`, `width: calc(100cqi + 1em)` — kabın iki kenarından 0.5 em taşar |

Taşma bilerek: açılma hareketinde yarılar 0.45 em içeride başlar; satır kenardan taşmasa kenarda boşluk
görünürdü. Taşan kısmı başlık sayfasının `overflow: hidden`'ı keser (yatay kaydırma yok, ölçüldü).

## 2. Hareket

`hazir` (başlık fontu) olunca: yarılar `x ±0.45em → 0`, 0.4 s, 0.05 s gecikme, `ease.inOut`; `&`
opaklık 0 → 1 aynı geçişle. Yalnızca transform ve opaklık; hareket azaltılmışken yarılar yerinde.

## 3. Tek ad / ad yok

Kurdele kesilmez: adın (ya da "Davetlisiniz"in) altında kenardan kenara tek parça şerit; `&` yok.
Sözün iki tarafı yoksa kesilecek bir kurdele de yoktur.
