# `shared/heroes/HerbaryumHero.tsx` — dal çizimi "hareketi azalt"a uyar

> **Kullananlar:** 9 kategorinin `*Herbaryum` şablonu
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

`Sprig` bileşenindeki dal gövdesi `pathLength: 0 → 1` ile çiziliyordu. `pathLength`
transform olmadığından `MotionConfig reducedMotion="user"` onu susturmaz.

`Sprig` artık `useReducedMotion()` okur ve açıksa gövde çizili başlar
(`BlueprintHero.md` ile aynı gerekçe ve kalıp).
