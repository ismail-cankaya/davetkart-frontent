# `src/components/templates/kina/KinaBlueprint/index.tsx` — Teknik Çizim

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-blueprint'`), `src/data.ts` (`kina-blueprint` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına kahvesi kâğıt üstüne krem çizgi ve kına ışığı vurgu; pafta kodu `KN-02`.

Hero: BlueprintHero (ortak) — `paper="#3a170e"`, `line="#fbe3cf"`, `accent="#ffb27a"`, `sheetCode="KN-02"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (mor-kahve `#2a1020`, `#ff9f68`) | `KINA_BLUEPRINT` (kına kahvesi) |

Vurgu rengi: `#ff9f68` → `#ffb27a`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.81 | input placeholder |
| Hero | 7.32 | gövde / `#3a170e` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Çerçeve çizimi (`pathLength`) | Ortak hero'da; `useReducedMotion` yok (1. turda raporlandı) |

## 5. Görsel öz-kontrol

Dugun/Kurumsal Blueprint'inden kâğıt rengiyle ayrışıyor (kahve, mavi değil).
