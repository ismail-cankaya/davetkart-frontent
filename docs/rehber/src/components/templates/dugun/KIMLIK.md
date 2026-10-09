# Düğün kategorisinin görsel kimliği — "Tül & Kurdele"

> **Kapsam:** `src/components/templates/dugun/**` (40 şablon, `flavors.tsx`, `themes.ts`, `parts/`)
> **Denetim:** `npm run check`; duman testi ve kontrast betiği (§7)
> **Okuyacaklar:** kına ve nişan tasarım ajanları (2. tur) — §10 onlar için yazıldı

---

## 1. Özet

Düğün artık "koyu zemin + şampanya altını / fildişi + bronz" varsayılanında değil.
Kimlik **beyazın tonları** üzerine kurulu: soğuk inci beyazı zemin, menekşe-siyah mürekkep,
tek sıcak vurgu olarak **şakayık**, botanik şablonlarda **mersin yeşili**. Metal ışığını
altın değil **inci** taşır. Motif dili **kurdele düğümü** (davetiye kurdelesi, "nikâh
düğümü") ve **puantiyeli tül** (gelin duvağı). Hareketin karakteri **buluşma**: iki uç
kenarlardan gelip ortada buluşur — kurdele çizgileri, isimler, `&` çevresindeki çizgiler.

## 2. Palet

| Rol | Ad | Hex | Nerede |
|---|---|---|---|
| Açık zemin | Tül | `#f8f6f9` | Açık temaların `base`'i (fildişi değil, soğuk) |
| Derin tül | Tül derin | `#efebf2` | Degrade uçları, hero kenarı |
| Kıl çizgi | İnci | `#e4dee9` | `border`, `divider` |
| Güçlü çizgi | İnci koyu | `#cbc2d3` | LCV alan alt çizgisi |
| Başlık | Mürekkep | `#211b2d` | `heading`, birincil buton dolgusu |
| Sayfa metni | Mürekkep orta | `#433b52` | `page` |
| Gövde | Mürekkep soluk | `#655d74` | `body` |
| Vurgu | Şakayık | `#9b3a63` | `accent`, `accentBg` (çip yazısı stone-50) |
| Vurgu açık | Şakayık açık | `#d98bab` | Süs, parçacık |
| Botanik | Mersin | `#41604f` / açık `#a9c6b5` | Dugun2, Dugun5, Riso, Herbaryum, Dokuma |
| Koyu zemin | Gece | `#16121d` / derin `#0e0b13` | Koyu temaların `base`'i |
| Gecede vurgu | Şakayık ışığı | `#eba9c6` | Koyu `accent` |
| Gecede metal | İnci ışığı | `#efe8f3` | Koyu temalarda birincil buton (altın yerine) |
| Yardımcı | Lila | `#c7b8e2` | Mesh, cam, leke üçlülerinin üçüncü rengi |

Şablonlar bu aileden sapmaz; yalnızca ton kayar (Gökyüzü'nde zemin gök mavisine, Deniz'de
akvamarine, Dugun3'te vurgu koyu şakayığa, Tek Çizgi'de mor mürekkebe).

**Bilerek dışarıda bırakılanlar:** altın/şampanya (`#c9a961`, `#d4af5f`…), bronz/vizon,
fildişi (`#f5f1ea` gibi sıcak krem), zümrüt (DavetKart marka rengi), lacivert (sünnet).

## 3. Tipografi

| Katman | Yazı | Tavır |
|---|---|---|
| İsimler | Cormorant Garamond **italik**, 500 | Büyük, sıkı satır (1.04); `&` 0.72em, vurgu renginde, iki kıl çizgi arasında |
| Bölüm başlıkları | Cormorant Garamond (`theme-cormorant` her düğün temasında) | Ortak bölümler `font-serif` → Cormorant |
| Küçük başlıklar | Inter 10–11 px, 600, `tracking-[0.42em]` | Davetiye kartının geniş aralıklı satırı; `pl-[0.42em]` ile merkezlenir |
| Slogan | Cormorant italik 18–20 px, vurgu | "Evleniyoruz" |
| Tarih | Gün: Cormorant 48–60 px lining; ay/saat/yıl: Inter 10–11 px aralıklı | Kart düzeni: ay üstte, saat │ gün │ yıl |
| Gövde | Inter light 14–15 px | |

Yeni font yok; yalnızca yüklü üç aile kullanıldı. Büyük harfe çevrilen satırlar
`lang="tr"` altında (KurdeleHero kökü) Türkçe kuralla büyür.

## 4. Motif

| Motif | Dosya | Kullanım |
|---|---|---|
| Kurdele düğümü | `parts/Kurdele.tsx` | Zarf mührü, 22 ortak hero'nun süsü (`flavor.Ornament`), KurdeleHero açılışı |
| Puantiyeli tül | `flavors.tsx` (desen), `parts/TulVeil.tsx` | Bölüm arkası desen; Sade ve Modern hero'sunda kadrajı saran tül |
| İnci kafes | `DugunSekilli` | Çapraz kurdele bantları + kesişimde inciler |
| İnci çerçeve | `DugunSade` | İki ince yuvarlak çerçeve |
| Tül panel | `KurdeleHero` `panelClassName` | Parlak videonun önünde metin paneli (Sahil) |
| LCV kartı satırı | `themes.ts` `kurdele()` | Kutu değil alt çizgi alan, hap butonlar |

Tüm yeni görseller kodla çizilmiş özgün SVG/CSS'tir.

## 5. Hareket karakteri — "Buluşma"

- **Kurdele açılışı:** iki çizgi ekranın iki yanından merkeze uzanır (1.1 s), ilmekler
  çizilir, düğüm atılır, kuyruklar düşer (toplam ~2.1 s).
- **İsimler:** gelin soldan, damat sağdan 28 px kayarak gelir (1.3 s); `&` buluştukları
  anda ölçekle belirir, iki yanındaki çizgiler dıştan içe uzanır.
- **Geri kalan:** 14 px yükselerek solma, `ease.out` (markanın imza eğrisi), yay (spring)
  ve sürekli dönme yok. Tek sürekli döngü kaydırma incisi (4 tekrar).
- Süreler `stage` ölçeğinde (yalnızca bir kez izlenen an); hiçbir giriş zıplamaz.

## 6. Kontrast

**Yöntem** (`node_modules/.cache/smoke-dugun/contrast.py`, git'e girmez):

- Bölüm çiftleri `themes.ts`'in dökümünden okunur. Yarı saydam renkler zemine
  karıştırılır (`surface` → `base` üstüne, alan → kart üstüne). Gradyanlı buton ve
  `bg-clip-text` başlıkta her durak ayrı denenir.
- Hero çiftleri gerçek katmanlardan örneklenir: video posteri (dikey 360×780 ve yatay
  1280×800, `object-cover`), PNG görseller, scrim/perde degradeleri, `Hale` tepe anı,
  huzme ve ışık sızıntısının tepe anı, mesh lekesinin metnin arkasındaki en kötü anı.
  Metin kolonu 14×14 hücreye bölünür; **en kötü hücre** raporlanır.
- Eşik: normal metin 4.5, büyük başlık (isim, bölüm başlığı) 3; harita iğnesi (ikon) 3.

**Sonuç:** 680 çift, **0 AA altı**. İlk ölçümde 13 çift AA altındaydı; düzeltmeler §11'de.

| Şablon | Bölüm en düşük | Çift | Hero en düşük | Çift / en kötü zemin |
|---|---|---|---|---|
| Dugun1 | 4.87 | placeholder / alan | 5.62 | accent / `#faf8f9` |
| Dugun2 | 5.01 | placeholder / alan | 5.32 | body / `#f8f8f5` |
| Dugun3 | 5.15 | placeholder / alan | 5.83 | body / `#faf7f8` |
| Dugun4 | 5.77 | placeholder / alan | 4.80 | accent / `#cbd3c1` (kemer yaprağı) |
| Dugun5 | 4.65 | placeholder / alan | 4.77 | accent / `#dee6df` |
| DugunAurora | 5.20 | placeholder / alan | 5.05 | body / `#553f4f` (mesh lekesi) |
| DugunBento | 4.74 | placeholder / alan | 5.61 | body / `#f5f2f7` |
| DugunBilet | 5.40 | placeholder / alan | 5.45 | body / `#ece8ef` |
| DugunBlueprint | 5.20 | placeholder / alan | 6.76 | body / `#1e1832` |
| DugunBrutal | 5.31 | accent / base | 5.31 | accent / `#f1eef3` |
| DugunCizgi | 5.19 | placeholder / alan | 5.55 | body / `#f3f0f5` |
| DugunDeco | 5.11 | placeholder / alan | 7.22 | body / `#0f0d13` |
| DugunDenizIsiltisi | 4.57 | placeholder / alan | 4.71 | body / `#dbecec` |
| DugunDokuma | 4.87 | placeholder / alan | 5.23 | body / `#f0ecef` |
| DugunFilm | 5.44 | placeholder / alan | 6.78 | body / `#120f15` |
| DugunGazete | 5.12 | placeholder / alan | 5.37 | body / `#ecebe9` |
| DugunGokyuzu | 5.24 | placeholder / alan | 5.24 | accent / `#cfddec` |
| DugunGulYapraklari | 5.37 | placeholder / alan | 4.55 | accent / `#cdb0b4` |
| DugunHerbaryum | 5.34 | placeholder / alan | 6.13 | body / `#f5f4f6` |
| DugunKagit | 5.11 | placeholder / alan | 5.10 | body / `#e6e1ea` |
| DugunKinetik | 4.68 | placeholder / alan | 5.32 | body / `#efecf2` |
| DugunKrom | 5.31 | placeholder / alan | 5.95 | body / `#292832` |
| DugunManzara | 5.27 | placeholder / alan | 5.21 | body / `#38363f` |
| DugunMermer | 4.95 | placeholder / alan | 5.24 | body / `#efecf2` |
| DugunModern | 5.34 | placeholder / alan | 7.24 | body / `#241a33` |
| DugunMumIsigi | 5.56 | placeholder / alan | 6.84 | body / `#2f2316` |
| DugunNoir | 4.73 | placeholder / alan | 6.86 | body / `#0b0a0e` |
| DugunOnyx | 5.73 | placeholder / alan | 5.69 | body / `#2c292e` |
| DugunPano | 5.32 | placeholder / alan | 6.72 | body / `#141018` |
| DugunPlak | 5.29 | placeholder / alan | 6.69 | body / `#161219` |
| DugunPosta | 5.16 | placeholder / alan | 5.57 | body / `#f0edf2` |
| DugunRiso | 5.33 | accent / base | 5.03 | accent / `#f1eef2` |
| DugunSade | 4.69 | placeholder / alan | 5.29 | body / `#efebf2` |
| DugunSahil | 4.81 | placeholder / alan | 5.11 | body / `#40383c` (tül panel) |
| DugunSekilli | 5.20 | placeholder / alan | 8.18 | body / `#14111b` |
| DugunSuluboya | 4.96 | placeholder / alan | 5.52 | body / `#f4f1f6` |
| DugunTerrazzo | 5.23 | placeholder / alan | 5.98 | body / `#f5f3f6` |
| DugunUfuk | 5.32 | placeholder / alan | 9.87 | body / `#0a0f24` |
| DugunVitray | 5.41 | placeholder / alan | 6.91 | body / `#140f1a` |
| DugunYildizHaritasi | 5.54 | placeholder / alan | 7.35 | body / `#0e0c1c` |

**Varsayımlar ve sınırlar:**

- Video katmanı tek bir kare (poster) ile ölçüldü; videonun başka kareleri farklı olabilir.
- Parçacıklar (yaprak, toz) anlık geçtiği için hesaba katılmadı.
- Dugun1–3'te süs görselleri metin kolonunun dışında varsayıldı (padding ile ayrılır);
  zemin `base` kabul edildi.
- 23 ortak hero'lu şablonda hero metni HeroStage zemininin orta durağıyla ölçüldü; ortak
  hero'ların kendi kart/panel yüzeyleri (`surface`) bölüm çiftlerinde ölçülen yüzeyle aynıdır.
- AA altında kalan dekoratif metin yok.

## 7. Doğrulama

| Betik | Ne yapar | Son sonuç |
|---|---|---|
| `npm run check` | lint + build + verify | yeşil (rapor) |
| `node_modules/.cache/smoke-dugun/build.mjs smoke.tsx` | 40 şablon × 3 senaryo `renderToString` + Suspense'i bekleyen `prerenderToNodeStream`; `undefined/NaN/Invalid Date/null` yasak | `40 şablon × 3 senaryo, 0 hata` |
| `python -I node_modules/.cache/smoke-dugun/contrast.py .` | §6 | `680 çift, 0 AA altı` |

Senaryolar: (a) `INITIAL_INVITATION` + `SHOWCASE_CONTENT`, galeri/program/hediye/LCV dolu,
zarf kapalı; (b) bütün `show*` kapalı, isim/başlık/alt başlık/mekân/harita/tarih boş;
(c) (a) + zarf. Pano'nun boş isim yedeği sunucu çıktısında aranmaz: kanatlar sunucuda
rastgele harfle başlayıp ismi istemcide yerleştirir.

## 8. Hangi şablon kendi hero'sunu aldı, neden

| Şablon grubu | Hero | Gerekçe |
|---|---|---|
| Dugun1–5, Sade, Manzara, Sekilli, Modern, Gökyüzü, Mum Işığı, Gül Yaprakları, Deniz Işıltısı, Sahil, Onyx, Aurora, Krom (17) | **KurdeleHero** (kategori hero'su) | Hepsi `Summary` kullanıyordu; Summary dokuz kategoride aynı, ön planda kategori farkı yoktu. Tek bir kategori hero'su 17 şablona aynı imzayı verir; `compact` ve `panelClassName` ile süslü/videolu zeminlere uyar |
| Bento, Noir, Kağıt, Deco, Riso, Bilet, Vitray, Kinetik, Tek Çizgi, Plak, Suluboya, Pano, Yıldız Haritası, Dokuma, Film, Mermer, Gazete, Posta, Brutal, Terrazzo, Teknik Çizim, Herbaryum, Ufuk (23) | Ortak hero (değişmedi) | Bu şablonların değeri tasarım dilinin kendisi; hero'yu değiştirmek dili silmek olurdu. Ayrışma tema ailesi, hero parametreleri, kurdele süsü ve bölüm karakteriyle sağlandı |

## 9. "Hareketi azalt" — kategorideki her animasyon kaynağı

| Kaynak | Şablonlar | Nasıl susturulur |
|---|---|---|
| Kurdele düğümü `pathLength` + çizgi `scaleX` | KurdeleHero'lu 17 | `useReducedMotion()` → baştan çizili |
| İsim x kayması, öğe y yükselişi, `&` ölçeği | KurdeleHero'lu 17 | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solar |
| Kaydırma incisi `animate-bob-down-6` | KurdeleHero'lu 17 | `index.css` reduce kuralı |
| Süs görseli girişleri (x/y/ölçek/dönüş) | Dugun1–5 | MotionConfig; opaklık solar |
| Sade çerçevesi (ölçek + opaklık), Sekilli kafesi (opaklık) | Sade, Sekilli | MotionConfig ölçeği atlar; opaklık solması kalır |
| Otomatik video | Gökyüzü, Mum Işığı, Deniz, Gül, Sahil, Onyx | `VideoBackdrop` video öğesini hiç basmaz, poster kalır |
| Atmosfer (`Hale`/`Halo`, `GodRays`, `LightLeak`, `AuroraMesh`, `GoldSheen`, `Iridescent`) | HeroStage'li şablonlar | `[data-atmosphere]` → `animation: none` (index.css) |
| Canvas parçacıkları | Gül, Sahil, Onyx, Aurora, Krom, Noir, Vitray | `ParticleField` tek durağan kare |
| İşaretçi parallax'ı | HeroStage'li şablonlar | `usePointerParallax` dinleyici kurmaz |
| Zarf | Hepsi | `Envelope` kendi reduce yolunu taşır |
| Ortak hero döngüleri (Plak dönüşü, Film/Mermer/Vitray süpürmesi, Terrazzo çakılları, Pano kanatları, Kinetik şerit, Yıldız/Tek Çizgi çizimi, Ufuk sahnesi) | İlgili ortak hero'lu şablonlar | Ortak dosyalarda; bu turda değişmedi |
| Teknik Çizim ve Herbaryum çerçeve çizimi (`pathLength`) | Blueprint, Herbaryum | Ortak hero'da `useReducedMotion` yok; tek seferlik çizim. Ortak öneri olarak raporda |
| Program çizgisi (kaydırmaya bağlı `scaleY`) | Hepsi | Ortak `Timeline`; değişmedi |

Kategoride canvas/rAF döngüsü, yeni CSS `@keyframes` ya da kaydırmaya bağlı yeni efekt yok.

## 10. Kına ve nişan için ayrışma notları

- **Renk:** Düğün soğuk inci + menekşe mürekkep + şakayık (pembe-mürdüm) + mersin aldı.
  Kına için sıcak kırmızı/kına turuncusu/bordo ve (isterse) altın serbest; nişan için
  şampanya-gül, ya da alyans metali. Şakayık `#9b3a63` ve inci `#efe8f3` düğüne ait sayılsın.
- **Motif:** Kurdele düğümü ve puantiyeli tül düğünün. Halkalar (alyans) nişana bırakıldı.
- **Hero:** KurdeleHero `dugun/parts` içinde ve düğüne özgü; kına/nişan kendi kategori
  hero'sunu yazmalı, bunu kopyalamamalı.
- **Bölüm karakteri:** Alt çizgili LCV alanı + hap buton düğünün. Kına/nişan kutu alanı ya
  da farklı köşe dili seçerek ayrışabilir.
- **Ortak şablon kayıtları:** `sade/manzara/sekilli/modern` kart kayıtları üç kategoride
  ortak; düğün görünümü artık kapaklarla çelişiyor (rapordaki öneri).

## 11. Bu turda yapılan kontrast düzeltmeleri

| Şablon | Sorun (ilk ölçüm) | Düzeltme |
|---|---|---|
| Dugun2 | placeholder 4.41 | `#6f7a70` → `#667168` |
| DugunBlueprint | placeholder 4.17 | `/55` → `/65` |
| Dugun4 | hero gövde 3.32 (kemer yaprakları) | perde ortası .45 → .60, gövde/vurgu koyulaştı |
| DugunGokyuzu | hero gövde 3.94 | perde 70/50/70, gövde/vurgu koyulaştı |
| DugunGulYapraklari | hero gövde 2.70 | scrim .50 + merkez .70, gövde/vurgu koyulaştı |
| DugunSahil | hero gövde 1.16 (videonun üst yarısı parlak altın gök) | tül panel %70 + ufuk bandı + huzme/sızıntı kısıldı |
| DugunAurora | hero gövde 2.60 (mesh lekesi) | mesh .55 → .30, merkez scrim .60, gövde açıldı |
| Koyu şablonlar | `Halo` animasyonu opaklığı ezip ~%64'te parlıyordu | `parts/Hale.tsx` ile dıştan kısıldı |
