# Kurumsal kategori kimliği — "Grafit & Sinyal"

> **Kapsam:** `src/components/templates/kurumsal/**` (26 şablon, `flavors.tsx`, `parts/`)
> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-*` preset kimlikleri)
> **Denetim:** `npm run check` · duman testi (26 şablon × 4 senaryo) · kontrast
> betiği — bkz. [7. Doğrulama](#7-doğrulama)

---

## 1. Neden yeni bir kimlik?

Eski kurumsal şablonların çoğu çelik mavisi / turkuaz etrafındaydı. Bu aile
Sünnet'in (`#2f7f8c`, `#7fd0c0`) ve Nişan'ın (`#9fb8d8`, `#5f7f9f`) paletleriyle
çakışıyordu. Deco ise "koyu zemin + şampanya altını" varsayılanını taşıyordu.
Kategoriler arasındaki fark çoğunlukla yalnızca renkti.

Kurumsal davetin duygusu romantik değil. Davet **ölçülüp biçilmiş, güven veren
bir belge** gibi görünmeli. Kimlik bu yüzden baskı provasından türetildi.

| Eksen | Kurumsal | Kardeş kategoriler |
|---|---|---|
| Palet | Nötr grafit/kâğıt + **tek sinyal** (kobalt) | Sıcak krem, altın, gül, bordo |
| Yazı | **Grotesk** (Inter), sıkı harf aralığı, tabular rakam | Playfair / Cormorant serif |
| Motif | Kesim işareti, kayıt artısı, cetvel | Yaprak, alyans, hilal, taç |
| Hareket | Kesin ve kısa: çizgi çizilir, başlık maskeden yükselir | Bulanıklıktan süzülme, yavaş belirme |
| Köşe | 4 px kart / 2 px kontrol | 24 px yuvarlak kart |

## 2. Palet (hex)

`parts/theme.ts` → `KURUMSAL_INK`. Tailwind sınıfları şablon dosyalarında açık
yazılır. Tailwind dinamik üretilen sınıfı göremez.

| Ad | Hex | Rol |
|---|---|---|
| Grafit | `#0D0F13` | Koyu zemin |
| Antrasit | `#161A20` | Koyu kart (`/85`) |
| Kâğıt | `#F1F1ED` | Açık zemin (fildişi değil, nötr ofis kâğıdı) |
| Beton | `#E4E4DE` | Açık hover / ikincil yüzey |
| Mürekkep | `#101216` | Açık zeminde başlık |
| Koyu başlık | `#F3F4F1` | Koyu zeminde başlık |
| Koyu gövde | `#A2A8B0` | Koyu zeminde gövde (8.0:1) |
| Açık gövde | `#565B63` | Açık zeminde gövde (6.0:1) |
| **Kobalt** | `#2B3FE0` | Kategori sinyali: açık zeminde vurgu, CTA, mühür |
| **Kobalt ışığı** | `#8F9CFF` | Koyu zeminde vurgu ve CTA |
| Platin | `#C5CBD3` | Gala dili (Noir, Deco, Mermer, Zirve) |
| İşaret kırmızısı | `#F0442A` / koyu zeminde `#FF6A4D` | Yalnızca afiş dili (Kinetik, Pano) ve küçük işaretler (Brutal, Posta, Terrazzo) |
| Kobalt gece | `#0F1A5C` | Blueprint paftası |

Kurumsal kimlik başka bir şirketin kimliği değildir. Kobalt, hiçbir markanın
imza mavisinden alınmadı. Logo, yazı ya da renk imzası taklidi yoktur.

## 3. Tipografi

- **Grotesk takası** (`kurumsalTheme(…, { type: 'grotesk' })`): Ortak bölümler
  başlıklarını `font-serif` ile basar. Tema kökü
  `[&_.font-serif]:font-sans [&_.font-serif]:not-italic` taşır. Böylece şablonun
  içindeki serif başlıklar Inter'e döner ve dik yazılır. Seçici iki sınıflı
  (0,2,0) olduğundan tekil yardımcıları ezer. Bu, `index.css`'teki
  `.theme-cormorant` ile aynı desendir; yalnızca şablona kapsamlıdır.
- **Serif korunanlar** (`type: 'serif'`): Noir ve Deco (Cormorant), Mermer, Kağıt
  ve Gazete (Playfair). Bunlar gala, resmî kayıt ve gazete dilidir. Serif o
  dilin kendisidir.
- Künye hero'su: başlık Inter 600, `tracking-[-0.035em]`, `leading-[1.02]`.
  Etiketler 9–11 px, büyük harf, `0.22–0.3em`. Rakamlar `tabular-nums`.

