# `src/components/templates/dugun/DugunOnyx/index.tsx` — Onyx & İnci

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-onyx'`), `src/data.ts` (`dugun-onyx` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Onyx & İnci — saf siyah zeminde sıvı metal; metin kadrajı boydan boya taşıyan iki inci kıl çizginin (stel) arasında, kategorinin en iri isimleriyle.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero `nameClassName` (en iri isimler) |
| Zemin | Menekşe-siyah | Saf siyah `#070708` |
| Süs | yok | `Stel`: iki inci kıl çizgi + ortalarında elmas |
| Işık | `Hale` | Düzeltilmiş ortak `Halo` (tepe .14) |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.79 | placeholder / alan |
| Hero | 5.71 | body (mesaj/mekân) / zemin #2d2926 |

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

`a:ok(30KB) b:ok(8KB) c:ok(27KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Stel çizgileri kenardan %3 içeride; tarih bandı çizgilere yaklaşır ama değmez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
