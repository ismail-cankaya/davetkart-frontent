# `shared/paper/MumMuhur.tsx` — mum mühür

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Katmanlar

1. Taşmış mumun kenarı: üç frekanslı dalgalı bir daire, 72 nokta, yumuşak eğriler. Üç biçim (`bicim`).
2. Işık (üst-sol) ve gölge (alt-sağ) radyal degradeleri — renkten bağımsız.
3. Mührün bastırdığı çukur: iç halka, üst-sol kenarı gölgede, alt-sağı ışıkta.
4. Kabartma nokta halkası.
5. Harfler: üç kopya (koyu alt-sağ, açık üst-sol, mum renginde üst yüz). Filtre yok.

İlk denemede harfler okunmuyordu (gölge %40, ışık %36); %55 / %50'ye çekildi.

## 2. Kırılma

Mühür iki kez çizilip zikzak bir çatlaktan iki `clip-path` parçasına kesilir. `kirik` olunca bütün
mühür anında gizlenir, parçalar 0.3 s'de ayrılıp söner (x, y, döndürme, opaklık — yalnızca transform
ve opaklık). Sol parça çatlağı 0.6 birim aşar: iki parça arasında piksel dikişi görünmez.

## 3. Erişilebilirlik

`aria-hidden`: mühür süstür. Zarfta dokunma hedefi olan düğme (72 px, `aria-label="Davetiyeyi aç"`)
`KagitZarf`'tadır. Harfler bilgi taşımaz; adlar sayfada gerçek metin olarak var.

## 4. Sınırlar

- Renk `var(--kg-mum)` ya da düz hex; degrade verilemez.
- SVG kimlikleri `useId` ile tekildir; aynı sayfada birden çok mühür güvenli.
