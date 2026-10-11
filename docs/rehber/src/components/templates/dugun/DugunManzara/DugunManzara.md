# `src/components/templates/dugun/DugunManzara/DugunManzara.tsx` — İnci Gravür

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-manzara'`), `src/data.ts` (`manzara` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

İnci Gravür — süslü güllü çerçeve görseli gri tona çekilip tersine çevrilir; koyu yeşil zemin tül beyazına, altın gravür gümüş bir kalem işine döner. Açık şablon.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Ton | Koyu (1. turda mor-siyah, öbür koyularla karışıyordu) | Açık: tül zemin, mor mürekkep vurgu `#5e3f6e` |
| Arka plan | `bg.png` luminosity karışımı | `bg.png` `grayscale invert contrast(1.6)` %40 + lila çarpım + okuma tülü (kenarda %45) |

`manzara` kart kaydı kına ve nişanla ortak: kapak hâlâ zümrüt fotoğraf.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.95 | placeholder / alan |
| Hero | 4.65 | body (mesaj/mekân) / zemin #d5d0d9 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |

## 5. Duman testi

`a:ok(26KB) b:ok(4KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Gravürün yalnız orta şeridi görünür (kare görsel dikeyde kırpılır). |
| 768 px | Madalyon ortada, metin içinde. |
| 1280 px | Görsel ~1.25× büyür, çizgiler yumuşar. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
