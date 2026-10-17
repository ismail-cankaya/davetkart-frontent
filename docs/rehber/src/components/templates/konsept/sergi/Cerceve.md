# `konsept/sergi/Cerceve.tsx` — paspartulu çerçeve

> **Tarih:** 2026-10-17 · dal `design/sergi` · Kaynak: SERGI-KONSEPTI §5

---

| Prop | Varsayılan | Ne |
|---|---|---|
| `oran` | `4 / 5` | Eserin en/boy oranı |
| `paspartu` | `9` | Paspartu payı, çerçeve genişliğinin yüzdesi (dikeyde de genişliğe göre: eşit pay) |
| `gecikme` | `0` | Asılma gecikmesi (s) |

Yapı: beyaz kutu + `#D6D6D2` kenar + tek yumuşak gölge (`--sg-cerceve-golge`, canlandırılmaz) →
içinde eser kesimi (tek kıl çizgi, `overflow-hidden`). Altın çerçeve, oyma, köşe yuvarlaması yok.

## Hareket

`eserAsilir`: y −10 → 0, döndürme −0.6° → 0, 0.6 s `ease.out`, `origin-top` (çivisinden asılır gibi).
"Hareketi azalt"ta yalnızca opaklık kalır.

## Sınırlar

- Çocuk eser `absolute inset-0` ile kesimi doldurmalı; SVG eserler `slice` ile kırpılır.
- Fotoğraflı eser (galerinin ilk görseli) pilotta kullanılmadı: açık soru (pilot raporu §8).
