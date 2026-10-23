# `konsept/kitap/SayfaBasi.tsx` — sayfa başları (`renderBackdrop`)

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

Açık kitabın iki sayfasının üst kenarı gibi: solda kitabın adı (adlar, 13 px italik), sağda bölüm adı
(11 px aralıklı büyük harf). Renk `soluk` (6.17).

- **Yalnızca kap ≥ 64 rem (1024 px):** bölümler 28 rem genişliğinde ortadadır, iki yan boşluk sayfa
  kenarıdır. 768 px'te Detaylar kartı (x 160–608) sol başlığın altından geçerdi; orada çizilmez.
- `heroExit` 0.6 → 1 arasında belirir: kapakta ve iç kapakta sayfa başı olmaz.
- Sol başlık kullanıcının yazdığı biçimde (büyük harfe çevrilmez), en çok 15 rem, gerekirse iki satır.
- Bilgi tekrarıdır: `aria-hidden`.
- Sayfa numarası backdrop'ta yok: sabit katman kaydırmayla değişen bir numara bilemez.
