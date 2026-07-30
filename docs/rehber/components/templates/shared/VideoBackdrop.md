# VideoBackdrop — Davetiye Arka Plan Videosu Katmanı

> **Kod dosyası:** `src/components/templates/shared/VideoBackdrop.tsx`
> **Bu rehber kime yazıldı:** React ve HTML video API'lerini ilk kez gören birine.
> Hiçbir ön bilgi varsayılmıyor.

---

## 1. Bu dosya ne işe yarar?

Davetiye şablonlarının arkasına **kendi kendine dönen, sessiz, tam ekran bir video**
serer. Kullanıcı davetiyeyi açtığında arkada bulutlar süzülür, dalgalar hareket eder.

Tek başına hiçbir şey göstermez — bir şablon (örn. `DugunGokyuzu.tsx`) onu çağırır
ve "şu videoyu, şu odak noktasıyla göster" der.

### Neden ayrı bir dosya?

Videolu tema sayısı 1 değil, zamanla 10+ olacak. Video oynatmanın onlarca
tuzağı var (iOS tam ekrana zorlama, pil tüketimi, otomatik oynatma engelleri,
erişilebilirlik). Bu mantığı her temaya kopyalasak:

- 10 yerde aynı hata düzeltilmesi gerekir
- biri unutulur, o tema iPhone'da bozulur

Bu, **SRP (Single Responsibility Principle / Tek Sorumluluk İlkesi)** dediğimiz
şeydir: bir dosya tek bir işten sorumlu olur. `VideoBackdrop`'un tek işi
"videoyu doğru şekilde oynatmak". Videonun *hangi* video olduğu onu ilgilendirmez.

---

## 2. Önce temel kavramlar

### 2.1 HTML `<video>` etiketi nedir?

Tarayıcıya "burada bir video oynat" demenin yolu:

```html
<video src="bulut.mp4"></video>
```

Bu etiketin davranışını **öznitelikler (attribute)** ile ayarlarız:

| Öznitelik | Ne yapar |
|---|---|
| `autoplay` | Sayfa açılınca kendi kendine başlar |
| `muted` | Sesi kapatır |
| `loop` | Bitince başa döner, sonsuz tekrar |
| `playsinline` | Videoyu sayfanın içinde oynatır, tam ekrana zorlamaz |
| `poster` | Video yüklenene kadar gösterilecek durağan resim |
| `preload` | Videonun ne kadarının önceden indirileceği |
| `controls` | Oynat/duraklat düğmelerini gösterir (biz **kullanmıyoruz**) |

### 2.2 React'te öznitelikler neden farklı yazılıyor?

React, HTML'e çok benzeyen ama JavaScript içine gömülü olan **JSX** kullanır.
JSX'te öznitelikler **camelCase** (deve yazımı) olur:

| HTML | React (JSX) |
|---|---|
| `autoplay` | `autoPlay` |
| `playsinline` | `playsInline` |
| `disablepictureinpicture` | `disablePictureInPicture` |
| `class` | `className` |
| `tabindex` | `tabIndex` |

`class` özel bir durum: JavaScript'te `class` zaten ayrılmış bir kelime
(sınıf tanımlamak için), o yüzden React `className` der.

### 2.3 `<source>` etiketi ve codec seçimi

Video tek bir `src` yerine birden fazla alternatif kaynak alabilir:

```html
<video>
  <source src="bulut.webm" type="video/webm" />
  <source src="bulut.mp4"  type="video/mp4" />
</video>
```

**Tarayıcı listeyi yukarıdan aşağı tarar ve desteklediği İLK kaynağı indirir.**
Diğerlerine hiç dokunmaz. Bu çok önemli bir detay: yedek dosya koymak
kullanıcının internetinden 1 byte bile yemez — sadece sunucuda yer kaplar.

**codec (kodek)** = videoyu sıkıştırma yöntemi. Bizim için önemli ikisi:

