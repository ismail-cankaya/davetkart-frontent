# `konsept/kitap/Fleuron.tsx` — dizgi süsleri

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

| `tur` | Çizim | Kullanım |
|---|---|---|
| `yaprak` (varsayılan, 34 px) | Yatık sarmaşık yaprağı (hedera): kalp biçimli yaprak, ortasında zemin renginde damar, çentikten sola çıkıp aşağı kıvrılan sap | `BolumAcilisi` — paragraftan sonra |
| `cizgi` (84 × 14 px) | Ortada eşkenar dörtgen, iki yanda badem yaprak, uçlarda nokta | `IcKapak` — matbaa süsü |

- Renk `currentColor` (kurdele: şamuada 6.82, grafik eşiği 3). Damar `zemin` prop'unun rengindedir
  (varsayılan şamua); başka zeminde verilmelidir.
- Süstür: `aria-hidden`. Bölüm başına en çok bir tane.
- **Telif:** iki çizim de bu dal için elle yazılmış SVG yollarıdır; bir font glifinden ya da
  kaynaktan kopyalanmadı. Sarmaşık yaprağı matbaacılığın kamu malı motifidir (❦), çizim özgündür.
- Fontun kendi fleuron glifi denetlenmediği için SVG seçildi.
