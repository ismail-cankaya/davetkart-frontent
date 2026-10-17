# `konsept/harita/Rota.tsx` — noktalı rota ve duraklar

> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Çizim

Ara noktalar [`egriKur`](rotaGeometri.md) ile yumuşak bir eğriye, eğri `ornekle` ile eşit aralıklı
noktalara açılır. SVG, kapağın piksel boyutundadır (viewBox = ölçü): noktalar her genişlikte yuvarlak.

| Stil | Görünüş | Grafik kontrastı |
|---|---|---|
| `cadde` | Beyaz bant (13 px) + ince mürekkep kenar; üstünde 11 px arayla `rotaAcik` noktalar | nokta / beyaz 4.96 |
| `patika` | Bant yok; her noktanın arazi renginde 2.6 px halkası, 10 px aralık | nokta / halka 4.31 |

Duraklar: beyaz daire (r 14), rota kontur, içinde 16 px [simge](simgeler.md) ya da sıra numarası
(Barlow Condensed 600). Yerleri yay uzunluğunun ilk üçte ikisinde eşit aralıklı
([`durakOranlari`](rotaPlani.md)); son parça iğneye ve etiketine kalır.

## 2. Hareket

Noktalar on parçaya bölünür; her parça yalnızca **opaklıkla** ve sırayla belirir (`pathLength` ya da
`stroke-dashoffset` yok). Durak, içinde durduğu parçayla birlikte belirir. Zamanlar
[hareket](hareket.md)'te.