- **H.264** (`.mp4` içinde) — her cihazda **donanımda** çözülür. Yani telefonun
  içindeki özel çip halleder, işlemci boşta kalır, pil yavaş biter.
- **VP9** (`.webm` içinde) — dosya ~%40 daha küçük, ama iPhone'da donanım
  desteği **yok**. İşlemci yazılımla çözer → telefon ısınır, pil erir.

Bu yüzden davetiyede H.264/mp4 tercih ediyoruz. Karar bu dosyada gömülü
**değil** — `sources` dizisini çağıran şablon belirler.

---

## 3. TypeScript temelleri (bu dosyada geçenler)

### 3.1 `interface` — veri şeklinin sözleşmesi

```ts
export interface VideoSource {
  src: string;
  type: string;
}
```

Bu, "VideoSource dediğim şey, içinde `src` ve `type` adında iki metin
barındıran bir nesnedir" demek. TypeScript bunu **derleme zamanında**
kontrol eder; yanlış yazarsan `npm run lint` hata verir, tarayıcıya hiç
gitmez.

`export` = "bu tanımı başka dosyalar da kullanabilsin".

### 3.2 `?` — isteğe bağlı alan

```ts
objectPosition?: string;
```

Sondaki `?`, "bu alan verilmeyebilir" demek. Verilmezse `undefined` olur.

### 3.3 Varsayılan değer

```ts
objectPosition = '50% 50%'
```

"Verilmediyse şunu kullan" demek. Böylece kodun içinde `undefined` kontrolü
yapmak zorunda kalmayız.

### 3.4 `React.ReactNode`

"Ekrana basılabilecek her şey" tipidir: metin, sayı, JSX elementi, dizi, `null`.
`children` prop'u bu tiptedir.

---

## 4. React temelleri (bu dosyada geçenler)

### 4.1 Props — bileşene dışarıdan verilen ayarlar

Bir React bileşeni, girdi alan bir fonksiyondur. Girdilerine **props** denir.

```tsx
export function VideoBackdrop({ sources, poster, ... }: VideoBackdropProps) {
```

Süslü parantez `{ }` **destructuring** (parçalama) denen JavaScript
özelliğidir: gelen nesnenin içinden istediğin alanları tek tek değişkene alır.
Şunun kısa yazımıdır:

```tsx
export function VideoBackdrop(props: VideoBackdropProps) {
  const sources = props.sources;
  const poster = props.poster;
}
```

### 4.2 `useState` — bileşenin hafızası

```tsx
const [isPainted, setIsPainted] = useState(false);
```

- `isPainted` → şu anki değer (başlangıçta `false`)
- `setIsPainted` → değeri değiştiren fonksiyon
- `setIsPainted(true)` çağrıldığında React bileşeni **yeniden çizer**

Neden normal değişken kullanmıyoruz? Çünkü normal değişkeni değiştirsen React
haberdar olmaz, ekran güncellenmez.

### 4.3 `useRef` — DOM elementine doğrudan tutamak

```tsx
const videoRef = useRef<HTMLVideoElement>(null);
```

React normalde DOM'a doğrudan dokunmaz. Ama `video.play()` ve `video.pause()`
gibi **imperatif** (emir kipi) komutlar için gerçek elemente erişmek gerekir.
`ref` bunu sağlar:

```tsx
<video ref={videoRef} ... />
// Artık videoRef.current gerçek <video> DOM elementidir
```

`useState`'ten farkı: `ref` değiştiğinde React **yeniden çizmez**. Sadece bir
kutu içinde değer saklar.

### 4.4 `useEffect` — yan etkiler

React bileşeninin asıl işi ekrana bir şey basmaktır. Bunun dışındaki her şey
(zamanlayıcı kurmak, olay dinlemek, ağ isteği atmak) **yan etki**'dir ve
`useEffect` içine yazılır.

