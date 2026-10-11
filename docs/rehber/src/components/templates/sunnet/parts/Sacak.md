# `src/components/templates/sunnet/parts/Sacak.tsx` — Otağ saçağı ve fener

> **Kullananlar:** `OtagBackdrop` (Klasik, fenerli), `SunnetLunapark` (HeroStage `overlay`)
> **Denetim:** statik önizleme 360/1280 px

---

## 1. `Sacak`

Dilimli, iki renk şeritli tente kenarı; dilim aralarında pirinç püskül,
üst bantta pul. 60 px yüksekliğinde.

| Karar | Neden |
|---|---|
| `userSpaceOnUse` desen, 44 px döşeme | Geniş kadrajda dilimler esnemez, çoğalır |
| `x="50%"` + `translate(-22)` | Tam ortada bir dilim; iki kenar simetrik kesilir |
| Püskül döşeme kenarında, iki yarım | Komşu döşemeyle tamamlanır |
| `useId` | Klasik ve Lunapark aynı belgede çizilirse renkleri karışmaz |

Zarf açılınca (`revealed`) yukarıdan yaylanarak iner. Hareketi azalt:
MotionConfig `y`'yi atlar, saçak yerinde görünür.

## 2. `Fener`

Saçağın çocuğu olarak çizilir ve onunla birlikte iner; kumaşın **arkasında**
durur (SVG `relative z-10`), ipi dilimlerin altından çıkar.

| Prop | Klasik sol | Klasik sağ |
|---|---|---|
| `cord` | 34 px | 58 px |
| `glass` | nar %82 | sax %82 |
| `phase` | 0 | 1.7 s |

İpinden sallanır (`sunnet-sway-hang`), camın arkasındaki ışık nefes alır
(`sunnet-glow`). İkisi de hareketi azaltta durur.

## 3. Yerleşim riski

360 px'te fenerler kenarda (%7), en alt noktaları ~132 px; içerik
`canopy` ile 112 px'ten başlar ama ortadadır (sorguç 48 px), çakışmaz.
@md'de %14'e içeri alınır.
