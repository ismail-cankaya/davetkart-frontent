# Üç yeni konseptin ortak kuralları

> **Kapsam:** `SERGI-KONSEPTI.md`, `KITAP-KONSEPTI.md`, `HARITA-KONSEPTI.md`. Bu dosya üçünün de
> ortak çerçevesidir; konsept rehberi bununla çelişirse **konsept rehberi** kazanır, çelişki raporda yazılır.
> **Tarih:** 2026-10-16 · **Durum:** Aşama 3 — onaydan sonra sabittir.

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
- **Aynı anda en fazla 2 ajan çalışır.** Ajanlar her kategoriden sonra durup rapor verdiği için sıra
  dönüşümlüdür: A ve B pilotu yapar → ikisi dururken C pilotu yapar → üç pilot yan yana gösterilir →
  sonra kategoriler ikişer ikişer ilerler.
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
yalnızca renk değişimi ayrı preset sayılmaz. Konsept bir kategoriye oturmuyorsa ajan zorlamaz, söyler.
