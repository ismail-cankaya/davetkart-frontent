# `nisan/kitap/NisanKitapKurdele` — "Kurdele"

> **ID:** `nisan-kitap-kurdele` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** iç kapak (nişan yorumu: kesik kurdele) · **Tarih:** 2026-10-22 · dal `design/kitap`

---

## 1. Fikir

Kapak yok: ilk ekran şamua bir başlık sayfası. Kitabın ayraç kurdelesi sayfayı **enine, tam ortadan**
ikiye böler; kurdele kesiktir, kesik uçlar (kırlangıç kuyruğu) birbirine bakar ve aradaki boşlukta
Caslon italik `&` durur — nişanda yüzükleri bağlayan kurdele kesilir, söz kesilir. İlk ad kurdelenin
üstünde, ikinci ad altında. Üst yarıda kullanıcının başlığı, alt yarının dibinde yalnızca gün.

Başlık sayfasının arkası **künye sayfası**dır (gerçek kitapta künye iç kapağın arka yüzündedir):
italik alt metin, yatay matbaa süsü, mekân, tam tarih, geri sayım. Gösterecek bir şey yoksa çizilmez.

| | |
|---|---|
| İlk ekran | Şamua (koyu bez yalnızca zarf açıkken, kapıda) |
| Kapı bezi | `murdum` `#3D2337`, etiket "Nişan Davetiyesi" (düz `BezKapak`) |
| Hero parçaları | `BaslikSayfasi` + [`KurdeleliAdlar`](KurdeleliAdlar.md) + `KunyeSayfasi` |

### Düğünün "İç Kapak"ından farkı (aynı eksen, nişana özgü yerleşim)

| | İç Kapak (düğün) | Kurdele (nişan) |
|---|---|---|
| İlk ekran | Tek sayfada her şey: başlık, adlar, alt metin, süs, künye, sayaç | Yalnızca başlık, adlar, gün — künye arka sayfada |
| Kurdele | Sağ üstten sarkan ayraç (süs, kenarda) | Sayfanın **yatay ekseni**: kenardan kenara, ortadan kesik |
| Adlar | Ortalı yığın, küçük `&` | Kurdelenin iki yanında; `&` kesiğin içinde |
| Süs | Yatay matbaa süsü başlık sayfasında | Süs kurdelenin kendisi; matbaa süsü künye sayfasında |

Gerekçe: nişanın kendine ait bir ritüeli (kurdele kesme) var; kitap kitinin kurdelesi bu ritüeli
düzenin eksenine çevirir. Düğün kimliğinin kurdele **düğümü** (fiyonk) burada yoktur — düz, kesik bir
ayraç şeridi.

## 2. Zarf

Zarf modülü açıkken önce mürdüm bez kapak gelir (`KapakKapisi`, düz `BezKapak`); açılınca başlık
sayfası. Kapalıyken bez hiç yoktur. Önsöz'ün pencereli kapısından farklı yüz: iki nişan preset'i zarflı
ilk ekranda da ayrışır.

## 3. Hareket

Başlık sayfası font beklemesi (≤ 0.4 s) + 0.5 s belirir; kurdele yarıları bitişik başlar, 0.05 s sonra
0.4 s'de açılır, `&` belirir. Ölçüldü (`h1` DOM'a girdikten sonra): sayfa tam opak 829–838 ms, kurdele
açıldı 863–873 ms (360 ve 1280 px) — hero'nun son öğesi ≤ 1.0 s. Künye sayfası görününce 0.4 s.
Kapı 843 ms (360 px) / 873 ms (1280 px) sonra kalkar, 90°'yi 430 ms'de geçer; azaltılmışken 52 ms.

## 4. Erişilebilirlik ve kontrast (çizilmiş ekranda ölçüldü, 2026-10-22)

| Ölçüt | Sonuç |
|---|---|
| Şamua sayfalarda en düşük | 6.17 (`soluk`: gün, alt metin, tam tarih, sayfa başı) |
| Adlar / `&` (kesikte) | 13.64 / 6.82 (`&` kurdelenin üstünde değil, boşlukta) |
| Kapı yaldız / mürdüm (en kötü) | 6.05 |
| AA altı | Yalnızca ortak Galeri sayacı (2.49–4.46) |
| `h1` | Tek: kurdeleli adlar; erişilebilir ad "Gülşen İrem & Mehmet Çağrı" |
| Klavye | Zarflı ilk Tab "Kapağı açın" (158 × 44), Enter kapıyı kaldırır |
| Yatay taşma | Yok: kurdele satırı kabın iki yanından 0.5 em taşar, bölümün `overflow: hidden`'ı keser |
| Görsel | Yeni görsel yok (0 KB) |

## 5. Denenen veri

`dolu`, `uzun` (adlar ikişer satır, kurdele yine ortada), `bos` (ad yok → "Davetlisiniz" ve altında
kesilmemiş tek parça kurdele; künye sayfası yalnızca alt metinle), `kapali`; tek ad (kurdele kesilmez);
sunucu çiziminde her modül tek tek kapalı × dört ad biçimi (duman testi, 0 hata). 360 / 768 / 1280 px;
zarflı ilk ekran.
