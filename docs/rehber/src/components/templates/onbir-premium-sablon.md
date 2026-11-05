# On bir premium şablon (Faz 17)

> **Tarih:** 5 Kasım 2026 · **Frontend dalı:** `ccr-9a346997-bu6gve` · **Backend dalı:** aynı ad
> Kayıt: `src/components/templates/lazyPresets.ts` → `LAZY_ONBIR_PRESETS` · Katalog: `src/data.ts` (`TEMPLATE_PRESETS` sonu)
> Video boru hattı: [`docs/rehber/scripts/video.md`](../../../scripts/video.md)

Mevcut ~360 şablon incelendikten sonra İsmail'e on bir öneri sunuldu ve hepsi onaylandı ("Hepsini yapalım").
Öneri tablosundaki plan önerileri (9 Gold, 2 Standart) olduğu gibi uygulandı.

---

## 1. Şablonlar

| Id | Kategori | Fikir | Teknik | Etkileşim | Plan |
|---|---|---|---|---|---|
| `kurumsal-lansman` | Kurumsal | Konferans sahnesi: truss'tan tarayan başlıklar, dev LED duvar, parlak zeminde yansıma, önde seyirci siluetleri. Etkinlik adı LED duvarda piksel piksel belirir. | Video: **giriş klibi → döngü** (başlıklar sırayla yanar, duvar merkezden açılır; son kare = döngünün ilk karesi). Ad: noktalı maske (`mask-image`) + iki kat ışıma. | Dokunulan yere üstteki başlıktan **takip spotu** döner (yaylı SVG koni + elips). | Gold |
| `kina-bugulu-ayna` | Kına | Gelin hamamı: kubbe filgözlerinden huzmeler, buhar, kemerli niş; nişte pirinç çerçeveli **buğulu ayna**. | Video (hamam) + canvas 2B buğu motoru (`buguMotoru.ts`) + **ön ışık katmanı** videosu (buhar, ışıltı). | Parmakla/imleçle buğu silinir, silinen yerden damla akar, buğu ~14 sn'de geri gelir. "Buğuyu tamamen sil" düğmesi. | Gold |
| `sunnet-ucan-hali` | Sünnet | Alacakaranlıkta kubbeli, minareli bir şehrin üstünde uçan halı; madalyonuna çocuğun adı işlenmiş. | **Scroll-scrub video** (8 sn, kısa GOP): kaydırdıkça şehir paralaksla kayar, gece çöker, ay yükselir, pencereler yanar. Ön ışık katmanı: yıldız tozu. CSS 3B halı, püsküller. | Dokunulan yerden yıldız kayar. | Gold |
| `parti-lazer` | Parti | Sisli çatı katında üç kaynaktan yelpaze lazerler, ızgaralı zemin. Tarih/saat/mekân lazerle havaya "yazılır". | **Video → canlı WebGL** (Gece Havuzu deseni): `lazerShader.ts` hem videoyu üretir hem canlıda devralır. | Lazerler parmağı/imleci yaylı izler (4 sn boşta kalınca videodaki yola döner); dokununca sis flaşı. | Gold |
| `dugun-kelebek` | Düğün | Şafak bahçesi; onlarca kelebek uçar, çiftin adlarının harflerine konar. | **R3F, tek örneklenmiş mesh** (`KelebekSahnesi.tsx`, ayrı chunk). Kanat çırpma vertex shader'da, kanat biçimi ve deseni parça shader'ında (doku yok). Kamera piksel ölçeğinde. | Kelebekler parmağı/imleci izler; dokununca yakındakiler kaçar. Konma noktaları DOM'daki ad satırlarından ölçülür. | Gold |
| `dugun-karanlik-oda` | Düğün | Kırmızı güvenlik lambası altında fotoğraf banyosu. Çiftin **kendi galeri fotoğrafları** önce bembeyaz, sonra düzensizce koyulaşarak belirir; ana kare banyo tepsisinde, adlar polaroidin altına elle yazılmış. | CSS `filter` (`--dev` değişkeni) + iki kimyasal leke katmanı + SVG gren; tek rAF döngüsü. Galeri kapalı/boşsa CSS degradesiyle çizilmiş atmosfer kareleri. | İpteki kareler sürüklenince **yaylı sarkaç** gibi sallanır; telefonu **sallamak** kareleri savurur ve banyoyu hızlandırır (`useDeviceMotion`). | Gold |
| `nisan-koi` | Nişan | Nilüferli gece havuzu; kohaku ve altın iki koi birbirinin kuyruğunu kovalayarak yin-yang biçiminde döner. | **Tek tam ekran shader** (`koiShader.ts`): çakıl dibi, kostik, gövde = omurga segmentlerine uzaklık, çatal kuyruk, gölge, nilüfer. Omurga CPU'da zincir takibiyle (`koiSim.ts`). | Suya dokununca halka yayılır ve **yem düşer**: en yakın balık döner, hızlanır, yer. | Gold |
| `parti-kokteyl` | Parti | Bar ışıklarının önünde kristal bardak; açılışta sıvı dökülür, buzlar yüzer, kabarcıklar yükselir; bardağa baş harfler kazınmış. | Tam ekran shader (`kokteylShader.ts`): camdan **kırılan bokeh**, dalgalı sıvı yüzeyi, buz SDF'leri, pipet, narenciye. Yaylı çalkalanma CPU'da. | Telefon **eğilince** sıvı çalkalanır (masaüstünde imleç), sallayınca dalgalanır; dokununca buzlar tokuşur, ağızda ışıltı. | Gold |
| `mezuniyet-yillik` | Mezuniyet | Lacivert deri kapaklı, altın varaklı yıllık: portre, tören bilgisi + damga, galeri kolajı, kendiliğinden yazılan arkadaş imzaları. | **CSS 3B kıvrılan sayfa** (`KivrilanSayfa.tsx`): sayfa 6 şeride bölünür, her şerit bir öncekinin ucuna menteşeli; çevirme ortasında kâğıt bükülür. | Sayfa parmakla sola çekilerek çevrilir (geri de); oklar ve ←/→ tuşları. | Gold |
| `dogum-gunu-surpriz-makinesi` | Doğum günü | Retro kapsül makinesi. | Canvas 2B fizik (`makineMotoru.ts`): 18 kapsül, sabit 1/120 sn adım, çeper ve kapsül çarpışması; durunca döngü uyur. | Kol çevrilince kapsül hazneye düşer, dokununca açılır ve bir bilgi kartı verir (tarih, saat, yer, program, sürpriz). Telefon **eğilince** kapsüller yuvarlanır. | Standart |
| `baby-kazi-kazan` | Baby shower | Pastel kartta altın simli kazı alanları: kimin için, ne zaman, ve sürpriz. | Canvas 2B kaplama + seyrek örneklemeyle açılma oranı (`kaziMotoru.ts`); sayfa üstü ikinci tuvalde sim kırıntıları ve konfeti. | Kazıdıkça kırıntı dökülür; %50 açılınca kaplama düşer; hepsi açılınca konfeti. "Hepsini birden aç". | Standart |

