# `src/components/templates/dugun/DugunDenizIsiltisi/DugunDenizIsiltisi.tsx` — Deniz Işıltısı

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-deniz-isiltisi'`), `src/data.ts` (`dugun-deniz-isiltisi` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Deniz Işıltısı — kaustik ışık ağı; akvamarin zemin, altın değil mercana çalan şakayık vurgu.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Perde | white 40/20/50 | white 55/40/60 |
| Tema | Altın vurgu | `DUGUN_THEMES.DugunDenizIsiltisi` (şakayık) |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.57 | placeholder / alan |
| Hero | 4.71 | body (mesaj/mekân) / zemin #dbecec |

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
| 360 px | Kaustik parlamalar yüksek frekanslı; perde altında okunur. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
