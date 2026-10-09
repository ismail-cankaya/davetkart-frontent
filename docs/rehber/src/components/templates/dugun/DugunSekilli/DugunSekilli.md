# `src/components/templates/dugun/DugunSekilli/DugunSekilli.tsx` — İnci Motif

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-sekilli'`), `src/data.ts` (`sekilli` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

İnci Motif — gece zemininde çapraz kurdele bantları ve kesişimlerine dizili inciler (gelinlik kafesi). Yaldız yok.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Tema | `SEKILLI_THEME` (altın, ortak dosya) | `DUGUN_THEMES.DugunSekilli` (Gece, inci vurgu) |
| Arka plan | Altın çapraz çizgi (base64 SVG); `bg.png` içe aktarılıp kullanılmıyordu | SVG `InciKafes` deseni + radyal okuma perdesi; kullanılmayan içe aktarma kaldırıldı |

`sekilli` kart kaydı ortak ve adı "Altın Motif": düğünde görünüm artık inci.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.20 | placeholder / alan |
| Hero | 8.18 | body (mesaj/mekân) / zemin #14111b |

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
| 360 px | 1x ekranlarda 56 px desende hafif moiré olabilir. |
| 768 px | Sorun beklenmez. |
| 1280 px | Kafes kenarlarda yoğun, merkez koyu: geniş ekranda iki yan şerit belirgin. |
