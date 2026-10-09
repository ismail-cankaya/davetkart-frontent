# `src/components/templates/dugun/Dugun5/Dugun5.tsx` — Bahar Bahçesi

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-5'`), `src/data.ts` (`dugun-5` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Bahar Bahçesi — pastel gök, sabit yükseklikte çiçek çayırı bandı; mersin mürekkep, şakayık vurgu.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero compact |
| Tema | Yerel adaçayı + pudra | `DUGUN_THEMES.Dugun5` |
| Çayır | Hero yüksekliğinin %42'si (içerik uzayınca metnin altına girerdi) | Sabit `h-48 @md:h-64` bant + içerik alt padding'i bandı aşar |

Mevcut PNG süs görselleri olduğu gibi kaldı.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.65 | placeholder / alan |
| Hero | 4.77 | accent (başlık/ay) / zemin #dee6df |

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
| 360 px | Hero içerikle uzar; çayır bandı hep altta, metin gökte. |
| 768 px | Sorun beklenmez. |
| 1280 px | Çayır max-w-4xl kolonda; iki yanda gök görünür. |
