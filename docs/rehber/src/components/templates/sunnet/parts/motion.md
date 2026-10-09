# `src/components/templates/sunnet/parts/motion.tsx` — Döngü kare tanımları

> **Kullananlar:** `flavors.tsx` (sorguç), `Kusak`, `KusakHero`, `Sacak` (fener), `NazarRings`
> **Denetim:** sünnet duman testi — SSR çıktısında `<style data-precedence="sunnet">` **bir kez**

---

## 1. Sorun

Kategorinin "şenlik sallantısı" sürekli birkaç döngü ister (tüy salınımı,
fener, saten parıltısı, nazar yörüngesi). `index.css` ortak dosya ve
kapalı; Motion'ın `repeat: Infinity` döngüleri ise ana thread'de her karede
stil yazar (index.css'teki 🔴 notu).

## 2. Çözüm: React 19 hoist edilen `<style>`

`<style href="sunnet-motion" precedence="sunnet">` React 19'da `<head>`'e
taşınır ve `href` ile tekilleşir: yirmi bileşen çağırsa da belgeye bir kez
yazılır. Döngüler yalnızca `transform`/`opacity` — compositor'da döner.

🔴 `<svg>` içine konmaz: SVG içindeki `<style>` hoist edilmez, olduğu yerde
kalır (denendi). Çağıranlar onu SVG'nin **kardeşi** olarak çizer.

| Sınıf | Kare | Süre | Kullanan |
|---|---|---|---|
| `sunnet-sway` | ±4° dönüş, kök alt orta (`fill-box`) | 6 s | Sorguç tüyü |
| `sunnet-sway-hang` | ±4° dönüş, kök üst orta | 5.2 s | Fener (ipinden) |
| `sunnet-glow` | opaklık .55 ↔ 1 | 4.4 s | Fener ışığı |
| `sunnet-sheen` | yatay süpürme, döngünün %38'i | 7 s | Kuşak saten parıltısı |
| `sunnet-spin` / `-rev` | 360° | 140 / 190 s | Nazar yörüngesi |

## 3. Hareketi azalt

`@media (prefers-reduced-motion: reduce)` hepsini `animation: none` yapar.
Öğeler ayrıca `data-atmosphere` taşır; index.css'in mevcut kuralı da onları
durdurur (çift güvence). `sunnet-sheen`'in dinlenme konumu `-130%`'tür:
durduğunda parıltı şeridin dışında kalır, ortada donmuş bir ışık görünmez.

## 4. Ortak değişiklik önerisi

Kare tanımları ileride `index.css`'e taşınabilir (diğer kategoriler de
`sway` isterse). Taşınmazsa bir şey bozulmaz.
