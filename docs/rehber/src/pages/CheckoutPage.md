# `src/pages/CheckoutPage.tsx` — Ödeme sayfası (`/odeme`)

> **Kod dosyası:** `davetkart-frontent/src/pages/CheckoutPage.tsx`
> **Durum:** Frontend tasarımı hazır · kart sağlayıcısı (Shopier ya da muadili) ve havale siparişi ucu **bağlı değil**
> **Birlikte gelenler:** `stores/useCheckoutStore.ts` · `components/payment/checkout/*` ·
> `components/ui/CopyField.tsx` · `services/bankTransfer.ts` · `utils/{iban,paymentCard,checkoutRoute,currency}.ts` ·
> `scripts/verify-payment.ts`
> **Değişenler:** `PaywallModal.tsx` (sipariş açmaz, sayfaya yönlendirir) · `useSubscriptionStore.ts`
> (checkout durumu çıktı) · `ProtectedRoute.tsx` (sorgu dizesini taşır) · `App.tsx` · `vite-env.d.ts` · `.env.example`

---

## 1. Akış

```
Yayınla → 402 → Plan duvarı (PaywallModal)
                  └─ "Ödemeye Geç" → /odeme?tier=gold&invitation=01J…
                                        ├─ Kart        → POST …/checkout → redirectUrl (sağlayıcı)
                                        └─ Havale/EFT  → hesap + tutar + referans → "Havaleyi Yaptım"
```

| Parça | Görevi |
|---|---|
| `PaywallModal` | **Hangi paket?** Sipariş açmaz; `checkoutHref()` ile sayfaya gider |
| `CheckoutPage` | Bağlamı URL'den okur (`parseCheckoutSearch`), düzeni kurar |
| `useCheckoutStore` | **Nasıl ödenecek?** Yöntem, sözleşme onayı, sipariş durumu, havale onayı |
| `CardPaymentForm` | Kart alanları (yerel state), canlı `CardPreview`, doğrulama |
| `BankTransferPanel` / `BankTransferPending` | Hesap bilgisi, kopyalama, adımlar / sonraki adım ekranı |
| `OrderSummary` | Paket, davetiye, toplam — fiyat yalnızca **gösterim** (M6) |

Bağlam store'da değil **URL'de** durur: yenileme ve yeni sekme aynı ekranı kurar.
Bu yüzden `ProtectedRoute` artık `pathname + search` saklıyor; aksi hâlde girişten
sonra `/odeme`'ye paketsiz dönülür ve sayfa "bağlantı geçersiz" derdi.

---

## 2. 🔴 Kart bilgisi hiçbir yere gitmez

Kart alanları `CardPaymentForm`'un **yerel** state'inde yaşar; store'a, URL'ye,
`localStorage`'a ya da API'mize yazılmaz. Kart numarasına dokunan her sunucu
PCI DSS kapsamına girer.

"Öde" bugün yalnızca siparişi açar (`POST /invitations/{id}/checkout`) ve
`redirectUrl`'e gider — plan duvarının eski davranışının aynısı. Sağlayıcı
seçildiğinde değişecek tek yer `handleSubmit`:

| Sağlayıcı akışı | Ne olur |
|---|---|
| Barındırılan sayfa (Shopier klasik form, 10.74) | Kart sağlayıcının sayfasında yazılır; buradaki alanlar kalkar, düğme "Güvenli ödeme sayfasına geç" olur |
| Doğrudan gönderim / tokenizasyon | Alanlar kalır; kart tarayıcıdan **doğrudan sağlayıcıya** gider, API'mize yalnızca jeton gelir |

> ⚠️ `FakeGateway` `redirectUrl` olarak `/odeme/basarili?order=…` döner. Bu rota
> **10.27**'ye kadar yok; `*` yakalayıcısı ana sayfaya düşürür.

---

## 3. Havale/EFT ve `.env`

```dotenv
VITE_BANK_TRANSFER_BANK_NAME=
VITE_BANK_TRANSFER_ACCOUNT_HOLDER=
VITE_BANK_TRANSFER_IBAN=
```

- Okuyan tek yer `services/bankTransfer.ts → getBankTransferAccount()`.
- Üçünden biri boşsa ya da IBAN **mod-97**'den geçmezse seçenek *"Şu an
  kullanılamıyor"* görünür. Yanlış hesabı göstermek, seçeneği kapatmaktan pahalıdır.
- 🔴 **Depodan uzak, tarayıcıdan değil.** `VITE_` değerleri derlenen JS'e gömülür.
  Bilgi zaten her müşteriye gösterildiği için kabul edilebilir; değiştirmek yeniden
  derleme ister. Yeniden derlemeden değişsin isteniyorsa backend'den okunur
  (`GET /payments/bank-account` gibi) — değişecek tek yer yine `bankTransfer.ts`.

### Referans kodu (geçici)

`bankTransferReference()` davetiye kimliğinin (yoksa hesap kimliğinin) son sekiz
karakterinden `DK-7XK2-M9QA` üretir. Gelen havale bu kodla elle eşleştirilir.

**Backend'de havale siparişi ucu yok.** "Havaleyi Yaptım" bugün sunucuya hiçbir
şey göndermez; bu yüzden sonraki ekran *"bildiriminiz alındı"* **demez**, yalnızca
sıradaki adımı söyler. Uç açıldığında (`method: bank_transfer` ile `pending`
sipariş) `confirmBankTransfer` onu çağırmalı ve referans `orderId` olmalı.

---

## 4. Doğrulama

```powershell
npm run lint
npm run verify:payment   # IBAN mod-97, Luhn, marka, son kullanma, ödeme adresi (44 kontrol)
```

`verify:payment` `npm run verify`'a eklendi.
