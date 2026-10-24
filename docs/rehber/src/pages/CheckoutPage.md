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

---

## 🆕 Faz 11: hediye kodu

```
┌ GiftCodeField ──────────────────┐   ┌ OrderSummary ─────────────┐
│ "Hediye kodum var" ▾            │   │ Paket bedeli     ₺399,00  │
│ [DUGUN2026      ] [Uygula]      │   │ Hediye kodu      −₺199,50 │  ← yalnızca önizleme varken
└─────────────────────────────────┘   │ Toplam           ₺199,50  │
toplam > 0 → yöntem seçici + kart    └───────────────────────────┘
toplam = 0 → FreeActivationPanel ("Ücretsiz etkinleştir")
```

| Durum | Sol sütun | Sağ sütun |
|---|---|---|
| Kod yok | Eskisi gibi | Katalog fiyatı |
| Kısmi indirim | Kart formu, düğme "₺199,50 Öde"; havale **kapalı** | İndirim satırı + yeni toplam |
| Toplam 0 | Kart ve havale yok; "Ücretsiz etkinleştir" | Toplam `₺0` |

### Plan değişince kod kalır

Eskiden tek bir effect hem bağlam değişiminde hem çıkışta `reset()` çağırıyordu. Artık ikiye
ayrıldı:

```ts
useEffect(() => () => useCheckoutStore.getState().reset(), []);    // çıkış: her şey gider
useEffect(() => {                                                   // plan/davetiye değişti
  reset({ keepGiftCode: true });
  if (tier) void refreshGiftCode(tier);                             // aynı kod, yeni plan
}, [tier, invitationId]);
```

Önizleme yalnızca **bu plan için** ise kullanılır (`giftPreview.tier === plan.id`). Plan
değişip yeni önizleme gelene kadar ekranda eski planın indirimi görünmez.

### Neden havale kapalı?

Havalede backend'de sipariş açılmıyor (`confirmBankTransfer` sunucuya bir şey göndermiyor).
Kod hiçbir siparişe ayrılamaz. Ekranda indirimli tutar gösterip havale istemek, kullanıcının
indirimli tutarı yatırıp sonra eşleştirmede eksik ödemiş görünmesi demekti. Havale düğmesi
"Hediye kodu yalnızca kartla ödemede geçerli" der; kod kaldırılınca geri açılır.

### Elle denendi (23 Ekim 2026, bulut çalışma alanı, gerçek backend + Chromium)

Yanlış kod → alanın altında `GIFT_CODE_INVALID` metni · `dugun 2026` (%50) → `₺199,50`, düğme
"₺199,50 Öde", havale kapalı · `HEDIYEGOLD` (free/gold) → `₺0`, "Ücretsiz etkinleştir" · onaysız
basış → onay kutusu kırmızı · onaylı basış → `/odeme/basarili?order=…`, "Ödemeniz onaylandı" ·
390 px genişlikte aynı kodu Standart'ta tekrar deneme → `ALREADY_USED` metni.
