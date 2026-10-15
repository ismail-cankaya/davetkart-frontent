# `shared/paper/Adlar.tsx` — el yazısıyla adlar

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Neden ayrı bileşen?

Üç kural her preset'te aynı:

1. **`&` serif italikle.** Kaligrafi fontlarının `&` glifi çoğu zaman harfe benzer; Pinyon'da "ɤ"
   gibi okunur (font denetiminde görüldü).
2. **Satır `&`'tan önce kırılır.** Bağlaçtan sonra bölünmez boşluk var; `&` ikinci adla kalır.
3. **Uzun ad küçülür, kesilmez.** Boy çarpanı: ≤ 22 karakter ×1, ≤ 34 ×0.86, ≤ 52 ×0.74, üstü ×0.62.
   `text-wrap: balance` satırları dengeler; `overflow-wrap: anywhere` tek uzun kelimeyi taşırmaz.

Her preset bunu kendisi yazsaydı dokuz kategoride dokuz farklı sonuç çıkardı.

## 2. Denendi

`Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu` (50 karakter), 360 px, Caveat 44 px × 0.74:
üç satır, taşma yok.

## 3. Sınırlar

- Yalnızca `&` ayırır; "ve" ile yazılmış adlar tek parça kalır (el yazısıyla, sorun değil).
