# `src/components/templates/kina/KinaCini/index.tsx` — Çini

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-cini'`), `src/data.ts` (`kina-cini` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kobalt kontur yerine kına kahvesi, sırlar kına turuncusu, duvak alı ve yaprak zeytini; derz avuç tonunda.

Hero: CiniHero (ortak) — `glaze`, `cobalt="#7a2a12"`, `turquoise="#c4581d"`, `coral="#b0241c"`, `leaf="#666a2c"`, `grout="#ecd3bf"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#b23a2a`) | `KINA_CINI` |
| Hero parametreleri | bordo kontur, altın sır, yeşil yaprak | kına kahvesi kontur, kına turuncusu sır, zeytin yaprak |

Vurgu rengi: `#b23a2a` → `#a8261c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.59 | accent/zemin |
| Hero | 7.34 | gövde / `#fbf1e6` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Mavisiz çini (`turquoise`/`cobalt` yuvaları bile kına tonunda): sünnetin sax mavisinden ve nazar turkuazından bilerek uzak.
