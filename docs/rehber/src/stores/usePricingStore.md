# `src/stores/usePricingStore.ts` + `src/hooks/usePricing.ts`

> **Faz:** 13 (frontend 13.9) · **Doğrulama:** `npm run verify:pricing` → *"Katalog deposu"*

---

## 1. Ne tutar?

Backend fiyat kataloğunun **tek kopyası** ve kime ait olduğu (`loadedFor`: kullanıcı kimliği
ya da `'guest'`).

## 2. Kurallar

| Kural | Neden |
|---|---|
| Misafir `/public/plans`, kullanıcı `/pricing` okur | İlk yayın indirimi kişiye özel |
| Kimlik değişince katalog yeniden istenir | Giriş yapan yeni üye %60'lı fiyatını görmeli; çıkış yapınca misafir fiyatı |
| Başka kimliğin kataloğu ekranda **kalmaz** | Misafir fiyatı "sizin fiyatınız" gibi görünmesin |
| Yalnızca en son isteğin yanıtı yazılır | Yavaş misafir yanıtı, arada giriş yapan kullanıcının kataloğunu ezmesin |
| Hata → `status: 'error'`, katalog uydurulmaz | Sayı yoksa sayı yok: "gösterilemiyor" + "tekrar dene" |
| `force` her zaman tazeler | Ödeme sayfası; ilk yayın indirimi başka sekmede kullanılmış olabilir |

## 3. `usePricing()` kancası

```tsx
const { catalog, status, reload } = usePricing();           // fiyat sayfası, paywall
const { catalog } = usePricing({ force: true });             // ödeme sayfası
const percent = useFirstPublishPercent();                    // pazarlama metinleri
```

Bileşen yalnızca kendi kimliğine ait kataloğu görür (`loadedFor === key`). Böylece giriş
anında bir kare bile yanlış fiyat çizilmez.

## 4. Kim tazeler?

- `CheckoutPage` her açılışta (`force`).
- `PaymentReturnPage` sipariş `paid` olunca: ilk yayın indirimi bitti.
- `useCheckoutStore`, backend 403 `PAYMENT_METHOD_DISABLED` döndüğünde: yöntem sayfa açıkken
  kapatılmış, düğmeler artık yanlış.
