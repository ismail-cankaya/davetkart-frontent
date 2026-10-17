# `konsept/kitap/KitapSayac.tsx` — geri sayım satırı

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

Kutu değil dizgi: üstte `KALAN SÜRE`, altında `120 GÜN · 02 SAAT · 51 DAKİKA` (rakam Caslon Text 21 px,
birim 11 px aralıklı büyük harf). Renkler çağırandan (`sayiClassName`, `birimClassName`).

- Saniye yok: her saniye değişen rakam "bir kez oynayan" hareket dilini bozar. Kanca saniyede bir
  yenilenir ama yalnızca bu satır çizilir.
- `showTimer` kapalıysa ya da tarih okunamıyorsa hiç yer kaplamaz.
- 360 px'te iç kapağın 280 px sütununa tek satır sığar (denendi); daha darda birimler satır atlar,
  ayraç noktası satır sonunda kalabilir.
- Zaman `useCountdown(date, timezone)` ile: duvar saati etkinliğin saat diliminde.
