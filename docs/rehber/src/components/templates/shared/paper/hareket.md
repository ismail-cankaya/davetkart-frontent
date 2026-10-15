# `shared/paper/hareket.ts` — hareket dili

> **Tarih:** 2026-10-15 · dal `design/kagit` · Kurallar: [KAGIT-KONSEPTI §5](../../../../../tasarim/KAGIT-KONSEPTI.md)

---

Kâğıt kayar, mürekkep belirir, damga basılır. Üç yardımcı, `motion`'a doğrudan yayılacak
`initial / animate / transition` döndürür; eğriler `utils/motion.ts`'ten (`ease.out`).

| Yardımcı | Süre | Canlandırılan |
|---|---|---|
| `kaymaGirisi(gecikme)` | 0.6 s | opaklık, y, döndürme |
| `belirmeGirisi(gecikme)` | 0.45 s | opaklık |
| `basmaGirisi(gecikme, aci)` | 0.24 s | opaklık, ölçek, döndürme |

`KAGIT_SURE.ust = 1.0`: hero'da son öğenin `gecikme + süre` toplamının sınırı.

**Hareketi azalt:** App'teki `MotionConfig reducedMotion="user"` transform'ları atlar; yalnızca
opaklık kalır, öğe yerinde belirir. Sonsuz döngü kullanılmadığı için ayrıca korunacak bir şey yok.
