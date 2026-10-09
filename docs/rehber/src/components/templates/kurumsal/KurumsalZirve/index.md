# `kurumsal/KurumsalZirve/index.tsx` — Zirve & Liderlik (Sinematik)

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-zirve`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Varsayılan `Summary` yerine Künye hero. Sıcak altın gün doğumu (düğün ailesinin dili) soğuk kobalt şafağa döndü; vurgu platin. Hero kontrastı için gökyüzü orta durağı koyulaştı, gövde `#BCC2CC`.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | Künye (`KurumsalHero`, `align="center"`) |
| Ton / zemin | koyu `#0C1018` |
| Sinyal | platin |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kobalt şafak degradesi, soğuk ışınlar (0.26), hale, güneş diski (sırtların ardında), 4 katman sırt, sis, ışık çizgileri, kadraj |

Hero ayrıntısı (ad ayrımı, künye, ölçü kademeleri): [parts/KurumsalHero](../parts/KurumsalHero.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Künye şafak bandının üstünde (en kötü 5.64:1) |
| 768 px | Sırtlar künyenin altına iner |
| 1280 px | Geniş sahnede künye merkezde |
