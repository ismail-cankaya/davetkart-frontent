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

---

## 🆕 Faz 18.3 (`SEC-01` · backend K159, K163) — hedefli katalog

### Neden?

Backend artık ilk yayın indirimini **tek açık siparişe** veriyor. Bir kullanıcının A davetiyesi
için bekleyen indirimli siparişi varsa B davetiyesinin fiyatı indirimsizdir; A'nın kendi sayfası
ise indirimi göstermeye devam eder. Yani "bu kullanıcının fiyatı" tek bir sayı değil: **hangi
hedef için sorulduğuna** bağlı. Katalog ucu bunun için isteğe bağlı bir parametre aldı:

```
GET /pricing                     -> davetiyesiz (paket) fiyatı
GET /pricing?invitation=01J…     -> o davetiyenin fiyatı
```

Yanıtın biçimi aynı (`PricingCatalog`); tipler değişmedi.

### İki yuva

| Yuva | Ne taşır | Kim okur |
|---|---|---|
| `catalog` (+ `loadedFor`, `status`) | davetiyesiz, ortak katalog | fiyat kartları, plan duvarı, pazarlama metinleri, davetiyesiz ödeme sayfası |
| `targeted` (`{ loadedFor, invitationId, catalog, status }`) | **bir davetiyenin** kataloğu | o davetiyenin ödeme sayfası |

🔴 **Neden tek kataloğu hedefe göre anahtarlamadık?** İlk taslak öyleydi ve yanlıştı. Ortak
kataloğu aynı anda birçok bileşen okur (`useFirstPublishPercent`, plan duvarı, fiyat kartları).
Ödeme sayfası onu kendi davetiyesine çevirince öbür bileşenlerin kataloğu "başka hedefin" olur;
kancaları yeniden istemez (bağımlılıkları değişmedi) ve sonsuza dek "yükleniyor"da kalırlar.
İki bileşen karşılıklı yeniden isterse de sonsuz istek döngüsü doğar. Ayrı yuva bu çatışmayı
yapıdan kaldırır: ödeme sayfası kendi fiyatını okur, kimsenin fiyatını değiştirmez.

### Eylemler

| Eylem | Ne yapar |
|---|---|
| `load({ force })` | Ortak katalog. **Değişmedi.** |
| `loadFor(invitationId, { force })` | Hedefli katalog. Ortak kataloğa dokunmaz. Misafirde hiçbir şey yapmaz |
| `refresh()` | İkisini de tazeler (kapanan ödeme yöntemi: `useCheckoutStore`) |

`loadFor` da `load` ile aynı üç kuralı taşır: (1) aynı kimlik + aynı davetiye için ikinci istek
atılmaz, (2) başka bir davetiyenin kataloğu yüklenirken ekranda **kalmaz** (`catalog: null`),
(3) yalnızca en son isteğin yanıtı yazılır (`latestTargetedRequest`).

İkinci kural bu fazın en önemli satırıdır: A'nın indirimli fiyatı, B'nin sayfası yüklenirken bir
an bile görünürse kullanıcı 99,60'a "Öde" deyip 249,00'lık bir siparişle karşılaşabilir.

### `usePricing({ force, invitationId })`

```ts
const { catalog } = usePricing({ force: true, invitationId: context?.invitationId ?? null });
```

- `invitationId` yok ya da `null` → ortak katalog (eski davranış).
- `invitationId` var ve kullanıcı oturumlu → hedefli yuva.
- Misafir → her zaman ortak katalog: ilk yayın indirimi kişiye özeldir, misafirin hedefi olmaz.

Kanca, **başka bir davetiyenin** hedefli kataloğunu bileşene hiç vermez (`null` + `'loading'`).

### Bilinen sınır

Plan duvarı (`PaywallModal`) ortak kataloğu okur. Kullanıcının bu davetiye için bekleyen
indirimli siparişi varken duvar liste fiyatını, ödeme sayfası indirimli fiyatı gösterir.
Tahsilatı belirleyen sayfa doğru; duvardaki fark kullanıcının lehine. Duvarı hedefli yapmak ayrı
bir iş (aynı anda iki hedefli tüketici doğar).

### Sık hatalar

| Hata | Sonuç |
|---|---|
| Ödeme sayfasında `usePricing({ force: true })` yazıp davetiyeyi geçmemek | Geri dönen kullanıcı kendi indirimini "kaybolmuş" görür |
| `loadFor` içinde eski kataloğu başka davetiye için ekranda tutmak | Yanlış hedefin fiyatı bir an görünür |
| Yöntem kapandığında yalnızca `load({ force: true })` çağırmak | Ödeme sayfası hedefli yuvadan okur; düğmeler eski kalır. `refresh()` kullan |
| Hedefi `localStorage`'a ya da URL dışında bir yere yazmak | Bağlam URL'dedir (`/odeme?invitation=…`); iki kaynak ayrışır |

### Denetim

`npm run verify:pricing` → "Hedefli katalog (ödeme sayfası)" başlığı altında 11 satır.
