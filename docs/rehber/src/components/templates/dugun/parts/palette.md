# `src/components/templates/dugun/parts/palette.ts` — Kategori renk sabitleri

> **Kullananlar:** `TulVeil.tsx` (rgb üçlüleri), `DugunKagit` (mühür), `DugunPlak` (etiket)
> **Denetim:** kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §6)

---

## 1. Neden ayrı dosya

Tailwind sınıfları kaynakta literal durmak zorunda: `bg-[${renk}]` gibi üretilen bir
sınıf derlenmez. Bu yüzden `themes.ts` hex değerlerini kendi dizgilerinde tekrar eder.
Bu dosya yalnızca satır içi stil, SVG ve HeroStage parametreleri içindir.

## 2. Değerler

Tam tablo ve rol açıklamaları [KIMLIK.md](../KIMLIK.md) §2'de. Bir rengi değiştirirken
`themes.ts`'teki literal karşılığını da değiştirin ve kontrast betiğini yeniden koşturun.
