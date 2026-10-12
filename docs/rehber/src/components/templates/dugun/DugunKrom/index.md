# `src/components/templates/dugun/DugunKrom/index.tsx` — Saten Gümüş

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-krom'`), `src/data.ts` (`dugun-krom` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Saten Gümüş — cilalı gümüşün yatay yansıma bantları (yalnız açık-orta gümüş aralığı); isimler koyu metal degradeden kesilir. Kategorinin tek soğuk gri, açık metal zemini.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Ton | Koyu krom + iridesan | Açık gümüş bant alanı + gümüş parlama |
| Başlık | Açık metal degrade | Koyu metal degrade `#14171d → #4a5261` |
| Zarf | Altın (ortak varsayılan) | Gümüş kağıt, grafit mühür |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.47 | placeholder / alan |
| Hero | 5.08 | accent (başlık/ay) / zemin #b7bfc9 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |

## 5. Duman testi

`a:ok(29KB) b:ok(6KB) c:ok(26KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Bantlar yatay; dar ekranda sıklaşır. |
| 768 px | Sorun beklenmez. |
| 1280 px | Bantlar geniş, "metal levha" hissi en güçlü burada. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
