# `konsept/kitap/doku.ts` · `doku/bez.webp` — bez cilt dokusu

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

## 1. Dosya

| Dosya | Boyut | Ne | Nasıl kullanılır |
|---|---|---|---|
| `bez.webp` | 2.5 KB | 192 px gri döşeme, 4 px adımlı düz dokuma | Bez rengiyle `background-blend-mode: multiply` |

Kitin toplam görsel bütçesi 40 KB; kullanılan 2.5 KB.

## 2. Nasıl üretildi?

`scripts/temalar/kagit-dokulari.ts` ile aynı yöntem: headless Chrome canvas'ı, sabit tohum,
periyodik değer gürültüsü → WebP (kalite 0.72). Kitin ajanı `scripts/`'e yazamadığı için üretici
depoya girmedi; önerilen yeri `scripts/temalar/kitap-bez.ts` (kaynak, pilot raporunda).

Tarif:

- Her kesişimde çözgü ya da atkı üsttedir (`(x + y) % 2`); üstteki iplik ortasında açık, kenarında
  koyu (`sin(π·u)`), karşı yönde `0.7 + 0.3·sin`.
- İplik başına ton (0.9–1.0), boy boyu seyrek kalınlaşma (slub, 12 hücreli gürültü), iki katlı
  bulutlanma (3 ve 8 hücre) ve ince tanecik.
- Değer `0.76 + 0.24 × dokuma`, sonra bulutlanmayla çarpılır. Tohum 41.

Ölçülen dağılım: en koyu 0.737 · %1 0.753 · ortalama 0.835 · %99 0.941 · en açık 0.973.

## 3. Kontrasta etkisi

`multiply` yalnızca koyulaştırır ve en açık değer 0.973'tür: bezin hiçbir noktası adlandırılan bez
renginden açık değildir; üstündeki yaldızın oranı en kötü noktada bile tablodaki değerin altına inmez
(şişe 5.21 → doku üstünde ölçülen en düşük 5.35).

## 4. Sınırlar

- 192 px'te tekrar eder; dokuma ve düşük kontrast tekrarı gizler.
- Yüksek yoğunluklu ekranda (DPR 3) döşeme büyütülür, dokuma yumuşar; bez hissi kalır.
