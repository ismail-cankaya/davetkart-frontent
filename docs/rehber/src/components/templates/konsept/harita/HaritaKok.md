# `konsept/harita/HaritaKok.tsx` — şablonun kökü

> **Tarih:** 2026-10-17 · dal `design/harita`

---

Her harita preset'i kompozisyonu bununla sarar. Üç iş yapar:

1. `--hr-etiket`, `--hr-govde`, `--hr-italik` değişkenlerini yazar (tema ve bileşenler font ailesini
   buradan okur; Tailwind sınıfına tırnaklı aile adı yazılmaz).
2. Fontları yükler ([fontlar](fontlar.md)).
3. Kapakla sahnenin paylaştığı bağlamı kurar ([baglam](baglam.md)): `kapakAlti` MotionValue'su.

`display: contents` — kendi kutusu yoktur, düzene karışmaz.
