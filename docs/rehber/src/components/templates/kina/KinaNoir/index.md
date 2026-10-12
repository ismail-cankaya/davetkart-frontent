# `src/components/templates/kina/KinaNoir/index.tsx` — Noir Minimal

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-noir'`), `src/data.ts` (`kina-noir` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Sıcak siyah zemin, duvak alı yalnızca çizgi ve işaret olarak; tek ışık, tepsideki bir mumun koru.

Hero: NoirHero (ortak, değişmedi).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#d9564f`) | `KINA_NOIR` (köşesiz al düğme) |
| Atmosfer | — | `Halo` al 0.12 + `embers` |

Vurgu rengi: `#d9564f` → `#ee6d55`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.82 | input placeholder |
| Hero | 6.40 | gövde / `#1c0d09` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `Halo` | `[data-atmosphere]` |
| Korlar | durağan kare |

## 5. Görsel öz-kontrol

Kategorinin en koyu ve en boş şablonu.
