# `src/components/templates/sunnet/SunnetKrom/index.tsx` — Likit Krom

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-krom`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi, kontrast betiği, statik önizleme 360

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` | `SehzadeHero` + okuma halesi (`9,13,36`); kuşak açık krom degrade |
| Sahne | gece mavisi metal, iridesan, çizgi + toz | aynı; zemin daha doygun (`#18234f → #060818`) |
| Tema | `#080c16` | `SUNNET_KROM`: `#090d24`, ad metalik degradeden kesilir |

## 2. 🔴 Metin gölgesi ve `bg-clip-text`

Okuma halesinin metin gölgesi, `text-transparent` + `bg-clip-text` başlıkta
degradenin **üstüne** boyanır ve adı karartır (ilk statik önizlemede ad gri
göründü). `SehzadeHero` kırpılmış başlıkta gölgeyi kapatır; radyal hale kalır.

## 3. Bakılacak risk

Kategorinin en dar kontrast çifti buradadır: input placeholder 4.60:1
(`#8d97b2`, iki kat beyaz cam üstünde). Degrade ad durakları ≥ 8.75:1.