```tsx
useEffect(() => {
  // 1. Kurulum: gözlemciyi başlat
  const observer = new IntersectionObserver(...);
  observer.observe(container);

  // 2. Temizlik: bileşen ekrandan kalkınca çalışır
  return () => observer.disconnect();
}, [prefersReducedMotion]);
```

- **Kurulum kodu** bileşen ekrana gelince çalışır
- **`return` ile döndürülen fonksiyon** bileşen ekrandan kalkınca çalışır
  → buna **cleanup (temizlik)** denir
- Sondaki `[prefersReducedMotion]` **bağımlılık dizisi**'dir: bu değer
  değişirse efekt baştan çalışır

**Temizlik yapmazsan ne olur?** Gözlemci ve olay dinleyicileri bellekte kalır.
Kullanıcı 20 farklı temaya baktıysa 20 gözlemci arka planda çalışmaya devam
eder → **bellek sızıntısı (memory leak)**, sayfa yavaşlar.

### 4.5 Custom hook — kendi kancamız

```tsx
function usePrefersReducedMotion(): boolean { ... }
```

`use` ile başlayan fonksiyonlara **hook** denir. İçinde başka hook'ları
(`useState`, `useEffect`) çağırabilirler. Bu, tekrar eden mantığı paketlemenin
React yoludur.

Burada "kullanıcı hareketi azalt dedi mi?" sorusunun tüm cevabını tek bir
kancaya sıkıştırdık. Başka bileşenler de aynı kancayı kullanabilir.

---

## 5. Satır satır çözümleme

### 5.1 `usePrefersReducedMotion`

```tsx
const [reduced, setReduced] = useState(
  () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
);
```

**`window.matchMedia`** = JavaScript'ten CSS medya sorgusu sormanın yolu.
`(prefers-reduced-motion: reduce)`, kullanıcının işletim sistemi ayarlarından
"animasyonları azalt" seçeneğini açıp açmadığını söyler.

**`useState(() => ...)`** — dikkat, `useState(değer)` değil `useState(fonksiyon)`.
Buna **lazy initialization (tembel ilklendirme)** denir. Fark:

- `useState(hesapla())` → `hesapla` **her çizimde** çalışır (gereksiz)
- `useState(() => hesapla())` → sadece **ilk çizimde** çalışır

```tsx
useEffect(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}, []);
```

Kullanıcı ayarı **sayfa açıkken** değiştirebilir. Bu dinleyici o anı yakalar.
Boş bağımlılık dizisi `[]` = "sadece bir kez kur, bir daha kurma".

`return () => query.removeEventListener(...)` temizliktir — dinleyiciyi
sökmezsek bellek sızar.

### 5.2 IntersectionObserver efekti

```tsx
if (prefersReducedMotion) return;
```

Kullanıcı hareket istemiyorsa video zaten render edilmiyor. Gözlemci kurmaya
gerek yok, erken çıkıyoruz. Buna **guard clause (koruma cümlesi)** denir —
iç içe `if` yerine erken `return` daha okunaklıdır (Clean Code).

```tsx
const observer = new IntersectionObserver(
  ([entry]) => { ... },
  { threshold: 0.01 }
);
```

**IntersectionObserver** = "şu element ekranda görünüyor mu?" sorusunu
tarayıcıya sordurmanın verimli yolu. Alternatifi her kaydırmada elle hesap
yapmaktır ve o çok pahalıdır.

- `([entry])` → gözlemci bir **dizi** verir; biz tek element izlediğimiz için
  parçalayıp ilkini alıyoruz
- `threshold: 0.01` → "elementin %1'i bile göründüyse 'görünüyor' say"

```tsx
if (entry.isIntersecting) {
  void video.play().catch(() => undefined);
} else {
  video.pause();
}
```

**Görünüyorsa oynat, görünmüyorsa duraklat.** Misafir aşağı kaydırıp RSVP
formunu doldururken arkada video dönmeye devam ederse GPU ve pil boşuna yanar.

