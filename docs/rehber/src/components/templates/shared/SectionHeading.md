# `shared/SectionHeading.tsx` — ortak bölüm başlığı ve giriş hareketi

> **Kullananlar:** `Timeline`, `Details`, `Gallery`, `GiftRegistry`, `RSVPForm`
> **Tarih:** 2026-10-22 · dal `design/konsept-ortak` · Karar: KONSEPT-ORTAK §8 (K10)

---

## 1. Neden ayrı dosya?

Beş bölümün üst etiket + başlık bloğu birebir kopyaydı (`motion.div` → `span` + `h2`). Konseptler iki
şey istedi: başa yaslı başlık ve daha kısa bir giriş. Beş kopyaya ayrı ayrı kanca eklemek yerine blok
tek bileşene alındı. **Tema alan vermezse çıkan DOM ve sınıf dizgesi öncekinin aynısıdır**
(`text-center mb-10` / `mb-12`, 0.9 s, 24 px).

## 2. Dışa aktarımlar

| Ad | İş |
|---|---|
| `SectionHeading` | `theme`, `eyebrow`, `title`, `amount` (görünürlük oranı), `className` (alt boşluk), `children` (başlığın altındaki satır: hediye notu, LCV son günü) |
| `sectionMotion(theme, fallback)` | `{ duration, distance }`: tema `sectionMotion` verdiyse onun değeri, vermediyse çağıranın bugünkü değeri |
| `isStartAligned(theme)` | `theme.headingAlign === 'start'` |

## 3. Başa yaslı başlık

`headingAlign: 'start'` blokta `text-center`'ı `text-start` ile değiştirir ve bloğu içerik sütununa
(`max-w-md mx-auto`) oturtur: başlık kartın sol kenarıyla aynı çizgide başlar (1280 px'te de). Ortalı
açıklama satırları (`mx-auto`) başa yaslıda `mx-0` alır (bkz. `GiftRegistry`).

## 4. Bölüm girişi

| Parça | Varsayılan (bugün) | `sectionMotion` verilince |
|---|---|---|
| Başlık bloğu | 0.9 s · `y` 24 px | `duration` · `distance` |
| Kart (Detaylar, Hediye, LCV) | 0.95 s · `y` 30 px · 0.1 s gecikme | `duration` · `distance` · 0.1 s gecikme |
| Galeri kartı | 0.9 s · ölçek 0.96 (kaymaz) | `duration` · ölçek aynı |
| Program adımı (`kart`) | 0.85 s · `x` ±36 px | `duration` · `x` ±`distance` |
| Program satırı (`icindekiler`) | 0.85 s · `y` 24 px | `duration` · `distance` |

İki alan da ayrı ayrı verilebilir; verilmeyen parça kendi bugünkü değerinde kalır. Detaylar'daki pin
yayı ve galeri kaydırması temadan etkilenmez.

**Hareketi azalt:** değişmedi. `MotionConfig reducedMotion="user"` kaymayı (transform) atlar; yalnızca
opaklık `duration` boyunca açılır.
