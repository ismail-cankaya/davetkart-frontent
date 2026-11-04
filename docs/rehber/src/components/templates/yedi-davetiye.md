# Yedi Davetiye — konsept şablonlarının kaydı ve yedi yeni düğün şablonu

> **Dal:** `design/yedi-davetiye` (`faz-14-account-settings` üzerinden) · **Tarih:** 2026-11-04

Bu rehber iki işi anlatır:

- **A.** Diskte yazılı olup hiçbir yere kaydedilmemiş 18 konsept şablonunun (Kitap · Harita · Sergi)
  canlıya alınması.
- **B.** Yedi yeni, animasyonlu düğün şablonu ve onların ortak 3D altyapısı.

Oturum boyunca soru sorulamadığı için verilen kararlar ilgili bölümün **Karar** satırlarında yazılıdır.

---

## A. Konsept şablonlarının kaydı

### A.1 Kaydedilen şablonlar

Id'ler uydurulmadı: hepsi bileşenlerin kendi rehberlerinde (`docs/rehber/src/components/templates/<kategori>/<konsept>/…`)
ve `KONSEPT-ORTAK.md §3` kimlik kuralında (`<önek>-<slug>-<ad>`) önceden belirlenmişti.

| Id | Bileşen | Katalog adı |
|---|---|---|
| `dugun-kitap-birinci-bolum` | `DugunKitapBirinciBolum` | Kitap — Birinci Bölüm |
| `dugun-kitap-ic-kapak` | `DugunKitapIcKapak` | Kitap — İç Kapak |
| `dugun-harita-kir-yolu` | `DugunHaritaKirYolu` | Harita — Kır Yolu |
| `dugun-harita-kiyi-kenti` | `DugunHaritaKiyiKenti` | Harita — Kıyı Kenti |
| `dugun-sergi-beyaz-kup` | `DugunSergiBeyazKup` | Sergi — Beyaz Küp |
| `dugun-sergi-duvar-yazisi` | `DugunSergiDuvarYazisi` | Sergi — Duvar Yazısı |
| `nisan-kitap-kurdele` | `NisanKitapKurdele` | Kitap — Kesik Kurdele |
| `nisan-kitap-onsoz` | `NisanKitapOnsoz` | Kitap — Önsöz |
| `nisan-harita-kavusak` | `NisanHaritaKavusak` | Harita — Kavuşak |
| `nisan-harita-kroki` | `NisanHaritaKroki` | Harita — Mahalle Krokisi |
| `nisan-sergi-bir-omur` | `NisanSergiBirOmur` | Sergi — Bir Ömür |
| `nisan-sergi-diptik` | `NisanSergiDiptik` | Sergi — Diptik |
| `dogum-gunu-kitap-masal` | `DogumGunuKitapMasal` | Kitap — Masal |
| `dogum-gunu-kitap-yeni-bolum` | `DogumGunuKitapYeniBolum` | Kitap — Yeni Bölüm |
| `dogum-gunu-harita-hazine-avi` | `DogumGunuHaritaHazineAvi` | Harita — Hazine Avı |
| `dogum-gunu-harita-kutlama-hatti` | `DogumGunuHaritaKutlamaHatti` | Harita — Kutlama Hattı |
| `dogum-gunu-sergi-devam-eden` | `DogumGunuSergiDevamEden` | Sergi — Devam Eden |
| `dogum-gunu-sergi-retrospektif` | `DogumGunuSergiRetrospektif` | Sergi — Retrospektif |

Kaydedilmeyen şablon yok: 18'inin hepsi çalışır durumdaydı.

### A.2 Nasıl kaydedildi

- **`src/components/templates/lazyPresets.ts`** — yeni dosya. Her konsept barrel'ı
  (`dugun/kitap`, `nisan/harita`, …) `React.lazy` ile ayrı chunk olarak yüklenir. `fromBarrel(load, ad)`
  adlandırılmış dışa aktarımı `default`'a çevirir; tip `Record<K, ComponentType<TemplateProps>>` olduğu
  için yanlış bileşen adı derleme hatası verir.
