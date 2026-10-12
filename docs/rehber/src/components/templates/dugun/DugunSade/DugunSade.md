# `src/components/templates/dugun/DugunSade/DugunSade.tsx` — Zarif Sadelik

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-sade'`), `src/data.ts` (`sade` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Zarif Sadelik — kategorinin en yalın hâli; tül beyazı zemin, kenarlardan saran puantiyeli tül, iki ince inci çerçeve.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Tema | `SADE_THEME` (fildişi + bronz, ortak dosya) | `DUGUN_THEMES.DugunSade` (Tül çekirdeği) |
| Arka plan | `bg-desktop.svg` (bronz alyanslar) %20 multiply | Tül radyal degrade + `TulVeil` + iki inci çerçeve |
| Giriş | yok | Çerçeve `revealed` ile belirir |

`TemplateRenderer` tanımadığı her şablon kimliğinde bu şablona düşer; diğer kategorilerin bilinmeyen kimlikleri de artık kurdele kimliğiyle açılır.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.69 | placeholder / alan |
| Hero | 5.29 | body (mesaj/mekân) / zemin #efebf2 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Çerçeve girişi (opaklık + ölçek) | MotionConfig ölçeği atlar, yalnız solma |

## 5. Duman testi

`a:ok(27KB) b:ok(5KB) c:ok(24KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Çerçeve 12 px içeride; kaydırma işareti incisi alt çizgiye yakın. |
| 768 px | Sorun beklenmez. |
| 1280 px | Çerçeve tüm genişliğe yayılır; çok geniş ekranda yuvarlak köşeli uzun bir pano gibi görünebilir. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
