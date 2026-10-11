# `shared/heroes/DecoHero.tsx` — `metal` rengi

> **Kullananlar:** 9 kategorinin `*Deco` şablonu
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

Çerçeve (`DecoFrame`) ve yelpaze (`Sunburst`) sabit altındı (`212,175,95`). Kurumsal bunu
platine çekmek için hero'ya gri tonlama filtresi uygulamak zorunda kalmıştı.

`DecoHeroProps.metal?: string` — `r,g,b` biçiminde; varsayılan altın, davranış aynı.
Örnek: `metal="197,203,211"` (platin). Bu gelince kurumsalın gri tonlama geçici çözümü
kaldırılabilir.
