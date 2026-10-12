# `src/components/templates/kina/KinaManzara/KinaManzara.tsx` — Yüksek Tepeler

> **Kullananlar:** `TemplateRenderer.tsx` (`'manzara'`), `src/data.ts` (`manzara` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına türküsündeki uzak tepelerin akşamı: kayısı gök, üç sıra tepe, en yüksek tepede ışığı yanan ev ve ona kıvrılan yol. Kategorinin vitrin şablonu.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `names="line"`, `timer="satir"`, `damga={DAMGA_AL}`, `pb-48 @md:pb-60`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | `shared/themeTokens` MANZARA (koyu, zümrüt odak) | `KINA_MANZARA` (açık kayısı, zeytin vurgu) |
| Hero | `Summary` | KinaHero, adlar tek satır + satır sayaç (tepeler 360 px'te ilk ekrana girer) |
| Arka plan | `assets/bg.png` | [TepelerSahnesi](TepelerSahnesi.md) |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.22 | accent/zemin |
| Hero | 5.79 | gövde / `#f5d3b5` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Tepelerin girişi (`y` + opaklık) | MotionConfig `y`'yi atlar |
| Akşam güneşi `kina-glow` | `parts/motion` reduce kuralı + `data-atmosphere` |

## 5. Görsel öz-kontrol

İlk öz-kontrolde tepeler 780 px'lik ilk ekranın altında kalıyordu; adlar tek satıra ve sayaç satıra alındı, şimdi görünüyor. Metin tepelere değmiyor.
