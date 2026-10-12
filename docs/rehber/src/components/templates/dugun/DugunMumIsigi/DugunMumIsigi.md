# `src/components/templates/dugun/DugunMumIsigi/DugunMumIsigi.tsx` — Mum Işığı

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-mum-isigi'`), `src/data.ts` (`dugun-mum-isigi` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Mum Işığı — sıcak toprak tonunda gece; bokeh üst yarıda serbest, metin alttaki koyu bölgeye iner (`anchor="end"`).

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero `anchor="end"` |
| Zemin | Menekşe-siyah perde | Toprak çarpımı `#5a3220`/35 + alta koyulaşan `#120d0b` perde |
| Vurgu | İnci pembesi | Mum ışığında şeftali-inci `#f2c6b6` |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.44 | placeholder / alan |
| Hero | 7.94 | body (mesaj/mekân) / zemin #241a12 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Otomatik oynayan video | `VideoBackdrop` "hareketi azalt"ta yalnızca posteri gösterir |

## 5. Duman testi

`a:ok(27KB) b:ok(5KB) c:ok(24KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | İçerik uzun olduğu için alta yaslama küçük ekranda ortalamaya yakın görünür. |
| 768 px | Üst yarıda bokeh açıkça görünür. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
