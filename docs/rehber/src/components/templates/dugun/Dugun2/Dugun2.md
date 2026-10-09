# `src/components/templates/dugun/Dugun2/Dugun2.tsx` — Pastel Buket

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-2'`), `src/data.ts` (`dugun-2` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Pastel Buket — krem gül ve okaliptüs girlandları; kategorinin botanik kolu, vurgu mersin yeşili. Vitrin şablonu (`FEATURED_TEMPLATES`).

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Tema | Yerel adaçayı teması | `DUGUN_THEMES.Dugun2` (mersin) |
| Yerleşim | yok | `heroContentClassName` dikey padding: düğüm ve sayaç girlandın altına girmez |

Mevcut PNG süs görselleri olduğu gibi kaldı.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.01 | placeholder / alan |
| Hero | 5.32 | body (mesaj/mekân) / zemin #f8f8f5 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |
| Süs görselleri girişi (x/y/ölçek/dönüş) | MotionConfig transform'u atlar; `revealed` ile zarf açılınca başlar |

## 5. Duman testi

`a:ok(26KB) b:ok(4KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Girland ~120 px; üst padding 56 px — kısa ekranda düğüm yaprak ucuna değebilir. |
| 768 px | Girland 430 px genişlikte sabitlenir. |
| 1280 px | Sorun beklenmez. |
