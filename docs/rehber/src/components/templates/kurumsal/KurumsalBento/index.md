# `kurumsal/KurumsalBento/index.tsx` — Bento Editorial

> **Kullananlar:** `TemplateRenderer.tsx` (`kurumsal-bento`)
> **Denetim:** duman testi (4 senaryo) · kontrast: [KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa)

---

## 1. Ne değişti?

Hücreler 4 px köşe aldı (`surface` → `rounded-[4px]`), isim hücresi grotesk oldu. Turkuaz vurgu kobalta, CTA kobalt dolguya döndü.

## 2. Ayarlar

| Alan | Değer |
|---|---|
| Hero | `BentoHero` (ortak) |
| Ton / zemin | açık `#F1F1ED` |
| Sinyal | kobalt `#2B3FE0` |
| Bölüm başlıkları | grotesk |
| Köşe (`kurumsalTheme`) | kesin |
| Hero sahnesi | Kâğıt degrade, kayıt ızgarası (merkezde), kadraj |

Ortak hero değiştirilmedi; şablon yalnızca parametre ve tema verir. Kategori
biçimi `kurumsalTheme()` üzerinden gelir: bkz. [parts/theme](../parts/theme.md).

## 3. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | 2 sütunlu ızgara; "Kurum & Etkinlik" adı `text-3xl` ile 3–4 satır |
| 768 px | `@lg` üç sütuna açılır; tarih/mekân hücreleri yan yana |
| 1280 px | `max-w-2xl` ızgara ortada; kadraj köşeleri boşta kalır |
