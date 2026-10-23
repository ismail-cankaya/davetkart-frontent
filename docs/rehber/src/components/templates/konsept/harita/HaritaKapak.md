# `konsept/harita/HaritaKapak.tsx` — harita kapağı (`renderHero`)

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (Aşama 5: K2, font sonrası sabit rota; nişan: `kenar`, `kavsak`, `etiketUstu`) · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.1, §6, §11](../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Fikir

Harita tam ekrandır (arka planda, [HaritaSahnesi](HaritaSahnesi.md)). Bir köşede [kartuş](Kartus.md),
karşı köşede [lejant](Lejant.md); rota ikisinin arasındaki boş alanda kartuşun altından çıkıp iğneye
gider. Ortalı simetri yok.

## 2. Parametreler

| Prop | Değerler | |
|---|---|---|
| `duzen` | `capraz` · `ayna` · `kenar` · `kavsak` | Bkz. §3 ve [rotaPlani](rotaPlani.md) |
| `rota` | `cadde` · `patika` · `kroki` | Bkz. [Rota](Rota.md) |
| `sus` | `kuzey` · `pusula` | Köşe süsü: kuzey oku (beyaz yuvarlakta "K") ya da pusula gülü |
| `olcekEsprisi` | boolean | Dipnotta "1 cm = bir ömür" (konsept başına en çok bir espri — Kıyı Kenti kullandı) |
| `etiketUstu` | metin | Mekân etiketinin üstündeki küçük üretilen satır (krokide "Buradayız"; Barlow Condensed 11 px, büyük harf, rota rengi / beyaz 6.69). Yalnızca mekân varsa çizilir |

## 3. Yerleşim

İki düzen her genişlikte ayrı yerleşimdir (K2: iki preset telefonda da ayrışır).

| | `capraz` (Kıyı Kenti) | `ayna` (Kır Yolu) |
|---|---|---|
| **Dar** (`genisMi` yanlış: telefon, 768 px dikey tablet) | Sütun: kartuş üstte solda (`100% − 3rem`, sağ üstte köşe süsü), arada ≥ 160 px rota alanı, lejant altta sağda; rota yukarıdan S çizerek iner, iğne solda | **Ters sütun** (`flex-col-reverse`): lejant + dipnot üstte sağda, kartuş altta solda; patika kartuşun üst kenarından çıkar, sağda bir kıvrımla **tepeye tırmanır**, iğne üstte (lejantın hemen altında); pusula gülü lejantın altında solda, temsilî harita notunun karşısında |
| **Geniş** (≥ 880 px ve yatay) | Tek satırlık ızgara `27rem \| 1fr \| 22rem`: kartuş sol üst, lejant sağ alt | Aynı ızgara: kartuş sol alt, lejant sağ üst, iğne tepenin doruğunda; pusula sağ altta |

| | `kenar` (Nişan Kroki) | `kavsak` (Nişan Kavuşak) |
|---|---|---|
| **Dar** | Harita **üstte** (ara alan `order-first`, ≥ 160 px), kartuş ve lejant altta tam genişlikte (en çok 27 rem) üst üste: tek bir başlık bloğu; rota kartuşun üst kenarından çıkıp sağ üstteki iğneye tırmanır; kuzey oku sağ üstte | Kartuş üst solda, lejant **alt solda**, iğne sağda; iki kol kartuşun altından çıkıp birleşir; ara alan ≥ 168 px; pusula sağ üstte |
| **Geniş** | İki sütun `1fr \| 25rem`: kartuş ve lejant sağ sütunda üst üste, dikeyde ortada; harita ve iğne solda; kuzey oku sol üstte | Kartuş sol üst, lejant sağ üst — ikisi de **üst satırda**; rota aşağıdaki araziye iner; pusula sol altta |

Sınıflar tek yerde: `yerlesim(duzen, genis, sus)` → kök, kartuş, ara alan, lejant grubu, köşe süsü.

DOM sırası hiçbir düzende değişmez (önce adlar, sonra lejant): ekran okuyucu önce `h1`'i okur;
kapakta odaklanabilen tek öğe lejanttaki "Yol tarifi" bağlantısıdır. `kenar`da görsel sıra
(harita → kartuş → lejant) DOM sırasıyla aynıdır; yalnızca boş ara alan öne alınır.

**Dar `ayna`, 360 × 780 ölçümleri** (2026-10-22, `dugun-harita-kir-yolu`, y px):

| Senaryo | Lejant | Yol tarifi | Temsilî harita | Kartuş | Kapak boyu |
|---|---|---|---|---|---|
| dolu | 20–324 | 263–307 ✓ ilk ekran | 336–347 ✓ | 511–761 | 781 |
| uzun | 20–362 | 301–345 ✓ | 374–385 ✓ | 549–916 (`h1` 609'da başlar) | 936 — uzama kabul (K2) |
| kapalı | 20–203 | 142–186 ✓ | 215–226 ✓ | 510–760 | 780 |
| boş | — (lejant yok) | — (`mapUrl` yok) | 24–35 ✓ | 574–760 | 780 |

Dört senaryoda da rota noktalarının hiçbiri mekân etiketine binmez, hiçbir durak bir kutunun altında
kalmaz (ölçüm: nokta merkezleri × etiket/kutu dikdörtgenleri).

## 4. Ölçüm

Kartuş ve lejant kutusu `offsetLeft/Top/Width/Height` ile okunur (dönüşümden bağımsız: giriş
animasyonu ölçüyü bozmaz). Boyut değişimi `ResizeObserver`, konum değişimi her çizimden sonraki bir
okumayla yakalanır; değer değişmediyse durum aynı nesne kalır, döngü olmaz. Ölçü gelmeden rota
çizilmez; sunucu çiziminde de çizilmez — bilgi kartuş ve lejantta eksiksizdir.

Kapak ayrıca alt kenarının ekrandaki yerini [baglam](baglam.md)'a yazar; perde oradan başlar.

### 4.1 Font geç gelince rota yerinden oynamaz (HARITA-KONSEPTI §6)

Pilotta fontlar (`display=swap`) geç gelince kartuşun boyu değişiyor, rota yeniden ölçülüyor ve iğne
animasyonsuz yer değiştiriyordu (ölçüldü: soğuk önbellek, 360 px, Kıyı Kenti — `h1`'den 410 ms sonra
iğne 36 px yukarı atladı; fontlar 1.5 s geciktirilince 3.55 s'de). Çözüm iki adımlı:

1. **İlk ölçüm son fontlarla yapılır.** Harita katmanı (rota, iğne, mekân etiketi)
   [`haritaFontlari()`](fontlar.md) çözülene kadar kurulmaz; kartuş ve lejant beklemez, yedek fontla
   girer. Fontlar sayfada zaten yüklüyse (zarf açılırken yüklendi, ikinci açılış) beklenmez. Katman
   kapaktan `k` s sonra açılırsa:
   - `k ≤ 0.5` (`HARITA_SURE.esnek`): çizelgesi `1 − k` ile sıkışır, son öğe yine 1.0 s içinde biter;
   - `k > 0.5`: oynamaz, yerinde belirir (giriş penceresi yetmez);
   - fontlar 6 s'de (`fontBekleme`) gelmezse yedek fontla kurulur.
2. **Plan sabitlenir.** İlk plan bir ref'te tutulur; anahtarı kadrajdır (dar ekranda genişlik, genişte
   genişlik × boy). Kutuların boyu sonradan değişirse plan yalnızca [`planGecerli`](rotaPlani.md)
   bozulduğunu söylerse yeniden kurulur (rota başı kartuşun altından çıktı, iğne ya da etiket bir
   kutunun altına girdi). Kadraj değişince (döndürme, pencere) her zaman yeniden kurulur — denendi:
   360 → 1280 → 360'ta iğne 121,369 → 573,226 → 121,369.

Ölçümler (`h1` DOM'a girdiği andan iğnenin her konum değişimi, 16 ms aralık, headless Chrome):

| Durum | İğne | Giriş biter |
|---|---|---|
| Sıcak önbellek — 360 Kıyı Kenti / 1280 Kır Yolu | 50 ms'de bir kez yerleşir, kıpırdamaz | 949 / 940 ms |
| Soğuk önbellek (bu makinede fontlar 0.45–2.3 s) — 360 Kıyı Kenti, iki deneme | 450 ms ve 949 ms'de bir kez yerleşir, kıpırdamaz | 944 / 949 ms |
| Font isteklerine +1.5 s gecikme — 360 Kır Yolu | 3968 ms'de bir kez, animasyonsuz | 3968 ms |
| Zarf açılarak (fontlar zarfta yüklendi) — 1280 Kır Yolu | 0 ms'de, kıpırdamaz | 974 ms |

## 5. Harita katmanı

Rota, iğne ve mekân etiketi kutuların **altında** (z-0) tek katmandadır; bütünü `aria-hidden`
(aynı bilgi lejantta gerçek metin). Mekân etiketi iğnenin yanında beyaz düz dikdörtgendir; dar
ekranda tek satır (`truncate`), genişte en çok iki satır. Kalan genişlik 80 px'ten azsa etiket
çizilmez. `venue` boşsa iğne kalır, etiket olmaz (`etiketUstu` da çizilmez).

## 6. Sınırlar

- Mekân adı kullanıcı metnidir; rehber §3.2 "etiketler büyük harf" der ama veri sözleşmesi harf
  büyüklüğünü değiştirmeyi yasaklar — etiket yazıldığı gibi çizilir.
- Fontlar yavaşsa (> 0.5 s) rota ve iğne giriş animasyonu olmadan, fontlar gelince belirir; 6 s'yi
  aşarsa yedek fontla çizilir ve o hâliyle sabit kalır. Font 6 s'den de geç gelip planı bozarsa
  (iğne lejantın altına girer) rota bir kez, animasyonsuz yeniden kurulur — bilinen tek sıçrama yolu.
- Dar `ayna`da `uzun` senaryoda kartuşun alt yarısı ilk ekranın altına taşar (adlar başlar, tarih
  kaydırınca görünür); lejant, düğme ve not her zaman ilk ekrandadır.

## Doğum günü eki (2026-10-23)

Font bekleme, giriş penceresi ve perde bildirimi [`kapakOrtak.ts`](kapakOrtak.md)'ye taşındı; davranış aynı.
`rotaPlani.ts`'teki `cikis`, `GIZLI`, `Yon` dışa açıldı ([izPlani](izPlani.md) kullanır). Lejantsız kapak:
[`IzKapak`](IzKapak.md).
