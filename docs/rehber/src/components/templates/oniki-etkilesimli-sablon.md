# On iki etkileşimli şablon

> **Tarih:** 5 Kasım 2026 · **Frontend dalı:** `design/claude-davetiye`
> Kayıt: `src/components/templates/lazyPresets.ts` → `LAZY_ONIKI_PRESETS` · Katalog: `src/data.ts` (`TEMPLATE_PRESETS` sonu)

Bu tur ~40 dakikalık bir süre sınırıyla, soru sorulmadan yürütüldü. On iki şablon on iki alt ajana aynı anda
dağıtıldı. Her ajan yalnızca kendi klasörüne yazdı, `tsc` ile temizledi ve 390 px / 1440 px ekran
görüntülerine bakarak düzeltti. Kayıt (`lazyPresets.ts`, `data.ts`) ve commit'ler koordinatör tarafından yapıldı;
her şablon ayrı bir commit'tir.

- Hiçbiri video render etmez ve hiçbiri `minimumTier` almaz.
- Her birinde en az bir gerçek etkileşim ve katmanlı bir açılış koreografisi var.
- `mode === 'preview'` ve `prefers-reduced-motion` iken döngü/WebGL yoktur; son kare statik çizilir.

> 🔴 **Aynı turda düzeltilen hata:** önceki turun `LAZY_ALTI_PRESETS` nesnesi tanımlanmış ama `LAZY_PRESETS`'e
> hiç yayılmamıştı; altı hızlı şablon `TemplateRenderer`'dan erişilemiyordu. Artık `LAZY_PRESETS`
> `...LAZY_ALTI_PRESETS, ...LAZY_ONIKI_PRESETS` içerir.

---

## 1. Şablonlar

