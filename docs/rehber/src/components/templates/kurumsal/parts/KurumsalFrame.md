# `kurumsal/parts/KurumsalFrame.tsx` — Kesim işaretli kadraj

> **Kullananlar:** 16 şablonun `HeroStage.overlay` katmanı: Aurora, Bento,
> Bilet, Cam, Çizgi, Dokuma, Film, Kinetik, Network, Noir, Pano, Plak, Posta,
> Suluboya, Vitray, Zirve
> **Denetim:** duman testi (çizim hatasız)

---

## 1. Ne yapar?

Hero'nun dört köşesine baskı provasındaki kesim işaretlerini (18 px L) ve sağ
kenara 41 çentikli bir cetvel çizer. Ortak hero'yu değiştirmeden kurumsal
şablonları kardeş kategorilerdeki aynı adlı şablonlardan ayıran imza budur.

Katman `renderHeroBackground` içinde, yani hero metninin **arkasında** durur.
`aria-hidden` ve `pointer-events-none` taşır.

## 2. Parametreler

| Prop | Anlam |
|---|---|
| `color` | CSS rengi. Koyu zeminde `rgba(243,244,241,0.22–0.3)`, açıkta `rgba(16,18,22,0.22–0.3)` |
| `revealed` | `HeroBackgroundState.revealed`. Zarf açılana kadar işaretler gizli kalır, sonra yerine oturur |
| `ruler` | Cetvel. Kendi çerçevesi ya da merkezî nesnesi olan hero'larda kapalı (Film, Noir, Dokuma, Posta, Vitray) |

## 3. Kadraj kullanılmayan şablonlar

| Şablon | Neden |
|---|---|
| Blueprint | Paftanın kendi ızgarası ve kenar etiketleri var |
| Deco | `DecoFrame` zaten üç halkalı bir çerçeve çizer |
| Terrazzo, Ufuk | Hero arka planı yok (opak taş / sabit sahne) |
| Gazete, Kağıt, Herbaryum, Mermer | Kâğıt/taş nesne kadrajın kendisi; ikinci çerçeve kalabalık olurdu |
| Brutal, Yıldız Haritası | Kadraj yerine kayıt ızgarası taşır |

## 4. Hareket

Köşeler `scale 0.4 → 1`, cetvel `scaleY 0 → 1` ile gelir. İkisi de transform
olduğu için `MotionConfig reducedMotion="user"` onları anında son duruma alır.
