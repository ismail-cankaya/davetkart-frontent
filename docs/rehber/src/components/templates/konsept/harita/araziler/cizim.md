# `konsept/harita/araziler/cizim.ts` — arazi yardımcıları

> **Tarih:** 2026-10-17 · dal `design/harita`

---

Arazi çizimlerinin ortak hesapları. Hepsi tohumludur (her açılışta aynı harita) ve modül yüklenirken
bir kez çalışır; çıktı durağan SVG yol dizgisidir. Çalışma anında filtre, canlandırma yok.

| İşlev | Ne |
|---|---|
| `tohumlu(n)` | mulberry32 — küçük, tekrarlanabilir rastgele sayı |
| `kapaliEgri(noktalar)` | Kapalı Catmull-Rom; koordinatlar tam sayıya yuvarlanır |
| `lekeYolu(leke, olcek, kayma)` | Düzensiz elips: 28 nokta, yarıçap 2./3./5. harmoniklerle bozulur. Eş yükselti halkası (`olcek` < 1, merkez `kayma` kadar kayar) ve orman lekesi bununla çizilir |
| `lekeIciNoktalar(leke, aralik)` | Lekenin içinde titreşimli ızgara: ağaç simgelerinin yeri |

Aynı tohumlu biçim küçültülüp kaydırıldığı için iç içe halkalar birbirini kesmez.

Nokta sayısı 36'dan 28'e, hassasiyet 0.1'den tam sayıya indirildi: kır arazisinin DOM'daki SVG'si
49.9 KB'tan 33.3 KB'a düştü, görünür fark yok.
