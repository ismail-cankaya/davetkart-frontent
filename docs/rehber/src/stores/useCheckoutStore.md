# `src/stores/useCheckoutStore.ts` — ödeme sayfasının durumu

> **Doğrulama:** `npm run verify:gift` (`scripts/verify-gift-code.ts`, 25 kontrol)
> Bu kılavuz Faz 11'de açıldı; Faz 11'in eklediği hediye kodu durumu anlatılıyor.

---

## 1. Yeni alanlar

| Alan | Ne |
|---|---|
| `giftCode` | Kullanıcının uyguladığı kod (kırpılmış, yazıldığı hâliyle) |
| `giftPreview` | Son başarılı önizleme. **`null` iken checkout'a kod gitmez** |
| `isCheckingGiftCode` | Önizleme isteği sürüyor |
| `giftCodeError` | Çizilmeye hazır hata metni (`toDisplayError`) |

| Eylem | Ne |
|---|---|
| `applyGiftCode(code, tier)` | Önizler; geçerliyse uygular. Hata **fırlatmaz**, metni `giftCodeError`'a yazar |
| `refreshGiftCode(tier)` | Plan değişti: aynı kodu yeniden önizler |
| `removeGiftCode()` | Kod, önizleme ve hata gider; uçuştaki önizleme iptal sayılır |
| `reset({ keepGiftCode })` | Plan değişiminde kod kalır, eski önizleme düşer |

## 2. Neden store'da, bileşende değil?

Kodu üç yer okuyor: `GiftCodeField` (yazar), `CardPaymentForm` ve `FreeActivationPanel`
(`startCardCheckout` üzerinden gönderir), `PaymentMethodSelector` (havaleyi kapatır). Bileşende
tutulsaydı prop olarak üç bileşene taşınırdı (CLAUDE.md §1: prop drilling yasak). Kart
bilgisinin aksine kod bir sır değil: kullanıcı onu zaten yazdı.

## 3. 🔴 Dört kural (her biri bir mutasyonla sınandı)

| Kural | Neden | Bozulursa |
|---|---|---|
| Önizlemesi olmayan kod checkout'a **gitmez** | Hatalı kod sessizce gönderilseydi kullanıcı ekrandaki (indirimsiz) fiyata "Öde" der, backend 422 dönerdi | `verify:gift` 1 kırmızı |
| Checkout `GIFT_CODE_*` dönerse önizleme **düşer**, sebep alana yazılır | Önizleme ile checkout arasında kod tükenebilir (önizleme bir söz değil). Eski önizleme yanlış bir toplam göstermeye devam ederdi | 2 kırmızı |
| Kod varken havale **seçilemez**, kod uygulanınca karta geçilir | Havalede sipariş açılmıyor, kod ayrılamaz (`CheckoutPage.md` §Faz 11) | 1 kırmızı |
| Yalnızca **son** önizleme isteği yazılır | Kullanıcı art arda basar ya da plan değişir: yavaş gelen eski yanıt yeni planın toplamını ezerdi | 2 kırmızı |

Son kural modül düzeyinde bir sayaçla (`latestPreview`) kuruldu: her istek bir numara alır,
yanıt geldiğinde numara hâlâ en sonuncuysa yazılır. `removeGiftCode()` ve tam `reset()` sayacı
artırır; kaldırılan kodun geç gelen önizlemesi onu geri getiremez.

Sağlayıcı hatası (502) önizlemeyi **silmez**: kod hâlâ geçerli, yalnızca ödeme sağlayıcısı
düştü.

## 4. Neden `applyGiftCode` hata fırlatmıyor?

Kod hatası beklenen bir kullanıcı hatası (yanlış yazım), olağanüstü bir durum değil. Metin
toast'ta değil alanın altında durmalı: kullanıcı kodu düzeltirken neyin yanlış olduğunu görmeye
devam eder. Dönüş değeri (`true`/`false`) çağırana yeter.

---

## 🆕 Faz 12 (12.11): `goToProvider(result)`

```ts
goToProvider: (result) => {
  const action = checkoutActionOf(result);      // checkout alanı, yoksa eski redirectUrl
  if (!action) return false;                     // sipariş açıldı, sağlayıcı sayfası yok
  if (action.type === 'form') submitProviderForm(action);   // Shopier: imzalı form POST
  else window.location.assign(action.url);                  // Fake: adrese git
  return true;
}
```

**Neden store'da, bileşende değil?** "Adres mi, form mu?" kararı bir **akış** kararı;
kart formu bunu bilmek zorunda değil. Karar tek yerde durunca yeni bir gidiş türü
(ileride bir iframe, bir mobil uygulama yönlendirmesi) tek dosyada eklenir.

**`assign`, `href =` değil:** davranış aynı; `assign` bir **eylem** olduğunu çağrı
yerinde belli ediyor ve testte taklit edilebilir bir metot.

🔴 Kart bilgisi yine store'a girmiyor: Faz 12'de kart alanları tamamen kalktı (12.12).
