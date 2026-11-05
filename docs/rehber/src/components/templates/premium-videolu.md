# Premium sinematik koleksiyon — 10 Gold şablon (Faz 16)

> **Tarih:** 4 Kasım 2026 · **Frontend dalı:** `design/claude-davetiye` · **Backend dalı:** `faz15-desing/claude-davetiye`
> Video boru hattı: [`docs/rehber/scripts/video.md`](../../../scripts/video.md) · Ortak kit: `src/components/templates/shared/sinema/`

Oturum soru sorulamadan yürütüldü; verilen her karar ilgili bölümde **Karar** satırıyla yazılıdır.

---

## 1. Şablonlar

| Id | Kategori | Konsept | İleri teknik |
|---|---|---|---|
| `dugun-saray-kapisi` | Düğün | Mermer sütunlu koridorda ilerleyen kamera, oymalı iki kanatlı kapı ışık sızdırarak açılır; adlar ışığın içinden gelir. | **Bölümler arası video kesmesi:** tek seferlik giriş klibi → görünmez kesmeyle döngü klibi |
| `dugun-yasemin` | Düğün | Ay ışığında bahçe duvarı: sarmaşıklarda nefes alan yaseminler, süzülen taç yapraklar, ateş böcekleri. El yazısı adlar buğudan doğar. | İşaretçiyi izleyen ay ışığı havuzu |
| `dugun-kristal-balo` | Düğün | Karanlık balo salonunda dönen kristal avize, prizmatik ışık lekeleri, bokeh; prizma ışıltılı didone adlar. | **Scroll-scrub video** (kaydırma ↔ `currentTime`, 6 karelik GOP) |
| `nisan-iplik` | Nişan | Mor kadife karanlıkta altın ve gül rengi iki iplik düğüm atar; adların arasında "&" yerine kendini çizen düğüm. | İşaretçinin bıraktığı altın iplik izi (canvas) |
| `kina-al-duvak` | Kına | Karanlıkta süzülen kırmızı tül kanatları, kenar şeridinde altın pullar; açılışta HTML tül kalkar (duvak), kına deseni kendini çizer. | Dokununca altın pul patlaması |
| `sunnet-sehzade` | Sünnet | Otağın içi: kubbeye toplanan al-lacivert dilimler, zincirlerden sarkan delikli pirinç fenerler; açılışta kadife perdeler bağlanır. | Sekiz köşeli yıldız arması (SVG çizim) |
| `dogum-gunu-havai-fisek` | Doğum günü | Gece şehir silüeti, körfeze yansıyan fişekler; 3·2·1 sayımı, alttan ateşlenerek dolan yaş rakamı. | **Video üstünde gerçek zamanlı ışık/parçacık kompozisyonu:** yaşa göre renk ve tempoda kendiliğinden ve dokununca patlayan kuyruklu fişekler |
| `mezuniyet-kep` | Mezuniyet | Gün batımında ağır çekimle havalanan kepler, püsküller, kurdeleler, pul konfeti; arkada dev mezuniyet yılı. | **Scroll-scrub video** + açılışta otomatik ilerleme |
| `baby-ay-besigi` | Baby shower | Pastel alacakaranlıkta kurdelelere asılı hilal beşik gibi sallanır, yıldızlar sarkar, bulut yatağı nefes alır. | Yükselen yıldız tozu (dokunuş) |
| `parti-havuz` | Parti | Üstten gece havuzu: karo zemin, kostik ağı, yüzen LED küreler, kulüp ışığı süpürmeleri. | **Video → canlı WebGL geçişi:** aynı shader canlıda devralır, dokunulan yerde su halkası |

İleri teknik şartı (en az 3): scroll-scrub ×2, video kesmesi ×1, video üstünde gerçek zamanlı
kompozisyon ×1, video → canlı WebGL ×1.

### 1.1 Öneri listesinden sapmalar

Keşifte dört öneri mevcut şablonlara fazla benziyordu; yerlerine özgün konseptler kondu:

