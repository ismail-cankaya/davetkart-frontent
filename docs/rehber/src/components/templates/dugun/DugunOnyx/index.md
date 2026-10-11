# `src/components/templates/dugun/DugunOnyx/index.tsx` — Onyx & İnci

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-onyx'`), `src/data.ts` (`dugun-onyx` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Onyx & İnci — videonun sıvı metali kalır; üstündeki hale, parlama ve toz inci-lilaya çevrildi.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Işık | Altın hale (animasyon yüzünden ~%64), altın parıltı | `Hale` (tepe .20), inci parıltı |
| Scrim | bottom .35 | bottom .35 + merkez .35 |
| Tema | Altın | `DUGUN_THEMES.DugunOnyx` (inci, gradyan inci buton) |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.73 | placeholder / alan |
| Hero | 5.69 | body (mesaj/mekân) / zemin #2c292e |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| HeroStage parçacıkları (canvas) | `ParticleField` tek durağan kare çizer, döngü başlamaz |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Otomatik oynayan video | `VideoBackdrop` "hareketi azalt"ta yalnızca posteri gösterir |

## 5. Duman testi

`a:ok(29KB) b:ok(7KB) c:ok(26KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Sorun beklenmez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Videonun altın hatları kenarlarda kalır; inci tipografiyle iki metal yan yana. |