**`video.play()` bir Promise döndürür** ve **başarısız olabilir**:

- iOS Düşük Güç Modu sessiz videoyu bile reddeder
- Bazı tarayıcı ayarları otomatik oynatmayı kapatır

Yakalamazsan konsola `Unhandled Promise Rejection` hatası düşer.
`.catch(() => undefined)` = "başarısız olursa sessizce geç, poster kalsın".
Buna **graceful degradation (zarif bozulma)** denir: özellik çalışmazsa
uygulama çökmez, daha basit hâliyle devam eder.

**`void`** öneki = "bu Promise'in sonucunu bilerek yok sayıyorum". Yazmasan da
çalışır ama linter uyarı verir; niyeti açıkça belgeler.

```tsx
observer.observe(container);
return () => observer.disconnect();
```

Kur ve temizle. Aynı desen.

### 5.3 Poster katmanı

```tsx
<img
  src={poster}
  alt=""
  aria-hidden="true"
  className="absolute inset-0 w-full h-full object-cover"
  style={{ objectPosition }}
/>
```

**Neden ayrı `<img>`, `<video poster>` yetmiyor mu?**

`poster` özniteliği video ilk karesini boyar boyamaz kaybolur. Video yüklenirken
ile ilk kare arasında **bir kare boşluk** oluşur — ekranda anlık siyah/beyaz
titreme. Posteri altta sabit tutup videoyu üstüne yumuşatarak bindirince bu yok
olur.

Ayrıca bu `<img>` üç ayrı durumda tek görünen katmandır:
1. Video henüz inmedi
2. Otomatik oynatma reddedildi
3. Kullanıcı "hareketi azalt" dedi

**`alt=""` + `aria-hidden="true"`** — bu görsel **dekoratiftir**, bilgi taşımaz.
Ekran okuyucu (görme engelli kullanıcının kullandığı yazılım) bunu atlamalı.
`alt="Bulutlu gökyüzü"` yazsaydık kullanıcıya gereksiz gürültü olurdu.

**`object-cover`** (Tailwind) = CSS `object-fit: cover`. Video/resim, kutuyu
**tamamen doldurur**, oranı korur, taşan kısım kırpılır. Alternatifi `contain`
olurdu ama o kenarlarda boşluk bırakır — davetiyede kabul edilemez.

**`objectPosition`** = kırpma olurken hangi bölgenin korunacağı.
`'50% 35%'` → yatayda ortala, dikeyde biraz yukarıyı koru.

### 5.4 Video elementi

```tsx
{!prefersReducedMotion && (
  <video ... />
)}
```

**Koşullu render.** JavaScript'te `A && B` ifadesi, `A` yanlışsa `B`'yi hiç
değerlendirmez. React `false` gördüğünde hiçbir şey basmaz. Yani "hareketi
azalt" açıksa `<video>` DOM'a **hiç girmez** — video indirilmez bile.

```tsx
playsInline
```

**En kritik öznitelik.** Bu olmadan iOS Safari videoyu **zorla tam ekrana
alır**. Davetiye kompozisyonu tamamen dağılır, kullanıcı siyah ekranda video
oynatıcı görür. Pazarlık konusu değildir.

```tsx
muted
```

**Teknik zorunluluk.** Hiçbir modern tarayıcı sesli videoyu otomatik başlatmaz
(kullanıcı izni olmadan ses çıkarmak kötü deneyimdir). `muted` olmadan
`autoPlay` çalışmaz.

> **React tuzağı:** React `muted`'ı öznitelik olarak değil DOM özelliği olarak
> ayarlar. Sunucu tarafı render (SSR) kullanan projelerde bu bilinen bir
> soruna yol açar. Bizim projede SSR yok (Vite SPA), sorun çıkmaz.

```tsx
preload="metadata"
```

Üç seçenek var:

