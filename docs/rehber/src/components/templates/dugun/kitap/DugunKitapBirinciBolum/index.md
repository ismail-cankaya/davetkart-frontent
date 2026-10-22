# `dugun/kitap/DugunKitapBirinciBolum` — "Birinci Bölüm"

> **ID:** `dugun-kitap-birinci-bolum` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** bez cilt · **Tarih:** 2026-10-17 · güncelleme 2026-10-20 (§11) · dal `design/kitap`

---

## 1. Fikir

Düğün, iki kişinin hikâyesinin **birinci bölümü**dür. İlk ekran şişe yeşili bez kapak: yaldız adlar,
üstte `BİRİNCİ BÖLÜM`, altta "Evleniyoruz" ve tarih. Kapağın ardında kitabın ilk sayfası — `BÖLÜM I`,
kullanıcının başlığı, başharfli alt metin, sarmaşık yaprağı, tarih ve mekân, geri sayım, sayfa
numarası. Sonra bölümler şamua üstünde `BÖLÜM II…` diye numaralanır.

| | |
|---|---|
| Bez | `sise` `#1F3A2E` |
| Kapak etiketi | "Birinci Bölüm" (sayfa başının sağ yanı da bu) |
| Hero parçaları | `BezKapak` + `BolumAcilisi` (kit) |

## 2. İki hâl

| Zarf modülü | İlk ekran | Hero |
|---|---|---|
| Kapalı | Bez kapak (tam bir ekran boyu — `useEkranBoyu`) | Kapak + altından ilk sayfa (adlar tekrar edilmez) |
| Açık | Bez kapak **kapı olarak** (`KapakKapisi`, "Kapağı açın") | Yalnızca ilk sayfa; adlar orada `h1` |

Zarf açıkken hero'yu da bez kapak yapmak, kapağı açınca yine aynı kapağı göstermek olurdu.

## 3. Hareket

Zarfsız: kapak içeriği font beklemesi (≤ 0.4 s) + 0.5 s belirme; ilk sayfa görününce 0.4 s.
Zarflı: dokunuş → kapak 0.8 s'de `ease.inOut` ile açılır (90°'yi ~433 ms'de geçer), kapı 830 ms'de
kalkar (ölçüldü, 2026-10-20, 360 px); ilk sayfa kapağın altında 0.5 s'de belirir. Hareket
azaltılmışken kapı anında kalkar.

İlk sayfanın alt metni sola yaslı + `pretty`; blok en uzun satırına daralıp ortada durur
([useSikiBlok](../../../konsept/kitap/useSikiBlok.md); 1280 px'te 45 px'lik sola kayma kalktı).
Sayfa başındaki adlar kullanıcının yazdığı gibidir (büyük harfe çevrilmez; 1280 px'te görüldü).

## 4. Geniş ekran

1280 px'te bez kapak tam ekran; ilk sayfa ve bölümler ortada, ≤ 34 em. Kap ≥ 1024 px'te kapak
ekrandan çıkınca sayfa başları belirir: solda adlar, sağda `BİRİNCİ BÖLÜM`.

## 5. Erişilebilirlik ve kontrast (ölçüldü, 2026-10-17)

| Ölçüt | Sonuç |
|---|---|
| Yaldız / bez (en kötü piksel) | 5.35 (etiket, italik, tarih, "Sayfayı çevirin") |
| Şamua sayfalardaki en düşük | 6.17 |
| AA altı | Ortak Galeri sayacı (2.49, örnek fotoğraf üstünde) |
| `h1` | Tek (zarfsız: kapaktaki adlar; zarflı: ilk sayfadaki adlar) |
| Klavye | İlk Tab "Kapağı açın" (158 × 44), Enter açar |

## 6. Denenen veri

`dolu`, `uzun` (`Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu`, 88 karakterlik mekân, uzun
başlık ve alt metin), `bos` (ad yok → "Davetlisiniz", tarih ve mekân satırları yok), `kapali`; her
modül tek tek kapalı (sunucu çizimi duman testi). 360 / 768 / 1280 px; zarflı ilk ekran; hareket azaltılmış.
