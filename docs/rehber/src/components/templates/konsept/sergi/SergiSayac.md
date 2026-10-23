# `konsept/sergi/SergiSayac.tsx` — etiket dilinde geri sayım

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

Ortak `useCountdown(date, timeZone)` kancasını okur (duvar saati + saat dilimi). Görünüm kutusuz:
üstte küçük başlık ("Açılışa kalan"), altında kıl çizgi ve dört sütun (sayı Instrument Sans 600 22 px
`tabular-nums`, birim 12 px). Rozet ya da kart yok (SERGI-KONSEPTI §8).

- Tarih okunamıyorsa hiç çizilmez; `showTimer` kapalıysa preset çağırmaz.
- Saniyede değişen rakamlar canlı bölge değildir: ekran okuyucu her saniye duyuru yapmaz; tarih
  etikette zaten yazılı.
- Giriş: `etiketBelirir` (opaklık); preset'lerde gecikme 0.5 s.

## Sınırlar

- Etkinlik geçmişse sıfırda durur (ortak kancanın davranışı).