| Id | Klasör | Fikir | Teknik | Etkileşim |
|---|---|---|---|---|
| `dugun-kule-saati` | `dugun/DugunKuleSaati/` | Kule saati: dişliler, sarkaç, akrep-yelkovan; saat düğün saatini vurunca kapak açılır, isimler çıkar. | SVG dişli dizisi (36/18/28/14 diş; yarıçap diş sayısıyla orantılı, kavrayan dişliler ters yönde ve oranla döner), akrep = yelkovan/12, sarkaç gerçek zamanlı sinüs (`mekanizma.ts`). Tek rAF, SVG `transform`'u doğrudan yazar. Açılışta saat düğün saatinden 3 saat önceden düğün saatine sarar; vurunca halkalar yayılır, kapaklar açılır, baş harfler ve isimler çıkar. | Kaydırma: bir ekran = 12 saat ileri; saate dokun → bir saat kurar ve yeniden vurur. |
| `dugun-yorunge` | `dugun/DugunYorunge/` | İki gezegen ayrı yörüngelerden yaklaşıp tek altın yörüngede buluşur; bölümler "uydu durakları". | R3F, `shared/three` (`ThreeStage`/`SceneCanvas`); sahne `YorungeSahnesi.tsx` ayrı chunk. Yörünge matematiği `yorunge.ts`'te, 3B sahne ve SVG yedeği aynı kareyi çizer. | Yatay sürükle / ←→ ile sistemi döndür (ataletli); kaydırma birleşmeyi tamamlar; eğim/fare kamera kaydırır. |
| `dugun-opera` | `dugun/DugunOpera/` | Kırmızı kadife perde dalgalanarak açılır, spotlar sahneyi tarar, localar ve altın varak; program "Perdeler & Sahneler". | Canvas 2B: perde kenarı 26 sönümlü yaylık zincir, 84 kıvrım şeridi (`perdeMotoru.ts`). Localar SVG. Başlıklar flavor ile yeniden adlandırıldı. | Perdeye dokun / "Perdeyi aç / kapat"; imleç spotları yönlendirir; kenarı ovmak dalga gönderir. |
| `nisan-kahve-fali` | `nisan/NisanKahveFali/` | Türk kahvesi fincanı ters çevrilir, telve akarak desen oluşturur, aradan isimler, tarih ve "fal" çıkar. | SVG fincan; `motion` 3B çevirme; canvas 2B ~2.800 tohumlu telve tanesi, 3 sn akış. | Fincan bir `<button>`; "Falı hemen göster" atlama butonu. |
| `nisan-kiraz-agaci` | `nisan/NisanKirazAgaci/` | Prosedürel kiraz ağacı dallanarak büyür, çiçek açar, yapraklar savrulur; kaydırma mevsimi ilerletir (tomurcuk → çiçek → döküm → kiraz). | Tohumlu özyinelemeli dallanma (7 seviye), canvas 2B (`kirazMotoru.ts`); tek "mevsim" değeri her şeyi sürer. | Dokun/sürükle → rüzgâr hamlesi (yaprak koparır, ağacı sallar). |
| `kina-ceyiz-sandigi` | `kina/KinaCeyizSandigi/` | Oymalı ceviz sandık açılır, içinden oyalı örtü, yazma ve işlemeli örtü katman katman yükselir; bölümler katlı örtü gibi görünür. | SVG sandık (ahşap damar filtresi, rozet, pirinç kilit); CSS 3B menteşeli kapak (`rotateX(-158deg)`); `theme.surface` = oya kenarlı bez sınıfı. | Sandık bir `<button>` (aç/kapat); 3,6 sn dokunulmazsa kendiliğinden açılır. |
| `sunnet-golge-oyunu` | `sunnet/SunnetGolgeOyunu/` | Arkadan aydınlatılmış perdede özgün figürler (şehzade, at, saray) üç sahnede davet hikâyesini anlatır. Bilinen karakter yok. | Eklemli SVG (her uzuv kendi ekleminde döner), tek rAF saatiyle `poses(scene, k, t)`; gölge ofseti lamba konumundan. | Dokun → sonraki sahne; sürükle → lambayı taşı; Enter/Space ve oklar. |
| `dogum-gunu-arcade` | `dogum-gunu/DogumGunuArcade/` | Oynanabilir mini platform oyunu: özgün küp robot zıplayarak tarih/mekân/program jetonlarını toplar. | Canvas 2B, sabit 1/60 sn adım (`motor.ts`); "INSERT COIN → READY → oyun" açılışı; `showEnvelope: false`. | Dokun/Space/↑ zıpla, →/← hız; "Oyunu atla" her an görünür; düz bilgi listesi her zaman var. |
| `mezuniyet-kara-tahta` | `mezuniyet/MezuniyetKaraTahta/` | Tebeşir dokulu kara tahta; bilgiler el yazısıyla yazılır, tebeşir tozu düşer, silgi ile panel değişir. | SVG `feTurbulence` tebeşir filtresi, Caveat yazı + soldan sağa clip açılışı, `pathLength` karalamalar; canvas 2B toz (`tebesirMotoru.ts`). | Silgi butonu → sonraki panel; tebeşire dokun → parmakla tahtaya çiz. |
| `baby-donence` | `baby-shower/BabyDonence/` | Beşik dönencesi: ipe asılı ay, yıldız, bulutlar sallanır; kaydırınca döner, bilgiler figürlerin arkasından çıkar. | Figür başına sönümlü sarkaç, tek rAF entegratörü, doğrudan DOM yazımı; halka düz elips izdüşümü. | Figüre dokun → savrulur (komşular da sallanır); kaydırma halkayı ataletle döndürür. |
| `parti-disko-topu` | `parti/PartiDiskoTopu/` | Dönen aynalı disko topu, duvarlara dağılan ışık benekleri, neon tipografi, ritimli ışık süpürmeleri. | Canvas 2B: 16 enlem bandı faset, normal tabanlı gölgeleme + Blinn-Phong parıltı (`diskoMotoru.ts`); ikinci canvas'ta 70 benek, 3 ışın, neon zemin ızgarası. | Sürükle → topu hızlandır (sürtünmeyle yavaşlar); dokun → "beat" flaşı + benek patlaması (0,5 sn bekleme, ≤2 flaş/sn). |
| `kurumsal-izometrik` | `kurumsal/KurumsalIzometrik/` | İzometrik mimari maket; kaydırdıkça katlar ayrılır, her kat bir bölüm (Ajanda, Mekân, Galeri, Katkı, LCV). | El yapımı SVG izometrik izdüşüm; katlar yalnızca verisi olan bölümler için çizilir. rAF/zamanlayıcı yok. | Kat veya alttaki çipe dokun → o bölüme kaydırır; hover/focus katı vurgular. |

## 2. Ortak kurallar (on ikisinde de)

- **Desen:** `InvitationComposition` + kendi `SectionTheme`'i (`themeOverride`) + kategori flavor'ından türetilmiş
  flavor + `renderBackdrop` / `renderHero` + `useHeroData` / `HeroCountdown` / `NO_NAMES` (`shared/yedi`).
  Timeline, Details, Gallery, RSVPForm bölümlerini kompozisyon çizer; boş veri olan bölüm orada gizlenir.
- **Önizleme / azaltılmış hareket:** rAF döngüsü ve WebGL yok; son kare bir kez çizilir.
- **Mobil:** 390 px öncelikli; canvas'larda DPR en fazla 2 (three tarafında `dprFor`, en fazla 1,75).
  Sürüklenen canvas'lar `touch-action: pan-y` kullanır; dikey kaydırma çalışır.
- **Temizlik:** rAF, zamanlayıcı, `ResizeObserver` ve dinleyiciler unmount'ta kaldırılır.
- **Kapak görselleri:** `public/images/sablonlar/<id>.svg` — **geçici** düz SVG yer tutucular (ad + renk).

## 3. Bilinen sınırlar

