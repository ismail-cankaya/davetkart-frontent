# `src/components/templates/kina/KinaMermer/index.tsx` — Mermer & Rölyef

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-mermer'`), `src/data.ts` (`kina-mermer` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Şeftali mermer levha, kına toprağı damar.

Hero: MermerHero (ortak) — `slab` şeftali degrade, `vein="#b9734e"`, `polish="light"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#a04f4f`) | `KINA_MERMER` |
| Hero parametreleri | fildişi levha, bej damar `#b09274` | şeftali levha, kına toprağı damar `#b9734e` |

Vurgu rengi: `#a04f4f` → `#9c4320`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.15 | accent/zemin |
| Hero | 5.87 | gövde / `#f1dbcb` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Parlama süpürmesi | Ortak dosyada |

## 5. Görsel öz-kontrol

Açık kart şablonları arasında damar rengiyle ayrışıyor.
