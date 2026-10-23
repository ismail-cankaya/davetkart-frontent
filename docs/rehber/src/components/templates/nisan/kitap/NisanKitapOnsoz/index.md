# `nisan/kitap/NisanKitapOnsoz` — "Önsöz"

> **ID:** `nisan-kitap-onsoz` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** bez cilt (nişan yorumu: pencereli kapak) · **Tarih:** 2026-10-22 · dal `design/kitap`

---

## 1. Fikir

Nişan hikâyenin önsözüdür: kitap henüz açılmadı, hikâye yalnızca görünüyor. İlk ekran mürdüm bez
kapak; ortasında oval bir **pencere** kesilmiştir ve pencereden ilk sayfa — şamua üstünde mürekkeple
adlar ve sarmaşık yaprağı — görünür. Bezin üstünde yalnızca yaldız etiket `ÖNSÖZ`, italik "Söz Verdik,
Nişanlanıyoruz" ve tarih. Kapağın ardında önsöz sayfası: kullanıcının başlığı, **italik** dizilmiş alt
metin (önsöz başharf almaz), tarih ve mekân, geri sayım, sayfa numarası **i** (kitabın ön sayfaları
küçük Roma rakamıyla numaralanır). Bölümler "Önsöz · II…" diye sürer.

| | |
|---|---|
| Bez | `murdum` `#3D2337` (yeni; K7 — bkz. [palet](../../../konsept/kitap/palet.md)) |
| Kapak etiketi | "Önsöz" (sayfa başının sağ yanı da bu) |
| Hero parçaları | [`PencereliKapak`](PencereliKapak.md) (preset'in) + `BolumAcilisi dizgi="italik"` (kit) |

### Düğünün "Birinci Bölüm"ünden farkı (aynı eksen, nişana özgü yerleşim)

| | Birinci Bölüm (düğün) | Önsöz (nişan) |
|---|---|---|
| Adlar | Bezin üstünde, yaldızla | Kapağın **içinde**, pencereden görünen kâğıtta, mürekkeple |
| Kapağın merkezi | Yaldız ad yığını | Açık oval pencere (koyu zemin + açık delik) |
| İlk sayfa | "Bölüm I", başharfli düz metin, sayfa "1" | "Önsöz", italik başharfsiz metin, sayfa "i" |
| Bölüm etiketleri | Bölüm II… | Önsöz · II… |

Gerekçe: nişan, hikâyenin içine bakılan ama henüz açılmayan andır; pencere bunu düzenle söyler.
Pencere çerçeve değildir — kenarında yaldız ya da çizgi yok, yalnızca kesik (KITAP-KONSEPTI §5).

## 2. İki hâl

| Zarf modülü | İlk ekran | Hero |
|---|---|---|
| Kapalı | Pencereli kapak (tam bir ekran boyu, `useEkranBoyu`), altta "Sayfayı çevirin" | Kapak + altından önsöz sayfası (adlar tekrar edilmez); adlar penceredeki `h1` |
| Açık | Pencereli kapak **kapı olarak** (`KapakKapisi yuz=…`, "Kapağı açın") | Yalnızca önsöz sayfası; adlar orada `h1` |

## 3. Hareket

Zarfsız: kapak içeriği font beklemesi (≤ 0.4 s) + 0.5 s belirme — ölçüldü, `h1` DOM'a girdikten
828 ms sonra tam opak. Önsöz sayfası görününce 0.4 s. Zarflı: kapak `ease.inOut` ile 0.8 s'de açılır
(90°'yi 429 ms'de geçer), kapı 822 ms (360 px) / 828 ms (1280 px) sonra kalkar; azaltılmışken 63 ms.
Pencere kapakla birlikte döner (içindeki adlar kapağa çizilidir; altta gerçek sayfa belirir).

## 4. Erişilebilirlik ve kontrast (çizilmiş ekranda ölçüldü, 2026-10-22)

| Ölçüt | Sonuç |
|---|---|
| Yaldız / mürdüm (en kötü piksel) | 6.05 (etiket, "Sayfayı çevirin"); italik ve tarih 6.13–6.16; kapıda "Kapağı açın" 6.16 |
| Penceredeki adlar / `&` | 13.64 / 6.82 (içe gölge kenarda; metne değmez) |
| Şamua sayfalarda en düşük | 6.17 (`soluk`) |
| AA altı | Yalnızca ortak Galeri sayacı (2.49–4.46, örnek fotoğraf üstünde; K10 ortak dalda) |
| `h1` | Tek (zarfsız: penceredeki adlar; zarflı: önsöz sayfasındaki adlar) |
| Klavye | Zarflı ilk Tab "Kapağı açın" (158 × 44), Enter kapıyı kaldırır |
| Görsel | Yeni görsel yok (0 KB); doku kitin `bez.webp`'i, pencere ve süs CSS/SVG |

## 5. Denenen veri

`dolu`, `uzun` (`Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu` — pencerede 32 px, dört satır
ad, oval uzar; 88 karakterlik mekân), `bos` (pencerede "Davetlisiniz", tarih yok), `kapali`; tek ad
(`& Mehmet Çağrı Yıldırımoğlu` → pencerede tek ad, `&` yok); sunucu çiziminde her modül tek tek
kapalı × dört ad biçimi (duman testi, 0 hata). 360 / 768 / 1280 px; zarflı ilk ekran.
