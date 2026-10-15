# `scripts/temalar/kagit-dokulari.ts` — kâğıt dokularını üretir

> **Komut:** `npx tsx scripts/temalar/kagit-dokulari.ts` · **Çıktı:** `src/components/templates/shared/paper/doku/*.webp`
> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Neden var?

Kâğıt dokusu çalışma anında SVG `feTurbulence` ile üretilirse kaydırmanın her karesinde yeniden
boyanır. Burada bir kez, headless Chrome'un canvas'ında üretilip WebP olarak yazılır. Yeni npm paketi
yok: WebP kodlayıcı tarayıcınınki, bağlantı Node'un yerleşik `WebSocket`'i (DevTools protokolü).

## 2. Ne üretir

| Dosya | Yöntem |
|---|---|
| `lif.webp` | Üç frekanslı periyodik değer gürültüsü (hamur) + 130 kısa eğri lif + 8 kalıntı |
| `keten.webp` | 4 px adımlı atkı/çözgü; iplik kalınlığı iplikten ipliğe, konumu gürültüyle değişir |
| `murekkep.webp` | İki gürültünün eşiklenmesiyle boyasız adacıklar (alfa) |
| `leke.webp` | Deforme çokgenin 70 yarı saydam katmanı + kenar çizgisi + tanecik (alfa) |

Bütün gürültüler döşeme boyuna periyodiktir: kenarlar dikişsiz birleşir. Tohumlar sabittir; aynı
desen yeniden üretilir.

Çıktıda `lif` ve `keten` için en koyu %1 yazdırılır; kontrast tablosu bu çarpanla hesaplanır
(KAGIT-KONSEPTI §2.5). Doku değişirse tablo da yeniden hesaplanmalı.

## 3. Gereksinim

Chrome ya da Edge. Yol `CHROME_PATH` ile verilebilir; yoksa Windows/macOS/Linux'un olağan yolları denenir.
