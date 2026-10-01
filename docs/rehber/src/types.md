# `src/types.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/types.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F1/8 · 🆕 **Faz 10**, adım 10.9 (§10)
> **İlgili karar:** K44 — kimliği backend üretir · Faz 10: K89 (`expired`)

---

## 1. Neden bu dosyayla başlıyoruz?

`types.ts` frontend ile backend arasındaki **sözleşmenin kaynağıdır**. Backend'in
`InvitationPayloadResource`'u bu dosyaya bakarak yazıldı; frontend'in her servisi
ve bileşeni bu dosyadan tip alıyor.

Bir sözleşme değişikliğinde önce burayı değiştirmek, TypeScript'in geri kalan
işi **senin için bulmasını** sağlar: `npm run lint` çalıştırdığında uyumsuz kalan
her dosya derleme hatası verir. Yani değişiklik listesi tahmin değil, **çıktı**
olur.

---

## 2. Değişen tek şey: `TimelineEvent`

**Önce:**

```ts
export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
}
```

**Sonra:**

```ts
export interface TimelineEvent {
  id: string | null;
  localKey: string;
  time: string;
  title: string;
  description: string;
}
```

İki alan, iki ayrı sorumluluk.

---

## 3. `id: string | null` — K44'ün frontend yüzü

Devraldığımız kodda tarayıcı kendi kimliklerini üretiyordu:

```ts
{ id: `tl-${Date.now()}`, ... }      // TimelineEditor
{ id: 'tl-1', ... }                   // data.ts varsayilan program
```

Bunun iki sorunu vardı (`timeline_events` migration kılavuzu §7):

1. Sunucuya, sunucunun hiç üretmediği kimlikler gidiyordu
2. `tl-1` **her davetiyede** aynıydı — evrensel olarak benzersiz değildi

Aldığın karar: **kimliği backend üretir.** `null`, "bu adım henüz kaydedilmedi"
demektir ve sözleşme iki açık duruma indirgenir:

| `id` | Backend ne yapar |
|---|---|
| `null` | Yeni satır oluşturur, kendi kimliğini verir |
| `"7"` | 7 numaralı satırı günceller |
| listede yok | O satırı siler |

`string \| null` yazımına TypeScript'te **birleşim tipi** (*union type*) denir:
değişken iki tipten birini alabilir. TS bunu zorlar — `id`'yi doğrudan bir
string bekleyen yere veremezsin, önce `null` durumunu ele almak zorundasın.

Bu tam olarak istediğimiz şey: derleyici, "bu adım kaydedilmemiş olabilir"
gerçeğini unutmana izin vermiyor.

---

## 4. 🔴 `localKey` — React'in gerçek ihtiyacı

`id`'yi `null` yapınca bir sorun doğuyor. React bir listeyi çizerken her elemana
**kararlı ve benzersiz** bir `key` ister:

```tsx
{events.map((event) => (
  <motion.div key={event.id}>      {/* ❌ artik null olabilir */}
```

`key={null}` React'te uyarı üretir ve daha kötüsü: birden fazla yeni adımın
anahtarı **aynı** olur (hepsi `null`). React o satırları ayırt edemez; kullanıcı
2. adıma yazarken imleç 1. adıma sıçrar, animasyonlar yanlış satırda oynar.

Çözüm ikisini **ayırmak**:

| Alan | Kimin | Nereye gider |
|---|---|---|
| `id` | Sunucunun kimliği | İstek gövdesine |
| `localKey` | React'in çizim anahtarı | **Hiçbir yere** — tarayıcıda kalır |

```tsx
<motion.div key={event.localKey}>   {/* ✅ her zaman dolu, her zaman benzersiz */}
```

### Neden `localKey` zorunlu (`?` yok)?

İsteğe bağlı yapıp `key={event.localKey ?? event.id}` de yazabilirdik. Yapmadık,
çünkü o yazım "bazen anahtarım yok" durumunu **kabul ediyor** — ve o durumda
yine `null` anahtar riski doğar.

