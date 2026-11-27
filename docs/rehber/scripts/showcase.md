# `scripts/showcase/capture.ts`

> **Faz:** 23 · **Çıktı:** `public/showcase/<preset>.webp` · **Kullanan:** `src/components/home/showcase/` ([kılavuz](../src/components/home/showcase.md))

## Ne yapar

`showcaseSlides.ts`'teki her şablonu `onizleme.html?preset=<id>&senaryo=dolu&yol=renderer` ile 390 × 844, DPR 2'de açar
(zarf kapalı, içerik görünür), şablonun kendi kaydırma kabını üç ekran boyunca kaydırıp her ekranı çeker, `ffmpeg` ile alt
alta ekler ve 540 px genişliğe indirip WebP (kalite 72) yazar.

## Nasıl koşulur

```
npm run dev -- --port 3101
npx tsx scripts/showcase/capture.ts --port 3101
npx tsx scripts/showcase/capture.ts --port 3101 --preset nisan-koi
```

Gerekenler: `ffmpeg` (`libwebp`), Playwright Chromium. Playwright'ın kendi tarayıcısı yoksa `CHROME_PATH=<chrome yolu>`.

## Sık hata

- Ekran sınırlarında küçük dikiş olabilir (şablonun sabit arka planı her ekranda tekrar çizilir).
- Çıktı ölçüsü `SHOWCASE_IMAGE` ile aynı olmalı (540 × 3506); `SCREENS` ya da `OUT_WIDTH` değişirse ikisi birlikte değişir.
- 27 Kasım 2026 çıktıları: `dugun-fener` 62,9 kB, `dugun-kelebek` 59,3 kB, `nisan-koi` 49,9 kB.
