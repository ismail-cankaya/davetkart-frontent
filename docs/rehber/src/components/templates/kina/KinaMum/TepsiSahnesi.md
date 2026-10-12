# `src/components/templates/kina/KinaMum/TepsiSahnesi.tsx` — Kına tepsisi sahnesi

> **Kullananlar:** `KinaMum` (`renderHeroBackground`)
> **Denetim:** görsel öz-kontrol 360 / 768 / 1280 (tepsi başlığa değmemeli), "hareketi azalt" tablosu ([KIMLIK](../KIMLIK.md) §7)

---

## 1. Ne çizer

Kına gecesinin merkezindeki nesne: bakır tepsi, ortasında yoğrulmuş kına tümseği,
çevresinde dokuz mum (dört arka, bir orta, dört ön; beyaz ve al dönüşümlü). Kodla
çizilmiş özgün SVG; `viewBox 0 0 400 200`.

```
   🕯  🕯   🕯   🕯  🕯       ← alevler titrer, arkalarında ışık nefes alır
  🕯 ╭──── ▲ ────╮ 🕯
     ╰── bakır ──╯          ← tepede, ilk ekranda
     ·  ·  ·
    Sophia (&) Elias        ← KinaHero, pt-[210px]
```

## 2. Yerleşim kararı

İlk sürümde tepsi altta duruyordu; hero 360 × 780'de ~620 px tuttuğu için tepsi ilk
ekranın dışında kalıyor, şablon Bordo'nun kopyası gibi görünüyordu. Şimdi:

| Öğe | Değer |
|---|---|
| SVG | `top-6 @md:top-10`, `h-[170px] @md:h-[220px]`, `xMidYMid meet` (genişlikle büyümez) |
| Tavan ışığı | `top-[130px] @md:top-[160px]`, 520 × 300 radyal, `kina-glow` 5 s |
| Zemin | `radial-gradient(110% 45% at 50% 12%, #4a1e0c → #261008 → #170a05)` — ışık tepside |
| Hero boşluğu | `KinaMum`: `pt-[210px] @md:pt-[280px]`; süs kapalı (`ornament={false}`) |

## 3. Hareket

| Öğe | Hareket | "Hareketi azalt" |
|---|---|---|
| Tepsi | `revealed` olunca `y -20 → 0` + opaklık (1.4 s) | MotionConfig `y`'yi atlar, opaklık kalır |
| Alevler | `kina-flicker` (tabandan ölçek + küçük dönüş), her mum farklı fazda | `parts/motion` reduce kuralı + `data-atmosphere` |
| Mum ışıkları, tavan ışığı | `kina-glow` (opaklık) | aynı |

Alevin konumu dış `<g transform>`'da, titreme iç `<g>`'de: CSS `transform` SVG
özniteliğini ezmesin.
