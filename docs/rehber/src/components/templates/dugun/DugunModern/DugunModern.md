# `src/components/templates/dugun/DugunModern/DugunModern.tsx` — Gece Modası

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-modern'`), `src/data.ts` (`modern` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Gece Modası — koyu cam kartlar, köşelerde nefes alan orkide ve lila ışık, kadrajı saran gece tülü.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Tema | `MODERN_THEME` (indigo, ortak dosya) | `DUGUN_THEMES.DugunModern` |
| Arka plan | İndigo degrade + `animate-pulse` leke + `bg-desktop.svg` | HeroStage: gece degradesi, iki `Hale`, `TulVeil` (koyu) |

`modern` kart kaydı ortak; kapak indigo.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.34 | placeholder / alan |
| Hero | 7.24 | body (mesaj/mekân) / zemin #241a33 |

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

`a:ok(28KB) b:ok(7KB) c:ok(25KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Köşe ışıkları dar kadrajda metne yaklaşır (kontrast en kötü an hesabında). |
| 768 px | Sorun beklenmez. |
| 1280 px | Işıklar yüzdelikle büyür, köşeler boş görünmez. |
