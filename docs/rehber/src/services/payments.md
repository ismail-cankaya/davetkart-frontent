# `src/services/payments.ts` — Ödeme servisi

> **Kod dosyası:** `davetkart-frontent/src/services/payments.ts`
> **İlk yazım:** Faz 7 (checkout uçları) · **Kılavuz:** Faz 10, adım 10.26 (K18 borcu, sipariş okuma uçlarıyla birlikte)
> **Backend:** `PaymentController` (checkout) · `OrderController` (okuma, backend 10.23)
> **Doğrulama:** `npm run verify:endpoints` → *"Ödeme uçları"*, *"Sipariş okuma uçları (Faz 10)"*

---

## 1. Dört uç

| Metot | Uç | Döndürdüğü | Ne zaman |
|---|---|---|---|
| `checkoutForInvitation(id, tier)` | `POST /invitations/{id}/checkout` | `CheckoutResult` (201, `pending`) | Kart ödemesi, tek davetiye |
| `checkoutForAccount(tier)` | `POST /payments/checkout` | `CheckoutResult` | Paket (bugün arayüzde yok, 10.58) |
| 🆕 `getOrder(orderId)` | `GET /orders/{id}` | `OrderRecord` | Ödeme dönüş sayfası (10.27) yoklar |
| 🆕 `listOrders()` | `GET /orders` | `OrderRecord[]` | İleride *"siparişlerim"* |

## 2. 🔴 Checkout ödeme değildir

Dosyanın en önemli cümlesi başındaki yorumda: checkout bir **sipariş niyeti**
açar (`status: 'pending'`). Ödeme, kullanıcı `redirectUrl`'e gidip sağlayıcıda
tamamlayınca ve sağlayıcının **webhook**'u backend'e ulaşınca gerçekleşir.

Bu yüzden okuma uçları gerekti. Sağlayıcıdan dönen kullanıcıya *"ödendi"* demenin
tek dürüst yolu, siparişin **şu anki** durumunu backend'e sormak.

## 3. `getOrder`: kimlik kodlanıyor

```ts
api.get(`/orders/${encodeURIComponent(orderId)}`)
```

Kimlik URL'nin sorgu dizesinden geliyor (`/odeme/basarili?order=01j…`), yani
kullanıcının adres çubuğuna yazabileceği bir değer. Kodlanmadan yola yazılsaydı
`?order=../auth/me` isteği `GET /api/orders/../auth/me`'ye, tarayıcı normalleştirince
`GET /api/auth/me`'ye giderdi. Burada zararsız (kendi bilgisi) ama *"sorgu dizesi
yola yazılmaz, kodlanır"* kuralının istisnası olmamalı.

`verify:endpoints` bunu sınıyor: `getOrder('../auth/me')` → `GET /orders/..%2Fauth%2Fme`.
**Mutasyon (10.26'da denendi):** `encodeURIComponent` kaldırılınca denetim
*"GET /orders/../auth/me (beklenen: …%2F…)"* diye kırılıyor.

## 4. Şekil denetimi

```ts
function isOrderRecord(body: unknown): body is OrderRecord {
  return typeof body === 'object' && body !== null
    && typeof body.orderId === 'string' && typeof body.status === 'string';
}
```

`toCheckoutResult` ile aynı desen: yanıt beklenen şekilde değilse **hata fırlat**,
yanlış bir nesneyi sayfaya taşıma. En sık sebep zarfın (`{ data }`) açılmaması ya da
bir proxy'nin HTML hata sayfası döndürmesi. Denetim bilerek yalnızca iki alana
bakıyor: sayfanın karar vermek için okuduğu alanlar bunlar.

## 5. 404'ü ayırt etmeye çalışma

Başkasının siparişi ile var olmayan sipariş backend'de **aynı 404**'ü döner (H7).
Sayfa ikisini ayırt etmeye çalışmamalı: ikisi de *"bu siparişi bulamadık"*
demek. Ayırt edebilseydi, backend'in saklamaya çalıştığı bilgiyi (*"bu kimlik
var"*) frontend sızdırmış olurdu.

---

## 🆕 Faz 10 (backend 10.58 · K99): paket tek davetiyelik

`checkoutForAccount()` ve `POST /payments/checkout` değişmedi; değişen siparişin **ne açtığı**.
Davetiyesiz alınan sipariş artık hesabın bütün davetiyelerini açmıyor, ilk yayınlanan davetiyeye
bağlanıyor (backend `PublishEntitlementResolver.md` → *Faz 10*). Frontend'de yalnızca açıklamalar
güncellendi (`payments.ts`, `useCheckoutStore.ts`, `useSubscriptionStore.ts`). Fiyat sayfasında
*"bütün davetiyeleriniz"* diyen bir metin yoktu; değiştirilecek bir vaat çıkmadı.
