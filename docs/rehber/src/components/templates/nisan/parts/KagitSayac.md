# `nisan/parts/KagitSayac.tsx` — kâğıt geri sayım

> **Kullananlar:** `NisanSozMektubu`, `NisanGulKurusu`, `NisanSozSenedi`
> **Tarih:** 2026-10-15 · dal `design/kagit`

---

Geri sayım: ana kartın altında üç ek kart (gün, saat, dakika).

- **Saniye yok:** her saniye değişen rakam "bir kez oynar" hareket dilini bozar.
- Rakamlar **düz (lining) rakam**: Cormorant'ın varsayılan eski stil rakamları "119"u "I I 9" gibi
  gösteriyordu (pilotta görüldü).
- Kendi bileşenidir: `useCountdown` her saniye çizim tetikler, yalnızca bu satır yeniden çizilir.
- `showTimer` kapalıysa ya da tarih yoksa hiç yer kaplamaz.

## Sınırlar

Kategoriden bağımsız; pilot raporunda kite taşınması önerildi (kit değişikliği onay ister).