Zorunlu tutunca sorumluluk net: `TimelineEvent` üreten **her yer** bir yerel
anahtar vermek zorunda. Bu üç yer var ve üçü de sonraki dosyalarda ele alınacak:

| Nereden gelir | `localKey`'i kim üretir | Dosya |
|---|---|---|
| Sunucudan yüklenen kayıt | `invitationService` (`srv-7` gibi) | F2 |
| Varsayılan program | `data.ts` | F8 |
| Kullanıcının eklediği yeni adım | `TimelineEditor` | F7 |

TypeScript üçünü de derleme hatasıyla hatırlatacak — bu yüzden zorunlu.

---

## 5. `localKey` sunucuya gitmiyor, peki gitse ne olurdu?

Hiçbir şey: backend'in `InvitationRequest` kuralları arasında `localKey` yok,
dolayısıyla `validated()` onu **düşürür** (3.8 §7 — beyaz liste).

Yine de servis katmanında temizleyeceğiz (F2). Sebep sözleşme hijyeni:

> Gövdeye giden her alan bir **söz**dür. Sözleşmede yeri olmayan bir alanı
> göndermek, yarın birinin ona bakmasına ve ona bağlanmasına davetiye çıkarır.

Bu, backend tarafında Resource'u beyaz liste yapmamızla (C1) aynı ilkenin ters
yöndeki uygulaması: **giden veri de sayılır.**

---

## 6. Değişmeyenler

Sözleşmenin geri kalanı backend'le zaten uyumlu:

| Tip | Durum |
|---|---|
| `InvitationRecord` | ✅ `{id, status, updatedAt, invitation}` — `InvitationResource` birebir üretiyor |
| `InvitationStatus` | ✅ `'published' \| 'saved'` — K38 ile backend de iki değere indi |
| `Invitation` | ✅ 24 alan — `InvitationPayloadResource` hepsini karşılıyor |
| `AuthUser` | ✅ Faz 2'de hizalanmıştı (K35) |

`InvitationRecord.id` alanının `string` olması ULID kararıyla (K40) tutarlı:
backend `char(26)` bir kimlik döndürüyor ve `/invite/{id}` bağlantısı doğrudan
onu kullanıyor.

---

## 7. Şimdi ne kırılacak?

```powershell
npm run lint
```

Bu değişiklikten sonra TypeScript üç dosyada hata verecek:

| Dosya | Hata | Nerede düzelecek |
|---|---|---|
| `data.ts` | `DEFAULT_TIMELINE_EVENTS`'te `localKey` yok, `id: 'tl-1'` | F8 |
| `TimelineEditor.tsx` | `addEvent` `localKey` vermiyor | F7 |
| `services/invitations.ts` | Sunucudan gelen veri `localKey` taşımıyor | F2 |

🔴 **Bu hatalar iyi haberdir.** Sözleşmeyi değiştirdik ve derleyici, uyum
sağlaması gereken her yeri **eksiksiz** listeledi. Aynı değişikliği JavaScript'te
yapsaydık liste yerine, haftalar sonra ortaya çıkan garip davranışlar olurdu.

Backend tarafında bu işi `composer check` yapıyordu; frontend'de `npm run lint`
yapıyor. İkisi de aynı soruyu soruyor: *"söylediğin şeyi gerçekten yaptın mı?"*

---

## 8. Terim sözlüğü

| Terim | Anlamı |
|---|---|
| **Birleşim tipi** (*union*) | `A \| B` — değer iki tipten biri olabilir |
| **`key`** | React'in liste elemanlarını takip etmek için istediği kararlı kimlik |
| **Sözleşme** (*contract*) | İki sistemin üzerinde anlaştığı veri biçimi |
| **Tip denetimi** | Kodu çalıştırmadan, derleme anında uyumsuzlukları bulma |

---

## 9. Sırada ne var?

**F2 — `src/services/invitations.ts`**

Tek davetiye varsayan servis, REST koleksiyonu istemcisine dönüşecek:
`list / get / create / update / remove`. Orada ayrıca sunucudan gelen adımlara
`localKey` atanacak ve giden gövdeden düşürülecek.

---