## 4. Motif dili

| Motif | Dosya | Nerede |
|---|---|---|
| Odak işareti (köşe kesimleri + artılı daire) | `flavors.tsx` → `Ornament` | Zarf mührü, hero süsü, künye rayı |
| Kayıt artısı ızgarası | `flavors.tsx` → `BackgroundPattern`, `parts/RegistrationGrid.tsx` | Bölümlerin arkası; Network, Bento, Brutal, Yıldız hero zemini |
| Kesim işaretli kadraj + kenar cetveli | `parts/KurumsalFrame.tsx` | 16 şablonun hero sahnesi (`HeroStage.overlay`) |
| Buzlu cam levhalar | `parts/GlassPanes.tsx` | Cam |
| Yıl filigranı (konturlu) | `parts/KurumsalHero.tsx` | Künye hero (sola yaslı düzen) |

## 5. Hareket karakteri

`KURUMSAL_EASE = [0.16, 1, 0.3, 1]`: hızlı çıkar, kısa kuyrukla oturur.
Süreler 0.6–0.95 s, kademe 0.06–0.09 s. Bulanıklık filtresi yok, süzülme yok.

- Ray ve künye çizgileri `scaleX` ile soldan sağa çizilir.
- Başlık maskeli bir satırdan `y: 110% → 0` yükselir. Maske alt payı
  (`pb-[0.12em]`) ç/ş/g kuyruklarını kesmez.
- Kesim işaretleri `scale 0.4 → 1` ile yerine oturur, cetvel yukarıdan iner.
- Sürekli döngüler yalnızca iki tane ve ikisi de sakin: kaydırma işaretindeki
  sinyal (1.6 s) ve cam levhaların süzülmesi (14–17 s).

## 6. Şablonlar: hangisi kendi hero'sunu aldı, neden?

**Kendi hero'su (Künye — `parts/KurumsalHero.tsx`):** Network, Cam, Zirve, Aurora.

Bu dördü varsayılan `Summary`'yi kullanıyordu. `Summary` ismi çift gibi basar:
"Nova Teknoloji **&** Gelecek Zirvesi" italik bir ampersandla yan yana durur.
Kurumsal sihirbaz ise ad alanını **"Kurum / Marka" & "Etkinlik Adı"** olarak
toplar (`data.ts` → `nameLabels`). Künye hero adı ikiye ayırır. Kurum üst raya,
etkinlik dev başlığa gider. Tarih, saat ve mekân etiketli satırlara dizilir.
Uzun adlar için dört ölçü kademesi vardır. Bu bir düzen farkıdır, renkle
çözülemez. Network, Cam ve Zirve yalnızca kurumsal kategoride var; Aurora'nın
Summary'si de bir tasarım dili değil, varsayılandı.

| Düzen | Şablonlar | Neden |
|---|---|---|
| `align="start"` (sola yaslı) | Network, Cam | Sahnenin ağırlığı sağda (ağ, cam levhalar); metin solda nefes alır |
| `align="center"` | Zirve, Aurora | Sahnenin odağı eksende (güneş, ışık perdesi) |

**Ortak hero'yu koruyanlar (22):** Tasarım dili şablonun adıdır (Bento, Brutal,
Vitray…). Bu dili kategori hero'suyla değiştirmek ad ile görünümü çelişkiye
düşürürdü. Bu şablonlar kimliği şu yollarla alır: `kurumsalTheme()` ile köşe,
düğme ve grotesk başlık; hero parametreleri (kobalt, platin, işaret); sahneye
eklenen kadraj ya da ızgara. Ortak hero kodu kopyalanmadı.

