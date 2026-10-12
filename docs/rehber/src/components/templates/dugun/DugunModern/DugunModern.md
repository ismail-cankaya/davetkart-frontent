# `src/components/templates/dugun/DugunModern/DugunModern.tsx` — Gece Modası

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-modern'`), `src/data.ts` (`modern` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Gece Modası — nötr kömür zemin, sağ üstten çapraz düşen orkide-lila huzme, sola yaslı editoryal düzen, dik ince serif isimler.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero `align="start"`, `nameClassName` (dik, ince, iri) |
| Zemin | Menekşe-siyah + köşe haleleri | Kömür `#0c0b0e` + çapraz orkide huzme + köşe halesi |
| Tül | Koyu `TulVeil` | Kaldırıldı (sade editoryal zemin) |

`modern` kart kaydı ortak; kapak indigo.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.44 | placeholder / alan |
| Hero | 4.78 | body (mesaj/mekân) / zemin #473440 |

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

`a:ok(27KB) b:ok(6KB) c:ok(24KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Sola yaslı; uzun isim iki satıra iner. |
| 768 px | Metin solda max-w-xl; sağ yarıda huzme. |
| 1280 px | Sol kenar boşluğu `@3xl:px-24`. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
