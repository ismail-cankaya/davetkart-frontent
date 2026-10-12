# `src/components/templates/kina/parts/motion.tsx` — Kına döngüleri

> **Kullananlar:** `TepsiIcon`, `MumSayac`, `TepelerSahnesi`, `TepsiSahnesi`
> **Denetim:** "hareketi azalt" tablosu ([KIMLIK](../KIMLIK.md) §7)

---

`index.css` ortak dosya olduğu için kare tanımları burada durur. React 19 `href` +
`precedence` taşıyan `<style>`'ı `<head>`'e taşır ve tekilleştirir; kaç bileşen
çağırırsa çağırsın belgeye bir kez yazılır.

| Sınıf | Ne | Süre |
|---|---|---|
| `kina-flicker` | Alev: tabandan `scale` + küçük `rotate` | 2.6 s |
| `kina-glow` | Mum ışığı, akşam güneşi: opaklık 0.62 ↔ 1 | 3.4 s (sahnede 5–7 s) |

İkisi yalnızca `transform`/`opacity` değiştirir (compositor). `@media
(prefers-reduced-motion: reduce)` ikisini de durdurur; öğeler son karede görünür kalır.
Ayrıca her animasyonlu öğe `data-atmosphere` taşır: index.css'in ortak kuralı da durdurur.