| Şablon | Ton | Sinyal | Yazı | Köşe | Sahne eki |
|---|---|---|---|---|---|
| Bento | açık | kobalt | grotesk | kesin | ızgara + kadraj |
| Bilet | koyu | kobalt ışığı | grotesk | kesin | kobalt tram + kadraj |
| Blueprint | kobalt gece | kırmızı kalem `#FF8A6B` | grotesk | sert | — (paftanın kendi çerçevesi var) |
| Brutal | açık | kobalt + işaret | grotesk | sert | tam kayıt ızgarası |
| Çizgi | açık | kobalt | grotesk | kesin | kadraj |
| Deco | kobalt gece | platin | Cormorant | kesin | platin yelpaze; hero süsleri gri tonlu |
| Dokuma | açık | kobalt | grotesk | kesin | kadraj (cetvelsiz) |
| Film | koyu | kobalt ışığı | grotesk | kesin | kadraj (cetvelsiz) |
| Gazete | açık | kobalt | Playfair | kesin | — |
| Herbaryum | açık | kobalt (siyanotip) | grotesk | kesin | — |
| Kağıt | açık | koyu kobalt mühür | Playfair | kesin | — |
| Kinetik | koyu | işaret | grotesk | kesin | kadraj |
| Mermer | koyu | platin | Playfair | kesin | — |
| Noir | koyu | platin | Cormorant | sert | kadraj (cetvelsiz) |
| Pano | koyu | işaret | grotesk | kesin | kadraj; panoya yalnızca etkinlik adı (20 karakter sınırı) |
| Plak | koyu | kobalt etiket | grotesk | kesin | kadraj |
| Posta | açık | kobalt + işaret şerit | grotesk | kesin | kadraj (cetvelsiz) |
| Suluboya | açık | kobalt | grotesk | kesin | kadraj |
| Terrazzo | açık | kobalt | grotesk | serbest | — (hero opak taş) |
| Ufuk | sahne | kobalt ışığı | grotesk | serbest | — (ortak Ufuk sahnesi) |
| Vitray | koyu | kobalt ışığı | grotesk | kesin | kadraj (cetvelsiz) |
| Yıldız Haritası | koyu | kobalt ışığı | grotesk | kesin | koordinat ızgarası |

### Deco'daki gri tonlama

`DecoHero`, çerçevesini ve yelpazesini sabit altınla çizer (`212,175,95`).
Bunun parametresi yok. KurumsalDeco hero kabına
`heroContentClassName="[&_[aria-hidden=true]]:grayscale"` verir. Böylece yalnızca
dekoratif (`aria-hidden`) katmanlar gri tonlanır ve altın, platine döner.
Metin ve süs zaten temadan renk alır. Kalıcı çözüm `DecoHero`'ya bir `metal`
parametresi eklemektir; bkz. raporun ortak değişiklik önerileri.

## 7. Doğrulama

### 7.1 Kontrast (WCAG AA)

Betik her şablonun `SectionTheme` sınıflarını kaynaktan okur. Yarı saydam
renkleri altındaki zemine karıştırır: kart = `surface ∘ base`, girdi =
`input ∘ kart`. Vurgu dolgusunun üstündeki yazı, ortak bölümlerin sabit
rengidir (koyu: `slate-950`, açık: `stone-50`). Kalın değer AA altıdır;
tabloda yoktur.

