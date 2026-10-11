# `shared/heroes/PanoHero.tsx` — ekran okuyucu tam metni okur · `nameMax`

> **Kullananlar:** 9 kategorinin `*Pano` şablonu (kurumsal `nameMax` ile etkinlik adını verir)
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## 1. Sorun

Pano, metni harf harf "kanatlara" böler ve satır başına üst sınırla kırpar (isim satırı 20).
Kanatlar yerleşirken rastgele harfler gösterir. Ekran okuyucu bunları ayrı ayrı okuyordu:
hem **kırpılmış** adı hem de dönen ara harfleri.

## 2. Çözüm

`FlapRow` iki parça çizer:

```tsx
<span className="sr-only">{text}</span>          // tam, kırpılmamış metin
<div aria-hidden="true"> …kanatlar… </div>      // yalnızca görsel
```

Tarih ve mekân satırları da aynı `FlapRow`'u kullandığı için onlar da düzeldi.

## 3. `nameMax`

İsim satırının kanat sınırı artık prop: `nameMax` (varsayılan 20 — davranış aynı).
Kanat genişliği sabit olduğundan sınırı büyütmek 360 px'te satır sayısını artırır;
şablon bunu bilerek seçmelidir.
