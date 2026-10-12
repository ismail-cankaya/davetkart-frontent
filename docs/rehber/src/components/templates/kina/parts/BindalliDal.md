# `src/components/templates/kina/parts/BindalliDal.tsx` — Bindallı dalı ve köşesi

> **Kullananlar:** `KinaHero` (ayraç), `KinaSade` (iki köşe), `KinaSekilli` (dört köşe + taç)
> **Denetim:** görsel öz-kontrol (köşeler metne değmemeli)

---

Bindallı, kına gecesinde gelinin giydiği kadife kaftandır; adı "bin dallı"dan gelir:
kadifeye sırmayla işlenmiş dallar, laleler ve pullar. İki çizim, ikisi de
`currentColor` ile boyanır ve özgün yollardan oluşur:

| Bileşen | viewBox | Ne |
|---|---|---|
| `BindalliDal` | 200 × 28 | Ortada lale, iki yana dalgalanan saplar, badem yapraklar, kıvrım, pul |
| `BindalliKose` | 120 × 120 | Sol üst köşe: iki kenara uzanan sarmaşık, köşegende lale; diğer köşeler `transform` ile aynalanır |

Sol kol, sağ kolun `scale(-1 1)` aynasıdır; simetri elle değil geometriyle sağlanır.
