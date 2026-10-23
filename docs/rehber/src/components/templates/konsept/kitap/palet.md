# `konsept/kitap/palet.ts` — bezler ve sayfa renkleri

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (`murdum`, nişan), 2026-10-23 (`kestane`, doğum günü) · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §2](../../../../../tasarim/KITAP-KONSEPTI.md)

---

## 1. Renkler

| Ad | Hex | Rol |
|---|---|---|
| `BEZLER.sise` | `#1F3A2E` | Bez cilt (Düğün · Birinci Bölüm) |
| `BEZLER.sarap` | `#5B1E24` | Bez cilt — kınanın kapağı (K7) |
| `BEZLER.lacivert` | `#1C2541` | Bez cilt (Düğün · İç Kapak'ın kapak kapısı, K7) |
| `BEZLER.murdum` | `#3D2337` | Bez cilt (Nişan · Önsöz'ün pencereli kapağı ve Kurdele'nin kapak kapısı) — **yeni, rehberde yok** (aşağıda) |
| `BEZLER.kestane` | `#3B2A1E` | Bez cilt (Doğum günü · Masal'ın masal kapağı) — **yeni, rehberde yok** (§4) |
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
| yaldız / şişe · şarap · lacivert · mürdüm · kestane | 5.21 · 5.36 · 6.38 · 5.94 · 5.78 |
| şamua / kestane | 11.38 |
| yaldız / mürekkep (anı defteri kapağı, `DefterKapak`) | 6.92 |
| yaldız / bez × 0.737 (dokunun en koyusu) | 6.34 · 6.48 · 7.20 · 6.89 |
| şamua / mürdüm | 11.70 |
| soluk / harita başlığı `#E8DDC0` | 5.48 |

## 3. Neden `murdum`?

K7 (KITAP-KONSEPTI §11): aynı konseptte iki kategori aynı kapağı taşımaz. Üç bezin üçü de tutuldu
(düğün `sise` + `lacivert`, kına `sarap`), nişana dördüncü bez gerekti. Mürdüm eriği: mora çalan koyu
erik — şarabın kırmızısından ve lacivertin mavisinden ayrı, nişan kataloğunun pudra/lavanta
çizgisine yakın, yaldızla klasik bir cilt rengi. Çizilmiş ekranda yaldız / mürdüm en kötü 6.05
(nişan kılavuzları). Konsept rehberinin §2.1 tablosuna eklenmesi raporda öneri.

## 4. Neden `kestane`?

Dört bezin dördü de bir kategoriye ayrıldı (düğün `sise` + `lacivert`, kına `sarap`, nişan `murdum`;
baby shower için rehber `lacivert`'i öneriyor). Doğum gününün masal kapağına beşinci bez gerekti.
Kestane: sıcak, koyu kahve — eski çocuk kitaplarının bez cildi; öbür dört bezin yeşil, kırmızı, mavi
ve mor tonlarından ayrı. Çizilmiş ekranda yaldız / kestane (dokuyla) en kötü **5.88** (Masal
kılavuzu). Anı defteri kapağı (`DefterKapak`) bez değildir: dokusuz `murekkep` mukavva, yeni renk
istemez. Konsept rehberinin §2.1 tablosuna eklenmesi raporda öneri.

Tailwind dinamik sınıf üretemediği için tema dizgileri hex'leri sabit yazar; bez rengi ise preset'e
göre değiştiğinden `BezYuzey` onu satır içi stille verir.
