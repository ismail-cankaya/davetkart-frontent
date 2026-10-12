# `src/components/templates/kina/KinaEbru/index.tsx` — Ebru

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-ebru'`), `src/data.ts` (`kina-ebru` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kâğıt `#fdf5ec`, altın yerine bakır-sırma `#b8843a`, mürekkep kına kırmızısı.

Hero: EbruHero (ortak) — `paper="#fdf5ec"`, `gold="#b8843a"`, `ink="#9c2a18"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#9b2230`) | `KINA_EBRU` |
| Hero parametreleri | `#9b2230` mürekkep | `#9c2a18` kına kırmızısı |

Vurgu rengi: `#9b2230` → `#9c2a18`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.76 | accent/zemin |
| Hero | 7.13 | gövde / `#f3ece4` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `EbruSheet` | Ortak efekt |

## 5. Görsel öz-kontrol

Halkalar kartın dışında; kart zemini düz kâğıt.
