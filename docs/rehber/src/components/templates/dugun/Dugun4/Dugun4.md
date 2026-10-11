# `src/components/templates/dugun/Dugun4/Dugun4.tsx` — Pembe Kemer

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-4'`), `src/data.ts` (`dugun-4` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Pembe Kemer — çiçekli kemerin açıklığında `compact` kurdele hero; okuma perdesi ortada %60.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary compact | KurdeleHero compact |
| Tema | Yerel pembe tema | `DUGUN_THEMES.Dugun4` (koyulaştırılmış gövde/vurgu) |
| Perde | via-white/40 | via-white/60 (kontrast denetimi sonrası) |

Mevcut PNG süs görselleri olduğu gibi kaldı.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.77 | placeholder / alan |
| Hero | 4.80 | accent (başlık/ay) / zemin #cbd3c1 |

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
| 360 px | İsimler kemerin yapraklı sütunlarına taşar; kontrast bu hücrelerle hesaplandı (AA). |
| 768 px | Sorun beklenmez. |
| 1280 px | Kemer max-w-3xl kolonda. |