**Genel**
- Ekran görüntüleri ajanların kendi Playwright betikleriyle alındı. `scripts/onizleme/cek.ts` bu ortamda
  Chromium'a bağlanamadı ve 390/1440 genişliklerini desteklemiyor. Birkaç koşuda tek bir kaynak 404 verdi;
  kaynağı izlenmedi (şablon dışı göründü).
- Açılış saatleri çoğunda bileşen yüklenince başlar; zarf açıkken koreografinin bir kısmı zarfın arkasında
  oynayabilir (Opera zarfın `revealed` sinyalini bekler, diğerleri beklemez).

**Şablon bazında**
- **Kule Saati:** saat gerçek anı değil, düğün saatinden 3 saat önceyi gösterir; saat verilmemişse 19:00. Kapaklar
  yalnızca bir kez açılır. Kare kısılırsa 5,5 sn'lik güvenlik zamanlayıcısı kapağı açar. İsim yoksa kadran
  penceresi boş kalır.
- **Yörünge:** sağ kenardaki "uydu" rayı bir kaydırma göstergesidir; bölüm konumlarına bağlı değildir ve
  gizli bölüm olsa da 5 durak gösterir. Telefonda ray kartlara ~8 px yakın. Sürükleme alanı yalnızca hero'nun
  orta bandı. Azaltılmış harekette hep SVG yedeği kullanılır.
- **Opera:** dar ekranda localar kırpılır (dekoratif şerit gibi okunur). Program maddeleri "I. Perde" diye
  numaralanmaz; yalnızca başlık değişti. 1440 px'te alt kıvrımlar hafif çizgili görünür.
- **Kahve Falı:** zamanlı otomatik açılış yok (erişilebilirlik yolu "Falı hemen göster"). Kuş deseni gevşek
  tanınır. Fal metni sabittir, veriden gelmez. Boş veri senaryosu görsel olarak denenmedi.
- **Kiraz Ağacı:** yapraklar yalnızca hero içinde düşer. Geç mevsimler (döküm, kiraz) ağaç ekrandan çıkarken
  oynar, kısmen görünür. Rüzgâr hamlesinin klavye karşılığı yok (dekoratif, canvas `aria-hidden`).
- **Çeyiz Sandığı:** sandık açılana kadar tarih/geri sayım gizli, isimlerle sandık arasında boşluk kalır.
  Bölüm kartlarının kaydırmayla açılması yalnızca scroll-driven animation destekleyen tarayıcılarda.
  `<style>` bloğu her hero'da bir kez enjekte edilir.
- **Gölge Tiyatrosu:** sahneler yalnızca ilk oynatmada kendiliğinden ilerler; sonrası dokunmayla. Geçiş
  ortasında dokunulursa poz harmanlanmadan atlar. Şaha kalkan atın arka toynakları zemin çizgisinin biraz altında.
- **Arcade:** oyun açıkken Space ve oklar tüm pencerede yakalanır. Bir testte oyun kapandıktan sonra Space'e
  basmaya devam edilince sayfa beyaz kaldı; neden bulunamadı (ortak düzende olabilir) — **ilk kontrol edilecek
  konu**. Boş veride sayaç "0/0" gösterir. Piksel yazı tipi yok, sistem monospace.
- **Kara Tahta:** Google Fonts yüklenemezse Cormorant'a düşer. Tahta boyutu değişince (döndürme) çizim
  temizlenir. Tahta sabit yükseklikte (420/440 px); çok uzun isimler sıkışabilir. Boş veri denenmedi.
- **Dönence:** dönüş düz izdüşüm (gerçek 3B değil); figürler kesişirken arkadaki öndekinin üstüne çıkabilir.
  Önizleme ve azaltılmış hareket yalnızca kod okunarak doğrulandı.
- **Disko Topu:** duvar benekleri düz bir bantta; fasetlerden hesaplanmaz. İki canvas döngüsü canlı modda
  davetiye açık kaldıkça sürer. Özel neon yazı tipi yok.
- **İzometrik Maket:** bölüme atlama, paylaşılan bölümlerin `<h2>` metnini şablonun başlıklarıyla eşleştirerek
  çalışır (bölümlerde id yok); başlıklar değişirse atlama bozulur. SVG tam ayrık durum için yükseklik
  ayırdığından kaydırmadan önce binanın üstünde boşluk var. Kat etiketleri 390 px'te ~10–11 px.

## 4. Doğrulama

- On iki şablonun tamamı kaydedildi. Her commit öncesinde `npm run lint && npm run build` geçti.
- İlk 11 şablonun commit'lenmiş hâli ayrı bir worktree'de `tsc`, `build` ve `verify:render` ile doğrulandı.
- **Yapılmadı:** insan gözüyle gerçek cihazda deneme ve gerçek kapak görselleri. İlk iş: Arcade'deki beyaz
  sayfa gözlemi ve zarf açıkken açılış koreografilerinin zamanlaması.
