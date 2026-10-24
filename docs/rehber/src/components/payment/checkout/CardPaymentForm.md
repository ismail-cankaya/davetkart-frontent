# `src/components/payment/checkout/CardPaymentForm.tsx`

> **Faz:** 12 — adım 12.12 (yeniden yazım) · **Backend:** K117–K119

## 1. Ne değişti?

| Faz 10–11 | Faz 12 |
|---|---|
| Kart numarası, isim, son kullanma, CVC alanları + canlı kart önizlemesi | **Hiç kart alanı yok** |
| "399 ₺ Öde" | Tutar kartın üstünde; düğme **"Güvenli ödeme sayfasına geç"** |
| `window.location.href = redirectUrl` | `goToProvider(result)`: imzalı formu Shopier'e POST eder |

## 2. 🔴 Neden alanları tamamen kaldırdık?

Eski alanlar hiçbir yere gönderilmiyordu (bileşenin yerel state'inde doğup ölüyordu).
Shopier'in klasik akışında kart **Shopier'in sayfasında** yazılır. Bizim sayfamızda
kart istemeye devam etmek iki yanlış yaratırdı:

1. **Kullanıcı kartını iki kez yazardı** (bizde ve Shopier'de) ve bizdekinin boşa
   gittiğini anlamazdı. Daha kötüsü: bizim sitemizde kart istemek, oltalama sitelerinin
   de yaptığı şeydir; kullanıcıya yanlış bir alışkanlık öğretir.
2. **PCI DSS kapsamı.** Kart verisini *gösteren* bir form bile, o sayfanın betiklerini
   (bir analitik betiği, ele geçirilmiş bir npm paketi) karta erişebilir kılar. Alan
   yoksa erişilecek veri de yok. Kart verisine hiç dokunmayan bir site, PCI DSS'in en
   hafif öz değerlendirmesiyle (SAQ A) yetinebilir.

`CardPreview`, `CardBrandMark` ve `utils/paymentCard.ts` artık hiçbir yerden çağrılmıyor.
Silmek ayrı bir karar: `verify:payment` hâlâ `paymentCard`'ın saf fonksiyonlarını
sınıyor ve bir gün tokenizasyonlu bir sağlayıcıya geçilirse geri gelebilirler.
(Ders 26'ya göre bu bir borç: ya kullan ya sil.)

## 3. Akış

```
submit → onay kutusu? → startCardCheckout (POST …/checkout, sipariş 'pending')
       → goToProvider(result)
            form     → gizli <form> Shopier'e POST → sayfa değişir
            redirect → adrese git
            yok      → "ödeme sayfası açılamadı" toast'u + ekranda duran not
```

## 4. Metinler artık çeviri anahtarı

Bu dosyanın yeni metinleri `providerCheckout.*` anahtarlarında (12.14, 10 dil). Eski
Türkçe sabit metinler (bekleyen sipariş notu, toast) yeniden yazılırken anahtara taşındı.
