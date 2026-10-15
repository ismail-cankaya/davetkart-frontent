# `shared/paper/doku.ts` · `doku/*.webp` — önceden üretilmiş dokular

> **Tarih:** 2026-10-15 · dal `design/kagit` · Üretici: [kagit-dokulari](../../../../../scripts/temalar/kagit-dokulari.md)

---

## 1. Neden önceden üretilmiş?

Çalışma anında SVG `feTurbulence` filtresi, kaydırmanın her karesinde yeniden boyanır; telefonda
kaydırma takılır. Mevcut `PaperGrain` ve Suluboya hero'su bunu yapıyor. Kit aynı görünümü bir kez
üretilmiş küçük WebP döşemelerle verir.

## 2. Dosyalar

| Dosya | Boyut | Ne | Nasıl kullanılır |
|---|---|---|---|
| `lif.webp` | 1.1 KB | 256 px gri döşeme: bulutlu hamur, kısa lifler, seyrek kalıntı | `background-blend-mode: multiply` |
| `keten.webp` | 2.8 KB | 256 px gri döşeme: dalgalanan atkı/çözgü | aynı |
| `murekkep.webp` | 9.6 KB | 128 px alfa maskesi: eşit dağılmayan boya | damganın `mask-image`'ı |
| `leke.webp` | 8.7 KB | 200 px alfa maskesi: kenarda toplanan pigment | lekenin `mask-image`'ı |
| **Toplam** | **22.3 KB** | | bütçe 40 KB |

Dokular gridir: kâğıt rengiyle çarpılınca her paletin rengini alır; ayrı renkli dosya gerekmez.
Maskeler siyah + alfadır: rengi CSS'ten alır.

## 3. Kontrasta etkisi

Döşemenin en koyu %1'i: lif ×0.937, keten ×0.906. Kontrast tablosu kâğıdı bu çarpanla koyultarak
hesaplandı. Doku daha koyu üretilirse tablo yeniden hesaplanmalı.

## 4. Sınırlar

- Döşeme 256 px'te tekrar eder; düşük kontrast bunu gizler. Doku koyulaştırılırsa tekrar görünür.
- `leke.webp` 200 px'tir; 400 px'e kadar büyütmek kenarı yumuşatır (suluboya için kabul edilebilir).
