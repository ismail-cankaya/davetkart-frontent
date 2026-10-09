# `kurumsal/KurumsalUfuk/index.tsx` — Ufuk

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-ufuk`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Sahne ön ayarına dokunulmadı: kapak görseli (`kurumsal-ufuk-kapak.svg`) o ön ayarla basılır. Kimlik bölümlerde: grotesk başlık, kobalt ışığı vurgu, yer tutucu `white/55`. Hero rozeti hap biçimli kalır (köşe "serbest").

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `UfukHero` (ortak) |
| Ton / zemin | sahne (`#03070D`) |
| Sinyal | kobalt ışığı `#9FAAFF` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | serbest |
| Hero sahnesi | Ortak `UfukScene` + `UFUK_PRESETS.kurumsal` (değişmedi) |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Düşük risk |
| 768 px | Düşük risk |
| 1280 px | Düşük risk |
