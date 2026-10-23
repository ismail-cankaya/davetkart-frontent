# `konsept/harita/hareket.ts` — "İğne düşer, rota ilerler"

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (`olcek`, `fontBekleme`, `esnek`) · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §6](../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Tanımlar

`useHaritaHareketi(girisBitti?, olcek?)` üç giriş üretir; hepsi yalnızca `opacity` ve `transform`.

| Ad | Ne | Süre |
|---|---|---|
| `kutu(g)` | Kartuş, lejant: opaklık + y 8 → 0 | 0.4 s |
| `igne(g)` | İğne: y −16 → 0, ölçek 1.2 → 1 (kök alt orta) | 0.35 s |
| `belir(g, s)` | Yalnızca opaklık: rota parçaları, etiket, dipnot, köşe süsü | `s` (vars. 0.3 s) |

`olcek` (0–1], gecikme ve süreleri çarpar. Kapak harita katmanını fontlar gelene dek kurmaz
([HaritaKapak §4.1](HaritaKapak.md)); katman `k` s geç açılırsa çizelgesi `1 − k` ile sıkışır.

| Sabit | Değer | |
|---|---|---|
| `HARITA_SURE.ust` | 1.0 s | Kapakta son öğenin bitişi |
| `HARITA_SURE.esnek` | 0.5 s | Katman bundan geç açılırsa oynamaz, yerinde belirir |
| `HARITA_SURE.fontBekleme` | 6 s | Katman fontları en çok bu kadar bekler, sonra yedek fontla çizer |

## 2. Kapak zaman çizelgesi (s)

kartuş 0–0.40 · lejant 0.12–0.52 · cadde bandı 0.08–0.33 · rota parçaları 0.15 + i × 0.065 (her biri
0.14; son parça 0.88'de biter) · duraklar parçalarıyla (son 0.94) · köşe süsü 0.45–0.75 · iğne
0.55–0.90 · mekân etiketi 0.72–0.97 · dipnot 0.60–0.90.

Katman `k` s geç açıldıysa (k ≤ 0.5) rota, durak, iğne ve etiket zamanları `k + t × (1 − k)` olur;
son öğe `k + 0.97 × (1 − k) < 1.0` s'de biter.

**Ölçüm** (headless Chrome, `h1` DOM'a girdiği andan kapaktaki her öğe tam opak ve yerinde olana
kadar, 16 ms aralıkla): pilotta 927–952 ms; 2026-10-22'de sıcak önbellekte 940–949 ms, soğuk
önbellekte 944–949 ms, zarf açılarak 974 ms. Hareket azaltıldığında 29 ms (hiçbir öğe oynamaz;
harita katmanı fontların önbellekten çözülmesini bekleyip yerinde belirir).

## 3. Hareket azaltıldığında

`initial: false` — hiçbir şey oynamaz, öğe son hâliyle çizilir (yalnızca opaklık da oynamaz).
Haritanın paralaksı da durur ([HaritaSahnesi](HaritaSahnesi.md)).

## 4. `girisBitti`

Kapak 1.0 s sonra `girisBitti`'yi açar; o andan sonra doğan öğe (ör. ekran döndü, rota yeniden
kuruldu) oynamaz, yerinde belirir. Font geç gelince rotanın yeniden kurulması artık beklenen bir yol
değildir: katman fontları bekler ve planı sabitler ([HaritaKapak §4.1](HaritaKapak.md)).
