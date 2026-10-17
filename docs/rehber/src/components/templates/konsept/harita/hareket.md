# `konsept/harita/hareket.ts` — "İğne düşer, rota ilerler"

> **Tarih:** 2026-10-17 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §6](../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Tanımlar

`useHaritaHareketi(girisBitti?)` üç giriş üretir; hepsi yalnızca `opacity` ve `transform`.

| Ad | Ne | Süre |
|---|---|---|
| `kutu(g)` | Kartuş, lejant: opaklık + y 8 → 0 | 0.4 s |
| `igne(g)` | İğne: y −16 → 0, ölçek 1.2 → 1 (kök alt orta) | 0.35 s |
| `belir(g, s)` | Yalnızca opaklık: rota parçaları, etiket, dipnot, köşe süsü | `s` (vars. 0.3 s) |

## 2. Kapak zaman çizelgesi (s)

kartuş 0–0.40 · lejant 0.12–0.52 · cadde bandı 0.08–0.33 · rota parçaları 0.15 + i × 0.065 (her biri
0.14; son parça 0.88'de biter) · duraklar parçalarıyla (son 0.94) · köşe süsü 0.45–0.75 · iğne
0.55–0.90 · mekân etiketi 0.72–0.97 · dipnot 0.60–0.90.

**Ölçüm** (headless Chrome, `h1` DOM'a girdiği andan kapaktaki her öğe tam opak ve yerinde olana
kadar, 16 ms aralıkla): 927–952 ms (2 preset × 360 / 768 / 1280). Hareket azaltıldığında 1 ms.

## 3. Hareket azaltıldığında

`initial: false` — hiçbir şey oynamaz, öğe son hâliyle çizilir (yalnızca opaklık da oynamaz).
Haritanın paralaksı da durur ([HaritaSahnesi](HaritaSahnesi.md)).

## 4. `girisBitti`

Fontlar geç gelince (`display=swap`) kartuşun boyu değişir, rota yeniden ölçülür, yeni parçalar ve
etiket doğabilir. Kapak 1.0 s sonra `girisBitti`'yi açar; o andan sonra doğan öğe oynamaz, yerinde
belirir. Bu olmadan ilk ölçümlerde giriş soğuk önbellekte 2.5 s'yi aşıyordu.
