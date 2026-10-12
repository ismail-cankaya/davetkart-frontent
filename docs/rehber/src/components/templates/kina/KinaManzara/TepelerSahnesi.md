# `src/components/templates/kina/KinaManzara/TepelerSahnesi.tsx` — Yüksek Tepeler sahnesi

> **Kullananlar:** `KinaManzara` (`renderHeroBackground`)
> **Denetim:** görsel öz-kontrol 360 / 768 / 1280 (metin tepelere değmemeli), "hareketi azalt" tablosu ([KIMLIK](../KIMLIK.md) §7)

---

## 1. Ne çizer

Kına türküsünün "yüksek tepeler"i: kayısı akşam göğü, üç sıra tepe (açıktan koyuya
`#e3a87f` → `#b46944` → `#6c2e1a`), en yüksek tepede beyaz duvarlı, al çatılı, penceresi
yanan bir ev ve ona kıvrılan kesik çizgili yol; yakın tepede kına ağaçları (zeytin taç).
Kodla çizilmiş özgün SVG, `viewBox 0 0 400 170`.

## 2. Yerleşim

| Öğe | Değer |
|---|---|
| SVG | `bottom-0`, `h-[170px] @md:h-[210px]`, `xMidYMax slice` (geniş ekranda yatay taşar, boy sabit) |
| Akşam güneşi | `left-[62%] bottom-[96px]`, 340 px radyal, `kina-glow` 7 s |
| Hero boşluğu | `KinaManzara`: `pb-48 @md:pb-60`, adlar tek satır, satır sayaç |

Hero uzarsa (uzun ad, dar ekran) sahne de uzar: tepeler bölümün dibine yapışık kalır,
metin her zaman üstündedir. 360 × 780'de tepeler ilk ekranda görünür (öz-kontrol).

## 3. Hareket

| Öğe | Hareket | "Hareketi azalt" |
|---|---|---|
| Tepeler | `revealed` olunca `y 28 → 0` + opaklık | MotionConfig `y`'yi atlar |
| Akşam güneşi | `kina-glow` | `parts/motion` reduce kuralı + `data-atmosphere` |
