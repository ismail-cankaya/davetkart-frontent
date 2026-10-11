# `src/components/templates/sunnet/SunnetModern/index.tsx` — Ferah Turkuaz (Modern)

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-modern`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi, kontrast betiği, statik önizleme 360

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` | `SehzadeHero` (sorguç ve kuşak turkuaz `#0d6f80`) |
| Arka plan | turkuaz ışık lekeleri, gümüş halkalar, kesikli uçurtma kuyruğu | iki köşeye taşan soyut nazar boncuğu (`NazarRings`), dönen kesikli yörünge |
| Tema | `teal-*`/`slate-*` adlı renkler | `SUNNET_MODERN`: `#f3f8fb`, `#0c2340` ad, turkuaz vurgu, hap düğme |

"Modern" burada süssüzlük değil, nazar boncuğunun grafik bir yorumudur:
geleneksel motif, bol boşluk ve tek renk ailesi (turkuaz + lacivert).

## 2. Kapak

`SunnetModern/assets/sunnet-modern-kapak.svg` — iki nazar boncuğu, turkuaz
kuşak, "Ferah". `data.ts` hâlâ `public/images/sunnet-modern.svg` (uçurtma)
gösterir; import önerisi raporda.

## 3. Bakılacak risk

360 px'te sağ üst boncuk sorgucun sağında (x ≥ 245) biter; sol alt boncuk
sayacın altına girebilir — kartlar opak beyaz cam olduğu için okunurluk
etkilenmez. 1280 px'te boncuklar %46 / %30 genişlikte.
