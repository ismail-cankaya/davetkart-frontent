# `konsept/harita/rotaGeometri.ts` — eğri ve örnekleme

> **Tarih:** 2026-10-17 · dal `design/harita`

---

Saf hesap, DOM'a dokunmaz.

| İşlev | Ne yapar |
|---|---|
| `egriKur(noktalar)` | Catmull-Rom → kübik Bézier parçaları. Eğri her ara noktadan geçer; uçlarda teğet komşuya bakar |
| `yolDizgisi(parcalar)` | `<path d>` (cadde bandı); koordinatlar 0.1 px'e yuvarlanır |
| `ornekle(parcalar, aralik)` | Her parçayı 48 adımlık kırık çizgiye açar, yay uzunluğunu biriktirir, her `aralik` pikselde bir nokta bırakır; `konum(oran)` yay uzunluğu oranındaki noktayı verir |

Keskin dönüşler (tek noktada ~150°) Catmull-Rom'da "V" bırakır; bu yüzden [rotaPlani](rotaPlani.md)
U dönüşlerini iki ara noktaya yayar.
