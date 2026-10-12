# `src/components/templates/kina/KinaYildizHaritasi/index.tsx` — Yıldız Haritası

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-yildiz-haritasi'`), `src/data.ts` (`kina-yildiz-haritasi` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Sıcak gece, krem yıldızlar, kına turuncusu takımyıldız çizgisi.

Hero: YildizHero (ortak) — `star="#ffe6cc"`, `line="#d0682a"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#e0a878`, mor gece) | `KINA_YILDIZ` (kahve gece) |
| Atmosfer | — | `Halo` 0.13 |

Vurgu rengi: `#e0a878` → `#f2a87a`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.83 | input placeholder |
| Hero | 7.06 | gövde / `#2c1414` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Takımyıldız çizimi | Ortak dosyada |
| `Halo` | `[data-atmosphere]` |

## 5. Görsel öz-kontrol

Mor yerine kahve gece: düğünün menekşe gecesinden ayrı.
