# `src/services/pricing.ts` — fiyat kataloğu servisi

> **Kod dosyası:** `davetkart-frontent/src/services/pricing.ts`
> **Faz:** 13 (frontend 13.9) · **Backend:** `PricingController` (13.6, K128)
> **Doğrulama:** `npm run verify:endpoints` → *"Fiyat kataloğu uçları (Faz 13)"*

---

## 1. Neden var? "Frontend'de fiyat yok"

Faz 12'ye kadar fiyat **iki yerde** yazılıydı: backend `config/davetkart.php` (tahsil edilen)
ve frontend `data.ts` (gösterilen). İkisi elle aynı tutuluyordu. Üstelik `/pricing` sayfası
üçüncü bir kopya taşıyordu (Zarif/Prestij/İhtişam, 349–949 ₺) ve o kopya hiç satılmayan
paketleri gösteriyordu.

İndirim (ilk yayın %60, kampanya) gelince bu ikilik bir hata fabrikasına dönerdi.
Frontend %60'ı kendisi hesaplasaydı yuvarlama, kampanya bitişi ve "ilk yayın mı?" sorusu
iki tarafta ayrı ayrı cevaplanırdı. Faz 13'ün kuralı:

> **Sayıyı hesaplayan, onu tahsil edendir.** Frontend yalnızca gösterir.

## 2. İki uç

| Metot | Uç | Kim | Ne içerir |
|---|---|---|---|
| `publicCatalog()` | `GET /public/plans` | Misafir | Liste fiyatı + çalışan kampanya |
| `myCatalog()` | `GET /pricing` | Oturumlu | + ilk yayın indirimi (uygunsa) |

Hangisinin çağrılacağına `usePricingStore` karar verir (kimliğe göre).

## 3. Biçim doğrulaması — sayı hesaplamaz, sınar

`isPlanPrice()` her planda şunu sınar:

```ts
priceMinor − discountMinor === totalMinor   // döküm tutarlı mı?
```

Bu bir hesap değil, bir **tutarlılık denetimi**. Bozuk bir yanıt "399 ₺ − 239,40 ₺ = 99 ₺"
gibi bir ekran çizerdi; reddedilir ve ekranda "fiyat gösterilemiyor" görünür. Kuruş alanları
tam sayı olmalı (kesirli sayı = birim karışıklığı).

Bilinmeyen bir ödeme yöntemi (backend yarın `wallet` eklerse) yanıtı **reddetmez**,
listeden **düşer**. Tanımadığımız bir düğmeyi çizemeyiz ama geri kalan katalog çalışır.

`isPlanPrice` dışa açık, çünkü hediye kodu önizlemesi de bir `PlanPrice`
(`services/payments.ts` → `isGiftCodePreview`).

## 4. Havale hesabı da buradan (K135)

Eskiden `services/bankTransfer.ts` hesabı `VITE_BANK_TRANSFER_*` ortam değişkenlerinden
okuyordu. Bu değerler derlemeye gömülüyordu, yani hesabı değiştirmek frontend'i yeniden
derlemek demekti. Artık hesap backend `.env`'inde duruyor ve katalogla
(`bankTransfer`) geliyor, yalnızca havale açıkken. `bankTransfer.ts`'te yalnızca referans
kodu üreticisi kaldı.
