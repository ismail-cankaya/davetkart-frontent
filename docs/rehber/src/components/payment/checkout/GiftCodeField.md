# `GiftCodeField.tsx` ve `FreeActivationPanel.tsx` — hediye kodu arayüzü

> **Faz:** 11, adım 11.15 · **Dizin:** `src/components/payment/checkout/`
> Durum: `useCheckoutStore` · Metinler: `translation.json` → `giftCode.*` (10 dil)

---

## 1. `GiftCodeField`

"Hediye kodum var" açılır alanı. Kapalı başlar; kod zaten uygulanmışsa (plan değişti, sayfaya
geri dönüldü) açık başlar.

| Durum | Görünüm |
|---|---|
| Boş | Kod kutusu + **Uygula** (kutu boşken pasif) |
| Kontrol | Düğmede dönen simge, "Kontrol ediliyor…"; kutu kilitli |
| Hata | Kutu kırmızı çerçeve, altında metin (`role="alert"`) |
| Uygulandı | Yeşil kart: kod, "₺199,50 indirim uygulandı", **Kaldır**; başlıkta "Uygulandı" rozeti |

Bileşen yalnızca **yazar ve gösterir**: önizleme, hata ve uygulanan kod store'dadır (CLAUDE.md
§3). Taslak metin (`draft`) yerel state'te, çünkü yalnızca bu bileşen onu okur.

Erişilebilirlik: açılır düğmede `aria-expanded` + `aria-controls`, kutuda `aria-invalid` +
`aria-describedby` (hata metnine bağlı), gizli `<label>`.

Kutu 64 karakterle sınırlı (backend `max:64`). Büyük harf **yalnızca görüntüde**
(`uppercase`): gönderilen değer yazıldığı gibidir, normalleştirmeyi backend yapar (tek yerde).

## 2. Neden metin hatası toast değil?

Toast birkaç saniye sonra kaybolur. Kullanıcı kodu düzeltirken neyin yanlış olduğunu
görmeye devam etmeli. Checkout sırasında gelen kod hatası ise **ikisini** birden yapar: toast
(düğmeye bastı, bir şey oldu) ve alan (önizleme düştü, sebep burada).

## 3. i18n

Ödeme sayfasının geri kalanı bugün Türkçe sabit metin; yeni metinler Faz 11 talimatı gereği
`translation.json`'a 10 dilde yazıldı (`giftCode.*`, 15 anahtar). Sonuç: Türkçe dışı bir dilde
sayfanın yalnızca hediye kodu bölümü o dilde görünür. Sayfanın tamamının çevirisi ayrı bir iş.

## 4. `FreeActivationPanel`

Toplam **0** olduğunda yöntem seçici ve kart formu yerine çizilir.

```
[Bu paket size hediye]  (koyu yeşil kart)
[ ] Kullanım Koşulları…
[ Ücretsiz etkinleştir ]
```

- Aynı `startCardCheckout`'u çağırır. Bedava kararını **backend** verir (K107): tutar 0'ı
  görür, siparişi `paid` açar.
- Sözleşme onayı yine zorunlu: bedava da olsa bir hizmet sözleşmesi kuruluyor.
- `redirectUrl` uygulama içiyse (`/odeme/basarili…`) `navigate()` ile, sayfa yenilenmeden
  gidilir.
- 🔴 Yanıt `paid` değilse (kod arada değişti) sağlayıcıya **gidilmez**: kullanıcı bedava
  bekliyordu, kart sayfası onu şaşırtırdı. Toast + önizleme yenilenir, ekran gerçek toplama
  döner. Açılan `pending` sipariş 30 dakika sonra `expired` olur ve kodu geri verir.

## 5. Değişen komşular

| Dosya | Değişiklik |
|---|---|
| `OrderSummary.tsx` | Önizleme varsa bedel/indirim/toplam önizlemeden (kuruş); indirim satırı ve toplam animasyonla girer |
| `CardPaymentForm.tsx` | `amount` (TL) → `amountMinor` (kuruş); düğme "₺199,50 Öde" |
| `PaymentMethodSelector.tsx` | Kod varken havale kapalı, açıklaması "Hediye kodu yalnızca kartla ödemede geçerli" |
| `CheckoutPage.tsx` | Yerleşim ve iki effect (`CheckoutPage.md` §Faz 11) |

`PaymentReturnPage.tsx` değişmedi: hediye siparişi `paid` olduğu için "Ödemeniz onaylandı"
ekranı çiziliyor. Hediyeye özel bir metin ("Planınız hediye olarak tanımlandı") açık soru.

---

## 🆕 Faz 13

"₺X indirim uygulandı" satırı artık `giftDiscountMinor` gösteriyor, yani kodun **kendi**
payını. `discountMinor` toplam indirim oldu (ilk yayın + kod). Onu göstermek, %50'lik bir
kodu ₺319,20 indirim yapmış gibi gösterirdi.
