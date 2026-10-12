# Kına kategorisinin görsel kimliği — "Al & Kına"

> **Kapsam:** `src/components/templates/kina/**` (35 şablon, `flavors.tsx`, `themes.ts`, `parts/`)
> **Denetim:** `npm run check`; kına duman testi, kontrast betikleri ve görsel öz-kontrol (§9)
> **Okuyacaklar:** nişan, doğum günü, mezuniyet, baby shower ve parti tasarım ajanları — §10 onlar için yazıldı

---

## 1. Özet

Kına artık "koyu zemin + şampanya altını" ya da genel bir "bordo" değil. Kimlik
**kınanın kendi renkleri** üzerine kurulu: avucun **şeftali kremi**, kurumuş kınanın
**kahvesi** (mürekkep), taze kınanın **turuncusu** (imza), gelin duvağının **alı** ve süs
olarak bindallı işlemesinin **sırması** ile kuru kına yaprağının **zeytini**. Koyu
şablonlarda zemin mor ya da lacivert değil, **ıs** (mum isi gibi sıcak kahve-siyah).
Motif dili törenin nesneleri: **kına tepsisi**, avuca konan **kına damgası**, **bindallı
dalı**, **al duvak oyası**, **mum**. Hareketin karakteri **yakılma ve titreme**: öğeler
bulanıktan netleşir, damga ortadan yayılır, alevler titrer.

## 2. Palet

Tek kaynak `parts/palette.ts`; tema sınıflarında değerler açık yazılır.

| Rol | Ad | Hex | Nerede |
|---|---|---|---|
| Açık zemin | Avuç | `#f8ebdf` | Açık temaların `base`'i (fildişi değil, şeftali) |
| Açık degrade ucu | Avuç derin | `#efd6c1` | Hero degradeleri |
| Kıl çizgi | Kına tozu | `#e4c4ab` | `border`, zarf kartı kenarı |
| Başlık | Mürekkep | `#33140c` | Açık `heading`, koyu düğme dolgusu |
| Sayfa metni | Mürekkep orta | `#52261a` | Açık `page` |
| Gövde | Gövde | `#7a4532` | Açık `body` |
| İmza | Kına | `#c4581d` | Damga, süs, zarf mührü (koyu) |
| Kına metni | Kına koyu | `#a4451a` | Açık `accent` |
| Koyu vurgu | Kına ışığı | `#f2a066` | Koyu `accent`, düğme |
| Duvak | Al | `#b0241c` | Açık temada birincil düğme, mühür, etiket |
| Duvak koyu | Al koyu | `#871a15` | Kenar, damga halkası |
| Süs | Sırma | `#d8a24a` | Yalnızca süs ve koyu zeminde ince vurgu (çerçeve, oya, bant) |
| Alev | Mum | `#ffd27f` | Mum alevi, ışık |
| Koyu zemin | Is | `#1b0c07` | Koyu temaların `base`'i |
| Kadife | Kadife | `#4a0f1f` | Bindallı (Sekilli), zarf kâğıdı |
| Botanik | Yaprak / yaprak açık | `#666a2c` / `#b9b56d` | Tek Çizgi, Herbaryum, Manzara, leke üçlülerinin üçüncüsü |

**Bilerek dışarıda bırakılanlar:** şampanya altını (`#c9a961`, `#d4af5f`) — sırma yalnızca
süstür, düğme ya da başlık rengi olmaz; fildişi `#f5f1ea`; şakayık `#9b3a63` ve inci (düğün);
sax mavisi, nazar laciverti ve turkuazı (sünnet); petrol `#1f6f6a` ve pembe `#dd6b7a`
(eski kına temalarında vardı, kaldırıldı); mor gece zemini.

**Sünnet kırmızısından ayrışma:** sünnetin nar kırmızısı `#c3263c` mavi zemin üstünde soğuk,
pembeye çalan bir kırmızı. Kınanın alı `#b0241c` daha sarı ve koyu; hiçbir kına temasında
mavi zeminle yan yana gelmez.

## 3. Tipografi

