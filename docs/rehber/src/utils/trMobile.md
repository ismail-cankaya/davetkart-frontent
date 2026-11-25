# `src/utils/trMobile.ts`

> **Faz:** 19 ortak düzeltme — Hat A `E5` (SEC-10 D2) · **Karar:** K262

`normalizeTrMobile(raw)` → `"05XXXXXXXXX"` ya da `null`.

1. Boşluk, tire, parantez ve nokta atılır (`0532 123-45 67`, `(0532) 123 45 67`).
2. `+90` ya da `90` öneki, ardından `5` ve 9 hane geliyorsa `0`'a çevrilir.
3. Sonuç `^05\d{9}$` değilse `null`: sabit hat (`0212…`), başında `0` olmayan 10 hane, harf.

Backend `StoreCheckoutRequest::prepareForValidation` + `regex:/\A05\d{9}\z/` ile **aynı kural**; ikisi ayrışırsa form geçer ama
backend 422 verir. Test: `verify:payment` → "Alıcı telefonu"; backend `CheckoutBuyerPhoneTest`.