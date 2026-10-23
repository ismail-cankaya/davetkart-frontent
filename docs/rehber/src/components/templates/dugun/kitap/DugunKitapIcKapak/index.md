# `dugun/kitap/DugunKitapIcKapak` — "İç Kapak"

> **ID:** `dugun-kitap-ic-kapak` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** iç kapak · **Tarih:** 2026-10-17 · güncelleme 2026-10-20 (K7, §11) · dal `design/kitap`

---

## 1. Fikir

Kapak yok: davetiye kitabın **iç kapak sayfası**dır, künye düzeninde. Üstte kullanıcının başlığı
(yazar satırı gibi), ortada adlar (kitabın adı) ve italik alt metin, matbaa süsü; altta yayın yeri ve
yılı yerine mekân ve tarih. Sağ üstten kurdele bir ayraç sarkar. Açık, sade alternatif.

| | |
|---|---|
| İlk ekran | Şamua (koyu bez yalnızca zarf açıkken, kapıda) |
| Kapı bezi | `lacivert` `#1C2541`, etiket "Düğün Davetiyesi" (K7: `sarap` kınanın kapağıdır; aynı konseptte iki kategori aynı kapağı taşımaz) |
| Hero parçası | `IcKapak` (kit) |

"Birinci Bölüm"den farkı renk değil düzen: orada koyu kapak + başharfli ilk sayfa, burada açık bir
başlık sayfası; başharf yok, ayraç ve matbaa süsü var.

## 2. Zarf

Zarf modülü açıkken önce lacivert bez kapak gelir (`KapakKapisi`); açılınca altından başlık
sayfası görünür. Kapalıyken bez hiç yoktur.

## 3. Hareket

Başlık sayfası font beklemesi (≤ 0.4 s) + 0.5 s belirir; ayraç 0.3 s gecikmeyle 0.4 s'de sarkar
(son öğe 0.7 s). Kapak `ease.inOut` ile 0.8 s'de açılır, 90°'yi ~430 ms'de geçer; kapı 832 ms
(360 px) / 835–845 ms (1280 px) sonra kalkar (ölçüldü, 2026-10-20); azaltılmışken 75 ms.

## 4. Erişilebilirlik ve kontrast (ölçüldü, 2026-10-17)

| Ölçüt | Sonuç |
|---|---|
| Hero en düşük | 6.17 (italik alt metin, tarih — `soluk` / şamua) |
| Kapı yaldız / lacivert (en kötü piksel, çizilmiş ekranda) | 6.48 (360 ve 1280 px, `dolu` ve `uzun`; etiket, italik, tarih, "Kapağı açın", adlar) — önce yaldız / şarap 5.50 |
| Alt metin | Sola yaslı + `pretty`, blok en uzun satırına daralıp ortada ([useSikiBlok](../../../konsept/kitap/useSikiBlok.md)) |
| AA altı | Ortak Galeri sayacı (2.49, örnek fotoğraf üstünde) |
| Ayraç | Metin sütununun dışında (360 px'te x 328–342, sütun 40–320) |

## 5. Denenen veri

`dolu`, `uzun`, `bos`, `kapali`; her modül tek tek kapalı (duman testi); 360 / 768 / 1280 px; zarflı
ilk ekran; hareket azaltılmış.
