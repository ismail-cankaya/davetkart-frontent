# `kurumsal/parts/GlassPanes.tsx` — Buzlu cam levhalar

> **Kullananlar:** `KurumsalCam` (`HeroStage.atmosphere`)
> **Denetim:** duman testi; kontrast betiği (Cam hero çiftleri)

---

## 1. Ne yapar?

Açık zeminli "Sıvı Cam" sahnesinde, bulanık kobalt/platin renk kütlelerinin
önüne iki yarı saydam levha koyar. Levhalar hafif eğik durur ve çok yavaş
süzülür (14 s ve 17 s).

## 2. 🔴 Neden `backdrop-filter` yok?

Levhaların altındaki renk kütleleri (`AuroraMesh`) her karede hareket eder.
`backdrop-filter: blur()` bu durumda arkadaki görüntüyü **her karede** yeniden
örnekler. Cam etkisi ucuz yoldan kurulur:

| Katman | Değer |
|---|---|
| Dolgu | `linear-gradient(135deg, beyaz %58 → beyaz %16 → kobalt ışığı %14)` |
| Kenar | `border-white/70` |
| Parlak üst kenar | `inset 0 1px 0 rgba(255,255,255,0.95)` |
| Kırılma | `inset 1px 0 0 rgba(43,63,224,0.18)` (sol kenarda kobalt) |
| Derinlik | `0 40px 70px -40px rgba(16,18,40,0.35)` |

Kütleler zaten bulanık olduğu için yarı saydam levha buzlu cam gibi okunur.

## 3. Kontrast

Levhalar zemini **açar**. Koyu metnin kontrastı levhanın önünde artar, düşmez.
En kötü zemin levhanın dışındaki kobalt lekesidir; bkz.
[KIMLIK.md §7.1](../KIMLIK.md#71-kontrast-wcag-aa).

## 4. Hareketi azalt

Süzülme `useReducedMotion()` ile kapanır (`y: 0`, `duration: 0`). Levhalar
yerinde ve görünür kalır.
