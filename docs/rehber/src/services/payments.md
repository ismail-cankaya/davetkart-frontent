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

---

## 🆕 Faz 11: hediye kodu

| Metot | Uç | Gövde |
|---|---|---|
| `checkoutForInvitation(id, tier, giftCode?)` | `POST /invitations/{id}/checkout` | `{tier}` ya da `{tier, giftCode}` |
| `checkoutForAccount(tier, giftCode?)` | `POST /payments/checkout` | aynı |
| 🆕 `previewGiftCode(code, tier)` | `POST /gift-codes/preview` | `{code, tier}` |

### `checkoutBody()`

```ts
checkoutBody('gold', '  DUGUN2026 ')  // { tier: 'gold', giftCode: 'DUGUN2026' }
checkoutBody('gold', '   ')           // { tier: 'gold' }   ← anahtar HİÇ yok
```

Kod yoksa ya da yalnızca boşluksa anahtar gönderilmez; gövde kodsuz ödemeyle bayt bayt aynı
kalır. 🔴 İndirim, tutar ve toplam **asla** gövdeye girmez: fiyat gibi indirimi de backend
hesaplar (M6). `verify:endpoints` gövdede `discount`, `discountMinor`, `amount`,
`totalMinor`… arar.

### 🔴 Checkout artık her zaman `pending` dönmüyor

Kod tutarı **0**'a indirirse backend siparişi sağlayıcıya gitmeden `paid` açar (backend K107)
ve `redirectUrl` doğrudan `/odeme/basarili?order=…` olur. Dosyanın başındaki "checkout ödeme
değildir" kuralının **tek** istisnası bu. İstemci yine kendi hesabına güvenmez; "bedava oldu"
bilgisini yanıttaki `status`'tan okur.

### Önizleme yanıtı doğrulanır

`isGiftCodePreview()` dört para alanının **tam sayı** olduğunu denetler. Bir gün backend TL
göndermeye başlasa (`299.25`) yanıt reddedilir; ekranda 100 kat yanlış tutar görünmez.
`verify:endpoints` → "önizleme: kesirli kuruş alanı reddediliyor".

---

## 🆕 Faz 12 (12.10): `checkout` alanı ve `checkoutActionOf()`

Backend checkout yanıtına `checkout` alanı ekledi (K119):

```ts
type CheckoutAction =
  | { type: 'redirect'; url: string }                                  // Fake, hediye siparişi
  | { type: 'form'; url: string; fields: Record<string, string> };     // Shopier
```

İki yeni dışa açık fonksiyon:

| Fonksiyon | Ne yapar |
|---|---|
| `isCheckoutAction(value)` | Biçim bekçisi. `form`'da en az bir alan olmalı ve **her değer metin** olmalı |
| `checkoutActionOf(result)` | Önce `checkout`, yoksa eski `redirectUrl`, ikisi de yoksa `null` |

### Neden `toCheckoutResult` artık `checkout`'u da sınıyor?

Bu fonksiyon zaten "yanıt beklenen biçimde mi" sorusunu soruyordu (`orderId` metin
mi). Yeni alan **geldiyse** aynı soruya tabi: yarım bir form (alanı eksik ya da değeri
sayı) sağlayıcıya gönderilirse kullanıcı Shopier'de anlamsız bir "imza hatası" görür.
Hata kaynağına yakın yakalansın: istek atıldığı anda, açık bir mesajla.

### Neden eski `redirectUrl` hâlâ okunuyor?

İki depo ayrı yayınlanıyor. Backend Faz 12'ye geçmeden frontend yayınlanırsa yanıtta
`checkout` olmaz; `redirectUrl` geri dönüşü sayesinde Fake akışı çalışmaya devam eder.
Ters yön de güvenli: backend `redirectUrl`'i `type=redirect` iken hâlâ gönderiyor.
Sözleşme değişikliğinde **iki yönlü uyumluluk** penceresi bırakmak, iki deponun aynı
dakikada yayınlanması zorunluluğunu kaldırır.

`verify:payment`'a 10 kontrol eklendi (`Ödeme sayfasına gidiş (Faz 12)` bölümü, 12.11 commit'inde: betik iki adımın kodunu birlikte sınıyor).

---

## 🆕 Faz 13

- `isGiftCodePreview` = `isPlanPrice` (döküm tutarlılığı dahil) + `benefit`,
  `giftDiscountMinor`, `currency`.
- Kapalı yöntem 403 `PAYMENT_METHOD_DISABLED` döner. `useCheckoutStore` bunu görünce fiyat
  kataloğunu tazeler.
