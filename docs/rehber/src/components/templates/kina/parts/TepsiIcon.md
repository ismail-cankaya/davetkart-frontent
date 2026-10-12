# `src/components/templates/kina/parts/TepsiIcon.tsx` — Kına tepsisi süsü

> **Kullananlar:** `flavors.tsx` → `KINA_FLAVOR.Ornament`: zarf mührü, `KinaHero`, ortak hero'ların süs yuvası (Bento, Deco, Kağıt, Riso…)
> **Denetim:** zarf mührü kontrastı (ikon ≥ 3), görsel öz-kontrol

---

Eski süs, Hint mehendi'sini andıran bir mandala yıldızıydı. Türk kına gecesinin simgesi
**kına tepsisi**dir: yoğrulmuş kınanın ortasında ve kenarında mumlar, gelinin etrafında
dolaştırılır. 24 × 24 çizimde: tas (elips + gövde), kına tümseği, üç mum, üç alev.

🔴 Alevlerin konumu dış `<g transform>`'dadır, titreme iç yolda. CSS `transform`
animasyonu SVG `transform` özniteliğini ezer; ikisi aynı öğede olsaydı alevler (0,0)'a
kayardı.

Alevler `kina-flicker` sınıfı ve `data-atmosphere` taşır; "hareketi azalt"ta durur
(bkz. [motion](motion.md)). 18–30 px'te (zarf mührü, Bento) okunur.
