# `src/components/templates/dugun/DugunKrom/index.tsx` — Likit Krom

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-krom'`), `src/data.ts` (`dugun-krom` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Likit Krom — gümüş-inci metal; isimler degradeden kesilir (her satır kendi öğesinde).

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Başlık | beyaz–lila–mavi degrade | beyaz–inci–lila degrade |
| Tema | Yerel krom | `DUGUN_THEMES.DugunKrom` |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.31 | placeholder / alan |
| Hero | 5.95 | body (mesaj/mekân) / zemin #292832 |

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

## 5. Duman testi

`a:ok(30KB) b:ok(6KB) c:ok(27KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Sorun beklenmez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
