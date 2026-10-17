# `konsept/kitap/hareket.ts` — kapak açılır, sayfa çevrilir

> **Tarih:** 2026-10-17 · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §6](../../../../../tasarim/KITAP-KONSEPTI.md)

---

| Sabit / kalıp | Süre | Nerede |
|---|---|---|
| `KITAP_SURE.kapak` | 0.8 s, `ease.out` | `KapakKapisi`: `rotateY` 0 → −160° |
| `kapakBelirir(hazir)` | 0.5 s | Opaklık + ölçek 0.98 → 1; `hazir` yanlışken bekler (font) |
| `ayracSarkar` | 0.4 s, 0.3 s gecikme | `Ayrac`: y −100% → 0 |
| `bolumGirisi` | 0.4 s, bir kez | Hero'nun kapak altındaki sayfası: opaklık + y 10 → 0 |

Yalnızca `transform` ve `opacity`. Hero'da son öğe: ayraç 0.3 + 0.4 = 0.7 s; kapak içeriği font
beklemesiyle en geç 0.4 + 0.5 = 0.9 s.

"Hareketi azalt": App'in (ve önizlemenin) `MotionConfig reducedMotion="user"`'ı transform'ları
atlar, opaklık kalır. Kapak kapısı kendi kısa yolunu kullanır (dokunuş → anında kalkar).
