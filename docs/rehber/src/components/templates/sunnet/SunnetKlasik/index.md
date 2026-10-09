# `src/components/templates/sunnet/SunnetKlasik/index.tsx` — Şehzade (Klasik)

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-klasik`), `sunnet/index.ts`, anasayfa vitrini (`FEATURED_TEMPLATES`)
> **Denetim:** `npm run check`, sünnet duman testi, kontrast betiği, statik önizleme 360/768/1280

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` | `SehzadeHero` (`canopy`, sorguç sax, kuşak nar) |
| Arka plan | lacivert gece, altın çift çerçeve, hilal, nabız atan noktalar | `OtagBackdrop`: gündüz otağı, sax–beyaz saçak, iki fener |
| Tema | `#0a1633` + `amber-*` (Tailwind adlı renkler) | `SUNNET_KLASIK`: `#f5f7fd`, lacivert ad, nar vurgu, sax hap düğme + pirinç iç halka |

Kategori kendi hero'sunu buradan başlatır: vitrin şablonu, kategorinin ilk
izlenimi. Eski görünüm kardeş kategorilerin "koyu + altın" varsayılanıydı.

## 2. Kapak

`SunnetKlasik/assets/sunnet-klasik-kapak.svg` — yeni görünümün kodla çizilmiş
özgün kapağı (otağ, saçak, fenerler, sorguç, nar kuşak, "Şehzade", kandil
sayaç). `data.ts` hâlâ `public/images/sunnet-klasik.svg` (eski lacivert taç)
gösterir; import önerisi raporda (`data.ts` kapalı).

## 3. Bakılacak risk

| Genişlik | Risk |
|---|---|
| 360 | Fenerler kenarda; uzun başlık kuşakta iki satır — önizlemede temiz |
| 768 | Fenerler @md'de %14'e girer |
| 1280 | Mekân satırı kırılınca iğne ilk kelimeye yapışık (düzeltildi) |
