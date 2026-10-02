# `src/utils/iban.ts` — IBAN yardımcıları

> **Kod dosyası:** `davetkart-frontent/src/utils/iban.ts`
> **Bu kılavuz:** Faz 10, adım FE 10.19 · **Karar:** **K105** (IBAN her kayıtta doğrulanır)
> **Birlikte değişenler:** `components/create/DetailsFormStep.tsx` (anlık uyarı) ·
> `locales/{tr,en}/errors.json` (`validation.rules.iban`) · `scripts/verify-payment.ts` ·
> `scripts/verify-error-contract.ts`
> **Backend:** `App\Support\Iban` (backend 10.62) · `invitation.iban` → `iban` kuralı

---

## 1. İki doğrulama, iki soru

| Fonksiyon | Nerede | Kural |
|---|---|---|
| `isValidTrIban` | Havale ödemesi (DavetKart'ın **kendi** hesabı) | Yalnızca TR, 26 karakter, mod-97 |
| 🆕 `isValidIban` | Davetiyedeki hediye IBAN'ı (çiftin hesabı) | Herhangi bir ülke; TR ise 26 karakter; mod-97 |

İkincisi yurt dışındaki bir akrabanın IBAN'ını da kabul ediyor. İkisi aynı sağlama toplamını
(`passesMod97`) paylaşıyor.

## 2. 🔴 Backend'le birebir aynı kural

Backend IBAN'ı **her kayıtta** denetliyor (K105). Editör geçerli dediği bir IBAN'ı backend
reddederse kullanıcı neden kaydedilmediğini anlayamaz; tersi olursa uyarı boşuna çıkar. Bu yüzden
`verify:payment`'teki *"IBAN (davetiye, backend ile aynı kural)"* bölümü backend'in
`tests/Unit/IbanTest.php`'siyle **aynı 14 vakayı** sınıyor. Kurallardan biri değişirse iki
taraftaki testlerden biri kırılır.

Vakaların ikisi sağlama toplamı **doğru** olacak şekilde hesaplandı (`TR23000610051978645784132`:
25 karakter, `DE1312345`: çok kısa). Uzunluk ve biçim kontrolleri ancak bu vakalarla tek başlarına
sınanabiliyor (mutasyonla doğrulandı).

## 3. Editördeki uyarı (`DetailsFormStep`)

Otomatik kaydetme hatayı sessizce işaretliyor (`saveState: 'error'`), toast göstermiyor. IBAN
yarım yazılmışken her kayıt 422 alıyor ve **diğer alanlar da** o kayıtta yazılmıyor (kararın bilinen
bedeli). Alanın altındaki uyarı bunu kullanıcıya söylüyor:

> *IBAN geçerli görünmüyor. Lütfen kontrol edin; düzeltilene kadar değişiklikleriniz kaydedilmez.*

- Boş IBAN için uyarı yok: hediye modülü kapalıyken IBAN zorunlu değil.
- `aria-invalid` ve `aria-describedby` ile ekran okuyucuya bağlı.
- Değer **yazıldığı gibi** gönderiliyor; backend normalize edip geri yazmıyor (imleç kaçmasın).

## 4. Hata metni

Backend reddederse hata zarfı `{"invitation.iban":[{"rule":"iban"}]}`. Metin
`validation.rules.iban`'dan geliyor: *"IBAN geçerli bir IBAN değil. Hesap numarasını kontrol
edin."* `verify:errors` iki dilde de anahtarın varlığını sınıyor. Türkçe metin silinince
*"iban kuralı → [tr] çevirisi yok"* kırılıyor.
