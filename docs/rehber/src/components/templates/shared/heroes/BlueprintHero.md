# `shared/heroes/BlueprintHero.tsx` — çizim "hareketi azalt"a uyar

> **Kullananlar:** 9 kategorinin `*Blueprint` (Teknik Çizim) şablonu
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## Sorun

Pafta çerçevesi `pathLength: 0 → 1` ile çizilerek belirir. `App.tsx`'teki
`MotionConfig reducedMotion="user"` yalnızca **transform** animasyonlarını susturur;
`pathLength` transform değildir. Hareketi azaltmayı seçen kullanıcı çizimi görmeye devam ediyordu.

## Çözüm

`useReducedMotion()` okunur; açıksa çerçeve `initial={{ pathLength: 1 }}` ile çizili başlar.
`YildizHero` aynı kalıbı zaten kullanıyordu.

Ölçü çizgilerinin `scaleX` girişi transform olduğu için `MotionConfig` onları zaten susturur.