- **`TemplateRenderer.tsx`** — `THEME_PRESETS` sonuna `...LAZY_KONSEPT_PRESETS`; şablon `Suspense`
  içinde çizilir (yedek: tam ekran, sessiz şamua zemin `TemplateFallback`). Eski, eager şablonlar için
  Suspense etkisizdir.
- **`src/data.ts`** — 18 katalog girdisi (kategori başına `categories: ['dugun' | 'nisan' | 'dogum-gunu']`).
  Renkler konseptlerin kendi paletlerinden alındı (`konsept/kitap/palet.ts` bezleri, `konsept/harita/palet.ts`,
  `konsept/sergi/palet.ts` eser renkleri). `imageUrl: ''` — kod tabanlı şablon; `TemplateCover` kapağı
  kartın degradesiyle çizer (bkz. `TemplateCover` durum 3). Tailwind sınıfları literal yazıldı.

**Karar — kategori barrel'ları (`dugun/index.ts`) değiştirilmedi.** İş tanımı "kategori `index.ts`
dışa aktarımlarına ekle" diyordu; ancak `TemplateRenderer` kategori barrel'ını statik içe aktarır.
Konsept barrel'ı oraya `export *` ile bağlansaydı Rollup modülü ana pakete koyar, `React.lazy` ayrı
chunk üretemezdi (aynı modül hem statik hem dinamik içe aktarılmış olur). Konsept barrel'ları zaten
vardı (`<kategori>/<konsept>/index.ts`); tembel kayıt onları doğrudan hedefler. `scripts/onizleme`
de aynı barrel'ları kullanır.

**LCV:** Bu şablonlar (ve depodaki bütün şablonlar) LCV'yi `InvitationComposition` içindeki satır içi
`RSVPForm` ile alır; `onRsvpClick` hiçbir mevcut şablonda kullanılmıyor. Davranış korunmuştur.

### A.3 Doğrulama

