# `src/components/templates/dugun/DugunGulYapraklari/DugunGulYapraklari.tsx` — Gül Yaprakları

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-gul-yapraklari'`), `src/data.ts` (`dugun-gul-yapraklari` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Gül Yaprakları — pudra zeminde video yaprakları ve önlerinde şakayık rengi canvas yaprakları.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Scrim | beyaz both .40 | beyaz both .50 + merkez .70 (kontrast denetimi) |
| Parçacık | gül pembesi | şakayık + lila |
| Tema | Yerel gül teması | `DUGUN_THEMES.DugunGulYapraklari` |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.37 | placeholder / alan |
| Hero | 4.55 | accent (başlık/ay) / zemin #cdb0b4 |

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

`a:ok(31KB) b:ok(9KB) c:ok(28KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ön düzlem yaprakları metnin üstünden geçer (anlık, kontrast hesabı dışı). |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