| Katman | Yazı | Tavır |
|---|---|---|
| Adlar (KinaHero) | Playfair Display **dik**, 500, `leading-[1.04]` | İtalik değil: düğünün Cormorant italiğinden ve sünnetin Playfair italiğinden ayrı |
| `&` | Cormorant Garamond italik 600, kına damgasının içinde | Tek italik öğe; damga rengi üstünde krem `#fff4ea` |
| Küçük başlıklar | Inter 10–11 px, 600, büyük harf, `tracking-[0.34em]` | `lang="tr"` altında Türkçe büyük harf (İ) |
| Tarih | Playfair 24–28 px; gün/saat Inter büyük harf | Künye: `SALI · SAAT 19:00` / `9 Şubat 2027` / iğne + mekân |
| Gövde | Inter light 14–16 px | |

Yeni font yok; yalnızca yüklü üç aile.

## 4. Motif

| Motif | Dosya | Kullanım |
|---|---|---|
| Kına tepsisi | `parts/TepsiIcon.tsx`, `KinaMum/TepsiSahnesi.tsx` | Zarf mührü ve ortak hero'ların süs yuvası (`flavor.Ornament`); Mum'un sahnesi |
| Kına damgası | `parts/KinaDamga.tsx` | `&` yuvası; Sade'nin köşe lekeleri; Modern'in dev krem lekesi |
| Bindallı dalı ve köşesi | `parts/BindalliDal.tsx` | KinaHero ayracı, Sekilli çerçevesi, Sade köşeleri, bölüm deseni (`flavors.tsx`) |
| Al duvak oyası | `KinaBordo/KinaBordo.tsx` (`Duvak`) | Bordo'nun tepesinden sarkan kavisli tül ve iğne oyası pulları |
| Mum | `parts/MumSayac.tsx` | Dört mumlu geri sayım |
| Yüksek tepeler | `KinaManzara/TepelerSahnesi.tsx` | Kına türküsünün manzarası |
| Dövme bakır | `KinaKrom` (`CekicIzi`), Deco/Monogram/Takvim parametreleri | Altın yerine bakır metal |

Tüm yeni görseller kodla çizilmiş özgün SVG/CSS; mehendi/hint deseni, belirli bir sanatçı
ya da marka çizimi yok. Eski süs (mandala yıldızı) Hint mehendi'sini andırdığı için kalktı.

## 5. Hareket karakteri — "Yakılma ve titreme"

- **Yakılma:** tepsi süsü bulanıktan netleşerek büyür (1.4 s); başlık, adlar ve künye
  `blur(6px) → 0` + 16 px yükselişle sırayla gelir (0.25 → 1.2 s).
- **Damga:** `&` lekesi `scale 0.4 → 1` ile avuçta yayılır (0.7 s gecikme).
- **Bindallı dalı:** ortadan iki yana açılır (`scaleX 0.5 → 1`).
- **Titreme:** alevler `kina-flicker` (tabandan ölçek + ±2.5° dönüş, 2.6 s), ışıklar
  `kina-glow` (opaklık 0.62 ↔ 1). Her mum farklı fazda: tek bir alev değil, bir oda dolusu mum.
- Yay (spring), zıplama ve sürekli dönme yok; eğri markanın `ease.out`'u.
## 6. Kontrast

