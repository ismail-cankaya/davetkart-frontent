# `onizleme.html` · `scripts/onizleme/`

> **Ne için:** konsept preset'lerini kayıt dosyalarına dokunmadan çizmek ve 360 / 768 / 1280 px
> ekran görüntülerini almak. Yalnızca geliştirme sunucusunda çalışır; `vite build`'e girmez
> (Vite yalnızca `index.html`'i derler).
> **Kullananlar:** Sergi, Kitap, Harita konsept ajanları (`docs/rehber/tasarim/KONSEPT-ORTAK.md §6`).

---

## 1. Neden var?

Önceki tasarım turlarında her ajan kendi geçici düzeneğini kurdu (`__harness__`, commit'lenmedi). Üç
konseptin pilotu yan yana karşılaştırılacağı için görüntülerin **aynı veriyle, aynı boyutta, aynı
beklemeyle** alınması gerekiyor.

## 2. Dosyalar

| Dosya | İş |
|---|---|
| `onizleme.html` | Kök sayfa; `scripts/onizleme/main.tsx`'i yükler |
| `scripts/onizleme/main.tsx` | Adres parametrelerini okur, davetiyeyi kurar, şablonu tam ekran çizer |
| `scripts/onizleme/senaryolar.ts` | Dört senaryo ve kategoriye göre örnek veri |
| `scripts/onizleme/cek.ts` | Headless Chrome'u DevTools protokolüyle sürer, ekranları PNG olarak yazar |

## 3. Adres

`http://localhost:<port>/onizleme.html?preset=<id>&senaryo=<s>[&zarf=1][&kapat=timer,gift][&kategori=<id>][&mod=preview][&ad=…][&tarih=…][&mekan=…][&baslik=…][&altmetin=…][&harita=0]`

- `preset` yoksa: konsept barrel'larındaki bütün preset'lerin bağlantı listesi. Kit (`konsept/<slug>/`) ve
  ortak parça (`shared/<ad>/`) barrel'ları listelenmez; onlar preset değildir.
- **Preset nasıl bulunur:** kimliğin öneki kategoriyi, ikinci parçası konsept klasörünü verir
  (`dugun-sergi-beyaz-kup` → `dugun/sergi/index.ts`), bileşen adı kimliğin PascalCase hâlidir
  (`DugunSergiBeyazKup`). Kayıt dosyasına geçici satır **gerekmez**. Klasör yoksa ve kimlik
  `data.ts`'te varsa eski preset `TemplateRenderer` ile çizilir.
- Bulunamazsa sayfa kırmızı bir hata yazar ve `data-onizleme="hata"` işaretler.
- İsim temizliği (`displayNames`) `TemplateRenderer`'daki gibi uygulanır; `MotionConfig reducedMotion="user"` App'teki gibi sarar.

| Senaryo | Veri |
|---|---|
| `dolu` | Kategoriye uygun kısa adlar, 120 gün sonrası, mekân, harita bağlantısı, kategoriye uygun 4 adımlı program, 3 görselli galeri, hediye, LCV — hepsi açık |
| `uzun` | `Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu` (kategoriye göre karşılığı), uzun mekân, uzun başlık ve alt metin |
| `bos` | Sihirbazın ilk hâli: ad, tarih, mekân boş |
| `kapali` | `dolu` + bütün opsiyonel modüller kapalı |

Program her kategoride o etkinliğin adımlarıdır (`PROGRAMLAR`): nişanda *Söz ve yüzük takma*, *Kahve ve
tatlı ikramı*; kınada *Gelin alma*, *Kına yakma*; kurumsalda *Kayıt ve kahve*, *Panel* gibi. Adım
başlığına bakan parçalar (durak simgeleri, içindekiler) böylece kendi kategorisinin verisiyle denenir.

Zarf varsayılan olarak **kapalıdır** (görüntüler içeriği göstersin diye); `zarf=1` giriş kapısını açar.

### 3.1 Alan ezmeleri

Senaryonun üstüne tek tek alan yazar. Parametre **yoksa** senaryonun değeri kalır, **boşsa** alan boşalır.

| Parametre | Örnek | Ne dener |
|---|---|---|
| `ad` | `ad=Gülşen İrem` · `ad=& Mehmet Çağrı` · `ad=` | Tek ad, yalnız ikinci ad, adsız |
| `tarih` | `tarih=` · `tarih=2027-05-01T15:00` | Boş tarih (LCV son günü de boşalır), belirli tarih |
| `mekan` | `mekan=` | Boş mekân |
| `baslik`, `altmetin` | `baslik=` | Silinmiş başlık ya da alt metin |
| `harita` | `harita=0` | Harita bağlantısı yok |

## 4. Ekran görüntüsü

```bash
npm run dev -- --port 3101
npx tsx scripts/onizleme/cek.ts --port 3101 --preset dugun-sergi-beyaz-kup
```

| Seçenek | Varsayılan | |
|---|---|---|
| `--preset a,b` | — | Bir ya da daha çok kimlik |
| `--senaryo` | `dolu,kapali` | `dolu,uzun,bos,kapali` |
| `--genislik` | `360,768,1280` | 360×780, 768×1024, 1280×800 |
| `--ekran` | `8` | Sayfa başına en çok kaç ekran (kaydırarak) |
| `--zarf` | kapalı | Yalnızca zarf kapısının ilk ekranı |
| `--ac` | kapalı | `--zarf` ile: kapının düğmesine basar, 3 s sonra açılmış hâli ikinci kare olarak çeker |
| `--azalt` | kapalı | `prefers-reduced-motion: reduce` öykünür |
| `--kapat` | — | `timer,timeline,gallery,gift,rsvp` |
| `--ek` | — | Alan ezmeleri, `;` ile ayrılır: `--ek "ad=Gülşen İrem;tarih="` (§3.1) |
| `--etiket` | `ek` | `--ek` çekimlerinin dosya adındaki etiketi: `--etiket tekad` |
| `--cikti` | `node_modules/.cache/onizleme` | Görüntüler commit'lenmez |

Çıktı: `<cikti>/<preset>/<preset>--<senaryo>[-zarf][-azalt][-k-<modüller>][-<etiket>]--<genislik>--<sıra>.png`.
Kaydırılan kap davetiyenin kendi kaydırma kabıdır (`[data-lenis-prevent]`); her kaydırmadan sonra 1 s
beklenir (görünürken giren bölümler). `--ac`'ta düğme, `inert` olmayan ilk düğmedir (kapı açıkken içerik
`inert`); düğme yoksa ekranın ortasına dokunulur.

Tarayıcı portu geliştirme portu + 6000'dir (3101 → 9101): iki ajan aynı anda çekebilir. Sayfada hata ya
da `console.error` olursa betik onları yazar ve 1 ile çıkar.

## 5. Sınırlar

- Video katmanları headless çekimde ilk kare ya da poster olarak görünebilir.
- Galeri görselleri depodaki genel görsellerdir; gerçek fotoğraf boyutlarını temsil etmez.
- Ajanlar düzeneği değiştirmez; eksik görürse raporunda yazar.
