# Düğün kategorisinin görsel kimliği — "Tül & Kurdele"

> **Kapsam:** `src/components/templates/dugun/**` (44 şablon, `flavors.tsx`, `themes.ts`, `parts/`)
> **Denetim:** `npm run check`; duman testi, kontrast betiği ve görsel öz-kontrol (§7)
> **Okuyacaklar:** kına ve nişan tasarım ajanları — §10 onlar için yazıldı

---

## 1. Özet

Düğün "koyu zemin + şampanya altını / fildişi + bronz" varsayılanında değil. Kimlik
**beyazın tonları** üzerine kurulu: soğuk inci beyazı zemin, menekşe-siyah mürekkep, tek
sıcak vurgu olarak **şakayık**, botanik şablonlarda **mersin yeşili**. Metal ışığını altın
değil **inci** ve **gümüş** taşır. Motif dili **kurdele düğümü** (davetiye kurdelesi, "nikâh
düğümü") ve **puantiyeli tül** (gelin duvağı). Hareketin karakteri **buluşma**: iki uç
kenarlardan gelip ortada buluşur — kurdele çizgileri, isimler, `&` çevresindeki çizgiler.

Kategori hero'su (KurdeleHero) 17 şablona hizmet eder; bu şablonlar birbirinden **zemin
tonu, ışık ve yerleşimle** ayrışır (§8).

## 2. Palet

| Rol | Ad | Hex | Nerede |
|---|---|---|---|
| Açık zemin | Tül | `#f8f6f9` | Açık temaların `base`'i (fildişi değil, soğuk) |
| Derin tül | Tül derin | `#efebf2` | Degrade uçları, harita başlığı |
| Kıl çizgi | İnci | `#e4dee9` | `border`, `divider` |
| Güçlü çizgi | İnci koyu | `#cbc2d3` | LCV alan alt çizgisi |
| Başlık | Mürekkep | `#211b2d` | `heading`, birincil buton dolgusu |
| Sayfa metni | Mürekkep orta | `#433b52` | `page` |
| Gövde | Mürekkep soluk | `#655d74` | `body` |
| Vurgu | Şakayık | `#9b3a63` | `accent`, `accentBg`, açık temaların zarf mührü |
| Vurgu açık | Şakayık açık | `#d98bab` | Süs, parçacık |
| Botanik | Mersin | `#41604f` / açık `#a9c6b5` | Dugun2, Dugun5, Riso, Herbaryum, Dokuma, Çini |
| Koyu zemin | Gece | `#16121d` / derin `#0e0b13` | Koyu temaların çekirdeği |
| Gecede vurgu | Şakayık ışığı | `#eba9c6` | Koyu `accent` |
| Gecede metal | İnci ışığı | `#efe8f3` | Koyu temalarda birincil buton ve zarf mührü (altın yerine) |
| Yardımcı | Lila | `#c7b8e2` | Mesh, cam, leke üçlülerinin üçüncü rengi |
| Yardımcı | Gümüş | `#c3cad4` – `#f7f8fa` | Saten Gümüş (Krom) bantları |
| Yardımcı | Mürekkep moru | `#2c2340` / `#5e3f6e` | Çini hattı, İnci Gravür vurgusu |

Koyu şablonlar artık tek bir menekşe-siyah paylaşmaz: mersin gecesi `#0f1714`, kömür
`#0c0b0e`, sıcak toprak `#120d0b`, saf siyah `#070708`, gün batımı moru `#171526`.

**Bilerek dışarıda bırakılanlar:** altın/şampanya, bronz/vizon, sıcak fildişi, zümrüt
(DavetKart marka rengi), lacivert (sünnet), kobalt/grafit sinyal (kurumsal).

## 3. Tipografi

| Katman | Yazı | Tavır |
|---|---|---|
| İsimler | Cormorant Garamond **italik**, 500 | Büyük, sıkı satır (1.04); `&` 0.72em, vurgu renginde, kıl çizgiler arasında |
| İsim varyantları | Modern: dik ince Cormorant 300, sola yaslı; Onyx: en iri italik (`text-[3.2rem]` → `7xl`) | `nameClassName` |
| Bölüm başlıkları | Cormorant Garamond (`theme-cormorant` her düğün temasında) | Ortak bölümler `font-serif` → Cormorant |
| Küçük başlıklar | Inter 10–11 px, 600, `tracking-[0.42em]` | Davetiye kartının geniş aralıklı satırı |
| Slogan | Cormorant italik 18–20 px, vurgu | "Evleniyoruz" |
| Tarih | Gün: Cormorant 48–60 px lining; ay/saat/yıl: Inter 10–11 px aralıklı | Ortalı: ay üstte, saat │ gün │ yıl. Sola yaslı: gün │ yıl │ saat |
| Gövde | Inter light 14–15 px | |

Yalnızca yüklü üç aile kullanılır. Büyük harfe çevrilen satırlar `lang="tr"` altında Türkçe
kuralla büyür.

## 4. Motif

| Motif | Dosya | Kullanım |
|---|---|---|
| Kurdele düğümü | `parts/Kurdele.tsx` | Zarf mührü, ortak hero süsleri (`flavor.Ornament`), KurdeleHero açılışı |
| Puantiyeli tül | `flavors.tsx` (desen), `parts/TulVeil.tsx` | Bölüm arkası desen; Sade hero'sunda kadrajı saran tül |
| İnci kafes + kemer plaket | `DugunSekilli` | Çapraz kurdele bantları ve inciler; metin üstü kemerli, çift çizgili plakette |
| Gümüş gravür | `DugunManzara` | Süslü çerçeve görseli ters çevrilmiş gri gravür olarak |
| Stel | `DugunOnyx` | Kadrajı boydan boya taşıyan iki inci kıl çizgi ve elmaslar |
| Saten bantlar | `DugunKrom` | Yatay gümüş yansıma bantları + parlama |
| Çapraz huzme | `DugunModern` | Sağ üstten düşen orkide-lila ışık |
| Tül panel | `KurdeleHero panelClassName` | Parlak videonun önünde metin paneli (Sahil) |
| LCV kartı satırı | `themes.ts` `kurdele()` | Kutu değil alt çizgi alan, hap butonlar |
| Mühür | `themes.ts` `ZARF_TUL` / `ZARF_GECE` | Açıkta şakayık mum mührü, koyuda inci mühür |

Tüm yeni görseller kodla çizilmiş özgün SVG/CSS'tir.

## 5. Hareket karakteri — "Buluşma"

- **Kurdele açılışı:** iki çizgi ekranın iki yanından merkeze uzanır (1.1 s), ilmekler
  çizilir, düğüm atılır, kuyruklar düşer (~2.1 s). Sola yaslı düzende kurdele yalnız sağdan gelir.
- **İsimler:** gelin soldan, damat sağdan 28 px kayarak gelir (1.3 s); `&` buluştukları
  anda ölçekle belirir.
- **Geri kalan:** 14 px yükselerek solma, `ease.out`; yay ve sürekli dönme yok. Tek
  sürekli döngü kaydırma incisi (4 tekrar).

## 6. Kontrast

**Yöntem** (`node_modules/.cache/dugun/contrast.py`, git'e girmez):

- Bölüm çiftleri `themes.ts`'in dökümünden okunur; yarı saydam renkler zemine karıştırılır;
  gradyanlı buton ve `bg-clip-text` başlıkta her durak ayrı denenir; harita iğnesi temanın
  `mapHeader`'ı üzerinde ölçülür.
- Hero çiftleri gerçek katmanlardan örneklenir (video posteri dikey 360×780 ve yatay
  1280×800, PNG görseller, scrim/perde degradeleri, Halo tepe anı, huzme tepe anı, mesh
  lekesinin en kötü anı, gravürün ters çevrilmiş gri tonu, gümüşün en koyu bandı). Metin
  kolonu 14×14 hücreye bölünür; **en kötü hücre** raporlanır.
- Eşik: normal metin 4.5, büyük başlık 3; harita iğnesi (ikon) 3.

**Sonuç:** 748 çift, **0 AA altı**. En düşük hero oranı 4.55 (Gül Yaprakları, başlık).

| Şablon | Bölüm en düşük | Çift | Hero en düşük | Çift / en kötü zemin |
|---|---|---|---|---|
| Dugun1 | 4.87 | placeholder / alan | 5.62 | accent (başlık/ay) / zemin `#faf8f9` |
| Dugun2 | 5.01 | placeholder / alan | 5.32 | body (mesaj/mekân) / zemin `#f8f8f5` |
| Dugun3 | 5.15 | placeholder / alan | 5.83 | body (mesaj/mekân) / zemin `#faf7f8` |
| Dugun4 | 5.77 | placeholder / alan | 4.80 | accent (başlık/ay) / zemin `#cbd3c1` |
| Dugun5 | 4.65 | placeholder / alan | 4.77 | accent (başlık/ay) / zemin `#dee6df` |
| DugunAurora | 5.39 | placeholder / alan | 5.24 | body (mesaj/mekân) / zemin `#dad0f1` |
| DugunBento | 4.74 | placeholder / alan | 5.61 | body (mesaj/mekân) / zemin `#f5f2f7` |
| DugunBilet | 5.40 | placeholder / alan | 5.45 | body (mesaj/mekân) / zemin `#ece8ef` |
| DugunBlueprint | 5.20 | placeholder / alan | 6.76 | body (mesaj/mekân) / zemin `#1e1832` |
| DugunBrutal | 5.31 | accent / base | 5.31 | accent (başlık/ay) / zemin `#f1eef3` |
| DugunCini | 5.31 | placeholder / alan | 6.92 | body (mesaj/mekân) / zemin `#fdfcfe` |
| DugunCizgi | 5.19 | placeholder / alan | 5.55 | body (mesaj/mekân) / zemin `#f3f0f5` |
| DugunDeco | 5.11 | placeholder / alan | 7.22 | body (mesaj/mekân) / zemin `#0f0d13` |
| DugunDenizIsiltisi | 4.57 | placeholder / alan | 4.71 | body (mesaj/mekân) / zemin `#dbecec` |
| DugunDokuma | 4.87 | placeholder / alan | 5.23 | body (mesaj/mekân) / zemin `#f0ecef` |
| DugunEbru | 5.18 | placeholder / alan | 6.56 | body (mesaj/mekân) / zemin `#fbf9fb` |
| DugunFilm | 5.44 | placeholder / alan | 6.78 | body (mesaj/mekân) / zemin `#120f15` |
| DugunGazete | 5.12 | placeholder / alan | 5.37 | body (mesaj/mekân) / zemin `#ecebe9` |
| DugunGokyuzu | 5.24 | placeholder / alan | 5.24 | accent (başlık/ay) / zemin `#cfddec` |
| DugunGulYapraklari | 5.37 | placeholder / alan | 4.55 | accent (başlık/ay) / zemin `#cdb0b4` |
| DugunHerbaryum | 5.34 | placeholder / alan | 6.13 | body (mesaj/mekân) / zemin `#f5f4f6` |
| DugunKagit | 5.11 | placeholder / alan | 5.10 | body (mesaj/mekân) / zemin `#e6e1ea` |
| DugunKinetik | 4.68 | placeholder / alan | 5.32 | body (mesaj/mekân) / zemin `#efecf2` |
| DugunKrom | 5.47 | placeholder / alan | 5.08 | accent (başlık/ay) / zemin `#b7bfc9` |
| DugunManzara | 4.95 | placeholder / alan | 4.65 | body (mesaj/mekân) / zemin `#d5d0d9` |
| DugunMermer | 4.95 | placeholder / alan | 5.24 | body (mesaj/mekân) / zemin `#efecf2` |
| DugunModern | 5.44 | placeholder / alan | 4.78 | body (mesaj/mekân) / zemin `#473440` |
| DugunMonogram | 5.30 | placeholder / alan | 6.72 | body (mesaj/mekân) / zemin `#fdfcfe` |
| DugunMumIsigi | 5.44 | placeholder / alan | 7.94 | body (mesaj/mekân) / zemin `#241a12` |
| DugunNoir | 4.73 | placeholder / alan | 6.86 | body (mesaj/mekân) / zemin `#0b0a0e` |
| DugunOnyx | 5.79 | placeholder / alan | 5.71 | body (mesaj/mekân) / zemin `#2d2926` |
| DugunPano | 5.32 | placeholder / alan | 6.72 | body (mesaj/mekân) / zemin `#141018` |
| DugunPlak | 5.29 | placeholder / alan | 6.69 | body (mesaj/mekân) / zemin `#161219` |
| DugunPosta | 5.16 | placeholder / alan | 5.57 | body (mesaj/mekân) / zemin `#f0edf2` |
| DugunRiso | 5.33 | accent / base | 5.03 | accent (başlık/ay) / zemin `#f1eef2` |
| DugunSade | 4.69 | placeholder / alan | 5.29 | body (mesaj/mekân) / zemin `#efebf2` |
| DugunSahil | 4.81 | placeholder / alan | 5.11 | body (mesaj/mekân) / zemin `#40383c` |
| DugunSekilli | 5.04 | placeholder / alan | 8.21 | body (mesaj/mekân) / zemin `#151c1a` |
| DugunSuluboya | 4.96 | placeholder / alan | 5.52 | body (mesaj/mekân) / zemin `#f4f1f6` |
| DugunTakvim | 5.29 | placeholder / alan | 6.72 | body (mesaj/mekân) / zemin `#fdfcfe` |
| DugunTerrazzo | 5.23 | placeholder / alan | 5.98 | body (mesaj/mekân) / zemin `#f5f3f6` |
| DugunUfuk | 5.32 | placeholder / alan | 9.87 | body (mesaj/mekân) / zemin `#0a0f24` |
| DugunVitray | 5.41 | placeholder / alan | 6.91 | body (mesaj/mekân) / zemin `#140f1a` |
| DugunYildizHaritasi | 5.54 | placeholder / alan | 7.35 | body (mesaj/mekân) / zemin `#0e0c1c` |

**Varsayımlar ve sınırlar:** video tek kareyle (poster) ölçüldü; parçacıklar anlık geçtiği
için hesaba katılmadı; Dugun1–3'te süs görselleri metin kolonunun dışında varsayıldı; ortak
hero'lu şablonlarda hero metni HeroStage zemininde, Çini/Ebru/Monogram/Takvim'de kartın
kağıdında ölçüldü. AA altında kalan dekoratif metin yok.

## 7. Doğrulama

| Betik | Ne yapar | Son sonuç |
|---|---|---|
| `npm run check` | lint + build + verify (verify:render dahil) | rapor |
| `node_modules/.cache/dugun/build.mjs smoke.tsx` | 44 şablon × 3 senaryo `renderToString` + Suspense'i bekleyen `prerenderToNodeStream`; `undefined/NaN/Invalid Date/null` yasak | `44 şablon × 3 senaryo, 0 hata` |
| `python -I node_modules/.cache/dugun/contrast.py .` | §6 | `748 çift, 0 AA altı` |
| Görsel öz-kontrol | Kendi Vite sunucusu + `__harness__` + headless Chrome, 360×780 / 768×1024 / 1280×800 | her şablonun kılavuzunda §7 |

## 8. Hangi şablon kendi hero'sunu aldı, nasıl ayrışıyor

| Şablon grubu | Hero | Gerekçe |
|---|---|---|
| Dugun1–5, Sade, Manzara, Sekilli, Modern, Gökyüzü, Mum Işığı, Gül Yaprakları, Deniz Işıltısı, Sahil, Onyx, Aurora, Krom (17) | **KurdeleHero** | Hepsi dokuz kategoride aynı `Summary`'yi kullanıyordu |
| Bento … Ufuk, Çini, Ebru, Monogram, Takvim (27) | Ortak hero | Değeri tasarım dilinin kendisi; ayrışma tema, parametre, kurdele süsü ve bölüm karakteriyle |

1. turda 8 koyu KurdeleHero şablonu aynı mor-siyah zemin + aynı hero ile kopya gibiydi.
Şimdiki ayrışma:

| Şablon | Zemin tonu | Işık / kompozisyon | Yerleşim |
|---|---|---|---|
| Manzara — İnci Gravür | **açık** tül | ters çevrilmiş gümüş gravür çerçeve | ortalı |
| Aurora — Sedef | **açık** sedef | pastel iridesan mesh | ortalı |
| Krom — Saten Gümüş | **açık** soğuk gümüş | yatay gümüş bantlar + parlama, koyu metal isimler | ortalı |
| Sekilli — İnci Motif | mersin gecesi | her yerde inci kafes | **kemerli plaket** |
| Modern — Gece Modası | nötr kömür | çapraz orkide huzme | **sola yaslı**, dik ince isimler |
| Mum Işığı | sıcak toprak (video) | üstte serbest bokeh, alta koyulaşan perde | **alta yaslı** |
| Onyx — Onyx & İnci | saf siyah (video) | sıvı metal + **stel** çizgileri | ortalı, en iri isimler |
| Sahil | altın gök + koyu deniz (video) | ufuk bandı | **tül panel** |

## 9. "Hareketi azalt" — kategorideki her animasyon kaynağı

| Kaynak | Şablonlar | Nasıl susturulur |
|---|---|---|
| Kurdele düğümü `pathLength` + çizgi `scaleX` | KurdeleHero'lu 17 | `useReducedMotion()` → baştan çizili |
| İsim x kayması, öğe y yükselişi, `&` ölçeği | KurdeleHero'lu 17 | `MotionConfig reducedMotion="user"`; yalnız opaklık solar |
| Kaydırma incisi `animate-bob-down-6` | KurdeleHero'lu 17 | `index.css` reduce kuralı |
| Süs görseli girişleri | Dugun1–5 | MotionConfig; opaklık solar |
| Sade çerçevesi, Sekilli kafesi | Sade, Sekilli | MotionConfig ölçeği atlar; opaklık solar |
| Otomatik video | Gökyüzü, Mum Işığı, Deniz, Gül, Sahil, Onyx | `VideoBackdrop` video öğesini basmaz, poster kalır |
| Atmosfer (`Halo`, `GodRays`, `LightLeak`, `AuroraMesh`, `GoldSheen`, `Iridescent`) | HeroStage'li şablonlar | `[data-atmosphere]` → `animation: none` |
| Canvas parçacıkları (`parts/KenarParcacik.tsx`, yalnız kenar bantları, 448 px altında yok) | Gül, Sahil, Onyx, Noir, Vitray | `ParticleField` tek durağan kare |
| İşaretçi parallax'ı | HeroStage'li şablonlar | `usePointerParallax` dinleyici kurmaz |
| Ebru su salınımı | Ebru | `EbruSheet` `useReducedMotion` |
| Ortak hero döngüleri (Plak, Film, Mermer, Vitray, Terrazzo, Çini, Monogram, Pano, Kinetik, Yıldız, Tek Çizgi, Ufuk) | İlgili şablonlar | Ortak dosyalarda; kendi reduce yolları |
| Program çizgisi (kaydırmaya bağlı) | Hepsi | Ortak `Timeline` |

`parts/Hale.tsx` kaldırıldı: ortak `Halo` düzeltildi (tepe parlaklığı verilen `opacity`, x/y'de
ortalı). Hale'nin tepe değeri (0.85 × opacity) düzeltilmiş Halo ile aynı olduğundan kontrast
değişmedi; yalnızca halelerin yeri değişti (eskiden yarım boy kayıktı) ve yeniden ölçüldü.

## 10. Kına ve nişan için ayrışma notları

- **Renk:** düğün soğuk inci + menekşe mürekkep + şakayık + mersin + gümüş aldı. Kına için
  sıcak kırmızı/kına turuncusu/bordo serbest; nişan için şampanya-gül ya da alyans metali.
  Şakayık `#9b3a63`, inci `#efe8f3` ve mersin gecesi `#0f1714` düğüne ait sayılsın.
- **Motif:** kurdele düğümü, puantiyeli tül, inci kafes, stel düğünün. Halkalar nişana bırakıldı.
- **Hero:** KurdeleHero düğüne özgü; kopyalanmamalı.
- **Bölüm karakteri:** alt çizgili LCV alanı + hap buton + şakayık/inci mühür düğünün.
- **Ortak kayıtlar:** `sade/manzara/sekilli/modern` kart kayıtları ortak; düğün değerleri
  `categoryOverrides.dugun` olarak §12'de.

## 11. Düzeltme geçmişi

| Tur | Şablon | Sorun | Düzeltme |
|---|---|---|---|
| 0 | Dugun2, Blueprint | placeholder AA altı | koyulaştırıldı |
| 0 | Dugun4, Gökyüzü, Gül | hero gövdesi AA altı | perde güçlendi, mürekkep koyulaştı |
| 0 | Sahil | hero gövdesi 1.16 (altın gök) | tül panel + ufuk bandı |
| 1 | Dugun3 | buket sayacı kapatıyordu (360/768/1280) | buket sabit genişlik, içerik alt padding'i buketi aşar |
| 1 | Dugun4 | 360 px'te metin sarmaşık sütunlarına taşıyordu | kolon `px-[11%]`, `@md:max-w-[21rem]` |
| 1 | 8 koyu şablon | birbirinden ayırt edilemiyordu | §8'deki zemin/ışık/yerleşim ayrışması |
| 1 | Koyu temalar | zarf mührü altındı | `envelope.seal` inci, açıkta şakayık |
| 1 | Manzara, Krom | yeni açık zeminlerde gövde AA altı | gravür %40, okuma tülü; gövde koyulaştı |
| 1 | Onyx, Gül, Sahil, Noir, Vitray | parçacıklar isim, tarih ve sayacın üstünden geçiyordu | `KenarParcacik`: yatay maske, dar kapta çizilmez |
| 1 | Mum Işığı, Sedef, Saten Gümüş, Modern, Dugun4 | 360 px kontak sayfasında silik/boş kalan yerler | üstten amber ışık, belirgin ağ, koyu metal isim, 768+ dış hat `&`, daha dar kolon |

## 12. `data.ts` kart değerleri

`imageUrl` verilmeyen satırlarda mevcut değer kalır (Dugun1–5 PNG, videolu kartlarda poster,
Ufuk SVG; tasarım dili kartlarında boş). Ortak dört preset için değerler
`categoryOverrides.dugun` (`TemplatePresetLook`) içindir; kına ve nişanın kartı değişmez.

| Preset | name | primaryColor | backgroundStyle | titleColor | btnColor |
|---|---|---|---|---|---|
| `sade` → `categoryOverrides.dugun` | Zarif Sadelik | `#f8f6f9` | `bg-gradient-to-br from-[#ffffff] via-[#f8f6f9] to-[#efebf2]` | `text-[#211b2d]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#f8f6f9]` (+ `imageUrl: ''`: mevcut kapak bronz alyanslı eski SVG) |
| `manzara` → `categoryOverrides.dugun` | İnci Gravür | `#f6f3f7` | `bg-gradient-to-br from-[#fbfafc] via-[#e9e1ef] to-[#5e3f6e]` | `text-[#211b2d]` | `bg-[#2c2340] hover:bg-[#3f3456] text-[#f6f3f7]` (+ `imageUrl: ''`: zümrüt fotoğraf çelişiyor) |
| `sekilli` → `categoryOverrides.dugun` | İnci Motif | `#0f1714` | `bg-gradient-to-br from-[#1a2620] via-[#0f1714] to-[#dcd2e6]` | `text-[#f4f6f2]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` (+ `imageUrl: ''`) |
| `modern` → `categoryOverrides.dugun` | Gece Modası | `#0c0b0e` | `bg-gradient-to-br from-[#151418] via-[#0c0b0e] to-[#e79ac0]` | `text-[#f7f5f8]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` (+ `imageUrl: ''`) |
| `dugun-1` | Zarif Çerçeve (Düğün 1) | `#faf8f9` | `bg-[#faf8f9]` | `text-[#33282f]` | `bg-[#33282f] hover:bg-[#4a3d45] text-[#faf8f9]` |
| `dugun-2` | Pastel Buket (Düğün 2) | `#f8f8f5` | `bg-[#f8f8f5]` | `text-[#2c362e]` | `bg-[#2f3d33] hover:bg-[#435447] text-[#f8f8f5]` |
| `dugun-3` | Bordo Zambak (Düğün 3) | `#faf7f8` | `bg-[#faf7f8]` | `text-[#3a1d2b]` | `bg-[#4a1d31] hover:bg-[#632a43] text-[#faf7f8]` |
| `dugun-4` | Pembe Kemer (Düğün 4) | `#fcf5f7` | `bg-[#fcf5f7]` | `text-[#4a2537]` | `bg-[#8f3a5a] hover:bg-[#a34a6b] text-white` |
| `dugun-5` | Bahar Bahçesi (Düğün 5) | `#f5f8f4` | `bg-[#f5f8f4]` | `text-[#26392f]` | `bg-[#2f4a3b] hover:bg-[#3f5f4c] text-[#f5f8f4]` |
| `dugun-gokyuzu` | Gökyüzü Rüyası (Videolu) | `#f1f4f9` | `bg-[#f1f4f9]` | `text-[#212d43]` | `bg-[#2c3a55] hover:bg-[#3d4e6e] text-[#f1f4f9]` |
| `dugun-mum-isigi` | Mum Işığı (Videolu) | `#120d0b` | `bg-[#120d0b]` | `text-[#fbf3ee]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` |
| `dugun-gul-yapraklari` | Gül Yaprakları (Videolu) | `#fbf3f5` | `bg-[#fbf3f5]` | `text-[#3d2732]` | `bg-[#3d2732] hover:bg-[#553a47] text-[#fbf3f5]` |
| `dugun-deniz-isiltisi` | Deniz Işıltısı (Videolu) | `#eef6f5` | `bg-[#eef6f5]` | `text-[#1b3537]` | `bg-[#1f4446] hover:bg-[#2c5a5c] text-[#eef6f5]` |
| `dugun-sahil` | Sinematik Sahil (Videolu) | `#171526` | `bg-[#171526]` | `text-[#fbf5f4]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` |
| `dugun-onyx` | Onyx & İnci (Videolu) | `#070708` | `bg-[#070708]` | `text-[#f7f2f8]` | `bg-gradient-to-r from-[#f6f2f8] to-[#d9cfe3] text-[#0d0b10]` |
| `dugun-aurora` | Sedef (Modern) | `#f6f3f8` | `bg-gradient-to-br from-[#f3c4d8] via-[#cec1f0] to-[#bee2d6]` | `text-[#211b2d]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#f6f3f8]` |
| `dugun-krom` | Saten Gümüş (Modern) | `#eceff3` | `bg-gradient-to-br from-[#f7f8fa] via-[#c3cad4] to-[#eef1f5]` | `text-[#14171d]` | `bg-[#1b1f27] hover:bg-[#2e3440] text-[#eceff3]` |
| `dugun-bento` | Bento Editorial (Modern) | `#f8f6f9` | `bg-gradient-to-br from-[#fcfbfd] via-[#ede8f1] to-[#ddd5f0]` | `text-[#211b2d]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#f8f6f9]` |
| `dugun-noir` | Noir Minimal (Modern) | `#0d0b10` | `bg-gradient-to-br from-[#15121a] via-[#0b0a0e] to-[#d9d0e2]` | `text-[#f5f1f7]` | `bg-[#e9e3ee] hover:bg-white text-[#0d0b10]` |
| `dugun-kagit` | Kağıt & Mühür | `#f3f1f4` | `bg-gradient-to-br from-[#f7f5f8] via-[#e6e1ea] to-[#9b3a63]` | `text-[#231d2b]` | `bg-[#231d2b] hover:bg-[#3a3245] text-[#f3f1f4]` |
| `dugun-deco` | Platin Deco | `#0e0c12` | `bg-gradient-to-br from-[#1c1822] via-[#0f0d13] to-[#d9d0e2]` | `text-[#f8f4fa]` | `bg-gradient-to-r from-[#d9d0e2] to-[#f3eff6] text-[#120f16]` |
| `dugun-riso` | Risograph Poster | `#f7f5f6` | `bg-gradient-to-br from-[#fbfafb] via-[#bc2a5e] to-[#3f6b55]` | `text-[#1d1922]` | `bg-[#1d1922] hover:bg-[#3a3440] text-[#f7f5f6]` |
| `dugun-bilet` | Davet Bileti | `#f2f0f4` | `bg-gradient-to-br from-[#f9f8fa] via-[#e0dae5] to-[#8f2f57]` | `text-[#211b2b]` | `bg-[#211b2b] hover:bg-[#3a3245] text-[#f2f0f4]` |
| `dugun-vitray` | Vitray Işık | `#110d16` | `bg-gradient-to-br from-[#c95a86] via-[#b9a7e0] to-[#6f9c86]` | `text-[#140f19]` | `bg-gradient-to-r from-[#ebb0c9] to-[#d9cdf3] text-[#140f19]` |
| `dugun-kinetik` | Kinetik Tipografi | `#f6f5f7` | `bg-gradient-to-br from-[#fbfafc] via-[#e4dee9] to-[#9b3a63]` | `text-[#19141f]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#f8f6f9]` |
| `dugun-cizgi` | Tek Çizgi | `#f9f8fa` | `bg-gradient-to-br from-[#fdfcfd] via-[#e0dae5] to-[#5a3f73]` | `text-[#211b2b]` | `bg-[#211b2b] hover:bg-[#3a3245] text-[#f9f8fa]` |
| `dugun-plak` | Vinil Plak | `#121016` | `bg-gradient-to-br from-[#231c27] via-[#121016] to-[#9b3a63]` | `text-[#f6f1f8]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` |
| `dugun-suluboya` | Suluboya | `#faf9fb` | `bg-gradient-to-br from-[#fefdfe] via-[#c7b8e2] to-[#e2a3bd]` | `text-[#2a2333]` | `bg-[#2a2333] hover:bg-[#403749] text-[#faf9fb]` |
| `dugun-pano` | Mekanik Pano | `#120f17` | `bg-gradient-to-br from-[#1f1a26] via-[#141018] to-[#eab0c8]` | `text-[#f6f1f8]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` |
| `dugun-yildiz-haritasi` | Yıldız Haritası | `#0c0b16` | `bg-gradient-to-br from-[#1a1630] via-[#0e0c1c] to-[#e2d4f5]` | `text-[#f7f4fb]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` |
| `dugun-dokuma` | Dokuma | `#f5f2f4` | `bg-gradient-to-br from-[#faf8f9] via-[#3f6b55] to-[#a3365f]` | `text-[#251e29]` | `bg-[#251e29] hover:bg-[#3c3341] text-[#f5f2f4]` |
| `dugun-film` | Film Şeridi | `#100d13` | `bg-gradient-to-br from-[#1d1922] via-[#120f15] to-[#ddd3e6]` | `text-[#f6f1f8]` | `bg-[#efe8f3] hover:bg-white text-[#16121d]` |
| `dugun-mermer` | Mermer & Rölyef | `#f4f2f5` | `bg-gradient-to-br from-[#fbfafc] via-[#efebf2] to-[#b4a9c0]` | `text-[#241f2b]` | `bg-[#241f2b] hover:bg-[#3a3443] text-[#f4f2f5]` |
| `dugun-gazete` | Gazete Manşeti | `#f3f2f1` | `bg-gradient-to-br from-[#f9f8f7] via-[#ecebe9] to-[#8f2f57]` | `text-[#16131a]` | `bg-[#16131a] hover:bg-[#2f2a34] text-[#f3f2f1]` |
| `dugun-posta` | Posta Damgası | `#f7f5f8` | `bg-gradient-to-br from-[#fdfcfd] via-[#f0edf2] to-[#a3365f]` | `text-[#231d2b]` | `bg-[#231d2b] hover:bg-[#3a3245] text-[#f7f5f8]` |
| `dugun-brutal` | Brutal | `#f1eef3` | `bg-gradient-to-br from-[#fdfcfe] via-[#f1eef3] to-[#b8245a]` | `text-[#17131c]` | `bg-[#b8245a] hover:brightness-110 text-[#fff5f8]` |
| `dugun-terrazzo` | Terrazzo | `#f5f3f6` | `bg-gradient-to-br from-[#fdfcfd] via-[#f5f3f6] to-[#a3365f]` | `text-[#241f2b]` | `bg-[#241f2b] hover:bg-[#3a3443] text-[#f5f3f6]` |
| `dugun-blueprint` | Teknik Çizim | `#1e1832` | `bg-gradient-to-br from-[#2a2245] via-[#1e1832] to-[#f4b3cd]` | `text-[#e3d9f2]` | `bg-[#f4b3cd] hover:brightness-110 text-[#1e1832]` |
| `dugun-herbaryum` | Herbaryum | `#f5f4f6` | `bg-gradient-to-br from-[#fdfcfd] via-[#f5f4f6] to-[#3f6b55]` | `text-[#26212d]` | `bg-[#26212d] hover:bg-[#3c3545] text-[#f5f4f6]` |
| `dugun-ufuk` | Ufuk | (aynı) | (aynı) | (aynı) | `bg-[#f3e9f0] hover:bg-white text-[#1a1426]` |
| `dugun-cini` | Gül Çini | `#f5f3f7` | `bg-gradient-to-br from-[#fdfcfe] via-[#6f9c86] to-[#2c2340]` | `text-[#211b2d]` | `bg-[#2c2340] hover:bg-[#3f3456] text-[#fdfcfe]` |
| `dugun-ebru` | Ebru | `#f3eff4` | `bg-gradient-to-br from-[#f1edf3] via-[#d6cbea] to-[#b5577c]` | `text-[#211b2d]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#fbf9fb]` |
| `dugun-monogram` | İnci Varak Monogram | `#f4f2f6` | `bg-gradient-to-br from-[#fdfcfe] via-[#d6cde0] to-[#9b3a63]` | `text-[#211b2d]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#fdfcfe]` |
| `dugun-takvim` | Takvim | `#f2f0f4` | `bg-gradient-to-br from-[#fdfcfe] via-[#e5dfea] to-[#9b3a63]` | `text-[#211b2d]` | `bg-[#211b2d] hover:bg-[#3a3149] text-[#fdfcfe]` |
