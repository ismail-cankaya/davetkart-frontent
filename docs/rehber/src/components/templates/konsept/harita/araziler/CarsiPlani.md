# `konsept/harita/araziler/CarsiPlani.tsx` — şehir planı: çarşı

> **Tarih:** 2026-10-23 · dal `design/harita` · Eksen: [HARITA-KONSEPTI §4.3](../../../../../../tasarim/HARITA-KONSEPTI.md) · İlk kullanan: [Kutlama Hattı](../../../dogum-gunu/harita/DogumGunuHaritaKutlamaHatti/index.md)

---

## 1. Fikir

Şehir planı ekseninin ikinci yorumu. [`SehirPlani`](SehirPlani.md) (Kıyı Kenti) suyla, düzenli ve arazi
renginde ızgarayla kurulur; Çarşı'da su yoktur, yapı adaları **dolu** (`blok`) ve sokaklar düzensizdir.

## 2. Çizim

1200 × 1500 tuval, `slice`. Tonlar: **blok** (zemin), **yol**, **park**, **arazi** (meydan içi).

| Öğe | Nasıl |
|---|---|
| Sokaklar | Tohumlu: hafif eğik yataylar 96–180 aralıkla; dikeyler yataylar arasında parça parça, parçaların ~%22'si atlanır (iki ada birleşir). Tek yol dizgisi, 12 px beyaz + %22 mürekkep kenar |
| Bulvar | Çapraz, 26 px |
| Meydanlar | İki beyaz halkalı daire, içi arazi, ortada anıt halkası |
| Parklar | İki leke + ağaçlar (%30); sokakların üstünde: ızgarayı keser |

DOM'da 16 öğe. Sokak adı yok.

## 3. Ölçü

Kaynak 3.8 KB; DOM'daki SVG 8.6 KB. Perde %80 yeter: bölüm metninin en kötüsü 5.06.

## 4. Telif ve doğruluk

Kurgusaldır; gerçek bir şehir ya da harita sağlayıcısının renk şeması taklit edilmez.
