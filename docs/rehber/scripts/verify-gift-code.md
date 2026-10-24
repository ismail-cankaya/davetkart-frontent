# `scripts/verify-gift-code.ts` — `npm run verify:gift`

> **Faz:** 11 · `npm run verify` zincirinde (`verify:payment`'tan sonra)

`useCheckoutStore`'un hediye kodu durumunu **gerçek** servis ve gerçek axios örneğiyle sınar;
yalnızca taşıma katmanı (adapter) taklittir. Taklit URL'e ve gövdeye göre yanıt seçer, istenirse
geciktirir (yarış denemesi için).

| Grup | Ne sınanıyor |
|---|---|
| Uygula / kaldır | kırpma, önizleme gövdesi `{code, tier}`, kaldırma |
| Hatalı kod | önizleme yok, metin alanda, **önizlemesiz kod checkout'a gitmez** |
| Checkout | geçerli kod gövdede, `paid` yanıt, tükenen kod (422) önizlemeyi düşürür, 502 düşürmez |
| Havale | kod uygulanınca karta geçiş, kod varken havale kapalı, kaldırınca açık |
| Plan ve yarış | plan değişince kod kalır ve yeniden hesaplanır, geç gelen eski yanıt yenisini ezmez, kaldırılan kod geri gelmez |

Mutasyon kanıtı: `useCheckoutStore.md` §3.

```powershell
npm run verify:gift
```
