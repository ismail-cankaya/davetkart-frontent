# `src/components/templates/dugun/parts/Kurdele.tsx` — Kurdele düğümü

> **Kullananlar:** `dugun/flavors.tsx` (`KurdeleMark` → `Ornament`), `parts/KurdeleHero.tsx` (`KurdeleCizim`)
> **Denetim:** duman testi; görsel kontrol orkestratör ekran görüntüsünde

---

## 1. Motif

Kategorinin süsü iç içe halkalardan (nişanın alyans dilinin tekrarı) kurdele düğümüne
geçti. Türkçede "düğün" ile "düğüm" yan yanadır; davetiye kartının kurdelesi ve
"nikâh düğümü" aynı şekli söyler. Çizim kodla yazılmış özgün bir SVG'dir: iki ilmek,
ortada düğüm, S kıvrımlı iki kuyruk ve ilmeklerde iki kıvrım çizgisi.

## 2. İki bileşen, tek veri

| Bileşen | Nerede | Not |
|---|---|---|
| `KurdeleMark` | Zarf mührü (30 px), ortak hero süsleri (18–44 px) | 28 px altında kıvrım çizgileri kapanır; 40 px üstünde çizgi incelir |
| `KurdeleCizim` | KurdeleHero açılışı (44–58 px) | İki kurdele çizgisi kenardan merkeze uzanır, sonra ilmek → düğüm → kuyruk çizilir |

Yol verisi (`KNOT`, `LOOPS`, `TAILS`, `CREASES`) dosyada tek yerde durur.

`KurdeleCizim align="start"` (DugunModern'in sola yaslı düzeni): sol çizgi çizilmez,
düğüm solda durur ve kurdele yalnızca sağ kenardan düğüme uzanır.

## 3. "Hareketi azalt"

`pathLength` bir transform değildir; `MotionConfig` onu susturmaz. `KurdeleCizim`
`useReducedMotion()` ile düğümü ve çizgileri baştan çizili verir.
