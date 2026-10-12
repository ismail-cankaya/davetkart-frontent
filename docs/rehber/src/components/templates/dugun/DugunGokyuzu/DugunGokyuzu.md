# `src/components/templates/dugun/DugunGokyuzu/DugunGokyuzu.tsx` — Gökyüzü Rüyası

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-gokyuzu'`), `src/data.ts` (`dugun-gokyuzu` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Gökyüzü Rüyası — şafak göğü videosunun önünde tül perde; gece mavisi mürekkep, bulut altı şakayık.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Perde | white 45/10/55 | white 70/50/70 + merkez tül halesi (kontrast denetimi) |
| Tema | Yerel gök teması | `DUGUN_THEMES.DugunGokyuzu` |

Video ve poster değişmedi; yalnızca üstündeki katmanlar.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.24 | placeholder / alan |
| Hero | 5.24 | accent (başlık/ay) / zemin #cfddec |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Otomatik oynayan video | `VideoBackdrop` "hareketi azalt"ta yalnızca posteri gösterir |

## 5. Duman testi

`a:ok(27KB) b:ok(5KB) c:ok(24KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Dikey video; perde videoyu belirgin soldurur. |
| 768 px | Sorun beklenmez. |
| 1280 px | Yatay video; güneş sol altta, perdeyle yumuşar. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
