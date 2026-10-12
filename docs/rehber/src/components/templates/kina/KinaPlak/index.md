# `src/components/templates/kina/KinaPlak/index.tsx` — Vinil Plak

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-plak'`), `src/data.ts` (`kina-plak` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Siyah plak, al etiket; dönüş 44 s.

Hero: PlakHero (ortak) — `label="#b0241c"`, `labelInk="#fdebd8"`, `spinDuration={44}`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#e08a72`) | `KINA_PLAK` |
| Hero parametreleri | `#b8323f` etiket | al `#b0241c` |

Vurgu rengi: `#e08a72` → `#f2a066`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.31 | input placeholder |
| Hero | 7.03 | gövde / `#2a130a` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Plak dönüşü | Ortak dosyada |
| `Halo` | `[data-atmosphere]` |

## 5. Görsel öz-kontrol

Plak silueti tek başına tanınıyor.
