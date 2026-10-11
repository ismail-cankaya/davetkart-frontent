# `src/pages/PaymentReturnPage.tsx` — Ödeme dönüş sayfası (`/odeme/basarili`, `/odeme/hata`)

> **Kod dosyası:** `davetkart-frontent/src/pages/PaymentReturnPage.tsx`
> **Faz:** 10 — Dilim C, adım 10.27
> **Birlikte gelenler:** `utils/paymentReturn.ts` (karar mantığı) · `App.tsx` (iki rota) ·
> `scripts/verify-payment.ts` (*"Ödeme dönüşü"* bölümleri)
> **Backend:** `GET /api/orders/{id}` (backend 10.23) · `config/payment.php` → `return_urls`
> **Önce oku:** [`CheckoutPage.md`](CheckoutPage.md) · [`services/payments.md`](../services/payments.md)

---

## 1. Çözdüğü sorun: dönüş adresi yoktu

Backend'in sağlayıcıya verdiği dönüş adresleri Faz 7'den beri yazılı:

```php
// config/payment.php
'return_urls' => [
    'success' => env('PAYMENT_SUCCESS_URL', '/odeme/basarili'),
    'failure' => env('PAYMENT_FAILURE_URL', '/odeme/hata'),
],
```

`FakeGateway` bugün kullanıcıyı `/odeme/basarili?order=01j…`'ye gönderiyor. Ama
frontend'de bu rota **yoktu**. `App.tsx`'teki `*` kuralı kullanıcıyı sessizce ana
sayfaya atıyordu. Kullanıcı ödedi ve hiçbir şey görmedi (gözden geçirme raporu §2.1).

## 2. 🔴 Adres bir ipucu, gerçek değil

| Olay | Kim yapar | Ne zaman |
|---|---|---|
| Kullanıcıyı `/odeme/basarili`'ye göndermek | Sağlayıcı, **tarayıcı** üzerinden | Ödeme ekranından çıkınca |
| Siparişi `paid` yapmak | Sağlayıcının **webhook**'u, sunucudan sunucuya | Dönüşten önce, aynı anda ya da **sonra** |

İkisi birbirinden bağımsız. *"Başarı adresine geldiyse ödenmiştir"* demek iki şekilde
yanlış olabilir: webhook henüz gelmemiş olabilir, ya da biri adresi elle yazmış olabilir.
Sayfa bu yüzden adrese değil, **siparişin backend'deki durumuna** bakar ve onu
birkaç saniye yoklar.

## 3. Karar mantığı ayrı dosyada: `utils/paymentReturn.ts`

Sayfa yalnızca **yoklar ve çizer**. *Neyi* çizeceğine saf fonksiyonlar karar verir:

| Fonksiyon | Soru |
|---|---|
| `shouldKeepPolling(status, kind, attempts)` | Bir daha sorayım mı? |
| `returnViewFor(status, { kind, settled })` | Hangi ekranı göstereyim? |
| `orderIdFrom(params)` | `?order=` ne? |

Saf oldukları için `verify:payment` onları tarayıcısız sınıyor. Sayfanın içine
gömülselerdi yalnızca elle denenebilirlerdi.

### 3.1 Yoklama

```
2 sn aralıkla, en fazla 15 okuma (30 sn)
```

| Durum | Başarı adresi | Hata adresi |
|---|---|---|
| `pending` | devam | **tek okuma**: sağlayıcı *"tamamlanmadı"* dedi |
| `expired` | devam (K89: geç ödeme `paid` yapabilir) | tek okuma |
| `paid` · `failed` · `refunded` | dur (son durum) | dur |

### 3.2 🔴 Ekran eşlemesi `Record<OrderStatus, …>`

```ts
const VIEW_BY_STATUS: Record<OrderStatus, (ctx: ViewContext) => ReturnView> = {
  paid: …, pending: …, expired: …, failed: …, refunded: …,
};
```

`types.md` §10'un notu buradan karşılandı: `switch` + `default` yazılsaydı, backend'in
yarın ekleyeceği bir durum sessizce `default`'a düşerdi. `Record` eksik bir kolu
**derleme hatasına** çeviriyor. 10.27'de denendi: `expired` kolu silinince `tsc`
*"Property 'expired' is missing"* diye durdu.

