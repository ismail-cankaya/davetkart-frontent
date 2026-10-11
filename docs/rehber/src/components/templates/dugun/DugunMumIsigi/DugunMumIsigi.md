# `src/components/templates/dugun/DugunMumIsigi/DugunMumIsigi.tsx` — Mum Işığı

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-mum-isigi'`), `src/data.ts` (`dugun-mum-isigi` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Mum Işığı — gece nikâhı; sıcak bokeh videosu, inci tipografi, inci pembesi vurgu, inci buton.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Perde | black 45/15/55 | black 50/20/60 |
| Tema | Şampanya vurgu | `DUGUN_THEMES.DugunMumIsigi` (inci) |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.56 | placeholder / alan |
| Hero | 6.84 | body (mesaj/mekân) / zemin #2f2316 |

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
| 360 px | Sorun beklenmez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
