# `src/components/templates/dugun/DugunSekilli/DugunSekilli.tsx` — İnci Motif

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-sekilli'`), `src/data.ts` (`sekilli` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

İnci Motif — mersin gecesi (yeşil-siyah) zeminde baştan sona inci kafes; metin üstü kemerli koyu bir plakette, çift kıl çizgili.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero + kemer plaket (`panelClassName`) |
| Zemin | Menekşe-siyah | Mersin gecesi `#0f1714` |
| Kafes | Merkezde sönük | Her yerde görünür; metin plakette |

`sekilli` kart kaydı ortak ve adı "Altın Motif": düğünde görünüm artık inci.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.04 | placeholder / alan |
| Hero | 8.21 | body (mesaj/mekân) / zemin #151c1a |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Kafes girişi (opaklık) | Yalnız solma; transform yok |

## 5. Duman testi

`a:ok(27KB) b:ok(5KB) c:ok(24KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Plaket neredeyse tam genişlik; kafes kenarlarda ve plaketin üstünde. |
| 768 px | Plaket max-w-md; kemer yarıçapı ~224 px. |
| 1280 px | Plaket ortada, kafes iki yanda geniş. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