**Yöntem** (betikler `node_modules/.cache/kina/`, git'e girmez):

- **Bölüm çiftleri** (`contrast.ts`, `node run.mjs contrast.ts`): temalar `themes.ts`'ten
  okunur. Yarı saydam renkler zemine karıştırılır (`surface` → `base`, alan → kart). Bölüm
  zemini, kategori deseninin en kötü pikseli olarak vurgunun %40 × %13'ü ile karıştırılır.
  Gradyanlı düğme ve `bg-clip-text` başlıkta her durak ayrı denenir. Zarf mührü (ikon)
  ve zarf kartı etiketi/isimleri dahil. Sonuç: **571 çift, 0 AA altı**.
- **Hero çiftleri** (`textbox.py`): her şablon 360 × 780 dolu senaryoda headless Chrome ile
  çekilir; tema gövde rengine yakın (RGB mesafesi < 28) pikseller satır satır kümelenir,
  her satır kutusunun **baskın rengi** (5 bit nicem) metnin gerçek zemini sayılır ve
  en düşük satır raporlanır. Gövde metni en soluk metin olduğu için en kötü durumdur;
  başlıklar (eşik 3) hep daha yüksek çıktı.
- **Ayıklanan sahte eşleşmeler** (gözle doğrulandı): Manzara'da yakın tepe rengi, Riso'da
  başlığın riso gölgesi, Saray'da `&` damgası, Ebru ve Çini'de desen. Bento, Posta ve
  Herbaryum'da metin kartın içinde; zemini bölümlerde ölçülen `surface`.
- Eşik: normal metin 4.5, büyük başlık 3, ikon 3.

| Preset | Bölüm en düşük | Çift | Hero en düşük | Çift / gerçek zemin |
|---|---|---|---|---|
| `sade` | 4.85 | accent/zemin | 6.63 | gövde / `#f8ece0` |
| `manzara` | 5.22 | accent/zemin | 5.79 | gövde / `#f5d3b5` |
| `sekilli` | 7.66 | input placeholder | 7.46 | gövde / `#541223` |
| `modern` | 4.67 | accent/zemin | 5.34 | gövde / `#e78952` |
| `kina-bordo` | 4.07 | zarf mührü (ikon) | 8.39 | gövde / `#3c1219` |
| `kina-film` | 5.98 | input placeholder | 7.73 | gövde / `#170b06` |
| `kina-mermer` | 5.15 | accent/zemin | 5.87 | gövde / `#f1dbcb` |
| `kina-gazete` | 5.97 | accent/zemin | 7.43 | gövde / `#fbf4ec` |
| `kina-posta` | 5.72 | accent/zemin | — | metin kartta (bölüm `surface` çifti) |
| `kina-suluboya` | 5.12 | accent/zemin | 5.43 | gövde / `#e1a8a3` |
| `kina-pano` | 5.82 | input placeholder | 6.88 | gövde / `#2e140c` |
| `kina-yildiz-haritasi` | 5.83 | input placeholder | 7.06 | gövde / `#2c1414` |
| `kina-dokuma` | 5.46 | accent/zemin | 7.61 | gövde / `#fcf3e9` |
| `kina-cizgi` | 5.97 | input placeholder | 7.01 | gövde / `#f8eee2` |
| `kina-plak` | 5.31 | input placeholder | 7.03 | gövde / `#2a130a` |
| `kina-vitray` | 5.56 | input placeholder | 7.38 | gövde / `#22120d` |
| `kina-kinetik` | 5.51 | accent/zemin | 5.58 | gövde / `#942019` |
| `kina-deco` | 5.26 | input placeholder | 7.05 | gövde / `#2c160d` |
| `kina-riso` | 4.86 | accent/zemin | 6.99 | gövde / `#f3e4d2` |
| `kina-kagit` | 5.25 | accent/zemin | 6.51 | gövde / `#ece4dc` |
| `kina-aurora` | 4.07 | zarf mührü (ikon) | 8.07 | gövde / `#541a05` |
| `kina-bento` | 5.78 | input placeholder | — | metin kartta (bölüm `surface` çifti) |
| `kina-noir` | 4.82 | input placeholder | 6.40 | gövde / `#1c0d09` |
| `kina-krom` | 5.18 | input placeholder | 7.80 | gövde / `#221611` |
| `kina-saray` | 4.95 | buttonPrimary | 9.60 | gövde / `#290b07` |
| `kina-mum` | 5.44 | input placeholder | 7.17 | gövde / `#3e1a0c` |
| `kina-brutal` | 5.31 | accent/zemin | 9.00 | gövde / `#fffaf4` |
| `kina-terrazzo` | 5.59 | accent/zemin | 6.46 | gövde / `#eae4d7` |
| `kina-blueprint` | 4.81 | input placeholder | 7.32 | gövde / `#3a170e` |
| `kina-herbaryum` | 5.84 | accent/zemin | — | metin kartta (bölüm `surface` çifti) |
| `kina-ufuk` | 6.01 | input placeholder | 5.21 | gövde / `#6c3926` |
| `kina-cini` | 5.59 | accent/zemin | 7.34 | gövde / `#fbf1e6` |
| `kina-ebru` | 5.76 | accent/zemin | 7.13 | gövde / `#f3ece4` |
| `kina-monogram` | 6.37 | input placeholder | 6.23 | gövde / `#562c22` |
| `kina-takvim` | 5.28 | accent/zemin | 5.50 | gövde / `#f6c9a8` |

**En düşükler:** bölümlerde normal metin **4.67** (Modern, vurgu / turuncu zemin); ikon
4.07 (Aurora ve Bordo zarf mührü, eşik 3). Hero'da **5.21** (Ufuk, mekân satırı kubbe
siluetinin üstünde).

