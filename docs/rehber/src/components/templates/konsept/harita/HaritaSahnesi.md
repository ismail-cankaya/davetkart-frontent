# `konsept/harita/HaritaSahnesi.tsx` — sabit harita (`renderBackdrop`)

> **Tarih:** 2026-10-17 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.2](../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Katmanlar

1. Arazi zemini.
2. Arazi çizimi (`children`, ör. [`SehirPlani`](araziler/SehirPlani.md)), kadrajın %118'i boyunda.
   Belge ilerledikçe `translateY` 0 → −%14 (paralaks). Hareket azaltıldığında durur.
3. **Perde:** arazi rengi, %80 opak, kapağın alt kenarından başlar ve onunla kayar
   ([baglam](baglam.md)). Kapakta harita tam görünür; bölümlerin altında harita soluktur.

Yalnızca `transform` ve sabit opaklık; degrade ve filtre yok. Bütünü `aria-hidden`.

## 2. Perdenin oranı — ölçüm

Bölüm üst etiketi (rota, 10 px) haritanın en koyu çizilmiş yerinde ölçüldü: mürekkep %50 su üstünde
(tekne, fener, su adı). Bu yüzden haritadaki her süs çizgisi en çok %50 mürekkeptir.

| Perde | Süs çizgisi | Üst etiket (rota) | Gövde (gri) |
|---|---|---|---|
| %78 | %70 (ilk hâl) | 4.24 ✗ | 4.44 ✗ |
| **%80** | **%50** | **4.62 ✓** | **4.84 ✓** |

Başlık (`h2`, mürekkep, büyük) en kötü 9.34.

## 3. Yedek yol

Bağlam yoksa (`HaritaKok` dışında kullanım) perde kapak çıkarken opaklıkla iner (heroExit 0.1–0.85).
Bu yolda kaydırmanın ortasında başlıklar yarım perdeli kalabilir; preset'ler kökü kullanır.