## 10. 🆕 Faz 10 — `OrderStatus`'a `'expired'` (10.9 · K89)

### 10.1 Ne değişti?

```ts
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
```

Backend 10.3'te `OrderStatus` enum'una `Expired` ekledi. `orders:expire` komutu
(saatlik) ödeme penceresi dolan `pending` siparişleri artık `failed` değil
`expired` yapıyor (10.5).

### 10.2 `failed` ile farkı — ve neden frontend'i ilgilendiriyor?

| Durum | Kim söyledi | Sonradan `paid` olabilir mi? |
|---|---|---|
| `failed` | Sağlayıcı (ya da ödeme hiç başlatılamadı) | ❌ |
| `expired` | Bizim sabrımızın sonu | ✅ Geç gelen webhook ile |

Bugün frontend bu değeri yalnızca `CheckoutResult.status`'ta görebilir ve orada
sipariş **hep** `pending` doğar. Yani bu değişiklik bugün hiçbir ekranı
değiştirmiyor. Asıl okuyucusu **10.27**'nin ödeme dönüş sayfası olacak: siparişi
birkaç saniye yoklayıp `paid` → *"yayınlayabilirsin"*, `pending` → *"bekliyor"*,
`expired`/`failed` → *"tekrar dene"* diyecek.

### 10.3 Neden şimdi, sayfa yazılmadan önce?

Sözleşme bir **tip**tir ve tip önde gider (bu dosyanın §1'deki ilkesi). Backend
`expired` dönmeye başladığı anda (10.5 deploy edilince) frontend'in tipi eksik
kalırsa, bir sonraki geliştirici `switch (order.status)`'a bu kolu yazmayı
unutabilir — TypeScript uyarmaz, çünkü tip o değerin var olduğunu bilmiyor.
Tip genişleyince, `Record<OrderStatus, …>` gibi **tam** eşleme isteyen her yer
derleme hatası verir ve eksik kolu gösterir.

```powershell
npm run lint     # bugün yeşil: OrderStatus'u tam eşleyen bir yer henüz yok
```

Bugün yeşil olması bir **bulgu**: `OrderStatus`'u kullanan tek yer
`CheckoutResult.status` ve o değeri hiçbir yer `switch`'lemiyor. 10.27 yazılırken
ilk iş, dönüş sayfasının durum eşlemesini `Record<OrderStatus, …>` olarak kurmak
olmalı — o zaman `expired` unutulamaz.

---

## 11. 🆕 Faz 10 — `OrderRecord` (10.26)

```ts
export interface OrderRecord {
  orderId: string;
  tier: SubscriptionTier;
  status: OrderStatus;
  invitationId: string | null;
  createdAt: string;
  paidAt: string | null;
}
```

Backend `GET /orders` ve `GET /orders/{id}` yanıtı (`OrderResource`, backend 10.24).

### 11.1 Neden `CheckoutResult` değil?

İki tip aynı Resource'tan geliyor ama **farklı soruları** cevaplıyor:

| Tip | Soru | Özel alan |
|---|---|---|
| `CheckoutResult` | *"Ödemeye nereden devam edeyim?"* | `redirectUrl?`: yalnızca checkout yanıtında, bağlama göre var |
| `OrderRecord` | *"Siparişim ne durumda?"* | `paidAt`, `invitationId`: her siparişte var, değeri `null` olabilir |

Tek bir tipe birleştirilseydi `redirectUrl` sipariş listesinde de *"belki var"*
görünürdü ve `paidAt` checkout'ta *"belki yok"* olurdu. İkisi de yanlış bir bilgi.

### 11.2 `null` ile `?` farkı (N4 · C7)

`paidAt: string | null` yazıldı, `paidAt?: string` değil. Backend anahtarı **her
zaman** gönderiyor. `null`, *"henüz ödenmedi"* bilgisini taşıyor. `?:` yazılsaydı
TypeScript `order.paidAt === undefined` kontrolüne izin verirdi ve o kontrol hiçbir
zaman doğru olmazdı: sessiz bir hata. `redirectUrl?`'nin tersi, ve ikisi aynı
dosyada bilerek yan yana duruyor.
