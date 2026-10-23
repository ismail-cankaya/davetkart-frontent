# Üç yeni konseptin ortak kuralları

> **Kapsam:** `SERGI-KONSEPTI.md`, `KITAP-KONSEPTI.md`, `HARITA-KONSEPTI.md`. Bu dosya üçünün de
> ortak çerçevesidir; konsept rehberi bununla çelişirse **konsept rehberi** kazanır, çelişki raporda yazılır.
> **Tarih:** 2026-10-16 · **Durum:** Aşama 5 kararları işlendi (2026-10-20, §8).

---

## 1. Ajanlar ve dallar

| Konsept | Slug | Dal | Ajan |
|---|---|---|---|
| Sergi Açılışı | `sergi` | `design/sergi` | A |
| Hikâye Kitabı | `kitap` | `design/kitap` | B |
| Günün Haritası | `harita` | `design/harita` | C |

- Taban: `design/kagit` dalının `e93b24a` commit'i (Kâğıt nişan pilotu dahil; `main` tasarım işlerinin
  gerisinde). Rehberler bu tabanın üstüne ayrı bir commit olarak eklenir ve üç dal o commit'ten açılır.
  Denetimde fark **tabana göre** alınır: `git diff --name-only <taban>...design/<slug>`.
- Üç ajan aynı anda çalışabilir (kullanıcı 2 ajan sınırını kaldırdı). Her ajan kategori sonunda durur;
  üç konseptin aynı kategorisi yan yana denetlenir, onaydan sonra üçü birlikte sonraki kategoriye geçer.
- Ortak bileşen düzeltmeleri ve tema kancaları `design/konsept-ortak` dalında hazırlanır, denetlenip
  `design/konseptler`'e alınır. Ajan bu dalı kendi dalına ancak orkestratör bildirince birleştirir.
- Her ajan kendi worktree'sinde çalışır. `git add -A` yasak; dosyalar tek tek eklenir. Çalışma ağacı
  CRLF'dir: betikle düzenlemede önce `\r\n` → `\n`, yazarken geri.

## 2. Yazma izni