| Öneri | Çakışma | Yerine |
|---|---|---|
| `dugun-ipek` (saten kumaş) | `kina-bordo` "Bordo İpek" ve `nisan-sampanya` "Şampanya İpek" zaten ipek videosu | `dugun-yasemin` — Gece Yasemini |
| `nisan-yuzuk` (dönen yüzük) | `nisan-alyans` "Zarif Alyanslar" (sudan yükselen iki alyans) | `nisan-iplik` — Kader İpliği |
| `kina-ates` (tül + mum alevi) | `kina-mum` (mumlu tepsi), `kina-saray` (mum ışığı), `dugun-mum-isigi` | `kina-al-duvak` — Al Duvak (tül kalır, mum çıkar; pul + kına deseni) |
| `parti-gala` (sıvı krom) | `parti-gala` id'si zaten var; sıvı metal `dugun-onyx` videosunda ve `parti-krom`'da | `parti-havuz` — Gece Havuzu |

Kalan altı öneri (saray kapısı, kristal balo, şehzade, havai fişek, kep, ay beşiği) mevcut
şablonlardan yeterince ayrıştı: `kina-saray` kemer+mum, `mezuniyet-kampus` kitap sayfaları,
`sunnet-yildiz` masal şatosu parçacıklarıdır.

## 2. Mimari

### 2.1 Kayıt

- `lazyPresets.ts` → `LAZY_PREMIUM_PRESETS`: her şablon `React.lazy` ile **kendi chunk'ında**.
  Kategori barrel'larına (`dugun/index.ts`) eklenmedi (Yedi Davetiye ile aynı gerekçe).
- `src/data.ts` → katalog girdisi, `minimumTier: 'gold'`, kapak = videonun masaüstü posteri (`videoCover`).
- `scripts/verify-payment.ts` → premium liste 13 + 10 = 23 id olarak kilitli.
- Backend `config/davetkart.php` → `preset_tiers`'a aynı 10 id `'gold'`; `PaywallTest` 23'lük listeyi kilitler.

### 2.2 Ortak sinema kiti (`shared/sinema/`)

