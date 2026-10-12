# `src/components/templates/kina/KinaSekilli/KinaSekilli.tsx` — Bindallı

> **Kullananlar:** `TemplateRenderer.tsx` (`'sekilli'`), `src/data.ts` (`sekilli` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Vişne kadife üstüne sırmayla işlenmiş dört köşe sarmaşığı, çift çerçeve ve tepede lale dalı — gelinin kına kaftanı.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — orta, adlar alt alta, mum sayacı; `pt-24 pb-28` köşe süslerinden uzak durur.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | `shared/themeTokens` SEKILLI (altın motif) | `KINA_SEKILLI` (kadife `#3a0b17`, sırma vurgu) |
| Hero | `Summary` | KinaHero |
| Arka plan | `assets/bg.png` | Kadife degrade + `GoldSheen` + çift çerçeve + dört `BindalliKose` + `BindalliDal` taç |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 7.66 | input placeholder |
| Hero | 7.46 | gövde / `#541223` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Köşe süslerinin solması | Yalnızca opaklık (hareket değil) |
| `GoldSheen` | `[data-atmosphere]` reduce kuralı |

## 5. Görsel öz-kontrol

Çerçeve ve köşeler adlara/sayaca 360–1280 px'te değmiyor. Bordo ile aynı şarap ailesinde; Bordo'nun duvağı ve satır sayacı ikisini ayırıyor.
