# `src/components/payment/PlanPriceTag.tsx` — bir paketin fiyatı

> **Faz:** 13 (frontend 13.10) · **Kullananlar:** `PaywallModal`, `PricingPage`

```
₺399            ← üstü çizili liste fiyatı (yalnızca indirim varsa)   priceMinor
₺159,60 / tek seferlik                                               totalMinor
[%] İlk yayına %60 indirim                                           promotion
[%] %20 kampanya indirimi · 7 Ocak tarihine kadar                    promotion + endsAt
```

- **Hiçbir sayı hesaplanmaz.** İki sayı da backend dökümünden gelir.
- Katalog yoksa sayı **uydurulmaz**: yüklenirken iskelet, hata olursa "Fiyat şu an
  gösterilemiyor · Tekrar dene".
- Kampanya bitişi `Europe/Istanbul` saatinde gösterilir. Backend "7 Ocak'ın sonu" diye
  kurar (`20:59:59Z`). Başka saat dilimindeki ziyaretçi "8 Ocak" görmemeli.
  `formatPromotionEnd()` bu yüzden ayrı ve `verify:pricing` onu sınıyor.
- `inverted`: fiyat sayfasındaki koyu (öne çıkan) kart için renkler.