| Değer | Davranış |
|---|---|
| `none` | Hiçbir şey indirme — video geç başlar |
| `metadata` | Sadece süre/boyut bilgisini indir ✅ |
| `auto` | Videoyu baştan sona indirmeye başla |

`auto` olsaydı davetiye açılır açılmaz 1.5 MB indirilmeye başlar, asıl içeriğin
(isimler, tarih) boyanması gecikirdi. Mobil veride bu ciddi bir maliyettir.

```tsx
disablePictureInPicture
```

Kullanıcının videoyu "küçük pencerede ayır" seçeneğiyle koparmasını engeller.
Dekoratif arka planın koparılması anlamsız olurdu.

```tsx
aria-hidden="true"
tabIndex={-1}
```

- `aria-hidden` → ekran okuyucu bu elementi tamamen atlar
- `tabIndex={-1}` → Tab tuşuyla gezinirken buraya odak gelmez

Klavye kullanıcısı davetiyede gezinirken dekoratif videoya takılmamalı.

```tsx
onCanPlay={() => setIsPainted(true)}
className={cn(..., isPainted ? 'opacity-100' : 'opacity-0')}
```

**`canplay` olayı** = "yeterince veri indi, oynatmaya başlayabilirim".
O ana kadar video görünmez (`opacity-0`), poster görünür. Olay tetiklenince
`isPainted` `true` olur, React yeniden çizer, video 700ms'de yumuşayarak belirir.

`transition-opacity duration-700` bu geçişi CSS'e yaptırır. CSS geçişleri
**compositor thread**'de çalışır — JavaScript meşgul olsa bile takılmaz.

```tsx
{sources.map((source) => (
  <source key={source.src} src={source.src} type={source.type} />
))}
```

**`.map()`** = diziyi dönüştürme. Her `VideoSource` nesnesini bir `<source>`
JSX elementine çevirir.

**`key`** — React'in listedeki elemanları takip etmesi için zorunlu. Olmazsa
React konsola uyarı basar ve liste değişince yanlış elemanı güncelleyebilir.
`src` benzersiz olduğu için anahtar olarak uygundur. **Dizi indeksini
(`index`) anahtar yapmak yaygın bir hatadır** — liste sıralanınca bozulur.

### 5.5 `children`

```tsx
{children}
```

Şablon, videonun **üstüne** bir şeyler koyabilsin diye. Örneğin:

- okunabilirlik için koyu degrade katman (**scrim**)
- köşelere çapalanmış çiçek süslemeleri

```tsx
<VideoBackdrop sources={...} poster={...}>
  <div className="absolute inset-0 bg-black/25" />
</VideoBackdrop>
```

Bu, **composition (bileşim)** desenidir: `VideoBackdrop` üstüne ne
geleceğini bilmez, sadece yer açar. Kalıtım (inheritance) yerine bileşim
kullanmak React'in temel felsefesidir.

### 5.6 Dikey/yatay varyant seçimi

#### Problem

`object-cover` kutuyu doldurmak için taşan kısmı **kırpar**. Laptop için
hazırlanmış 16:9 (oran 1.78) bir videoyu 9:19.5 (oran 0.46) telefona
koyduğunda videonun **yaklaşık %65'i** ekran dışında kalır. Kompozisyonun
merkezindeki güneş, bulut kütlesi, boşluklar — hepsi kayar. Bu yüzden
davetiyeye "aynı videonun mobil versiyonu" değil, **ayrı komponize edilmiş
ikinci bir video** koyuyoruz.

Bileşen bunu şu prop ile alır:

```tsx
<VideoBackdrop
  sources={[...]} poster={...}                       // yatay takım
  portrait={{ sources: [...], poster: ... }}          // dikey takım (opsiyonel)
/>
```

`portrait` verilmezse davranış eskisiyle birebir aynıdır — yani bu ekleme
**geriye dönük uyumludur (backward compatible)**.