- `scripts/verify-render.tsx` — misafir sayfası artık `prerenderToNodeStream` ile çizilir (Suspense
  çözülür, tembel şablonlar da tam HTML'e döner). Yeni bölüm **"Tembel şablonlar: kayıt ve veri"**:
  her tembel şablon katalogda mı; dolu veride adlar ve mekân çiziliyor mu; boş veride (ad, tarih,
  mekân, program, fotoğraf yok) çizim kırılıyor mu. Toplam süre ~4 s.
- Playwright (dev sunucusu, `onizleme.html?preset=…&mod=live`), 390 × 844 ve 1440 × 900, `dolu` ve
  `bos` senaryoları: konsol hatası yok, yatay taşma yok. Boş senaryoda adların yerine "Davetlisiniz",
  program ve galeri bölümleri gizli.
- Ana paket: 1 586 kB → 1 594 kB (katalog girdileri + kayıt). Konsept kodu ayrı chunk'larda
  (en büyüğü ~10 kB, ortak kit chunk'ları ayrı).

Eksik/yarım parça bulunmadı: TODO yok, sabit örnek metin yok, mobilde taşma yok.

---

## B. Yedi yeni düğün şablonu

### B.0 Fikir denetimi (mevcut şablonlarla çakışma)

| Fikir | Yakın mevcut şablon | Karar |
|---|---|---|
| Kitap Sayfaları | Konsept "Kitap" (A bölümü) | Tutuldu. Kitap konsepti dikey kaydırmalı bir sayfadır; burada asıl deneyim **sayfa çevirme**. Yalnızca kitin fontu, bez dokusu ve `KITAP_TEMASI` paylaşılır. |
| 3D Gül Bahçesi | `dugun-gul-yapraklari` (videolu) | Tutuldu: video değil, gerçek zamanlı prosedürel 3B. |
| Mürekkep & Su | `*-ebru` | Tutuldu. Ebru yüzeyde desenleşen boyadır (SVG filtre, durağan bitmap); burada suyun **içinde** açılan hacimli bulut (shader, zamanla değişen). Renk dili de ayrı: lacivert/siyah mürekkep, şarap rengi kenar. |
| Holografik Cam | `*-aurora` ("Sedef") | Tutuldu. Sedef akan bir arka plan; holografik cam **eğimle tepki veren tek kart** (parlama ve renk açısı işaretçi/jiroskopla). |
| Dilek Fenerleri | `*-yildiz-haritasi`, `*-ufuk` | Tutuldu: gece göğü ortak, ama fenerler 3B, yükselen, kamera kaydırmayla tırmanıyor. |
| Pop-up Kart, Altın Toz | — | Benzeri yok. |

Değiştirilen fikir yok.

### B.1 Ortak altyapı

**`shared/three/`** (three.js İÇERMEYEN barrel + yalnızca sahne chunk'larından alınan `SceneCanvas`):

| Dosya | Görev |
|---|---|
| `ThreeStage.tsx` | Kapı: yalnızca istemcide, WebGL varsa, cihaz çok zayıf değilse (`saveData`, ≤1 GB bellek, ≤2 çekirdek) ve sayfadaki **tek Canvas yuvası** boşsa sahneyi açar. Statik/2D yedek her zaman altta çizilir; sahnenin ilk karesi gelince (`onReady`) söner, bağlam kaybı ya da hata (`onFail`, hata sınırı) olursa geri gelir. |
| `canvasSlot.ts` | Sayfa başına tek WebGL bağlamı (`useSyncExternalStore`). Editör + galeri gibi aynı anda birden çok 3B şablon çizilse ikincisi statik kalır. (Not: şablon galerisi zaten canlı şablon değil `TemplateCover` degradesi çizer.) |
| `SceneCanvas.tsx` | R3F `Canvas`: DPR `[1, 1.75]` (düşük kalite/önizlemede `[1, 1.25]`), ekran dışında ya da sekme gizliyken `frameloop="never"`, hareketi azaltınca `"demand"` (tek kare, son hâl), `webglcontextlost` → statik görünüm. |
| `useStageActive.ts` | IntersectionObserver + `visibilitychange`. |
| `useTilt.ts` | İşaretçi + `deviceorientation` eğimi, React durumu değil ref (kare başına yeniden çizim yok). iOS'ta jiroskop izni istenmez: izinsiz cihazda yalnızca işaretçi/boşta salınım çalışır. |
| `support.ts` | `hasWebGL`, `isVeryLowEnd`, `preferredQuality` (dokunmatik ya da ≤4 GB → `low`; `preview` → `low`). |

**`shared/yedi/`** — `useHeroData` (adlar en çok iki kişi, boş alanlar `''`, tarih parçaları) ve `HeroCountdown` (`showTimer` kapalı ya da tarih geçersizse çizilmez).

Bütün şablonlar `InvitationComposition` üstüne kuruludur (Kitap hariç): Program, Mekân, Galeri, Hediye ve LCV ortak bölümlerdir; boş veride kendileri gizlenir (`Timeline`/`Gallery`/`Details` `null` döner). Her şablonun kendi `SectionTheme`'i ve flavor kopyası var; sabit başlıklar mevcut şablonlardaki gibi flavor'da (projede şablon metinleri i18n'e bağlı değil).

**RTL:** Metinler mantıksal hizalıdır (`text-center`, `inset-x`). Kitap mekaniği bilerek `dir="ltr"` çalışır (sırt solda); Arapça kitap yönü (sırt sağda) yapılmadı — bilinen sınır.

### B.2 Şablonlar

| Id | Bileşen | Tek cümle |
|---|---|---|
| `dugun-kitap-sayfa` | `DugunKitapSayfa` | Kapağı kendiliğinden açılan, sayfaları köşeden kıvrılarak çevrilen düz illüstrasyonlu kitap. |
| `dugun-gul-3d` | `DugunGul3d` | Prosedürel 3B güller kartın çevresinde açar, sarmaşıklar uzar, yapraklar düşer; kart güllerin arasından öne gelir. |
| `dugun-popup` | `DugunPopup` | Kâğıt katmanlar (gök, tepeler, çiçekli kemer, ağaçlar, çift, çimen) yaylı bir hareketle ayağa kalkar, kaydırınca yatar. |
| `dugun-murekkep` | `DugunMurekkep` | Suya damlayan mürekkep bulutları (shader); adlar mürekkebin içinden netleşir, dokunulan yere yeni damla düşer. |
| `dugun-fener` | `DugunFener` | Gece göğüne yükselen sıcak ışıklı fenerler; kaydırdıkça kamera onlarla yükselir. |
| `dugun-holografik` | `DugunHolografik` | Eğimle parlaması ve renk açısı değişen yanardöner cam kart. |
| `dugun-altin-toz` | `DugunAltinToz` | Binlerce altın zerre patlayıp adları yazar; kaydırınca tarihi, sonra mekânı yazar ve toza dağılır. |

#### Kitap Sayfaları — `dugun/DugunKitapSayfa/`

- **`curl.ts`** — saf geometri. Köşe C, işaretçinin taşıdığı P'ye gider; katlama çizgisi C–P'nin dik ortayı. Ön yüz Sutherland–Hodgman ile yarı düzleme kırpılır (`clip-path: polygon`). Arka yüz kendi (aynalanmamış) düzeninde çizilir; "x'te aynala + çizgiye göre yansıt" iki yansımanın bileşkesi = dönme + öteleme → tek `matrix()`. P sırttan kopamaz (`constrain`). Katlama çizgisine yaslanan üç gradyan bandı: ön yüzde gölge, kanatta parlama, alttaki sayfaya düşen gölge.
- **`Kitap.tsx`** — yaprak yığını. Kıvrım her karede DOM'a doğrudan yazılır; React yalnızca "kaç yaprak çevrildi" ve "hangi yaprak sürükleniyor"u tutar (60 fps'te ağaç yeniden çizilmez). Çevirme: yatay sürükleme (dikey sürükleme sayfa içinde kaydırır, `touch-action: pan-y`), tekerlek/izleme dörtgeni (sayfa içeriği sonuna gelince), ok/PageUp/PageDown, dış kenar şeridine dokunma, büyük ileri/geri düğmeleri. Form alanları, bağlantılar ve galeri (`data-no-flip`) sürüklemeyi başlatmaz. Geniş ekranda çift sayfa (sol: önceki yaprağın arkası), kitap açılınca sırt ortaya kayar. Boşta 6 s'de bir köşe hafifçe kalkar.
- **`sayfalar.tsx`** — kâğıt yüzü (SVG gürültüsü data-URI → bir kez rasterlenir), sararmış kenar, sırt gölgesi, koşan başlık, sayfa numarası; gül kurusu bez kapak (kitin `bez.webp` dokusu, kendi rengi), yan kâğıdı deseni, süslü bölüm başlığı, dört düz illüstrasyon (kuşlar, yüzükler, fener, buket).
- Sıra: kapak → hikâye (başlık + başharfli alt metin) → Tarih & Mekân (`Details` + sayaç) → Program → Galeri → Hediye → LCV → son sayfa (imza). Verisi olmayan bölüm yaprak olmaz; bölüm numaraları buna göre yeniden sayılır.
- **Karar:** zarf modülü kullanılmaz; kapak zaten kapıdır.
- Hareketi azalt: kapak kendiliğinden açılmaz, çevirmeler animasyonsuz.

#### 3D Gül Bahçesi — `dugun/DugunGul3d/`

- `gulGeometri.ts`: taç yaprağı bükülmüş bir düzlem (çanak kenar, dışa dönen uç, tabanı koyu köşe rengi); yaprak da öyle. Gül = taç yaprağının altın açıyla sarmal örnekleri. Bütün taç yaprakları **tek** `InstancedMesh` (12 gül × 22 yaprak; düşükte 9 × 15), yapraklar bir, düşen taç yaprakları bir (70 / 30) → 3 + 4 sarmaşık çizim çağrısı.
- Açılış: güller sırayla büyür (`easeOutBack`) ve açar (yaprak eğimi kapalı → açık), sarmaşıklar `setDrawRange` ile uzar, kamera güllerin içinden (z 6.4 → 10) geri çekilir; kart 1 s'de bulanıktan öne gelir.
- Kaydırma: kamera yukarı süzülür, sahne kararır (HTML örtü). Eğim: kamera paralaksı.
- Işık: yarımküre + sıcak yönlü + pembe nokta ışık, sis ile alan derinliği hissi. **Bloom kullanılmadı** (`@react-three/postprocessing` ek paket olurdu); drei de bu sahnelerde gerekmedi (paket kurulu, ağaçtan atılır).
- Yedek: SVG sarmal güller.

#### Pop-up Kart — `dugun/DugunPopup/`

Zemin `rotateX(58°)`; her katman tabanından katlanır. İki iç içe `motion.div`: iç olan açılışta yaylı `rotateX(-90°)` (gecikmeli), dış olan kaydırmayla `+90°` geri yatar. SVG katmanlar düz renk "kesik kâğıt", gölge `drop-shadow`. WebGL yok.

#### Mürekkep & Su — `dugun/DugunMurekkep/`

Ham WebGL1, tek üçgen, tek fragment shader (ek paket yok). 8 damlalık uniform dizisi (x, y, başlangıç); yarıçap `1 - e^{-kt}` ile büyür, kenar iki kat domain-warp fbm ile tüylenir, kenar bölgesi şarap rengine çalar. Tuval **0.45–0.6 × DPR** çözünürlükte çizilir. Dokunma yeni damla ekler (halka tampon). Kaydırmada su `#F4F2ED` örtüyle durulur (bölümler açık zeminde okunur). `ThreeStage` kapısını ve tek-bağlam yuvasını kullanır.

#### Dilek Fenerleri — `dugun/DugunFener/`

R3F: fener gövdesi tek `InstancedMesh` (150 / 70, köşe renkleriyle altı parlak), hale ikinci `InstancedMesh` (tuvalde çizilen radyal doku, eklemeli karışım), 900 yıldızlık `points`. Alçaktaki fenerler açılışta ufkun altından dalga hâlinde salınır; kamera `progress` (belge oranı) ile 16 birim tırmanır. Ufuk silueti HTML/SVG.

#### Holografik Cam — `dugun/DugunHolografik/`

Koyu cam kart üstünde: `conic-gradient` (`screen`), folyo şeritleri (`overlay`, `background-position` eğimle), parlama (`radial-gradient`, konum eğimle), metin arkasında koyu örtü (kontrast). Eğim yay ile yumuşatılır; 2 s hareket yoksa (ve önizlemede) kart kendi kendine salınır. Açılış: `rotateY(-170°)`'den dönüş + ışık süpürmesi. Kaydırınca kart geriye yatar.

#### Altın Toz — `dugun/DugunAltinToz/`

`tozMotoru.ts`: `Float32Array` tabanlı yay-sönüm parçacıkları (2800 masaüstü, 1500 mobil, 900 önizleme), renk gruplarıyla `fillRect` + `lighter`. Hedefler, HTML'de gösterilen **aynı** yazının (aynı font, boy, satır, konum — `fitText`) ekran dışı tuvalde örneklenmesiyle bulunur; yazı oturunca HTML metin altın gradyanla öne geçer, zerreler söner. Hero, kaydırma kabının 1 + 0.8 × aşama sayısı ekranı kadar uzun, içi `sticky`: adlar → tarih (+ sayaç) → mekân → dağılma. Görünen aşama yazıları `aria-hidden`; ekran okuyucu için tek parça `sr-only` künye var.

### B.3 Performans

- Yedi şablon ve A'daki 18 şablon `React.lazy` ile ayrı chunk. 3B sahneler (`GulSahnesi`, `FenerSahnesi`) bir kez daha tembel: kartın HTML'i three.js inmeden çizilir.
- Build (2026-11-04): ana paket `index-*.js` **1 597 kB** (öncesi 1 586 kB; +11 kB = 25 katalog girdisi ve tembel kayıt — ana pakette three.js yok, denetlendi). three + R3F + `SceneCanvas` ortak chunk'ı **887 kB (gzip 239 kB)**, yalnızca Gül ve Fener açılınca iner. Şablon chunk'ları 3–25 kB (Kitap 24 kB).
- Mobilde kalite `low` (daha az örnek, DPR ≤ 1.25); ekran dışında kare çizilmez; tek WebGL bağlamı.
- `prefers-reduced-motion`: Gül/Fener tek kare (`demand`) son hâlini çizer, Mürekkep tek kare, Altın Toz zerreleri doğrudan yerine koyar, giriş animasyonları atlanır, Kitap kendiliğinden açılmaz.
- Ölçüm notu: kare hızı bu kapsayıcıda yazılımsal GPU (SwiftShader) ile ölçülemedi; 30/60 fps hedefi gerçek cihazda doğrulanmalı.

### B.4 Doğrulama

- `npm run lint`, `npm run build`, `npm run verify` temiz. `verify:render`: 25 tembel şablonun hepsi (A'daki 18 + 7 yeni) katalogda, dolu veride ad ve mekân çiziliyor, boş veride kırılmıyor; 324 şablonun hepsinde imza kuralı geçiyor.
- Playwright (`onizleme.html?preset=…&mod=live&yol=renderer` — kayıt dosyası üzerinden), 390 × 844 ve 1440 × 900: konsol hatası yok, yatay taşma yok; `dolu`, `bos` ve hareketi azaltma ile.
- Ekran görüntüleri (açılışın başı → ortası → sonu, kaydırma, masaüstü):
  - [`yedi-davetiye/dugun-kitap-sayfa.jpg`](yedi-davetiye/dugun-kitap-sayfa.jpg) · [`dugun-gul-3d.jpg`](yedi-davetiye/dugun-gul-3d.jpg) · [`dugun-popup.jpg`](yedi-davetiye/dugun-popup.jpg) · [`dugun-murekkep.jpg`](yedi-davetiye/dugun-murekkep.jpg) · [`dugun-fener.jpg`](yedi-davetiye/dugun-fener.jpg) · [`dugun-holografik.jpg`](yedi-davetiye/dugun-holografik.jpg) · [`dugun-altin-toz.jpg`](yedi-davetiye/dugun-altin-toz.jpg)
  - A bölümü, 390 px: [`a-konsept-390.jpg`](yedi-davetiye/a-konsept-390.jpg); boş veri + hareketi azalt: [`bos-veri-ve-hareket-azalt.jpg`](yedi-davetiye/bos-veri-ve-hareket-azalt.jpg)

### B.5 Bilinen sınırlar ve açık işler

- **Backend:** şablon id'leri bir izin listesinde/seeder'da tutuluyorsa 25 yeni id (`dugun-kitap-*`, `nisan-*-*`, `dogum-gunu-*-*` konseptleri ve 7 `dugun-*`) oraya eklenmeli. Frontend tarafında başka kayıt yok.
- Bloom/alan derinliği gerçek post-processing değil (ek paket istemedim); sis + ışık ile yaklaşıldı.
- iOS'ta jiroskop için izin akışı yok (izin isteği bir kullanıcı hareketi ister; davetiye sayfasında ayrı bir düğme gerektirir).
- Kitap'ta RTL kitap yönü yok; sayfa içi uzun bölümler (LCV formu) sayfa içinde kaydırılır.
- Altın Toz'da yazı oturmadan çok hızlı kaydırılırsa bir sonraki aşamanın zerreleri önceki yazının HTML'i solarken bir an üst üste görünebilir.
- `npm install` sonrası `npm audit` 13 bildirim veriyor (çoğu önceden var olan geliştirme bağımlılıkları); bu dalda ele alınmadı.
