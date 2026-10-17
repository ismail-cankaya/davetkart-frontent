# `konsept/harita/HaritaZarf.tsx` — katlanmış harita (`renderEnvelope`)

> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Fikir

Zarf modülünün haritadaki karşılığı: katlanmış bir harita. Kapak küçük bir kartuştur — üst etiket
(`flavor.envelopeLabel`), adlar, haritadan küçük bir pencere (preset'in kendi arazisi + iğne), altta
"GÜNÜN HARİTASI" ve pusula gülü. Altında açılan ilk panel: arazi, iki kat izi, iğne.

Kompozisyon bu bileşeni yalnızca `showEnvelope` açıkken çağırır; modül kapalıyken zarf hiç görünmez.

## 2. Zamanlama

| s | Olay |
|---|---|
| 0.00–0.45 | Kapak sol kenarından açılır (`rotateY` 0 → −165°, arka yüz gizli) |
| 0.40 | `onRevealStart` — kapak girişini başlatır |
| 0.45–0.85 | Kapı solar → `onOpened` |

**Ölçüm** (Tab → Enter, kapının DOM'dan kalkışı): 902 ms. Hareket azaltıldığında 68 ms (dönme ve
solma yok, kapı anında kalkar).

## 3. Erişim

"Haritayı açın" gerçek bir `<button>`: ilk Tab'da odaklanır (147 × 44 px, görünür odak çerçevesi),
Enter ile açılır. Kapının herhangi bir yerine dokunmak da açar.

## 4. Sınır

Kapı açıkken arkadaki bölümler (ör. Detaylar'ın "Yol Tarifi Al" bağlantısı) Tab ile odaklanabiliyor:
ortak kompozisyon kapı açıkken içeriği `inert` yapmıyor (Kâğıt zarfı da aynı). Ortak dosya önerisi.
