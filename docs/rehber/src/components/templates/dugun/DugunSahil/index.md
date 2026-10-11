# `src/components/templates/dugun/DugunSahil/index.tsx` — Sinematik Sahil

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-sahil'`), `src/data.ts` (`dugun-sahil` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Sinematik Sahil — gün batımı videosu; açık renk metin bir gece tülü panelin üstünde, ufuk bandı kısılmış.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero + `panelClassName` |
| Okuma | scrim both .5 | scrim both .55 + merkez .35 + ufuk bandı (.45) + tül panel (%70) |
| Işık | altın toz, huzme .40 | inci-pembe toz, huzme .22, sızıntı .18 |
| Tema | Altın vurgu | `DUGUN_THEMES.DugunSahil` |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.81 | placeholder / alan |
| Hero | 5.11 | body (mesaj/mekân) / zemin #40383c |

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

`a:ok(32KB) b:ok(11KB) c:ok(29KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Panel neredeyse tam genişlik; gün batımı yalnız üst ve alt şeritte görünür. |
| 768 px | Panel max-w-md, çevresinde ufuk parlar. |
| 1280 px | Panel güneşin tam önünde; tasarımın bilinçli bedeli. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
