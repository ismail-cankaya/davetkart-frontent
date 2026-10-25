# `scripts/verify-pricing.ts` — `npm run verify:pricing`

> **Faz:** 13 (frontend 13.14)

Üç bölüm:

1. **Kaynak taraması (F6):** `src/` altında (çeviriler ve yorum satırları hariç)
   `price: 399`, `₺549` ya da `.price * 100` gibi elle yazılmış bir fiyat kalırsa kırmızı
   yanar. Ayrıca `SUBSCRIPTION_PLANS` nesnelerinde `price` anahtarı olmamalı.
2. **Katalog deposu:** misafir ve kullanıcı uçları, aynı kimlikte ikinci istek atılmaması,
   `force`, giriş yapınca kişisel katalog, geç gelen eski yanıtın yenisini ezmemesi, hata ve
   tutarsız dökümde katalog uydurulmaması.
3. **Yardımcılar:** `paymentMethodsMode` (beş hâl) ve kampanya bitişinin işletme saatinde
   gösterilmesi.

Gerçek axios örneği kullanılır, yalnızca taşıma katmanı taklittir (`verify-gift-code` ile aynı).
