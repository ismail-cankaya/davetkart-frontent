# `scripts/video/` — kodla video üretim boru hattı

> **Faz 16** · 4 Kasım 2026 · dal `design/claude-davetiye`
> Şablon tarafı: [`src/components/templates/premium-videolu.md`](../src/components/templates/premium-videolu.md)

Premium (Gold) şablonların arka plan videoları **internetten indirilmez**, kodla üretilir. Gerekçe:
ağ yalnızca paket yöneticilerine açık, stok video lisans riski taşır ve kodla üretilen bir sahne
istendiği an yeniden render edilebilir (renk, süre, kompozisyon değişikliği bir parametre).

## 1. Klasör düzeni

```
scripts/video/
├── render.mjs                 # ortak çalıştırıcı (Node, ESM)
├── lib/
│   ├── types.ts               # SceneDef / SceneContext sözleşmesi
│   ├── stage.ts               # three.js çizici + efekt zinciri (bloom, vinyet, gren, titreşim)
│   ├── bloom.ts               # SoftBloomPass (13 dokulu aşağı / çadır yukarı örnekleme)
│   └── glsl.ts                # ortak GLSL gürültü, deterministik PRNG, ışık lekesi sprite'ı
└── <sablon-id>/
    ├── scene.ts               # ana klip → <id>-{desktop,mobile}.*
    ├── <klip>.scene.ts        # ek klip (ör. giris) → <id>-<klip>-{desktop,mobile}.*
    └── *.ts                   # sahneye özel yardımcılar (ör. saray-kapisi/sahne.ts)
```

Çıktılar mevcut sözleşmeyle aynı yerde (`videoAssets.ts`):

```
public/videos/templates/<id>/<id>-desktop.mp4|webm   <id>-desktop-poster.jpg
public/videos/templates/<id>/<id>-mobile.mp4|webm    <id>-mobile-poster.jpg
public/videos/templates/<id>/<id>-<klip>-desktop.mp4 …   (clipSet ile okunur)
```

> Not: iş tanımında poster adı `-poster.jpg` olarak geçiyordu; mevcut 13 videolu şablon ve
> `videoAssets.ts` varyant başına poster kullandığı için (`<id>-desktop-poster.jpg`) aynı düzen korundu.

## 2. Sahne sözleşmesi (`lib/types.ts`)

```ts
interface SceneDef {
  duration: number;   // sn
  fps: number;        // 24 sakin sahneler, 30 hareketli/scrub
  loop: boolean;      // kusursuz döngü
  scrub?: boolean;    // kaydırmaya bağlı: kısa GOP
  poster: number;     // poster anı (sn); posterMobile ile varyanta özel
  crf?: number;       // x264 başlangıç CRF'i
  setup(ctx): { render(t: number): void };
}
```

**Kural: kare yalnızca `t`'ye bağlıdır.** Simülasyon durumu biriktirilmez; parçacıklar kapalı
biçimli formüllerle (`konum = p0 + v·τ − ½gτ²`, sürüklenmeli yollar) hesaplanır, rastgelelik
`rng(seed)` (mulberry32) ile tohumludur. Bu yüzden kareler herhangi bir sırayla, paralel
işçilerde üretilebilir ve aynı komut her çalıştırmada aynı videoyu verir.

**Döngü kuralı:** her hareket `D` süresinde tam sayı tur atar (`sin(2π·k·t/D)`, `k` tam sayı).
Bitişi aşan olaylar (fişek patlaması) `t−D` ve `t+D` kaydırmalarıyla da değerlendirilir. Gürültü
alanlarında zaman, gürültü uzayında bir çember üzerinde dolaşır (`fbm(p + r·(cos, sin)(2πt/D))`).

**Mobil kompozisyon ayrı düşünülür:** `ctx.variant === 'mobile'` iken kamera FOV'u, nesne
konumları ve kadraj yeniden yerleşir (ör. Kader İpliği'nde düğüm üst üçte bire, Şehzade'de
fenerler dikey diziye). Yatay videonun kırpılması değildir.

## 3. Çalıştırma

```bash
node scripts/video/render.mjs <id> [--clip ad] [--variant desktop|mobile|all] [--workers 2] [--sheet]
node scripts/video/render.mjs <id> --stills 0,2.5,6        # yalnızca PNG kareler (geliştirme)
```

- Ara dosyalar: `node_modules/.cache/video/<id>/` (git dışı). `--stills` PNG, normal render JPEG q0.95 kare yazar.
- `--sheet`: baş / %25 / orta / %75 / son kare (+ döngüde ilk kare) yan yana temas sayfası —
  döngü birleşimini gözle kontrol etmek için.
- Sonuç satırları `node_modules/.cache/video/<id>/rapor.txt`'ye eklenir.

### 3.1 Akış

1. **Paketleme:** sahne esbuild ile tek IIFE'ye paketlenir (three.js dahil).
2. **Kare üretimi:** her işçi kendi headless Chromium'unu (`--use-angle=swiftshader`) açar,
   kendi kare aralığını `render(t)` + `canvas.toDataURL('image/jpeg', 0.95)` ile yazar.
