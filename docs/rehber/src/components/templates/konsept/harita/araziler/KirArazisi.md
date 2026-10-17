# `konsept/harita/araziler/KirArazisi.tsx` — arazi ekseni

> **Tarih:** 2026-10-17 · dal `design/harita` · Eksen: [HARITA-KONSEPTI §4.3](../../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Çizim

Kurgusal bir kır, 1200 × 1500 tuval, `xMidYMid slice`. Tonlar: **arazi**, **park** (korular), **su**
(dere, gölet); rota kapakta ayrı katmandır.

| Öğe | Nasıl |
|---|---|
| Dört tepe | [`lekeYolu`](cizim.md) ile 4–7 iç içe halka; her üçüncüsü ana eş yükselti eğrisi (2.2 px, mürekkep %30), diğerleri 1.4 px %20 |
| Dört koru | Düzensiz leke (park) + içinde ağaç simgeleri (yay + gövde, mürekkep %24) |
| Üç tarla | Döndürülmüş sıra deseni (mürekkep %16), kesikli sınır; biri sık sıralı bağ |
| Toprak yol | Kesikli ince çizgi (rota değil, arazinin dokusu) |
| Dere ve gölet | 18 px su bandı, gölet lekesi, üstünde seyrek akış noktaları |
| Su adı | *Serin Dere* — Newsreader italik, dere boyunca −36° (süs metni) |

Ana tepe, dere ve gölet her kadrajın görünen çekirdeğindedir. Geniş ekranda iğne çoğu zaman tepenin
doruğuna düşer.

## 2. Ölçü

Kaynak 3.06 KB (küçültülmüş) + yardımcılar 1.13 KB. Halkalar modül yüklenirken üretilir; DOM'da
33.3 KB, 189 öğe. Raster görsel yok.

## 3. Ayrışma

Mezuniyet Pusula'nın antika dünya haritasından farkı: yerel, düz renkli, eskitmesiz; altın yok.
