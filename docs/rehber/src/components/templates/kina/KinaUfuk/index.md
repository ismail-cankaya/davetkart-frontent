# `src/components/templates/kina/KinaUfuk/index.tsx` — Ufuk

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-ufuk'`), `src/data.ts` (`kina-ufuk` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kaydırdıkça kızıl akşamdan geceye geçen fenerli kubbe şehri; bölümler kına ailesinde.

Hero: UfukHero (ortak) + `UfukScene` `UFUK_PRESETS.kina` (kart kapağı aynı ön ayardan; renk değişmedi).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#ffb866`) | `KINA_UFUK` |

Vurgu rengi: `#ffb866` → `#ffbe76`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 6.01 | input placeholder |
| Hero | 5.21 | gövde / `#6c3926` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ufuk sahnesi (kaydırma) | Ortak sahne |

## 5. Görsel öz-kontrol

360 px'te mekân satırı kubbe siluetinin üstüne düşüyor (koyu siluet üstünde beyaz, 5.21). Sahne ortak.