| Şablon | Ton | Başlık/zemin | Gövde/zemin | Vurgu/zemin | Başlık/kart | Gövde/kart | Vurgu/kart | Birincil düğme | Vurgu dolgu+yazı | Yer tutucu/girdi |
|---|---|---|---|---|---|---|---|---|---|---|
| KurumsalAurora | koyu | 18.01 | 10.15 | 7.92 | 16.96 | 9.56 | 7.46 | 7.92 | 8.04 | 5.20 |
| KurumsalBento | açık | 16.56 | 6.04 | 6.42 | 18.52 | 6.75 | 7.18 | 7.27 | 6.96 | 4.98 |
| KurumsalBilet | koyu | 17.37 | 8.01 | 7.64 | 15.69 | 7.23 | 6.90 | 7.64 | 8.04 | 4.71 |
| KurumsalBlueprint | koyu | 13.51 | 7.54 | 6.88 | 11.90 | 6.87 | 6.06 | 6.88 | 8.74 | 4.79 |
| KurumsalBrutal | açık | 16.56 | 6.04 | 6.42 | 18.25 | 6.65 | 7.07 | 7.27 | 6.96 | 6.65 |
| KurumsalCam | açık | 16.27 | 7.15 | 6.31 | 18.11 | 7.95 | 7.02 | 7.27 | 6.96 | 4.96 |
| KurumsalCizgi | açık | 17.01 | 6.20 | 6.59 | 18.48 | 6.74 | 7.16 | 17.01 | 6.96 | 4.98 |
| KurumsalDeco | koyu | 17.68 | 8.00 | 11.95 | 16.66 | 7.53 | 11.26 | 11.95 | 12.35 | 5.11 |
| KurumsalDokuma | açık | 16.56 | 6.04 | 6.42 | 17.80 | 6.49 | 6.90 | 16.56 | 6.96 | 4.98 |
| KurumsalFilm | koyu | 17.37 | 8.01 | 7.64 | 16.07 | 7.41 | 7.07 | 7.64 | 8.04 | 4.85 |
| KurumsalGazete | açık | 16.56 | 6.04 | 6.42 | 17.80 | 6.49 | 6.90 | 16.56 | 6.96 | 4.98 |
| KurumsalHerbaryum | açık | 16.56 | 6.04 | 6.42 | 18.08 | 6.59 | 7.01 | 16.56 | 6.96 | 4.85 |
| KurumsalKagit | açık | 16.56 | 6.04 | 7.99 | 18.41 | 6.71 | 8.89 | 16.56 | 8.66 | 4.98 |
| KurumsalKinetik | koyu | 17.37 | 8.01 | 6.78 | 16.07 | 7.41 | 6.27 | 6.78 | 7.13 | 4.85 |
| KurumsalMermer | koyu | 17.26 | 7.77 | 11.66 | 16.04 | 7.22 | 10.84 | 11.66 | 12.35 | 4.84 |
| KurumsalNetwork | koyu | 17.60 | 8.11 | 7.74 | 16.60 | 7.65 | 7.30 | 7.74 | 8.04 | 5.05 |
| KurumsalNoir | koyu | 17.72 | 7.70 | 11.98 | 16.74 | 7.27 | 11.31 | 11.98 | 12.35 | 5.04 |
| KurumsalPano | koyu | 17.37 | 8.01 | 6.78 | 16.07 | 7.41 | 6.27 | 6.78 | 7.13 | 4.85 |
| KurumsalPlak | koyu | 17.37 | 8.01 | 7.64 | 16.07 | 7.41 | 7.07 | 7.64 | 8.04 | 4.85 |
| KurumsalPosta | açık | 16.70 | 6.09 | 6.47 | 17.95 | 6.55 | 6.96 | 7.27 | 6.96 | 4.98 |
| KurumsalSuluboya | açık | 17.01 | 6.20 | 6.59 | 18.48 | 6.74 | 7.16 | 7.27 | 6.96 | 4.98 |
| KurumsalTerrazzo | açık | 16.26 | 5.93 | 6.30 | 18.05 | 6.58 | 6.99 | 16.26 | 6.96 | 4.85 |
| KurumsalUfuk | koyu | 20.19 | 10.85 | 9.30 | 19.12 | 10.28 | 8.80 | 8.71 | 9.29 | 5.91 |
| KurumsalVitray | koyu | 17.81 | 8.05 | 7.83 | 16.72 | 7.56 | 7.36 | 7.83 | 8.04 | 5.13 |
| KurumsalYildizHaritasi | koyu | 17.91 | 8.10 | 7.88 | 16.87 | 7.63 | 7.42 | 7.88 | 8.04 | 5.20 |
| KurumsalZirve | koyu | 17.25 | 10.63 | 11.66 | 16.13 | 9.94 | 10.90 | 15.64 | 12.35 | 5.00 |

**Hero çiftleri.** Künye hero'su hareketli bir sahnenin üstünde durur. Zemin
olarak sahnenin **en parlak noktası** alındı: renk kütlesi, ışın ya da hale,
scrim ile birlikte. İlk ölçümde üç şablon AA altında kalıyordu. Düzeltmeden
sonraki değerler:

| Hero çifti | Renkler | Oran | Düzeltme |
|---|---|---|---|
| Zirve · gövde / şafak orta bant | `#BCC2CC` / `#3a4159` | 5.64 | 3.41'di. Gökyüzü orta durağı `#2E3754`, ışın 0.26, gövde açıldı |
| Zirve · vurgu (platin) | `#C5CBD3` / `#3a4159` | 6.18 | — |
| Cam · gövde / kobalt leke | `#4A4F58` / `#ccd2ec` | 5.49 | 4.21'di. Kütle 0.14, degradenin koyu ucu açıldı, gövde koyulaştı |
| Cam · vurgu / kobalt leke | `#2B3FE0` / `#ccd2ec` | 4.84 | 4.28'di (aynı düzeltme) |
| Aurora · gövde / ışık perdesi | `#B4B9C9` / `#2c3265` | 6.12 | 4.24'tü. Perde 0.38, gövde açıldı |
| Aurora · vurgu / ışık perdesi | `#8F9CFF` / `#2c3265` | 4.78 | 4.09'du (aynı düzeltme) |
| Network · gövde / kobalt hale | `#A2A8B0` / `#1b256a` | 5.77 | — |
| Pano · palet yazısı | `#F3F4F1` / `#16191F` | 15.94 | — |
| Plak · etiket yazısı | `#F3F4F1` / `#2B3FE0` | 6.58 | — |
| Posta · "Uçak Postası" etiketi | `#F4F7FB` / `#2B3FE0` | 6.76 | — |
| Posta · pul yazısı | `#2B2318` @0.75 / `#C5CBD3` | 5.13 | — |
| Herbaryum · föy etiketi (7 px) | `#2B3FE0` / `#FFFFFF` | 7.27 | — |
| Brutal · accent2 dolgu yazısı | `#101216` / `#F0442A` | 4.97 | — |
| Blueprint · ince etiket (@0.55, 6.5 px) | `#E8ECFF` @0.55 / `#0F1A5C` | 4.94 | — |
| Blueprint · kırmızı kalem | `#FF8A6B` / `#0F1A5C` | 6.88 | — |
| Deco · platin / kobalt gece | `#C5CBD3` / `#141A33` | 10.49 | — |

