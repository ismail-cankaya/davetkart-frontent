# `konsept/sergi/hareket.ts` — "ışık yanar, eser asılır"

> **Tarih:** 2026-10-17 · dal `design/sergi` · Kaynak: SERGI-KONSEPTI §6

---

| Ön ayar | Ne | Süre |
|---|---|---|
| `spotYanar(g)` | opaklık 0 → 1 | 0.5 s |
| `eserAsilir(g)` | opaklık, y −10 → 0, döndürme −0.6° → 0, `ease.out` | 0.6 s |
| `etiketBelirir(g = 0.5)` | opaklık | 0.3 s |
| `yaziBelirir(g)` | opaklık, y 12 → 0 | 0.4 s |

Kurallar: yalnızca `transform` ve `opacity`; sonsuz döngü yok; kapakta son öğenin gecikme + süresi
≤ 1.0 s. "Hareketi azalt"ta App'in `MotionConfig reducedMotion="user"`'ı transform'ları atlar,
opaklık kalır.

## Ölçüm (headless Chrome; kapak bağlandıktan sonra bütün canlı öğelerin oturduğu an)

| Preset | 360 | 768 | 1280 | 360 azalt |
|---|---|---|---|---|
| Beyaz Küp (`uzun`) | 888 ms | 892 ms | 886 ms | 887 ms (dönüşüm yok) |
| Duvar Yazısı (`uzun`) | 895 ms | 882 ms | 888 ms | 881 ms (dönüşüm yok) |

İlk ölçümde metin 0.95 s gecikmeyle 996–1006 ms'de oturuyordu (React bağlanma payı ~45 ms); gecikmeler
0.45 / 0.5 s'ye çekildi.

## Sınırlar

- Ortak bölümlerin girişleri 0.9 s, y 24–30 px'tir (§6'daki 0.4 s / 12 px değil); ortak dosyalar
  değiştirilemediği için rapora öneri olarak yazıldı.