#### Neden medya sorgusu (`matchMedia`) değil?

Akla ilk gelen çözüm `@media (max-width: 768px)`'dir. Bu projede **yanlış
cevap verir**: editördeki telefon simülatörü masaüstü tarayıcısında çalışır.
Viewport 1440px geniştir ama davetiye 390px'lik bir çerçeveye çizilir.
Medya sorgusu "masaüstü" der, kullanıcı telefon görüntüsüne bakarken yatay
videoyu görür.

Doğru soru "cihaz ne?" değil, **"benim kutum ne şekilde?"** sorusudur.

#### `ResizeObserver` — elementin kendi boyutunu izlemek

```tsx
const observer = new ResizeObserver(([entry]) => {
  apply(entry.contentRect.width, entry.contentRect.height);
});
observer.observe(element);
return () => observer.disconnect();
```

`ResizeObserver`, bir elementin boyutu her değiştiğinde haber veren tarayıcı
API'sidir. `window.resize` olayından farkı: pencere hiç değişmese bile
element değişmişse (yan panel açıldı, simülatör cihazı değişti) tetiklenir.

`entry.contentRect` = elementin padding hariç iç ölçüsü.
`disconnect()` yine **cleanup**'tır — yazılmazsa bellek sızar.

#### `useLayoutEffect` vs `useEffect`

| Kanca | Ne zaman çalışır |
|---|---|
| `useEffect` | Tarayıcı ekranı **boyadıktan sonra** |
| `useLayoutEffect` | DOM hazır, ama ekran **boyanmadan önce** |

Ölçümü `useEffect` ile yapsaydık sıra şöyle olurdu:

1. İlk çizim: varsayılan `landscape` → telefon **yatay videoyu indirmeye başlar**
2. Ekran boyanır
3. Efekt çalışır, "aslında dikeymişsin" der
4. İkinci çizim: dikey video de indirilmeye başlar

Yani mobil kullanıcı **iki video birden** indirir. `useLayoutEffect` ölçümü
boyamadan önce yaptığı için ilk çizim doğru varyantla yapılır, yanlış dosya
hiç istenmez. React bu efektin içindeki `setState`'i senkron olarak işler.

> Kural: **ölçüp hemen o ölçüye göre çizeceksen `useLayoutEffect`**, geri
> kalan her şey için `useEffect`.

#### Histerezis — eşiği ikiye bölmek

```tsx
const TO_PORTRAIT = 0.95;
const TO_LANDSCAPE = 1.05;
```

Tek bir eşik (`ratio < 1`) kullansaydık, kullanıcı pencereyi tam kare
civarında yavaşça sürüklerken oran 0.999 ↔ 1.001 arasında salınır, her
salınımda `key` değişir, video **yeniden yüklenir**. Saniyede onlarca ağ
isteği demektir.

İki eşik arasında bir **ölü bölge (dead zone)** bırakmak bu titremeyi
(flapping) engeller. Aynı mantık termostatlarda kullanılır: 20°C'de ısıtıcıyı
açıp 20.1°C'de kapatmak yerine, 19.5'te aç 20.5'te kapat.

#### `key` — kaynak değişince videoyu yeniden yüklemek

```tsx
<video key={variantId} ... >
```

**Kritik tuzak:** `<video>` elementinin altındaki `<source>` etiketlerini
değiştirmek tarayıcıyı **hiç ilgilendirmez**. Tarayıcı kaynak listesini
yalnızca elementi ilk gördüğünde okur. İmperatif çözüm `video.load()`
çağırmaktır; React'çe olanı ise `key` vermektir.

React `key` değiştiğinde elementi güncellemez, **söker ve yeniden kurar**.
Yeni bir `<video>` DOM'a girer, kaynak listesini baştan okur. Yan faydası:
eski elementin tüm iç durumu (buffer, oynatma konumu) çöpe gider — sızıntı
kalmaz.

