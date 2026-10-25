# `src/pages/PricingPage.tsx` — fiyatlandırma sayfası

> **Faz:** 13 (frontend 13.11)

## Ne değişti?

| Önce | Sonra |
|---|---|
| Yalnızca bu sayfada yaşayan üç uydurma paket: Zarif / Prestij / İhtişam (349 / 549 / 949 ₺) | `data.ts` → `SUBSCRIPTION_PLANS`: paywall ve ödeme sayfasıyla **aynı** üç paket |
| "İlk davetiyenizde ₺139" gibi sabit sayılar | Backend kataloğu: misafire liste + kampanya, giriş yapmış yeni üyeye %60'lı fiyat |
| Sabit "%60" bandı ve SSS cevabı | `firstPublishPercent`'ten; indirim kapalıysa band ve soru görünmez |
| "Kredi kartı, banka kartı ve havale ile ödeme" | Açık yöntemlere göre (`pricing.methods.*`) |

Özellik listesinde dahil olmayanlar (paywall'daki gibi) üstü çizili görünür. Öne çıkan
paket Gold.

⚠️ SSS'deki diğer cevaplar ("yayın süresi", "iade") eski sayfadan aynen kaldı. Ticari
gerçekliğe uygun olup olmadıklarını kontrol etmen gerekiyor.
