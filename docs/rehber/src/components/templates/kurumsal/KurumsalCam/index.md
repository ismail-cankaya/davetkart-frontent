# `kurumsal/KurumsalCam/index.tsx` — Sıvı Cam (Sinematik)

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-cam`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Kategorinin sinematik şablonlarının tek açık zeminlisi oldu. Turkuaz/mor koyu sıvıdan, gündüz ışığında buzlu cama. Cam `backdrop-filter` olmadan kurulur.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | Künye (`KurumsalHero`, `align="start"`) |
| Ton / zemin | açık `#EDEFF2` |
| Sinyal | kobalt |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Buz beyazı degrade, kobalt/platin `AuroraMesh` (0.14), iridesan, buzlu cam levhalar (`GlassPanes`), kadraj |

Hero ayrıntısı (ad ayrımı, künye, ölçü kademeleri): [parts/KurumsalHero](../parts/KurumsalHero.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Levhalar ve yıl filigranı metnin arkasında (kontrast en kötü noktada 4.84+) |
| 768 px | Levhalar sağa çekilir; sol künye nefes alır |
| 1280 px | İçerik `max-w-3xl` ortada, levhalar sağ kenarda |