#### Boyanma durumunun varyanta bağlanması

```tsx
const [paintedFor, setPaintedFor] = useState<Orientation | null>(null);
const isPainted = paintedFor === variantId;
```

`isPainted` düz `boolean` olsaydı: yatay video boyandı → `true`. Kullanıcı
pencereyi daraltır, dikey video kurulur ama **henüz tek kare bile üretmemiştir**;
`isPainted` hâlâ `true` olduğu için `opacity-100` ile görünür → anlık boş/siyah
kutu. Durumu "hangi varyant için boyandı" olarak tutmak bu boşluğu kapatır;
yeni video hazır olana kadar poster görünür kalır.

#### `variantId`'nin gözlemci bağımlılığına eklenmesi

```tsx
}, [prefersReducedMotion, variantId]);
```

`key` değişince eski `<video>` gider, `videoRef.current` yeni elemente
bağlanır. Gözlemci eski karara göre kurulu kalsaydı, hero ekran dışındayken
yeniden kurulan video `autoPlay` ile çalmaya başlar ve kimse onu duraklatmazdı.
Bağımlılığa eklemek gözlemciyi yeniden kurar; `IntersectionObserver` kurulur
kurulmaz ilk kararını verdiği için video anında doğru duruma geçer.

---

## 6. Sık yapılan hatalar

| Hata | Sonuç | Doğrusu |
|---|---|---|
| `playsInline` yazmamak | iOS'ta video tam ekrana zorlar, davetiye kırılır | Her zaman ekle |
| `muted` yazmamak | `autoPlay` hiçbir tarayıcıda çalışmaz | `muted` + `autoPlay` birlikte |
| `playsinline` (küçük harf) yazmak | React tanımaz, sessizce yok sayar | `playsInline` (camelCase) |
| `.play()` sonucunu yakalamamak | Konsolda Unhandled Rejection | `.catch(() => undefined)` |
| `useEffect` temizliği yazmamak | Bellek sızıntısı, sayfa yavaşlar | `return () => ...` |
| `preload="auto"` | 1.5 MB anında iner, LCP bozulur | `preload="metadata"` |
| `object-fit: contain` | Kenarlarda boşluk çıkar | `object-cover` |
| Videoyu `alt` metniyle etiketlemek | Ekran okuyucuda gürültü | `aria-hidden="true"` |
| `key={index}` kullanmak | Liste değişince yanlış güncelleme | `key={source.src}` |
| Videoya ses koymak | Dosya ~%10 büyür, hiç çalınmaz | ffmpeg'de `-an` |
| Telefonda da yatay videoyu kullanmak | Kadrajın ~%65'i kırpılır, kompozisyon dağılır | `portrait` takımı ver |
| Varyantı `matchMedia` ile seçmek | Editör simülatöründe yanlış karar | `ResizeObserver` ile konteyneri ölç |
| Ölçümü `useEffect` ile yapmak | Mobilde iki video birden indirilir | `useLayoutEffect` |
| Tek eşik (`ratio < 1`) kullanmak | Sınırda video sürekli yeniden yüklenir | Histerezis (0.95 / 1.05) |
| `<source>`'u değiştirip `key` vermemek | Tarayıcı yeni kaynağı okumaz | `key={variantId}` |

---

## 7. Nasıl denerim?

### 7.1 Tip kontrolü

```bash
npm run lint
```

Hata vermiyorsa TypeScript tarafı sağlamdır.

### 7.2 Tarayıcıda

```bash
npm run dev
```

`http://localhost:3000` → tema önizlemesine git.

**Kontrol listesi:**

1. **Poster görünüyor mu?** Ağ sekmesinde (DevTools → Network) hızı
   "Slow 3G" yapıp sayfayı yenile. Video inerken poster durmalı, siyah
   ekran olmamalı.