| Durum | Yoklama sürerken | Yoklama bitti | Hata adresi |
|---|---|---|---|
| `paid` | onaylandı | onaylandı | onaylandı |
| `pending` | doğrulanıyor | **gecikti** | tamamlanamadı |
| `expired` | doğrulanıyor (erken hüküm yok) | süresi doldu | süresi doldu |
| `failed` | tamamlanamadı | tamamlanamadı | tamamlanamadı |
| `refunded` | iade edildi | iade edildi | iade edildi |

**En önemli satır `pending` + yoklama bitti:** ekran *"onay gecikti"* der, *"ödendi"*
demez. `verify:payment` bunu genel bir kuralla da sınıyor: ödenmemiş hiçbir durum,
hiçbir bağlamda *"onaylandı"* göstermez.

## 4. 🔴 Ödeme yayınlamaz (K67)

*"Onaylandı"* ekranının metni: *"Davetiyenizi artık yayınlayabilirsiniz; ödeme davetiyeyi
kendiliğinden yayınlamaz, son adım sizde."* Düğme *"Panele Git ve Yayınla"*. Ekran
*"yayınlandı"* demez, çünkü backend yayını ayrı bir istekle (`POST …/publish`) yapar ve
o isteğin plan kontrolünü (402) ödemeden bağımsız olarak kendisi yapar.

## 5. 404: "bulamadık"

Başkasının siparişi ile var olmayan sipariş backend'de **aynı 404**'ü döner (H7).
Sayfa ikisini ayırmaz: `RESOURCE_NOT_FOUND` → *"Sipariş bulunamadı"*. `?order=`
hiç yoksa da aynı ekran. Diğer hatalar (ağ, 5xx) → *"Durumu okuyamadık"* + *"Tekrar Dene"*.

## 6. Yeniden deneme

`failed` ve `expired` ekranlarında *"Tekrar Dene"*, siparişin kendi `tier` ve
`invitationId`'siyle ödeme sayfasına döner (`checkoutHref`). Yeni bir sipariş açılır;
eskisi olduğu gibi kalır (muhasebe kaydı).

## 7. Oturum

İki rota da `ProtectedRoute` içinde: `GET /orders/{id}` kimlik ister. Sağlayıcıdan
dönerken oturum düşmüşse (ör. 30 günlük token süresi dolmuş, 10.10) kullanıcı girişe
gider. `ProtectedRoute` sorgu dizesini taşıdığı için girişten sonra `?order=` ile
aynı sayfaya döner.

## 8. Elle doğrulama (F8'e yeni senaryo)

```
1. Standart ile bir davetiye oluştur → Yayınla → 402 → Ödemeye Geç → Kart
2. FakeGateway'in redirectUrl'i: /odeme/basarili?order=<id>
   → "Ödemeniz doğrulanıyor" (webhook gelmediği için)
3. 30 sn sonra → "Onay biraz gecikti"
4. Webhook'u elle gönder (backend docs/rehber/fazlar/FAZ-7-ELLE-DOGRULAMA.md §12,
   imzalı Invoke-WebRequest) → "Tekrar Kontrol Et"
   → "Ödemeniz onaylandı" + ödeme zamanı
5. Adres çubuğunda order= değerini değiştir → "Sipariş bulunamadı"
6. /odeme/hata?order=<pending id> → "Ödeme tamamlanamadı" (yoklama yok)
```

## 9. 🆕 Hitap: "siz" (FE 10.14)

İlk sürüm (FE 10.11) kullanıcıya *"sen"* diye hitap ediyordu (*"Ödemen onaylandı"*).
Arayüzün geri kalanı *"siz"* diyor: *"Hesabınız yok mu?"* (`LoginPage`), *"Ödediğiniz plan
hakkı"* (`DashboardPage`), *"Hangi paketi almak istediğinizi"* (`CheckoutPage`). Aynı
uygulamada iki hitap, kullanıcıya iki ayrı ürün izlenimi verir. Bütün metinler *"siz"*e
çevrildi; mantık değişmedi.

Backend'in parola sıfırlama maili de aynı hitapla yazıldı (*"Hesabınız için bir parola
sıfırlama isteği aldık"*).
