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

---

## 🆕 Faz 18.3 (`SEC-01`) — hedefli katalog

Betiğe dördüncü bir bölüm eklendi (`verifyTargetedStore`): `loadFor` davetiyeyi sorguya yazıyor
mu, ortak kataloğu değiştirmiyor mu, aynı hedefte ikinci isteği atlıyor mu, başka davetiyenin
fiyatını ekranda tutmuyor mu, `refresh()` ikisini de tazeliyor mu, geç gelen eski yanıt yenisini
eziyor mu, hata fiyat uyduruyor mu, misafirde istek atıyor mu. Taşıma taklidi artık `params`'ı
da kaydediyor (`/pricing?invitation=INV_A`).

**Mutant:** `usePricingStore.ts`'te `loadFor` içindeki `catalog: same ? current.catalog : null`
ifadesini `catalog: current?.catalog ?? null` yap → "başka davetiyenin fiyatı ekranda kalmaz" kırmızı.