3. **H.264 mp4:** `libx264 -preset slow -tune film -pix_fmt yuv420p -profile:v high -movflags +faststart`.
   Döngüde GOP = 2 sn; **scrub** videolarda `-g <fps> -keyint_min <fps> -sc_threshold 0 -bf 0`
   (saniyede bir anahtar kare, B-kare yok). Arama en çok `fps − 1` kare çözer; telefonun
   donanım çözücüsünde birkaç ms. **Karar:** iş tanımı "kısa GOP" diyordu; 6 ve 12 karelik GOP
   denendi, kamerası hareket eden 1080 × 1920 klip 900 KB mobil bütçede x264 CRF 44–45'e düştü
   (bloklu). 1 sn'lik GOP kaliteyi geri kazandırdı; geri sarma da B-karesiz olduğu için hızlı.
4. **VP9 webm:** `libvpx-vp9 -b:v 0 -crf … -row-mt 1`, aynı GOP kuralı.
5. **Bütçe:** masaüstü mp4 ≤ 1.8 MB, mobil mp4 ≤ 900 KB, poster ≤ 60 KB. Aşılırsa CRF,
   aşım oranına göre sıçrar (`+6 CRF ≈ yarı bit oranı` → `crf += ⌈6·log2(boyut/bütçe)⌉`).
6. **Poster:** poster anının karesi tarayıcının JPEG kodlayıcısıyla, bütçeye sığan en yüksek
   kalitede (gerekirse %80 / %66 genişlikte) yazılır.

### 3.2 ffmpeg

Kapsayıcıda `/usr/bin/ffmpeg` (6.1, libx264 + libvpx-vp9) vardı; bu yüzden `ffmpeg-static`
eklenmedi. Çalıştırıcı sırasıyla `$FFMPEG`, PATH'teki `ffmpeg`, sonra (kuruluysa)
`ffmpeg-static` paketini dener; hiçbiri yoksa `npm i -D ffmpeg-static` önerir.

### 3.3 Playwright

Kapsayıcıdaki önkurulu Playwright `require('playwright')` ile alınır (`createRequire`); proje
`package.json`'ına eklenmedi. Yerel makinede `npx playwright install chromium` yeterlidir.

## 4. Efekt zinciri (`lib/stage.ts`)

`RenderPass → SoftBloomPass → OutputPass (ton eşleme + sRGB) → FinishPass`

- **SoftBloomPass:** UnrealBloomPass'in küçük çekirdekli düşük mip'leri parlak noktaların
  çevresinde **kare hale** bırakıyordu (Al Duvak'ın pul parıltılarında görüldü). Jimenez 2014
  tipi 13 dokulu aşağı örnekleme + 9 dokulu çadır yukarı örnekleme yuvarlak hale verir.
- **FinishPass:** vinyet, isteğe bağlı renk sapması, **zamansal gren** (çok düşük tutulur) ve
  **durağan üçgen titreşim** (±1/255, kareden kareye değişmez). Titreşim koyu degradelerde
  8 bit basamaklarını kırar; durağan kamerada hareket kestiriminde bedavaya yakındır.
  **Kamerası hareket eden sahnelerde (`dither: false`) kapatılır:** ekrana sabit desen, içerik
  kayarken her karede yeniden kodlanır ve bütçeyi yer (Kristal Balo, Kep, Saray Kapısı).
- Shader sahnelerinde renkler sRGB olarak seçildiyse fragment sonunda `pow(col, 2.2)` ile
  doğrusala çevrilir (Ay Beşiği), aksi hâlde çıkış geçişi pastel tonları yıkar.
- Canvas 2D sahneleri `canvasLayer()` dokusuyla aynı zincirden geçer (bloom, gren).

## 5. Performans notları (SwiftShader, 4 çekirdek)

| Ölçüm | Değer |
|---|---|
| Boş zincir (render + bloom + çıkış) 1080p | ~0.43 sn/kare (bloom'suz 0.19) |
| PNG kodlama 1080p (`toDataURL`) | ~0.14 sn · JPEG q0.95 ~0.045 sn |
| Al Duvak (shader) | ~1.0 sn/kare |
| Havai Fişek (canvas 2D, ~2500 sprite) | ~1.4 sn/kare |
| İki işçi paralel | toplam verim yalnızca ~%10 artar (SwiftShader zaten çok iş parçacıklı) |

Çıkarım: çözünürlük düşürülmedi; kare başına iş azaltıldı (tam ekran shader'da MSAA kapalı,
pahalı katmanlar tek seferlik canvas'a "pişirildi": gök, silüet, sarmaşık, çadır tavanı).

### Bit oranı dersi

İlk Gece Havuzu render'ı mobilde CRF 38'e düşmüştü (karolar çamurlaştı): kareden kareye değişen
gren + yüksek frekanslı kostik bütçeyi yiyordu. Zamansal gren 0.02 → 0.004–0.005'e indi, havuz
24 fps'e alındı ve yeniden render edildi. Sonuçlar §6'da.

## 6. Üretilen videolar

Tablo `premium-videolu.md` §3'te (boyutlar, CRF, poster kalitesi).
