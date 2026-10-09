# `src/components/templates/dugun/Dugun1/Dugun1.tsx` — Zarif Çerçeve

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-1'`), `src/data.ts` (`dugun-1` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Zarif Çerçeve — suluboya buket kolonları arasında `compact` kurdele hero; tozlu gül vurgu.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary compact | KurdeleHero compact |
| Tema | Yerel `DUGUN1_THEME` (krem + gül kurusu + altın çizgi) | `DUGUN_THEMES.Dugun1` (soğuk tül + tozlu şakayık) |

Mevcut PNG süs görselleri olduğu gibi kaldı.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.87 | placeholder / alan |
| Hero | 5.62 | accent (başlık/ay) / zemin #faf8f9 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Süs görselleri girişi (x/y/ölçek/dönüş) | MotionConfig transform'u atlar; `revealed` ile zarf açılınca başlar |

## 5. Duman testi

`a:ok(26KB,1 uyarı) b:ok(5KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Metin kolonu %70: uzun isimler (>12 harf) iki satıra iner. |
| 768 px | Kolonlar %21; sorun beklenmez. |
| 1280 px | max-w-4xl sarmalayıcı; kenar boşluğu düz zemin. |
