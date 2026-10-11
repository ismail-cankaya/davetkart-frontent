# `src/components/templates/dugun/DugunAurora/index.tsx` — Sedef

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-aurora'`), `src/data.ts` (`dugun-aurora` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Sedef — inci kabuğunun yanardöner iç yüzeyi gibi akan şakayık, lila ve nane mesh.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Mesh | gül–menekşe–turkuaz .62 | şakayık–lila–nane .30 |
| Scrim | both .3 | both .3 + merkez .6 |
| Tema | Yerel aurora | `DUGUN_THEMES.DugunAurora` |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.20 | placeholder / alan |
| Hero | 5.05 | body (mesaj/mekân) / zemin #553f4f |

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

`a:ok(29KB) b:ok(7KB) c:ok(26KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Mesh lekesi metnin arkasından geçebilir; en kötü an hesaplandı (AA). |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
