# `src/components/templates/dugun/DugunAurora/index.tsx` — Sedef

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-aurora'`), `src/data.ts` (`dugun-aurora` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Sedef — inci kabuğunun açık, yanardöner iç yüzeyi; pastel şakayık, lila ve nane mesh; üstünde yumuşak iridesan parıltı. Açık şablon.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Ton | Koyu mesh | Açık sedef: `#f6f3f8` zemin, pastel mesh %70, okuma tülü |
| Tema | Koyu cam | Açık buzlu cam kartlar, orkide-şakayık vurgu `#87306a` |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.39 | placeholder / alan |
| Hero | 5.24 | body (mesaj/mekân) / zemin #dad0f1 |

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

`a:ok(28KB) b:ok(6KB) c:ok(25KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Mesh lekeleri metnin arkasından geçer; en koyu leke hesaplandı. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
