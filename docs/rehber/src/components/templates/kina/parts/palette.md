# `src/components/templates/kina/parts/palette.ts` — "Al & Kına" renkleri

> **Kullananlar:** kına parçaları ve sahneleri (SVG dolguları, hero parametreleri)
> **Denetim:** kontrast betiği

---

Hex değerlerin tek kaynağı; tema **sınıfları** Tailwind taraması için `themes.ts`'te
değerleriyle açık yazılır (dinamik `bg-[${x}]` taranmaz). Tam tablo ve roller:
[KIMLIK §2](../KIMLIK.md).

`rgb(hex)` yardımcı fonksiyonu atmosfer katmanlarının beklediği `r,g,b` biçimini üretir.