**Bu turda düzeltilen:** Suluboya hero gövdesi al lekenin üstünde **4.02** idi → gövde
`#76412e` → `#5e2f1f`, **5.43**.

**Varsayımlar ve sınırlar:** video katmanı (Bordo) headless çekimde poster/ilk kare ile
ölçüldü; `Halo` ve mesh'in tepe anları ayrıca ölçülmedi, çekim anındaki kare ölçüldü
(Bordo ve Aurora'da gövde ≥ 8, pay geniş). Parçacıklar hesaba katılmadı.

## 7. "Hareketi azalt" — kategorideki her animasyon kaynağı

| Kaynak | Şablonlar | Nasıl susturulur |
|---|---|---|
| KinaHero girişleri: `y` 16 px, damga `scale`, dal `scaleX` | KinaHero'lu 9 | `MotionConfig reducedMotion="user"` transform'u atlar; opaklık ve bulanıklık solar (yer değiştirme yok) |
| Mum sayacı / satır sayacı `y` | KinaHero'lu 9 | MotionConfig |
| Alevler `kina-flicker`, ışıklar `kina-glow` (CSS keyframe) | Tepsi süsü (zarf mührü ve süs yuvası olan her şablon), mum sayacı, Tepsi ve Tepeler sahneleri | `parts/motion.tsx` içindeki `@media (prefers-reduced-motion: reduce)` + her öğede `data-atmosphere` (index.css kuralı) |
| Sahne girişleri (tepsi, tepeler `y`; Sade ve Modern lekeleri `scale`) | Mum, Manzara, Sade, Modern | MotionConfig; opaklık solar |
| Sekilli köşe süsleri | Sekilli | Yalnızca opaklık |
| Kaydırma ipucu `animate-bob-down-6` | KinaHero'lu 9 | index.css reduce kuralı |
| Video | Bordo | `VideoBackdrop` reduce'da video basmaz, poster kalır |
| Atmosfer (`Halo`, `SilkVeil`, `AuroraMesh`, `LightLeak`, `Arches`, `GoldSheen`, `Iridescent`, `Sunburst`, `GodRays`) | HeroStage'li şablonlar | `[data-atmosphere]` → `animation: none` |
| Canvas parçacıkları | Aurora, Bordo, Krom, Mum, Noir, Saray, Vitray | `ParticleField` tek durağan kare |
| İşaretçi parallax'ı | HeroStage'li şablonlar | `usePointerParallax` dinleyici kurmaz |
| Ortak hero döngüleri (Plak dönüşü, Pano kanatları, Kinetik şerit, Yıldız/Tek Çizgi/Teknik Çizim/Herbaryum çizimi, Ufuk sahnesi…) | İlgili ortak hero'lu şablonlar | Ortak dosyalarda; değişmedi |

Kategoride yeni canvas/rAF döngüsü, `useScroll` ya da otomatik video yok. Yeni CSS
keyframe'ler (`kina-flicker`, `kina-glow`) yalnızca `transform`/`opacity` değiştirir.

## 8. Hangi şablon kendi hero'sunu aldı, neden — ve görsel öz-kontrol

| Grup | Hero | Gerekçe |
|---|---|---|
| Sade, Manzara, Sekilli, Modern, Bordo, Saray, Mum, Aurora, Krom (9) | **KinaHero** | Hepsi `Summary` kullanıyordu: dokuz kategoride aynı ön plan. Kategori hero'su törenin sırasını (tepsi → başlık → adlar ve damga → dal → künye → mumlar) taşır. |
| Diğer 26 | Ortak hero (değişmedi) | Değerleri tasarım dilinin kendisi; ayrışma tema ailesi, hero parametreleri (bakır metal, kına iplikleri, al etiket…), tepsi süsü ve bölüm karakteriyle. |

**Aynı hero'yu kullanan dokuzun ayrışması:** ilk öz-kontrolde Mum, Bordo, Sekilli ve Saray
360 px'te birbirinin kopyası gibiydi (aynı yığılmış adlar, aynı mum sayacı, şarap zemin;
Mum'un tepsisi ilk ekranın dışında). KinaHero'ya `names` (alt alta / tek satır), `timer`
(mum / satır) ve `ornament` eklendi; Mum'un tepsisi tepeye, Manzara'nın tepeleri ilk
ekrana alındı, Bordo'ya tepeden sarkan al duvak çizildi. Ayrıntılı tablo:
[parts/KinaHero.md](parts/KinaHero.md) §5.

**Öz-kontrol** (`__harness__`, headless Chrome; görüntüler `node_modules/.cache/kina/shots/`):

| Görüntü | Ne görüldü |
|---|---|
| 360 × 780 temas sayfası, 35 şablon, dolu | Hiçbir iki şablon aynı değil; KinaHero'lu dokuz zemin, siluet ve ad düzeniyle ayrı |
| 768 × 1024 temas sayfası | Örtüşme yok |
| 1280 × 800 temas sayfası | Örtüşme yok; Saray'ın mum sayacı ilk ekranın altına taşar (kaydırınca görünür) |
| 360 × 780 boş senaryo | 35'inde "Davetlisiniz" yerinde; Gazete'de ortak hero bir "D" baş harfi, Takvim'de "Takvim" ay yedeği bırakır (ortak davranış) |
| Ufuk 360 / 768 kırpım | Mekân satırı kubbe siluetinin üstünde, sayaç kendi koyu hapında; süs değil sahne, okunur (5.21) |

## 9. Doğrulama

| Betik | Ne yapar | Son sonuç |
|---|---|---|
| `npm run check` | lint + build + verify (`verify:render` dahil) | yeşil, `EXIT 0` |
| `node node_modules/.cache/kina/run.mjs smoke.tsx` | 35 şablon × 3 senaryo, `renderToString` + Suspense'i bekleyen `prerenderToNodeStream`; metinde ve öznitelikte `undefined/NaN/Invalid Date/null` yasak; boşta "Davetlisiniz", dolu senaryoda "Kına Gecesi Programı" etiketi aranır | `35 şablon × 3 senaryo = 105 çizim, 0 hata` |
| `node node_modules/.cache/kina/run.mjs contrast.ts` | §6 bölüm çiftleri | `571 çift, 0 AA altı` |
| `python -I node_modules/.cache/kina/textbox.py <id…>` | §6 hero çiftleri | en düşük 5.21 |

Senaryolar: (a) `INITIAL_INVITATION` + `SHOWCASE_CONTENT`, galeri/program/hediye/LCV dolu,
zarf kapalı; (b) bütün `show*` kapalı, ad/başlık/alt başlık/mekân/harita/tarih boş;
(c) (a) + zarf. Pano'nun boş ad yedeği istemcide yerleştiği için sunucu çıktısında aranmaz.

## 10. Sonraki kategoriler için ayrışma notları

- **Renk:** Kına sıcak toprak ailesini aldı: şeftali krem, kına kahvesi, kına turuncusu
  `#c4581d`, al `#b0241c`, ıs `#1b0c07`, süs olarak sırma `#d8a24a` ve zeytin `#666a2c`.
  Nişan bunlardan ve düğünün inci/şakayığından uzak durmalı (ör. şampanya-gül, yüzük
  metali); doğum günü ve parti doygun turuncu-kırmızıyı kınaya bıraksın.
- **Metal:** Deco, Monogram, Takvim ve Krom'da metal **bakır**. Düğün inci, kurumsal platin
  aldı; nişan için altın ya da gül altını hâlâ boşta.
- **Motif:** Tepsi, mum, kına damgası (düzensiz leke), bindallı dalı, al duvak oyası kınaya
  ait. Mum sayacı kınanın; başka kategori geri sayımı mumla çizmesin.
- **Tipografi:** Adlar Playfair **dik**. Düğün Cormorant italik, sünnet Playfair italik +
  Inter büyük harf aldı; Cormorant dik ya da Inter ağırlıklı bir başlık sonrakilere açık.
- **Bölüm karakteri:** 10 px köşeli "tepsi" düğme + dolgulu kutu alan kınanın. Düğün hap
  düğme + alt çizgi aldı; nişan/doğum günü keskin köşe ya da tam yuvarlak seçebilir.
- **Sahne dersi:** sahne 360 × 780'in ilk ekranında görünmüyorsa şablon ayrışmaz (Mum ve
  Manzara'nın ilk sürümü). Sahneyi tepeye alın ya da hero'yu kısaltın.

## 11. `data.ts` kart değerleri

Kart (vitrin, kategori listesi) şablonun yeni görünümüyle çelişmesin diye. Ortak dört
preset (`sade`, `manzara`, `sekilli`, `modern`) için bu satırlar
**`categoryOverrides.kina`** değerleridir (`TemplatePresetLook`); diğerleri preset'in
kendi alanlarıdır. **Kalın** ad, bugünkü addan farklı olan öneridir. Ortak dört preset'in
bugünkü kapakları (`/images/emerald-640.webp`, `/images/corporate-640.webp`,
`/images/moda-gece.svg`, `/images/dugun-sade.svg`) kına görünümüyle çelişir; override'da
boş `imageUrl` kartı degradeye düşürür. Bordo ve Ufuk kapakları değişmez (soyut ipek,
ortak ufuk ön ayarı).
| Preset | `name` | `primaryColor` | `backgroundStyle` | `titleColor` | `btnColor` | `imageUrl` |
|---|---|---|---|---|---|---|
| `sade` (override) | **Avuç İçi** | `#f8ebdf` | `bg-gradient-to-br from-[#f8ebdf] via-[#efd6c1] to-[#c4581d]` | `text-[#33140c]` | `bg-[#b0241c] hover:bg-[#981d16] text-[#fdf3ea]` | `''` |
| `manzara` (override) | **Yüksek Tepeler** | `#f7e5d3` | `bg-gradient-to-br from-[#f7e5d3] via-[#f4d0b0] to-[#6c2e1a]` | `text-[#2e120a]` | `bg-[#2e120a] hover:bg-[#4a2215] text-[#f7e5d3]` | `''` |
| `sekilli` (override) | **Bindallı** | `#3a0b17` | `bg-gradient-to-br from-[#3a0b17] via-[#5a1426] to-[#d8a24a]` | `text-[#fbe9d6]` | `bg-[#ebbb62] hover:bg-[#f3ca7c] text-[#2a0810]` | `''` |
| `modern` (override) | **Kına Turuncusu** | `#ec8f57` | `bg-gradient-to-br from-[#ec8f57] via-[#ec8f57] to-[#fbe6cf]` | `text-[#260a04]` | `bg-[#260a04] hover:bg-[#40160b] text-[#fff1e4]` | `''` |
| `kina-bordo` | **Al Duvak (Videolu)** | `#1d0710` | `bg-gradient-to-br from-[#1d0710] via-[#61121f] to-[#b0241c]` | `text-[#fdeee4]` | `bg-[#f4a76c] hover:bg-[#f7b986] text-[#2b0a12]` | değişmez |
| `kina-film` | Film Şeridi | `#120805` | `bg-gradient-to-br from-[#120805] via-[#2a140c] to-[#f2a066]` | `text-[#fdeee2]` | `bg-[#f2a066] hover:brightness-110 text-[#120805]` | `''` (değişmez) |
| `kina-mermer` | Mermer & Rölyef | `#f7ebe1` | `bg-gradient-to-br from-[#f7ebe1] via-[#f4e1d2] to-[#b9734e]` | `text-[#2e140c]` | `bg-[#2e140c] hover:bg-[#4a2418] text-[#f7ebe1]` | `''` (değişmez) |
| `kina-gazete` | Gazete Manşeti | `#f6ecdf` | `bg-gradient-to-br from-[#f6ecdf] via-[#f0e2d2] to-[#a31f18]` | `text-[#21100a]` | `bg-[#21100a] hover:bg-[#3e2418] text-[#f6ecdf]` | `''` (değişmez) |
| `kina-posta` | Posta Damgası | `#f9eee3` | `bg-gradient-to-br from-[#f9eee3] via-[#f3e0cf] to-[#b0241c]` | `text-[#2e120a]` | `bg-[#2e120a] hover:bg-[#4a2215] text-[#f9eee3]` | `''` (değişmez) |
| `kina-suluboya` | Suluboya | `#fbf2e9` | `bg-gradient-to-br from-[#fbf2e9] via-[#f2a066] to-[#7d8338]` | `text-[#2e120a]` | `bg-[#2e120a] hover:bg-[#4a2215] text-[#fbf2e9]` | `''` (değişmez) |
| `kina-pano` | Mekanik Pano | `#160a05` | `bg-gradient-to-br from-[#160a05] via-[#2e140c] to-[#f2a066]` | `text-[#fdeee2]` | `bg-[#f2a066] hover:bg-[#f6b383] text-[#160a05]` | `''` (değişmez) |
| `kina-yildiz-haritasi` | Yıldız Haritası | `#150a0b` | `bg-gradient-to-br from-[#150a0b] via-[#2e1414] to-[#d0682a]` | `text-[#fdeee6]` | `bg-[#f2a87a] hover:bg-[#f6ba94] text-[#150a0b]` | `''` (değişmez) |
| `kina-dokuma` | Dokuma | `#f7e8da` | `bg-gradient-to-br from-[#f7e8da] via-[#c4581d] to-[#666a2c]` | `text-[#2e120a]` | `bg-[#2e120a] hover:bg-[#4a2215] text-[#f7e8da]` | `''` (değişmez) |
| `kina-cizgi` | Tek Çizgi | `#fbf2e8` | `bg-gradient-to-br from-[#fbf2e8] via-[#f7eadc] to-[#565a1f]` | `text-[#2c140c]` | `bg-[#2c140c] hover:bg-[#46261a] text-[#fbf2e8]` | `''` (değişmez) |
| `kina-plak` | Vinil Plak | `#1b0c07` | `bg-gradient-to-br from-[#1b0c07] via-[#1b0c07] to-[#b0241c]` | `text-[#fdeee2]` | `bg-[#f2a066] hover:bg-[#f6b383] text-[#1b0c07]` | `''` (değişmez) |
| `kina-vitray` | Vitray Işık | `#140906` | `bg-gradient-to-br from-[#140906] via-[#b0241c] to-[#d8a24a]` | `text-[#fdf0e6]` | `bg-gradient-to-r from-[#f2a066] to-[#e8c27a] hover:brightness-110 text-[#1b0c07]` | `''` (değişmez) |
| `kina-kinetik` | Kinetik Tipografi | `#8c1a14` | `bg-gradient-to-br from-[#8c1a14] via-[#a32019] to-[#ffc58f]` | `text-[#fff4ea]` | `bg-[#ffc58f] hover:bg-[#ffd3a8] text-[#3a0a06]` | `''` (değişmez) |
| `kina-deco` | Art Deco Gala | `#1c0d08` | `bg-gradient-to-br from-[#1c0d08] via-[#33180e] to-[#d98652]` | `text-[#fdeee2]` | `bg-gradient-to-r from-[#d98652] to-[#f2c3a0] hover:brightness-110 text-[#1c0d08]` | `''` (değişmez) |
| `kina-riso` | Risograph Poster | `#f8eadb` | `bg-gradient-to-br from-[#f8eadb] via-[#c4581d] to-[#666a2c]` | `text-[#2a0f08]` | `bg-[#2a0f08] hover:bg-[#45200f] text-[#f8eadb]` | `''` (değişmez) |
| `kina-kagit` | Kağıt & Mühür | `#f5e3d2` | `bg-gradient-to-br from-[#f5e3d2] via-[#eed6c0] to-[#b0241c]` | `text-[#33140c]` | `bg-[#b0241c] hover:bg-[#981d16] text-[#fdf3ea]` | `''` (değişmez) |
| `kina-aurora` | **Kına Ateşi (Modern)** | `#1a0907` | `bg-gradient-to-br from-[#1a0907] via-[#e26e32] to-[#b0241c]` | `text-[#fff4ec]` | `bg-gradient-to-r from-[#ffc08a] to-[#f2805a] hover:brightness-110 text-[#1f0a06]` | `''` (değişmez) |
| `kina-bento` | Bento Editorial (Modern) | `#faf0e6` | `bg-gradient-to-br from-[#faf0e6] via-[#f3dfcd] to-[#b0241c]` | `text-[#33140c]` | `bg-[#b0241c] hover:bg-[#981d16] text-[#fdf3ea]` | `''` (değişmez) |
| `kina-noir` | Noir Minimal (Modern) | `#0c0604` | `bg-gradient-to-br from-[#0c0604] via-[#1e0d08] to-[#b0241c]` | `text-[#fbf0e8]` | `bg-[#b0241c] hover:bg-[#c4301f] text-[#fdf0e6]` | `''` (değişmez) |
| `kina-krom` | **Bakır Tepsi (Modern)** | `#140a07` | `bg-gradient-to-br from-[#140a07] via-[#33180e] to-[#f4b48c]` | `text-[#ffeadb]` | `bg-gradient-to-r from-[#ffe2cc] via-[#f4b48c] to-[#de8a5e] hover:brightness-110 text-[#1a0c07]` | `''` (değişmez) |
| `kina-saray` | **Kına Odası (Sinematik)** | `#240a07` | `bg-gradient-to-br from-[#240a07] via-[#6e2414] to-[#f5b26b]` | `text-[#fff0e2]` | `bg-[#c0362a] hover:bg-[#d04434] text-[#fff0e2]` | `''` (değişmez) |
| `kina-mum` | **Kına Tepsisi (Sinematik)** | `#170a05` | `bg-gradient-to-br from-[#170a05] via-[#4a1e0c] to-[#ffc35f]` | `text-[#fff1df]` | `bg-[#e57f3c] hover:bg-[#ee9152] text-[#1b0c07]` | `''` (değişmez) |
| `kina-brutal` | Brutal | `#f8ebdf` | `bg-gradient-to-br from-[#f8ebdf] via-[#e8894a] to-[#b0241c]` | `text-[#2a0f08]` | `bg-[#b0241c] hover:brightness-110 text-[#fff1e6]` | `''` (değişmez) |
| `kina-terrazzo` | Terrazzo | `#f8ebdf` | `bg-gradient-to-br from-[#f8ebdf] via-[#d8a24a] to-[#b0241c]` | `text-[#33140c]` | `bg-[#33140c] hover:bg-[#52261a] text-[#f8ebdf]` | `''` (değişmez) |
| `kina-blueprint` | Teknik Çizim | `#3a170e` | `bg-gradient-to-br from-[#3a170e] via-[#3a170e] to-[#ffb27a]` | `text-[#fbe3cf]` | `bg-[#ffb27a] hover:brightness-110 text-[#3a170e]` | `''` (değişmez) |
| `kina-herbaryum` | Herbaryum | `#f8ecdf` | `bg-gradient-to-br from-[#f8ecdf] via-[#f4e2d0] to-[#666a2c]` | `text-[#2c160c]` | `bg-[#2c160c] hover:bg-[#4a2a1c] text-[#f8ecdf]` | `''` (değişmez) |
| `kina-ufuk` | Ufuk | `#0b0503` | `bg-gradient-to-br from-[#0b0503] via-[#7a2338] to-[#f7bd72]` | `text-white` | `bg-[#ffbe76] hover:brightness-110 text-[#2a0f08]` | değişmez |
| `kina-cini` | Çini | `#f8ebdf` | `bg-gradient-to-br from-[#f8ebdf] via-[#c4581d] to-[#7a2a12]` | `text-[#3a140a]` | `bg-[#7a2a12] hover:bg-[#93351a] text-[#fdf6ef]` | `''` (değişmez) |
| `kina-ebru` | Ebru | `#f6e6d6` | `bg-gradient-to-br from-[#f6e6d6] via-[#b8843a] to-[#9c2a18]` | `text-[#36120a]` | `bg-[#8c2414] hover:bg-[#a52e1b] text-[#fdf5ec]` | `''` (değişmez) |
| `kina-monogram` | Varak Monogram | `#2a0e08` | `bg-gradient-to-br from-[#2a0e08] via-[#4a1a0e] to-[#e0955a]` | `text-[#fbe8d8]` | `bg-[#eea56c] hover:brightness-110 text-[#2a0e08]` | `''` (değişmez) |
| `kina-takvim` | Takvim | `#f5e4d4` | `bg-gradient-to-br from-[#f5e4d4] via-[#ead2bc] to-[#b0241c]` | `text-[#33140c]` | `bg-[#8c1d16] hover:bg-[#a5261d] text-[#fdf5ec]` | `''` (değişmez) |


## 12. Kullanılmayan varlıklar

`KinaSade/assets/bg-desktop.svg`, `KinaModern/assets/bg-desktop.svg`,
`KinaManzara/assets/bg.png` ve `KinaSekilli/assets/bg.png` artık hiçbir dosyadan import
edilmiyor (sahneler kodla çiziliyor). Brifing "mevcut `assets/` kalabilir" dediği için
silinmedi; birleştirmede silinebilir.