2. **Video yumuşak geçiyor mu?** Poster'dan videoya ani sıçrama olmamalı.
3. **Kaydırınca duruyor mu?** DevTools → Performance kaydı al, aşağı kaydır.
   Hero ekrandan çıkınca video kare çizmeyi bırakmalı.
4. **Hareketi azalt çalışıyor mu?** DevTools → Rendering paneli →
   `Emulate CSS prefers-reduced-motion: reduce` → sayfayı yenile.
   Ağ sekmesinde **mp4 hiç indirilmemeli**.
5. **Gerçek telefonda:** Aynı ağdaki telefondan `http://<bilgisayar-ip>:3000`
   aç. `npm run dev` zaten `--host=0.0.0.0` ile çalışıyor. iPhone'da videonun
   tam ekrana zıplamadığını doğrula.

### 7.3 Konsol kontrolü

Konsolda şunlar **olmamalı**:

- `Unhandled Promise Rejection` → `.catch` unutulmuş
- `Warning: Each child in a list should have a unique "key"` → `key` eksik
- `Warning: Invalid DOM property 'playsinline'` → camelCase hatası

---

## 8. Terim sözlüğü

| Terim | Anlamı |
|---|---|
| **JSX** | JavaScript içine gömülü HTML benzeri sözdizimi |
| **props** | Bileşene dışarıdan verilen ayarlar |
| **hook** | `use` ile başlayan, React özelliklerine erişen fonksiyon |
| **ref** | DOM elementine doğrudan erişim tutamağı |
| **yan etki (side effect)** | Ekrana çizim dışındaki her iş |
| **cleanup** | Bileşen kalkarken çalışan temizlik fonksiyonu |
| **bağımlılık dizisi** | `useEffect`'in ne zaman yeniden çalışacağını belirler |
| **lazy initialization** | Başlangıç değerini sadece ilk çizimde hesaplama |
| **destructuring** | Nesne/diziden alanları tek tek değişkene alma |
| **guard clause** | İç içe `if` yerine erken `return` |
| **codec** | Video sıkıştırma yöntemi (H.264, VP9) |
| **poster** | Video yüklenmeden görünen durağan kare |
| **LCP** | Largest Contentful Paint — en büyük içeriğin boyanma süresi (Google'ın hız ölçütü) |
| **scrim** | Okunabilirlik için görsel üstüne binen yarı saydam katman |
| **object-fit: cover** | Kutuyu tamamen doldur, oranı koru, taşanı kırp |
| **IntersectionObserver** | Element görünürlüğünü verimli izleyen tarayıcı API'si |
| **graceful degradation** | Özellik çalışmazsa çökmeden basit hâline düşme |
| **memory leak** | Temizlenmeyen kaynakların bellekte birikmesi |
| **SRP** | Tek Sorumluluk İlkesi — bir dosya tek işten sorumlu |
| **composition** | Bileşenleri iç içe geçirerek birleştirme deseni |
| **compositor thread** | Tarayıcının çizim işini yapan, JS'ten bağımsız iş parçacığı |

---

## 9. Bu dosyanın bilinçli olarak yapmadıkları

Mimari sınırları netleştirmek için:

- **Hangi videoyu göstereceğine karar vermez** → şablon karar verir
  (yalnızca şablonun verdiği iki takım arasından, kutunun şekline göre seçer)
- **Video üretmez, kırpmaz, ölçeklendirmez** → dikey takım hazır gelmelidir
- **Codec seçmez** → `sources` dizisini şablon kurar
- **Renk/tema bilmez** → `SectionTheme` ile hiç ilgisi yok
- **Kırpma odağını kendi belirlemez** → `objectPosition` prop'u ile dışarıdan gelir
- **Üstüne bindirilecek katmanları üretmez** → `children` olarak dışarıdan alır

Bu kısıtlar bilinçlidir. Bileşen ne kadar az şey bilirse o kadar çok yerde
kullanılabilir.
