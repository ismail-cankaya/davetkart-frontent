# `src/components/templates/kina/parts/KinaDamga.tsx` — Kına damgası

> **Kullananlar:** `KinaHero` (ampersan yuvası), `KinaSade` (filigran), `KinaModern` (dev krem leke)
> **Denetim:** kontrast betiği (`&` / leke çifti), görsel öz-kontrol

---

Kına gecesinde gelinin avucuna konan kınanın izi: düzensiz bir daire, **kenarda
koyulaşan** halka (kına kururken kenarda yoğunlaşır). Kodla çizilmiş tek yol + soluk
bir iç leke; radyal degrade üç tondan oluşur.

| Dışa açılan | Ne |
|---|---|
| `KinaDamga` | `colors` (merkez, gövde, kenar), `className`, `style`, `children` (ortalanır) |
| `DAMGA_KINA` | `#dc7536 · #c4581d · #8e3510` — varsayılan |
| `DAMGA_AL` | `#c8402f · #b0241c · #871a15` — açık ve turuncu zeminde |

Degrade kimliği `useId` ile üretilir: aynı belgede birden çok davetiye çizildiğinde
çakışmaz.
