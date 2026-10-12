# `src/components/templates/dugun/Dugun3/Dugun3.tsx` — Bordo Zambak

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-3'`), `src/data.ts` (`dugun-3` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Bordo Zambak — zambakların koyu şakayığı, tül zemin, asimetrik çerçeve.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Tema | Yerel bordo teması | `DUGUN_THEMES.Dugun3` |
| Buket | Yüzdelik (%62, en çok 420 px): KurdeleHero uzayınca sayacın üstüne biniyordu | Sabit `w-40` / `@md:w-56`; içerik alt padding'i (`pb-14` / `@md:pb-24`) buket yüksekliğini aşar |
| Zambak | %36, en çok 240 px | %30, en çok 200 px; içerik üst padding'i kurdele çizgisini zambaktan uzak tutar |

Mevcut PNG süs görselleri olduğu gibi kaldı.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.15 | placeholder / alan |
| Hero | 5.83 | body (mesaj/mekân) / zemin #faf7f8 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Süs görselleri girişi (x/y/ölçek/dönüş) | MotionConfig transform'u atlar; `revealed` ile zarf açılınca başlar |

## 5. Duman testi

`a:ok(26KB) b:ok(4KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Buket 160 px; sayaç bandı buketin üstünde biter. |
| 768 px | Buket 224 px; hero içerikle uzar. |
| 1280 px | Hero 800 px'ten uzun, kaydırılır; buket sayaçla örtüşmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
