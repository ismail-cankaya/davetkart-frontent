# `src/components/templates/sunnet/parts/NazarRings.tsx` — Soyut nazar boncuğu

> **Kullananlar:** `SunnetModern` (iki örnek: sağ üst, sol alt `reverse`)
> **Denetim:** statik önizleme 360 px

---

## 1. Ne

Nazar boncuğunun iri, soyut hâli. Halkalar boncuğun gerçek sırasıyla:
saten mavi `#dfe6fb` → beyaz → turkuaz (%55) → lacivert göz bebeği → ışık
noktası. Çevresinde kesikli iki yörünge çok yavaş döner (140 / 190 s,
`reverse` ile ters yön).

## 2. Yerleşim

Kare SVG (`viewBox -50 -50 100 100`), genişlik yüzde ile verilir, yükseklik
orandan gelir. Modern'de köşelere taşırılır:

| Örnek | 360 px | @md |
|---|---|---|
| Sağ üst | `w-[64%] -top-[12%] -right-[22%]` | `w-[46%] -top-[22%] -right-[12%]` |
| Sol alt | `w-[44%] -bottom-[8%] -left-[20%]` | `w-[30%] -left-[8%]` |

360 px'te sağ üst boncuğun sol kenarı sorguç hizasında ~x 245'tedir; süs
(x 156–204) ve kuşak (y ~150+) ile çakışmaz (statik önizlemede doğrulandı).

## 3. Hareketi azalt

Yörünge `sunnet-spin` → `@media` + `data-atmosphere` ile durur; halkalar yerinde kalır.