En düşük oran: **4.71** (Bilet, yer tutucu). AA altında çift yok.

**Bilerek dışarıda bırakılan dekoratif metinler** (bilgi taşımaz; içerik başka
bir yerde AA ile tekrar edilir):

| Öğe | Neden muaf |
|---|---|
| Künye yıl filigranı (konturlu, %10) | Yılı künyedeki "Tarih" satırı zaten basar; `aria-hidden` |
| Kinetik alt şeridi (vurgu, `opacity-25`) | Akan tekrar metni; mekân/tarih çekirdekte AA ile yazılı (ortak hero) |
| Kesim işaretleri, cetvel, kayıt artıları | Metin değil; `aria-hidden` |

### 7.2 Hareketi azalt (`prefers-reduced-motion`)

`App.tsx`'teki `MotionConfig reducedMotion="user"` yalnızca Motion'ın transform
animasyonlarını susturur. Diğer kaynaklar tek tek ele alındı.

| Kaynak | Tür | Nasıl susuyor |
|---|---|---|
| Künye: başlık maskesi, ray/künye çizgileri, ofset girişler | Motion transform (`y`, `x`, `scaleX`) | `MotionConfig` → anında son durum; opaklık geçişi kalır (hareket değil) |
| Künye: kaydırma işareti döngüsü | Motion `repeat: Infinity` | `useReducedMotion()` → `y: 0`, `duration: 0` (durağan çizgi) |
| Künye: yıl filigranı | Motion opaklık | Hareket yok; yalnızca solma |
| Kadraj: köşe işaretleri, cetvel | Motion `scale` / `scaleY` | `MotionConfig` |
| Cam levhalar: süzülme | Motion `repeat: Infinity` | `useReducedMotion()` → `y: 0`, `duration: 0` |
| Halo, AuroraMesh, Iridescent, GodRays, FogDrift, GoldSheen | CSS `@keyframes` | `[data-atmosphere]` → `index.css` kuralı `animation: none` |
| Parçacıklar (network, stardust, streaks, haze) | canvas + rAF | `ParticleField` → `staticFrame` (tek kare), işaretçi etkisi 0 |
| HeroStage işaretçi parallax'ı | işaretçi → transform | `usePointerParallax` → hareket azaltılınca dinleyici kurulmaz |
| Kinetik / Brutal şeridi | CSS `animate-marquee` | `index.css` reduced-motion listesi |
| Plak dönüşü, Vitray, Film, Mermer, Terrazzo döngüleri | Motion sonsuz döngü | Ortak hero'lar `useReducedMotion()` ile kendileri kapatır |
| Pano palet çevirme | `setInterval` | `PanoHero` → `armed && !reduced` |
| Ufuk sahnesi ve hero çıkışı | kaydırmaya bağlı + CSS | Ortak `UfukScene`/`UfukHero` (`useReducedMotion`, `data-atmosphere`) |
| Zarf | Motion 3B | Ortak `Envelope`: bekleme atlanır, tek adımda solar |
| Gündem çizgisi (Timeline) | kaydırmaya bağlı `scaleY` | Kullanıcı kaydırmasını izler, kendiliğinden oynamaz. Ortak dosya; dokunulmadı |

### 7.3 Duman testi

`node_modules/.cache/smoke-kurumsal/` (git'e girmez), `scripts/run-check.mjs`
örneğiyle esbuild. Her şablon dört senaryoyla çizilir:

- (a) dolu örnek, zarf kapalı
- (b) her şey boş, zarf kapalı
- (c) (a) + zarf açık
- (d) 30+ karakterlik kurum ve etkinlik adı

Her çizim hem `renderToString` hem `prerenderToNodeStream` ile yapılır. İkincisi
tembel bölümleri (Gündem, Konum, Galeri, Bağış, Kayıt) gerçekten çözer. Çıktıda
`undefined`, `NaN`, `Invalid Date` ve `null` aranır; React'in Suspense çözüm
betiği denetim dışıdır. Ayrı bir yoklama şunları doğrular: grotesk takası,
bölüm kartlarının köşesi ve Künye'nin ad ayrımı/ölçü kademeleri.
