# `konsept/kitap/IcKapak.tsx` — künye düzenli başlık sayfası

> **Tarih:** 2026-10-17 · dal `design/kitap` · Eksen: iç kapak ([KITAP-KONSEPTI §4.3](../../../../../tasarim/KITAP-KONSEPTI.md))

---

## 1. Düzen

Kapak yok; şamua bir başlık sayfası, üç kat (`justify-between`, en az bir ekran):

| Kat | İçerik | Kitaptaki karşılığı |
|---|---|---|
| Üst | Kullanıcının başlığı (12 px aralıklı, harf büyüklüğü olduğu gibi) + çizgi | Yazar / dizi satırı |
| Orta | Adlar (`KitapAdlar`, `h1`, `&` kurdele), italik alt metin (18 px), `Fleuron cizgi` | Kitabın adı, alt başlık, matbaa süsü |
| Alt | Çizgi, mekân (14 px aralıklı), tam tarih, geri sayım | Künye: yayın yeri ve yılı |

Sağ üstten `Ayrac` sarkar.

## 2. Ayraç ve sütun

Metin sütunu `px-10` (360 px'te 280 px). Ayraç dar ekranda sağ kenardan 18 px içeride (x 328–342),
kap ≥ 48 rem'de metin sütununun 40 px dışında (`right: calc(50% − 19.5rem)`). Ayraç metnin altına
girmez — kurdele üstünde mürekkep okunmazdı.

## 3. Ölçüm

Şamua üstünde en düşük metin 6.17 (italik alt metin ve tarih, `soluk`). Adlar 13.64.

## 4. Sınırlar

- Mekân uzun olduğunda (88 karakter) künye üç satıra çıkar; başlık sayfası ekranı aşarsa aşağı uzar.
