# `shared/Envelope.tsx` — renkler temadan

> **Kullananlar:** `InvitationComposition` (`showEnvelope` açıkken)
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

Beş renk artık `theme.envelope`'tan okunur, yoksa eski varsayılana düşer:

```ts
const custom = theme.envelope ?? {};
const seal = custom.seal ?? (isDark ? 'bg-amber-300 text-slate-950' : 'bg-stone-800 text-stone-50');
```

Alanların listesi ve gerekçesi: `palette.md`. Animasyon, metin ve akış değişmedi.