> **Sürpriz satırı:** cinsiyet için ayrı bir alan yok. Kazı kazanın üçüncü alanı **alt metni** (`subtitle`)
> gösterir; kullanıcı "Bir kız bebek geliyor!" gibi bir cümle yazarak cinsiyet açıklaması yapabilir.

## 2. Yeni ortak parçalar

| Dosya | İş |
|---|---|
| `shared/three/useDeviceMotion.ts` | Yerçekimi yönü (`gx`, `gy`), sönümlü sallama enerjisi (`shake`) ve sallama geri çağrısı. Değerler ref'te; yeniden çizim yok. iOS'un ters eksen işareti düzeltilir. |
| `shared/three/GyroButton.tsx` | Artık aynı dokunuşla **hem yön hem hareket** iznini ister (iOS 13+). Mevcut kullananlar etkilenmez. |
| `shared/sinema/LightLayer.tsx` | Siyah zemin üzerine üretilmiş ışık videosunu (buhar, toz) ekran harmanıyla bindirir. |
| `InvitationComposition` → `renderForeground` | 🔴 Kaydırma kabının **önünde**, kökün doğrudan çocuğu olan, `mix-blend-mode: screen` ile harmanlanan ön plan kabı. İsteğe bağlı; verilmezse hiçbir şablon etkilenmez. |

**Neden `renderForeground`?** İlk denemede ışık katmanı hero'nun içine kondu: kaydırma kabı `z-10` ile kendi
katman bağlamını kurduğu için harman arkadaki videoyu değil **boşluğu** gördü ve klip siyah bir perde gibi
sahneyi kararttı (ekran görüntüsüyle yakalandı). Harmanın videoyu ve metni görebilmesi için katman kökte,
kaydırma kabının kardeşi olmalı.

**Neden gerçek alfa kanallı video değil?** VP9 alfayı Safari, HEVC alfayı Chrome oynatmaz; tek dosyayla
taşınabilir değil. Buhar, ışık ve parıltı gibi efektler ekleyerek parladığı için ekran harmanı bunlarda
birebir doğru sonuç verir ve H.264 donanım çözücüsünü kullanır. Koyu bir nesneyi öne bindirmek için uygun değildir.

## 3. Videolar

`node scripts/video/render.mjs <id> [--clip <ad>]` · çıktılar `public/videos/templates/<id>/`.

| Klip | Süre / fps | Masaüstü mp4 | Mobil mp4 | Not |
|---|---|---|---|---|
| `kurumsal-lansman-giris` | 4,5 sn / 24 | 1568 KB | 794 KB | tek sefer |
| `kurumsal-lansman` | 12 sn / 24, döngü | 1491 KB | 827 KB | LED ızgarası yüksek frekanslı: poster 960 px / q 0,5'e indi |
| `kina-bugulu-ayna` | 12 sn / 24, döngü | 1587 KB | 770 KB | yükselen buhar: iki gürültü katmanı çapraz harmanla döner |
| `kina-bugulu-ayna-on` | 12 sn / 24, döngü | 1268 KB | 863 KB | ön ışık katmanı |
| `sunnet-ucan-hali` | 8 sn / 30, scrub | 1834 KB | 891 KB | kare = kaydırma ilerlemesi |
| `sunnet-ucan-hali-on` | 10 sn / 24, döngü | 366 KB | 507 KB | ön ışık katmanı |
| `parti-lazer` | 8 sn / 24, döngü | 1780 KB | 835 KB | mobil CRF 42'ye çıktı (bütçe); canlıda shader devralır |