| Dosya | İş |
|---|---|
| `CinemaVideo.tsx` | Oynatma: `loop`, `scrub` (kaydırma ↔ `currentTime`, yumuşatılmış hedef, arama bitmeden yeni arama yok, iOS için oynat-durdur kilidi), `intro` (giriş klibi → ana döngüye çapraz geçiş). **Önizlemede (`mode === 'preview'`) ve hareketi azalt'ta video öğesi hiç oluşmaz, yalnızca poster.** Ekran dışında ve sekme gizliyken durur. Poster her zaman en altta (LCP). |
| `CinemaBackdrop.tsx` | `renderBackdrop` sahnesi: video + kaydırmaya bağlı yakınlaşma ve perde (bölümlerin okunabilirliği). |
| `DateCountdown.tsx` | Hero'nun ikinci ekranı: tarih + geri sayım, sınıflarla tamamen şablona bırakılır; tarih yoksa hiç çizilmez. |
| `SplitReveal.tsx` | Harf (grapheme) harf açılış; kelimeler bölünmez, Arapça/İbranice gibi bitişik yazılar kelime kelime açılır (harf bölmek bitişmeyi bozar). |
| `TapBurst.tsx` | Dokunuş patlaması (canvas); düğme ve form alanlarına dokunmak tetiklemez; parçacık yokken kare döngüsü durur; isteğe bağlı kendiliğinden patlama. |
| `LiveShader.tsx` | three.js'siz (~3 kB) tam ekran WebGL katmanı; videoyla aynı shader, video zamanına eşlenir, ilk karede belirir; tek WebGL yuvası kuralına uyar (`canvasSlot`). |
| `useTemplateFont.ts` | Şablona özel Google yazı tipini yalnızca şablon çizilince yükler (`index.css`'e eklenmedi: her sayfa indirirdi). |
| `ScrollCue.tsx` | Kapak altındaki "Kaydırın" çizgisi. |

**Geriye uyumluluk:** `VideoBackdrop` iki küçük değişiklik aldı — kancalar dışa aktarıldı ve
isteğe bağlı `still` prop'u (varsayılan `false`, mevcut 13 şablon etkilenmez). `videoAssets.ts`'e
`clipSet(slug, klip)` eklendi.

**`TemplateRenderer`:** tembel chunk inerken görünen yedek zemin artık şablonun katalog rengini
(`primaryColor`) kullanır; koyu premium şablonlarda bej bir parlama vardı.

### 2.3 Şablon iskeleti

Her şablon `InvitationComposition` + özel `themeOverride` (SectionTheme) + `renderBackdrop`
(CinemaBackdrop) + `renderHero` kullanır. Hero iki ekrandır: **kapak** (adlar, açılış
koreografisi) ve **tarih/geri sayım**. Program, mekân, galeri, hediye ve LCV ortak bölümlerdir;
veri yoksa ya da modül kapalıysa gizlenir (kompozisyonun kuralı). Ad yoksa "Davetlisiniz".

Her şablonun açılışı (ilk 3 sn) farklı bir hareket dili kullanır: tül kalkışı (Al Duvak), perde
bağlanması (Şehzade), 3·2·1 + flaş (Havai Fişek), dalış halkaları + odak (Havuz), anamorfik ışık
çizgisi (Kristal Balo), ışıktan yaklaşan adlar (Saray Kapısı), yaprak yağmuru + buğu (Yasemin),
düğüm çizimi (İplik), tek tek yanan yıldızlar (Ay Beşiği), kaydırma otomatik ilerlemesi (Kep).

### 2.4 Yazı tipleri

| Şablon | Aile |
|---|---|
| Saray Kapısı | Marcellus |
| Gece Yasemini | Pinyon Script (+ Cormorant) |
| Kristal Balo | Bodoni Moda |
| Kader İpliği | Fraunces (italik) |
| Al Duvak | Yeseva One |
| Şehzade Çadırı | Cinzel Decorative + Cinzel |
| Havai Fişek | Syne |
| Kep Atma | DM Serif Display |
| Ay Beşiği | Quicksand |
| Gece Havuzu | Unbounded |

Türkçe harfler (ğ, ş, ı, İ, ç, ö, ü) her biri için ekran görüntüsünde doğrulandı (§5).

**Karar:** adlar kullanıcı metnidir; hiçbir şablon `uppercase` uygulamaz (kompozisyon kuralı).

## 3. Videolar

Tablo, render sonrası `node_modules/.cache/video/<id>/rapor.txt`'den alındı.

| Klip | Varyant | mp4 | webm | poster | CRF (x264 / VP9) |
|---|---|---|---|---|---|
| `dugun-saray-kapisi-giris` | desktop | 1591 KB | 1063 KB | 59 KB (1536 px, q 0.66) | 26 / 34 |
| `dugun-saray-kapisi-giris` | mobile | 787 KB | 879 KB | 59 KB (864 px, q 0.62) | 32 / 37 |
| `dugun-saray-kapisi` | desktop | 1787 KB | 793 KB | 60 KB (1920 px, q 0.58) | 23 / 34 |
| `dugun-saray-kapisi` | mobile | 866 KB | 689 KB | 58 KB (1080 px, q 0.66) | 28 / 34 |
| `dugun-yasemin` | desktop | 1367 KB | 1508 KB | 58 KB (1267 px, q 0.54) | 30 / 41 |
| `dugun-yasemin` | mobile | 584 KB | 715 KB | 59 KB (713 px, q 0.54) | 36 / 49 |
| `dugun-kristal-balo` | desktop | 1636 KB | 1693 KB | 57 KB (1536 px, q 0.54) | 31 / 43 |
| `dugun-kristal-balo` | mobile | 834 KB | 800 KB | 58 KB (713 px, q 0.62) | 40 / 56 |
| `nisan-iplik` | desktop | 1457 KB | 1502 KB | 59 KB (1920 px, q 0.74) | 26 / 34 |
| `nisan-iplik` | mobile | 655 KB | 778 KB | 51 KB (1080 px, q 0.74) | 31 / 39 |
| `kina-al-duvak` | desktop | 1582 KB | 1451 KB | 54 KB (1920 px, q 0.74) | 29 / 34 |
| `kina-al-duvak` | mobile | 827 KB | 714 KB | 43 KB (1080 px, q 0.82) | 31 / 34 |
| `sunnet-sehzade` | desktop | 1623 KB | 719 KB | 59 KB (1920 px, q 0.54) | 23 / 34 |
| `sunnet-sehzade` | mobile | 776 KB | 785 KB | 59 KB (1080 px, q 0.58) | 30 / 34 |
| `dogum-gunu-havai-fisek` | desktop | 1623 KB | 1840 KB | 58 KB (1920 px, q 0.66) | 30 / 34 |
| `dogum-gunu-havai-fisek` | mobile | 859 KB | 847 KB | 60 KB (1080 px, q 0.7) | 39 / 50 |
| `mezuniyet-kep` | desktop | 1745 KB | 1596 KB | 59 KB (1920 px, q 0.58) | 28 / 41 |
| `mezuniyet-kep` | mobile | 829 KB | 808 KB | 57 KB (1080 px, q 0.54) | 35 / 52 |
| `baby-ay-besigi` | desktop | 1611 KB | 367 KB | 48 KB (1920 px, q 0.82) | 23 / 34 |
| `baby-ay-besigi` | mobile | 759 KB | 278 KB | 55 KB (1080 px, q 0.86) | 29 / 34 |
| `parti-havuz` | desktop | 1427 KB | 1794 KB | 56 KB (1536 px, q 0.66) | 31 / 34 |
| `parti-havuz` | mobile | 759 KB | 872 KB | 56 KB (1080 px, q 0.66) | 37 / 38 |

Bütçe: masaüstü mp4 ≤ 1.8 MB, mobil mp4 ≤ 900 KB, poster ≤ 60 KB — **hepsi içinde**. webm yedek
kaynaktır (mp4'ü oynatamayan tarayıcılar); aynı bütçe hedeflenir, VP9 CRF üst sınırı 63'tür.

**Mobil bütçe notu.** Mobil varyant masaüstüyle aynı piksel sayısını (≈2 MP) taşır ama bütçesi
yarısıdır. Statik kameralı sakin sahneler (Ay Beşiği, Saray döngüsü, Şehzade, Al Duvak, İplik)
CRF 28–31'de kaldı. Hareketi bütün kareye yayılan dört sahne daha yüksek CRF'e indi ve **üç
denemeden sonra bu seviyede kabul edildi** (kural: aynı sorun üç kez çözülemezse basitleştir,
not düş, devam et):

| Sahne | Denenenler | Son durum |
|---|---|---|
| Kristal Balo (scrub) | GOP 6 → 12 → 30; titreşim/gren kapalı; ışık noktası 900 → 160; boncuk yarıya; avize dönüşü neredeyse sıfır | mobil CRF 40 — telefonda (≈2.8× küçültülmüş) kristaller temiz |
| Havai Fişek | parçacık sayısı ↓, yumuşak iri sprite, yansıma 1/3 çözünürlükten, 24 fps, gren 0 | mobil CRF 39 — canlı fişek katmanı üstte |
| Gece Havuzu | gren 0.018 → 0.004, 24 fps, kırılma genliği 0.035 → 0.014 | mobil CRF 37 — yetenekli cihazda canlı WebGL devralır |
| Kep Atma (scrub) | GOP 30, titreşim/gren kapalı | mobil CRF 35 |

İyileştirme yolu (yapılmadı, karar gerekli): mobil varyantı 720 × 1280 kodlamak — telefon
ekranında fark edilmez, aynı bütçede CRF ~8 düşer. İş tanımı 1080 × 1920 istediği için uygulanmadı.

## 4. Performans ve paketler

`npm run build` sonrası (`dist/assets`, gzip `gzip -c | wc -c`):

| Parça | Boyut | gzip |
|---|---|---|
| Ana paket (`index-*.js`) | 1 618.9 kB (Faz 15: 1 612; fark katalog girdileri + yedek renk haritası) | 437.5 kB |
| Ortak sinema kiti (`useTemplateFont-*.js`: CinemaVideo, Backdrop, DateCountdown, SplitReveal, ScrollCue) | 6.8 kB | — |
| `TapBurst-*.js` | 2.5 kB | 1.3 kB |
| `parti-havuz` (shader + LiveShader dahil) | 16.4 kB | 7.2 kB |
| `kina-al-duvak` | 7.0 kB | 3.0 kB |
| `sunnet-sehzade` | 6.1 kB | 2.8 kB |
| `dogum-gunu-havai-fisek` | 6.1 kB | 2.9 kB |
| `dugun-kristal-balo` | 5.9 kB | 2.8 kB |
| `nisan-iplik` | 5.8 kB | 2.9 kB |
| `dugun-yasemin` | 5.6 kB | 2.7 kB |
| `dugun-saray-kapisi` | 5.3 kB | 2.4 kB |
| `mezuniyet-kep` | 5.2 kB | 2.5 kB |
| `baby-ay-besigi` | 5.0 kB | 2.5 kB |

- three.js **hiçbir** premium şablonun çalışma anı paketine girmez: sahneler videoya pişirildi;
  tek canlı WebGL (Havuz) ~3 kB'lık ham WebGL koşturucusuyla çizilir.
- Galeride ve editör önizlemesinde video inmez; yalnızca poster (≤ 60 kB).
- Canlı misafir sayfasında yalnızca yöne uygun varyant iner (`mp4` önce, `webm` yedek);
  döngü klipleri `preload="metadata"`, scrub ve giriş klipleri `preload="auto"`.

## 5. Doğrulama

Her şablon commit'inden önce:

- `npm run lint` (tsc), `npm run build`, `npm run verify` — temiz. `verify:payment` premium listeyi
  23 id olarak kilitler; her şablon commit'i yalnızca kendi id'sini ekledi (ara commit'ler de yeşil).
- Playwright (`onizleme.html?preset=<id>&yol=renderer`, dev sunucusu): 1440 × 900 ve 390 × 844'te
  0.6 / 1.8 / 4.5 sn açılış kareleri + hero çıkışı ve bölümler (kaydırılmış iki kare). Konsol
  hatası yok, yatay taşma yok. Görüntüler incelendi; bulunan kusurlar ve düzeltmeleri §5.1'de.
- **Önizleme modu:** `mod=preview` ve `prefers-reduced-motion: reduce` iken sayfada `<video>` 0,
  poster 1 (Al Duvak üzerinde ölçüldü). Canlı modda 1 video.
- **Scrub:** Kristal Balo'da açılış sonrası `currentTime` 1.43 sn (otomatik ilerleme %18),
  kaydırma %30 → 2.38, %60 → 4.76, %100 → 7.94, geri %20 → 1.60 sn.
- **RTL:** `dir="rtl"` + Arapça adlar (`ليلى & عمر`) ile Al Duvak, Gece Havuzu, Şehzade: harfler
  bitişik (SplitReveal kelime modu), taşma yok.
- **Türkçe glifler:** on yazı tipinin hepsinde "Gülşen İrem / Mehmet Çağrı / Yıldırımoğlu" doğru.

Not: ekran görüntüleri video render'ı ile aynı anda alındığı için (CPU paylaşımı) açılış
animasyonları gerçek cihazdan yavaş görünür; 4.5 sn karesinde bazı adlar hâlâ açılıyordu.

### 5.1 İncelemede bulunan ve düzeltilen kusurlar

| Şablon | Kusur | Düzeltme |
|---|---|---|
| Al Duvak | Sağ tül kanadı `-scale-x-100` yüzünden ters yöne kayıp adların üstünde kalıyordu (CSS `scale` motion'ın `x` dönüşümünden önce uygulanır). | Aynalama ayrı degradeyle; dönüşümde ölçek yok. |
| Hepsi | Tembel chunk inerken bej yedek zemin koyu şablonda parlıyordu. | `TemplateFallback` katalog rengini kullanır. |
| Gece Havuzu | 390px'te yatay taşma: açılış halkaları 9× büyüyordu. | Halkalar `overflow-hidden` kapta; aynı önlem fişek flaşı, saray ışık halesi, kristal ışık çizgisine de. |
| Gece Havuzu | Merkezde "gider" gibi halkalar: `THREE.Vector4()` varsayılanı `w = 1` olduğu için boş dokunuş dalgası etkin sayılıyordu. | `new Vector4(0, 0, 0, 0)`. |
| Kader İpliği | Masaüstünde iplik bandı adların üstünden geçiyordu. | Masaüstü varyantında bant yukarı (`cy` 0.27) ve genlik düşük; metin `@3xl`'de aşağıda. |
| Şehzade | Bağlanmış perdeler ikinci ekranın ortasında saçakla bitiyordu. | Perdeler yalnızca ilk ekranda (`h-[100svh]`), saçak kaldırıldı. |
| Al Duvak | Pul parıltılarında kare hale. | `SoftBloomPass` (bkz. `scripts/video.md` §4). |
| Kristal Balo, Havuz, Havai Fişek | Mobil bütçede çok yüksek CRF (blok). | Hareketli kamerada titreşim/gren kapalı, parçacık sayısı düşük ve yumuşak, 24 fps, scrub GOP 12. |

## 6. Açık kalanlar

- [ ] **Gerçek cihazda oynatma ve kare hızı.** SwiftShader'lı kapsayıcıda ölçüldü; iPhone Safari'de
  özellikle scrub (Kristal Balo, Kep) ve Havuz'un canlı WebGL katmanı denenmeli.
- [ ] **iOS Düşük Güç Modu:** sessiz video bile reddedilebilir; poster kalır (tasarlandığı gibi),
  scrub şablonlarında kaydırma sabit poster gösterir. Cihazda doğrulanmadı.
- [ ] **Havuz canlı katmanı:** video nesne-kapla (object-cover) kırpıldığı için canlı shader'ın
  küre konumları geçişte videodan birkaç yüzde kayabilir (1.6 sn'lik çapraz geçişte yumuşak).
- [ ] **Kapak görselleri:** katalog kapağı = videonun masaüstü posteri (yazısız). Yedi Davetiye'deki
  gibi adlı kapak istenirse `public/images/sablonlar/<id>.webp` üretilebilir.
- [ ] **Backend testi koşturulmadı:** kapsayıcıda PHP 8.3, proje ^8.5. PHP 8.5 makinede:
  `php artisan test --filter=PaywallTest` ve `--filter=TemplateCatalogueTest`.
- [ ] **Google Fonts:** şablon yazı tipleri çalışma anında Google'dan iner (uygulamanın mevcut
  `index.css` yaklaşımıyla aynı kaynak). CSP eklenirse `fonts.googleapis.com` / `fonts.gstatic.com`
  izinli olmalı.
- [x] **Yedi Davetiye açık işleri (Holografik rAF görünürlük, Altın Toz üst üste yazı, Mürekkep
  düğmeye dokunma, iOS jiroskop izni):** Faz 15'te kapanmıştı (15.1, 15.5, 15.3, 15.2); bu fazda
  ek iş gerekmedi. Mürekkep'in bağlamı unmount'ta bırakmaması bilinçli (StrictMode).

**Depo boyutu:** 10 şablonun videoları + posterleri git'te toplam **48.6 MB** (12 klip × 2 varyant ×
mp4/webm/poster). Videolar yeniden üretilebilir olduğu için Git LFS ya da CDN'e taşımak düşünülebilir
(*karar gerekli*).

## 7. Commit'ler (Faz 16)

**Frontend** — `design/claude-davetiye`:

| No | İçerik |
|---|---|
| 16.1 | Video boru hattı (`scripts/video/render.mjs`, `lib/`) |
| 16.2 | Al Duvak + ortak sinema kiti, `VideoBackdrop.still`, `clipSet`, yedek zemin rengi |
| 16.3 | Ay Beşiği |
| 16.4 | Şehzade Çadırı |
| 16.5 | Kader İpliği (+ kırık poster gizleme) |
| 16.6 | Gece Yasemini |
| 16.7 | Saray Kapısı (iki klip; giriş kesmesi AbortError düzeltmesi; düz döngüde `preload=metadata`) |
| 16.8 | Kep Atma (scrub GOP = 1 sn, CRF sınırları) |
| 16.9 | Havai Fişek |
| 16.10 | Kristal Balo (degrade metin dolgusu: İ noktası) |
| 16.11 | Cila: Al Duvak yeniden render, üç şablonda degrade metin dolgusu |
| 16.12 | Gece Havuzu (video → canlı WebGL) |
| 16.13 | Bu rehber + `docs/rehber/scripts/video.md` |

Her şablon commit'i kendi videosunu, sahne kaynağını, bileşenini, katalog girdisini ve
`verify-payment` listesindeki kendi id'sini taşır; ara commit'lerin hepsi `lint` + `verify` yeşil.

**Backend** — `faz15-desing/claude-davetiye`: 16.1 `config/davetkart.php` → `preset_tiers` (10 id,
`gold`) + `PaywallTest` 23'lük liste. Başka dosyaya dokunulmadı.

Hiçbir depoda `main`/`release-*` dalına dokunulmadı; PR açılmadı; `--force` kullanılmadı.