| Ajan yazabilir | Ajana kapalı |
|---|---|
| `src/components/templates/<kategori>/<slug>/**` | `TemplateRenderer.tsx` (kayıt) |
| `src/components/templates/konsept/<slug>/**` — konseptin **kiti** (palet, fontlar, kategoriler arası parçalar) | `data.ts`, `types.ts` |
| Bunların `docs/rehber/<aynı yol>.md` kılavuzları | `shared/**`, `<kategori>/index.ts` (kategori barrel'ı) |
| Kendi konsept rehberine **öneri** (raporda, dosyaya değil) | `index.css`, i18n kök dosyaları, diğer konseptlerin klasörleri |

`konsept/<slug>/` klasörü yenidir: kitin her kategoride kopyalanmaması için açıldı. Klasörün tek sahibi
o konseptin ajanıdır; başka kimse yazmaz, bu yüzden çakışma üretmez.

Önizleme için ajan kendi dalında geçici kayıt yapabilir (`TemplateRenderer`, `data.ts`, barrel),
ama bu satırları **commit'lemez**. Kayıt satırlarını raporunda önerir; birleştirmede orkestratör ekler.

## 3. Preset biçimi

| | Biçim | Örnek |
|---|---|---|
| Kimlik | `<önek>-<slug>-<ad>` | `dugun-sergi-beyaz-kup` |
| Önek | Mevcut kural: `dugun` `kina` `nisan` `sunnet` `dogum-gunu` `mezuniyet` `baby` `parti` `kurumsal` | `baby-kitap-ilk-sayfa` |
| Bileşen | `<Kategori><Slug><Ad>` | `DugunSergiBeyazKup` |
| Klasör | `<kategori>/<slug>/<Bileşen>/index.tsx` | `dugun/sergi/DugunSergiBeyazKup/index.tsx` |
| Barrel | `<kategori>/<slug>/index.ts` — birleştirmede kategori barrel'ına tek satır eklenir | `export * from './sergi';` |
| Kart | `data.ts` girişi raporda önerilir: `name`, `primaryColor`, `backgroundStyle`, `titleColor`, `btnColor`, `imageUrl`, `categories` | — |

Bir preset `TemplateProps` alır ve `InvitationComposition`'ı şu araçlarla kurar:

- `themeOverride: SectionTheme` — bütün renk ve yazı sınıfları. Font, Kâğıt kitindeki gibi `base`
  dizgisindeki keyfi varyantlarla verilir: `[font-family:…] [&_.font-serif]:[font-family:…]`
  (örnek: `shared/paper/tema.ts`). `index.css`'e dokunulmaz.
- `flavor` — kategori flavor'ının **kopyası**: `{ ...DUGUN_FLAVOR, headings: {…} }`. Bölüm başlıkları
  konseptin diliyle değiştirilebilir. Başlıklar modül bayraklarından hesaplanıyorsa `useMemo` ile.
- `renderHero`, `renderHeroBackground`, `renderBackdrop`, `renderEnvelope` — düzen ve sahne.
- Alt bölümlerin (Program, Detay, Galeri, Hediye, LCV) **düzeni değiştirilemez**; yalnızca tema ve
  başlıklarla boyanır. Düzen değişikliği gerekiyorsa ortak dosya önerisi olarak rapora yazılır.

### 3.1 Tema kancaları (`design/konsept-ortak`, K8 · K10)

Hepsi isteğe bağlı `SectionTheme` alanıdır; vermeyen şablonun çıktısı değişmez. Ayrıntı:
`docs/rehber/src/components/templates/shared/palette.md` §4.

| Alan | Tür | Varsayılan | Örnek |
|---|---|---|---|
| `headingAlign` | `'center' \| 'start'` | `center` | Sergi: `'start'` — başlık içerik sütununun sol kenarında |
| `sectionMotion` | `{ duration?: number; distance?: number }` | başlık 0.9 s / 24 px, kart 0.95 s / 30 px, adım 0.85 s / 36 px | Sergi `{ duration: 0.4, distance: 10 }`, Kitap `{ duration: 0.4, distance: 12 }` |
| `hideMapHeader` | `boolean` | `false` | Kitap ("harita yok") ve Harita (ikinci harita olmasın): `true` |
| `timelineLayout` | `'kart' \| 'icindekiler'` | `kart` | Kitap: `'icindekiler'` (`Karşılama ........ 17:00`) |
| `timelineNode` | sınıf dizgesi | `surface` + `border`, her zaman yuvarlak | Harita: `'bg-[#EEF0E6] border-2 border-[#A8321F] rounded-none rotate-45 [&>span]:-rotate-45'` |
| `status` | `{ success?, error?, errorInput? }` | `id`'ye göre ölçülmüş yeşil / kırmızı | Kitap: `{ success: 'bg-[#…]/15 text-[#…]', error: 'text-[#…]' }` (ölçerek) |

Yardımcılar: adları ayırmak için `utils/names.ts` → `splitPeople`, tarih satırları için
`shared/eventDate.ts` → `eventDateParts` (kitler kendi kopyalarını bunlara bağlar).

## 4. Veri sözleşmesi

| Alan | Kural |
|---|---|
| `names` | Tek metin `"A & B"`; ikinci ad yok olabilir. Anlamı kategoriye göre değişir: kurumsal *Kurum & Etkinlik*, mezuniyet *Mezun & Okul*, baby *Anne adayı & Bebek*, doğum günü *Sahibi & Ev sahibi*, sünnet *Çocuk & Aile*. |
| `date` + `timezone` | Duvar saati, offset'siz. Boş olabilir. Biçimlendirme `utils/eventTime.ts` ile. |
| `venue`, `mapUrl` | Boş olabilir. |
| `title`, `subtitle` | Kullanıcı metni; **büyük/küçük harfi değiştirilmez** (öneriler büyük harfle gelir). Silinmiş olabilir. |
| `show*` | Altı modülün her biri kapalı olabilir; `showEnvelope` kapalıysa zarf **hiç** görünmez. |
| Veri uydurulmaz | Veride olmayan bilgi (yaş, sıra no, mekânın gerçek konumu) gösterilmez. |

Denenecek veri: `Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu`, uzun mekân
(`Çırağan Sarayı Kempinski İstanbul Balo Salonu, Beşiktaş`), tek ad, boş tarih, boş mekân, her modül
tek tek kapalı, hepsi kapalı.

## 5. Kalite ölçütleri

- **Kontrast:** WCAG AA — gövde 4.5:1, büyük başlık (≥ 24 px ya da ≥ 18.66 px kalın) 3:1. Rehberdeki
  değerler formülle **hesaplandı**; ajan çizilmiş ekranda **ölçer**. Doku ya da görsel üstündeki yazı en
  kötü noktasında ölçülür.
- **Erişim:** `alt` metinleri; süs görselleri `aria-hidden`; klavye ile gezilir; dokunma hedefi ≥ 44 px.
  **Tek istisna:** galeri noktaları ikincil gezinmedir — 24 px genişlik × 44 px yükseklik (WCAG 2.2 AA
  2.5.8); oklar 44 × 44 kalır (N2, 2026-10-22).
- **Hareket:** yalnızca `transform` ve `opacity`; `prefers-reduced-motion`'da atlanır (App'teki
  `MotionConfig reducedMotion="user"` + CSS'te `motion-safe:`); hero'da son öğenin gecikme + süresi ≤ 1.0 s.
- **Görsel:** WebP/AVIF; kapak öncelikli, diğerleri `loading="lazy"`; preset başına ≤ **60 KB**; kitin
  ortak görselleri ayrı, konsept başına ≤ 40 KB. Çalışma anında ağır SVG filtresi (`feTurbulence`,
  `feGaussianBlur` zinciri) yok. Yeni npm paketi yok.
- **Font:** yalnızca konsept rehberinde seçilenler; şablon açılınca yüklenir (`display=swap`), genel
  `@import`'a eklenmez.
- **Telif:** süs ve görseller özgün SVG/CSS ya da lisansı açık; kaynak kılavuza yazılır. Marka, logo,
  tanınmış eser, kurum adı taklidi yok (her rehberin §9'u o konseptin riskini sayar).
- **Plan:** tasarım plan bilgisi göstermez, modülü plana bağlamaz.

## 6. Doğrulama ve rapor

Her kategori için:

1. `npm run check` — son satır rapora aynen yazılır.
2. Her preset: 360 / 768 / 1280 px + "tüm modüller kapalı" ekran görüntüsü. Zarflı ve zarfsız ilk ekran.
3. Kalite tablosu: ölçüt · sonuç · kanıt. Koşulmayan şey "doğrulandı" diye yazılmaz; "denenmedi" yazılır.
4. Kılavuzlar (K18): her yeni dosya için `docs/rehber/<aynı yol>.md`; açıklama koda değil kılavuza.
5. Commit: kategori başına bir commit, dosyalar tek tek.

Rapor biçimi ajan prompt'undadır (8 madde).

## 7. Sıra

Üç ajan da aynı sırayı izler; böylece her kategori üç konseptle yan yana denetlenir:

**Düğün (pilot)** → Nişan → Doğum günü → Mezuniyet → Baby shower → Kurumsal → Parti → Sünnet → Kına

Kategori başına **2** preset. İki preset aynı konseptin farklı **düzen eksenleri**dir (her rehberin §4.3'ü);
yalnızca renk değişimi ayrı preset sayılmaz. Ayrışma **360 px'te de** görülmelidir: iki preset telefonda
aynı yerleşimdeyse (yalnızca arka plan çizimi farklıysa) ayrı preset sayılmaz (Aşama 5, K2).
Konsept bir kategoriye oturmuyorsa ajan zorlamaz, söyler.

## 8. Aşama 5 kararları (2026-10-20)

Üç düğün pilotu yan yana gösterildi; kullanıcı K1–K10 önerilerinin hepsini onayladı. Konsepte özgü
kararlar her rehberin §11'inde. Ortak olanlar:

| # | Karar |
|---|---|
| K1 | Üç konsept de sürer; üç ajan Nişan'a birlikte geçer |
| K8 | Kitap'ın "içindekiler" programı için ortak `Timeline`'a tema seçeneği eklenir |
| K10 | Ortak bileşen sorunları tek dalda (`design/konsept-ortak`) çözülür; temaya kancalar eklenir |

K10 kapsamı: galeri sayacının kontrastı, ortak bölümlerde ≥ 44 px dokunma hedefleri, zarf açıkken arkadaki
içeriğin `inert` olması, "Kopyalandı" ve LCV hata metninin tema rengine bağlanması, alt bilgideki adların
büyük harfe çevrilmemesi, Timeline düğümlerinin temanın köşe yuvarlaklığından ayrılması, tekrarlanan
yardımcıların (`kisiler`, tarih biçimi) ortak yere taşınması. Kancalar: bölüm başlık hizası, bölüm giriş
süresi/mesafesi, Detaylar'ın soyut harita başlığını kapatma, Timeline görünümü (`kart` | `icindekiler`).

### Nişan turu (2026-10-22)

Üç konseptin Nişan'ı, Kitap ve Harita'nın düğün düzeltmeleri ve ortak dal (`386dbce`) yan yana gösterildi;
kullanıcı N1–N6 önerilerini onayladı. Konsepte özgü olanlar her rehberin §11'inde.

| # | Karar |
|---|---|
| N1 | Üç konsept Doğum günü'ne geçer. Turun ilk işi: `design/konseptler`'i almak, §3.1'deki tema kancalarını düğün ve Nişan preset'lerine uygulamak, kit yardımcılarını `splitPeople` / `eventDateParts`'a bağlamak |
| N2 | Galeri noktaları 24 px adım (WCAG 2.2 AA hedef boyutu); oklar 44 px. §5'teki 44 px kuralının tek istisnası |
| N3 | Ortak kapak özeti (`Summary`) kullanıcının başlığını ve mekânını büyük harfe çevirmez |

Önizleme düzeneği (`ad76b0f`): kategoriye uygun program; `ad=`, `tarih=`, `mekan=`, `baslik=`,
`altmetin=`, `harita=0` alan ezmeleri; `cek.ts --ek/--etiket` ve `--ac` (açılmış zarf). Tek ad ve boş
alanlar artık geçici sayfa gerektirmez (`docs/rehber/scripts/onizleme.md` §3.1).