## 4. Kurallar (on birinde de)

- **Desen:** `InvitationComposition` + kendi `SectionTheme`'i + kategori flavor'ından türetilmiş flavor +
  `renderBackdrop` / `renderHero` (+ gerekiyorsa `renderForeground`). Program, mekân, galeri, hediye ve LCV ortak bölümlerdir.
- **Önizleme (`mode === 'preview'`) ve "hareketi azalt":** video oluşmaz (poster), WebGL açılmaz, rAF döngüsü yoktur;
  her şablonun durağan bir son karesi vardır (SVG koi havuzu, SVG bardak, SVG kelebekler, açık kartlar, banyosu bitmiş kareler…).
- **WebGL:** shader'lar GLSL ES 1.0 (WebGL1) uyumlu. Koi'de uniform dizisi fonksiyon parametresiyle indekslenmez,
  önce yerel diziye kopyalanır (ES 1.0 Ek A). Sayfa başına tek WebGL yuvası kuralı (`canvasSlot`) korunur.
- **Mobil:** 390 px öncelikli; sürüklenen yüzeyler `touch-action: pan-y` (dikey kaydırma çalışır).
- **Erişilebilirlik:** canvas'lar `aria-hidden`; altta kalan metin gerçek DOM'dur (buğulu ayna, kazı kazan, yıllık).
  Her etkileşimin düğmeli bir karşılığı var ("Buğuyu tamamen sil", "Hepsini birden aç/göster", sayfa okları, kol bir `<button>`).

## 5. Öneriden sapmalar

| Öneri | Uygulanan | Neden |
|---|---|---|
| Karanlık Oda'da banyo "WebGL efektiyle" | CSS `filter` + leke katmanları | Galeri fotoğrafları başka bir kökenden gelir; WebGL dokusuna yüklemek CORS başlığı ister. CSS filtreleri GPU'da çalışır ve görüntü aynı. |
| Yıllık'ta "WebGL sayfa kıvrılması" | 6 şeritli CSS 3B kıvrım | Aynı CORS sorunu; ayrıca sayfa içeriği gerçek DOM kalır (seçilebilir, ekran okuyucu okur). |
| Ön katmanlar için "şeffaf video" | Ekran harmanlı ışık videosu | Bkz. §2. |

## 6. Kapaklar

Videolu dördünün kapağı videonun masaüstü posteridir (`videoCover`). Videosuz yedisi için
`public/images/sablonlar/<id>.webp` (640×640) **canlı ekrandan** alındı (Playwright, SwiftShader WebGL);
önceki turların geçici düz SVG'leri gibi değil.

## 7. Doğrulama

- `npm run lint`, `npm run build`, `npm run verify` (render dahil) geçti; `verify:payment` premium listeyi 32 kimlik olarak kilitler.
- Her şablon 390 px'te (bir kısmı 1280 px'te de) ekran görüntüsüyle denendi: kazıma, kol çevirme, sayfa çevirme,
  sürükleme, dokunma Playwright ile sürüldü.
- Backend: `config/davetkart.php` → `preset_tiers` +9; `PaywallTest` 32 kimlik; `TemplateCatalogueTest` Faz 17 bölümü.
  **Backend testleri bu ortamda çalıştırılamadı** (PHP 8.3; proje `^8.5`), yalnızca `php -l`.

## 8. Bilinen sınırlar

- **Gerçek cihazda denenmedi.** Özellikle iOS Safari'de hareket izni (`GyroButton`), `devicemotion` eksenleri ve
  sallama eşiği (14 m/s²) gerçek telefonda ayarlanmalı.
- **Kelebek:** konma noktaları ad satırlarının üst kenarından ölçülür; çok uzun adlarda kelebekler sık durabilir.
  Hareket dekoratiftir, klavye karşılığı yok.
- **Koi / Kokteyl / Lazer:** WebGL yoksa durağan görünüm; Koi ve Kokteyl'de video yedeği yoktur (gerekmedi).
- **Kokteyl:** bardak hero yüksekliğine göre ölçeklenir; geniş masaüstünde görece küçük kalır.
- **Yıllık:** imza notları sabit metindir (veriden gelmez). Sayfaların arkası boş kâğıttır; çevrilen sayfa gizlenir.
- **Sürpriz Makinesi:** kartlar sabit sırayla çıkar (tarih → saat → yer → program → sürpriz).
- **Lansman:** LED ızgarası yüksek frekanslı; mobil döngü CRF 39'da, poster düşük kalitede.
