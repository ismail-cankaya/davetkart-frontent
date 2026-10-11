# `kurumsal/KurumsalBilet/index.tsx` — Etkinlik Bileti

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-bilet`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Turkuaz biletten grafit/kobalt ışığı yaka kartına. Bilet gövdesi 4 px köşe; tram kobalt tonunda.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `TicketHero` (ortak) |
| Ton / zemin | koyu `#0D0F13` |
| Sinyal | kobalt ışığı |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Grafit degrade, kobalt tram (`Halftone`), kadraj |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Bilet künye hücreleri `truncate`: uzun mekân kesilir (ortak hero) |
| 768 px | Düşük risk |
| 1280 px | Bilet `max-w-md` küçük kalır; kadraj geniş alanı çerçeveler |
