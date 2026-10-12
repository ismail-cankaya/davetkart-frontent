# `src/components/templates/kina/parts/KinaHero.tsx` — Kına hero'su

> **Kullananlar:** `KinaSade`, `KinaManzara`, `KinaSekilli`, `KinaModern`, `KinaBordo`, `KinaSaray`, `KinaMum`, `KinaAurora`, `KinaKrom`
> **Denetim:** kına duman testi (35 × 3 senaryo), kontrast betiği (hero çiftleri), görsel öz-kontrol (360 / 768 / 1280) — bkz. [KIMLIK](../KIMLIK.md)

---

## 1. Neden yeni bir hero

Bu dokuz şablon ortak `Summary`'yi kullanıyordu: dokuz kategoride aynı düzen, kına
içinde de aynı koyu bordo zemin. 360 px temas sayfasında yedisi birbirinin kopyası
gibi duruyordu. Ortak bir hero'yu kopyalamak yasak; bu, kına töreninden okunan yeni
bir düzen:

```
      (tepsi)          ← kına tepsisi: bulanıktan netleşir, alevler titrer
  KINA GECEMİZE …     ← başlık, Inter büyük harf
      Sophia          ← Playfair Display DİK (italik değil), 500
       (&)            ← avuca konan kına damgası: leke ortadan yayılır
      Elias
   ~~~ lale ~~~       ← bindallı dalı
      mesaj
  CUMARTESİ · SAAT 19:00
    6 Şubat 2027
   ⌖ mekân
   🕯 🕯 🕯 🕯         ← mum sayacı
```

## 2. Summary ile sözleşme eşliği

| Alan | Boşsa |
|---|---|
| `names` | "Davetlisiniz" (tek satır; damga çizilmez) |
| `title` | Başlık satırı çizilmez |
| `subtitle` | Paragraf çizilmez |
| tarih / mekân | Künye yalnızca dolu olanla; ikisi de boşsa hiç |
| `showTimer` | false ya da geçersiz tarih → sayaç yok |

Tarih `heroText.kinaDateParts` ile duvar saatinden okunur; `new Date(invitation.date)` yok.
Sayaç `shared/useCountdown` ile saat dilimini kullanır.

## 3. Parametreler

| Prop | Değerler | Kim kullanır |
|---|---|---|
| `align` | `center` (tören) · `start` (afiş, iri ad, damga ikinci adın solunda) | Modern, Krom → `start` |
| `names` | `stack` (adlar alt alta, damga arada) · `line` (tek satır, küçük damga; ~130 px kısa) | Mum, Manzara, Aurora → `line` |
| `timer` | `mum` (dört mum, `MumSayac`) · `satir` (kıl çizgiler arasında üç birim, `SatirSayac`) | Manzara, Bordo, Aurora, Krom → `satir` |
| `ornament` | Tepedeki tepsi süsü; `false` ise başlık en üstte | Mum → `false` (sahnesi zaten tepsi) |
| `panel` | `none` · `kemer` (yarım daire tepeli pencere, çift kenar) · `cam` (buzlu kart) | Saray → `kemer`, Aurora → `cam` |
| `halo` | rgb üçlüsü: metnin arkasına radyal koyu hale + başlık gölgesi | Bordo (video) |
| `damga`, `damgaInk` | Ampersan lekesinin üç tonu ve `&` rengi | Manzara/Modern → `DAMGA_AL` |
| `flame` | Mum sayacının alev rengi | koyu şablonlar |
| `className` | Bölüme eklenir (twMerge): sahne için boşluk | Manzara `pb-48` (tepeler altta), Mum `pt-[210px]` (tepsi üstte), Bordo `pt-36` (duvak üstte) |

🔴 `bg-clip-text` başlıkta (Krom) metin gölgesi verilmez: gölge degradenin üstüne boyanır.

## 4. Hareket ve "hareketi azalt"

| Öğe | Hareket | Azaltılmışta |
|---|---|---|
| Tepsi, başlık, adlar, künye | `opacity` + `blur` + 16 px `y` | MotionConfig `y`/`scale`'i atlar; opaklık ve bulanıklık kalır (hareket değil) |
| Damga | `scale 0.4 → 1` | ölçek atlanır |
| Bindallı dalı | `scaleX 0.5 → 1` | ölçek atlanır |
| Alevler | CSS `kina-flicker` / `kina-glow` | `parts/motion` media kuralı + `data-atmosphere` |
| Kaydırma ipucu | `animate-bob-down-6` | index.css kuralı |

## 5. Dokuz şablon nasıl ayrışıyor

Aynı hero, farklı siluet. 360 px temas sayfasında hiçbir ikisi aynı değil
(görsel öz-kontrol, KIMLIK §8):

| Şablon | Zemin | Düzen | Adlar | Sayaç | Ayırt edici |
|---|---|---|---|---|---|
| Sade | açık avuç | orta | alt alta | mum | köşeden taşan iki soluk leke |
| Manzara | açık kayısı | orta | tek satır | satır | altta üç sıra tepe ve ev |
| Modern | kına turuncusu | sola | alt alta | mum | dev krem leke |
| Sekilli | vişne kadife | orta | alt alta | mum | çift çerçeve + dört bindallı köşe |
| Bordo | şarap (video) | orta | alt alta | satır | tepeden sarkan oyalı al duvak |
| Saray | kemerli oda | orta, kemer pencere | alt alta | mum | sivri kemer silueti |
| Mum | ıs | orta | tek satır | mum | tepede bakır tepsi ve dokuz mum |
| Aurora | kına ateşi mesh | orta, cam kart | tek satır | satır | renk kütlesi, buzlu kart |
| Krom | dövme bakır | sola | alt alta | satır | çekiç halkaları, bakır degrade ad |

