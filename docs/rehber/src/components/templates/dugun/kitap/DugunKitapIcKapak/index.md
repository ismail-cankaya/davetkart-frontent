# `dugun/kitap/DugunKitapIcKapak` — "İç Kapak"

> **ID:** `dugun-kitap-ic-kapak` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** iç kapak · **Tarih:** 2026-10-17 · dal `design/kitap`

---

## 1. Fikir

Kapak yok: davetiye kitabın **iç kapak sayfası**dır, künye düzeninde. Üstte kullanıcının başlığı
(yazar satırı gibi), ortada adlar (kitabın adı) ve italik alt metin, matbaa süsü; altta yayın yeri ve
yılı yerine mekân ve tarih. Sağ üstten kurdele bir ayraç sarkar. Açık, sade alternatif.

| | |
|---|---|
| İlk ekran | Şamua (koyu bez yalnızca zarf açıkken, kapıda) |
| Kapı bezi | `sarap` `#5B1E24`, etiket "Düğün Davetiyesi" |
| Hero parçası | `IcKapak` (kit) |

"Birinci Bölüm"den farkı renk değil düzen: orada koyu kapak + başharfli ilk sayfa, burada açık bir
başlık sayfası; başharf yok, ayraç ve matbaa süsü var.

## 2. Zarf

Zarf modülü açıkken önce şarap rengi bez kapak gelir (`KapakKapisi`); açılınca altından başlık
sayfası görünür. Kapalıyken bez hiç yoktur.

## 3. Hareket

Başlık sayfası font beklemesi (≤ 0.4 s) + 0.5 s belirir; ayraç 0.3 s gecikmeyle 0.4 s'de sarkar
(son öğe 0.7 s). Kapı 828–845 ms'de kalkar (ölçüldü); azaltılmışken 37 ms.

## 4. Erişilebilirlik ve kontrast (ölçüldü, 2026-10-17)

| Ölçüt | Sonuç |
|---|---|
| Hero en düşük | 6.17 (italik alt metin, tarih — `soluk` / şamua) |
| Kapı yaldız / şarap (en kötü piksel) | 5.50 |
| AA altı | Ortak Galeri sayacı (2.49, örnek fotoğraf üstünde) |
| Ayraç | Metin sütununun dışında (360 px'te x 328–342, sütun 40–320) |

## 5. Denenen veri

`dolu`, `uzun`, `bos`, `kapali`; her modül tek tek kapalı (duman testi); 360 / 768 / 1280 px; zarflı
ilk ekran; hareket azaltılmış.
