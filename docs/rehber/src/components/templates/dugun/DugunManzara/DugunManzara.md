# `src/components/templates/dugun/DugunManzara/DugunManzara.tsx` — Süslü güllü çerçeve görseli `mix-blend-luminosity` ile gece zeminine basılır: yeşil-altın gravür inci-menekşe bir kabartmaya döner.

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-manzara'`), `src/data.ts` (`manzara` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Süslü güllü çerçeve görseli `mix-blend-luminosity` ile gece zeminine basılır: yeşil-altın gravür inci-menekşe bir kabartmaya döner.

Hero: KurdeleHero (`dugun/parts/KurdeleHero.tsx`) — kategori hero'su, çünkü bu şablon eskiden dokuz kategoride aynı görünen `Summary`'yi kullanıyordu.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Hero | Summary | KurdeleHero |
| Tema | `MANZARA_THEME` (zümrüt, ortak dosya) | `DUGUN_THEMES.DugunManzara` (Gece) |
| Arka plan | `bg.png` + `bg-black/40`, harici Unsplash yedeği | `bg.png` luminosity %60 + radyal okuma perdesi; harici URL kaldırıldı |

`manzara` kart kaydı kına ve nişanla ortak: kapak hâlâ zümrüt fotoğraf.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.27 | placeholder / alan |
| Hero | 5.21 | body (mesaj/mekân) / zemin #38363f |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kurdele düğümü (çizgi + `pathLength`) | `useReducedMotion()` → çizili gelir |
| İsim kayması (x), öğe yükselişi (y), `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar; yalnız opaklık solması kalır |
| Kaydırma işareti incisi (`animate-bob-down-6`) | `index.css` reduce kuralı → `animation: none` |

## 5. Duman testi

`a:ok(26KB) b:ok(4KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Kare görsel dikeyde kırpılır; çerçevenin yalnız yan şeritleri görünür. |
| 768 px | Sorun beklenmez. |
| 1280 px | 1024 px görsel ~1.25× büyür, gravür yumuşar. |
