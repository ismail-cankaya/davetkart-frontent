# `konsept/kitap/palet.ts` — bezler ve sayfa renkleri

> **Tarih:** 2026-10-17 · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §2](../../../../../tasarim/KITAP-KONSEPTI.md)

---

## 1. Renkler

| Ad | Hex | Rol |
|---|---|---|
| `BEZLER.sise` | `#1F3A2E` | Bez cilt (Düğün · Birinci Bölüm) |
| `BEZLER.sarap` | `#5B1E24` | Bez cilt (Düğün · İç Kapak'ın kapak kapısı) |
| `BEZLER.lacivert` | `#1C2541` | Bez cilt (sonraki kategoriler) |
| `SAYFA.samua` | `#F2EAD3` | İç sayfa zemini |
| `SAYFA.murekkep` | `#231F1A` | Başlık, gövde |
| `SAYFA.soluk` | `#5E5446` | Sayfa başı, ikincil metin, form çerçevesi |
| `SAYFA.kurdele` | `#8C2F2F` | Başharf, ayraç, düğme, bölüm etiketi |
| `SAYFA.kurdeleKoyu` | `#74262A` | Düğme üstüne gelinince |
| `SAYFA.yaldiz` | `#C9A35C` | Yalnızca bez üstünde, düz renk |
| `YAN_KAGIDI` | `#E4D8B8` | Kapağın iç yüzü (yalnızca açılırken görünür, metin yok) |

## 2. Kontrast (formülle hesaplandı; çizilmiş ekran ölçümü tema ve preset kılavuzlarında)

| Çift | Oran |
|---|---|
| mürekkep / şamua | 13.64 |
| soluk / şamua | 6.17 |
| kurdele / şamua · şamua / kurdele | 6.82 |
| şamua / kurdeleKoyu | 8.52 |
| `stone-50` / kurdele (ortak bölümlerin seçili hâli) | 7.85 |
| yaldız / şişe · şarap · lacivert | 5.21 · 5.36 · 6.38 |
| yaldız / bez × 0.737 (dokunun en koyusu) | 6.34 · 6.48 · 7.20 |
| soluk / harita başlığı `#E8DDC0` | 5.48 |

Tailwind dinamik sınıf üretemediği için tema dizgileri hex'leri sabit yazar; bez rengi ise preset'e
göre değiştiğinden `BezYuzey` onu satır içi stille verir.
