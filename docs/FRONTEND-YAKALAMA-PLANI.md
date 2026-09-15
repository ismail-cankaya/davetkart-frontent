# Frontend Yakalama Planı

> **Tarih:** 11 Eylül 2026
> **Kimin için:** Frontend'i backend'in **altı faz** ilerisindeki hâline
> getirecek geliştirici (ya da AI asistanı)
> **Backend durumu:** Faz 0-9 kod ✅ · `composer check` yeşil · 238 test ·
> 21 uç nokta
> **Kaynak:** `davetkart-backend-php-laravel/` — `routes/api.php`,
> `contracts/error-codes.json`, `docs/08-HATA-SOZLESMESI.md`

---

## 0. 🔴 Önce bunu oku — dürüst durum

Frontend **çalışıyor**. Kullanıcı kayıt olabiliyor, davetiye tasarlayabiliyor,
dashboard'u görebiliyor. Sorun bu değil.

Sorun şu: **frontend'in backend'e yaptığı çağrıların bir kısmı var olmayan
uçlara gidiyor, bir kısmı da hiç yapılmıyor.** Ve bunların hiçbiri bugün bir
hata olarak görünmüyor, çünkü:

- Yanlış uçlar **mock'ların arkasında** (ödeme, asistan) — ağa hiç çıkmıyorlar.
- Var olmayan yollar (`/rsvps`, `/media/upload`, `/contact`) yalnızca o özellik
  gerçekten denendiğinde 404 veriyor, ve o akışlar henüz elle denenmedi.
- Eksik olanlar (yayınlama ucu) hiç çağrılmıyor, dolayısıyla hiç kırılmıyor.

🔴 **En tehlikeli tek madde:** `services/payments.ts` 1.8 saniye bekleyip
`status: 'paid'` döndürüyor. Gerçek ödeme açıldığı gün backend
`status: 'pending'` dönecek ve para **webhook gelene kadar** tahsil edilmiş
sayılmayacak. Kullanıcı "ödedim" ekranını görüp yayınlamaya basacak ve **402**
alacak. Bu, backend'i canlıya almadan önce kapatılması gereken tek maddedir.

---

## 1. Sözleşme farkı — frontend ne çağırıyor, backend'de ne var

### 1.1 Yanlış giden çağrılar

| Dosya | Frontend çağırıyor | Backend'de gerçekten var olan | Sonuç |
|---|---|---|---|
| `services/media.ts` | `POST /media/upload` | `POST /invitations/{id}/media` (auth)<br>`POST /public/invitations/{id}/media` | 🔴 **404** |
| `services/rsvps.ts` | `GET /rsvps` | `GET /invitations/{id}/rsvps` (auth) | 🔴 **404** |
| `services/rsvps.ts` | `POST /rsvps` | `POST /public/invitations/{id}/rsvps` | 🔴 **404** |
| `services/rsvps.ts` | `DELETE /rsvps/{id}` | `DELETE /rsvps/{id}` | ✅ doğru |
| `services/contact.ts` | `POST /contact` | `POST /public/contact` | 🔴 **404** |

🔴 Üç uçtaki ortak sebep aynı ve bir **backend kararıdır (N1)**: *alt kaydın
aidiyeti URL'nin yapısında durur, gövdede değil.* Düz bir `/media/upload` ucu
olsaydı davetiye kimliği gövdeden gelirdi — yani **istemcinin sözüne** kalırdı.
`/contact` → `/public/contact` ise **K12/K76**: auth'suz yüzeyin tamamı tek
önekte durur.

### 1.2 Hiç yapılmayan çağrılar

| Ne | Backend ucu | Frontend'de |
|---|---|---|
| **Yayınlama** | `POST /invitations/{id}/publish` | 🔴 **Hiç yok** |
| **Tekil checkout** | `POST /invitations/{id}/checkout` | 🔴 Mock |
| **Paket checkout** | `POST /payments/checkout` | 🔴 Mock |
| **Asistan** | `POST /assistant/chat` (auth) | 🔴 Mock |
| **Sahip olunan plan** | (`orders` üzerinden sunucu bilir) | 🔴 Oturum içi mock |

### 1.3 Doğru olanlar (dokunma)

`POST /auth/register` · `POST /auth/login` · `POST /auth/logout` ·
`GET /auth/me` · `GET|POST /invitations` · `GET|PUT|DELETE /invitations/{id}` ·
`GET /public/invitations/{id}` · `DELETE /rsvps/{id}`

---

## 2. Sıra ve gerekçesi

Sekiz dilim. Sıra rastgele değil: **her dilim bir sonrakinin hata mesajını
okunabilir kılıyor.**

| # | Dilim | Neden bu sırada |
|---|---|---|
| **F1** | Hata çeviri katmanı | Sonraki her dilim hata üretecek. Önce bu olmazsa 402'ler, 409'lar ve 429'lar ekranda ham kod olarak görünür |
| **F2** | Yanlış uçları düzelt + honeypot | Ucuz, çok sayıda, birbirinden bağımsız. Faz 5/6/8'i tek hamlede açar |
| **F3** | 🔴 Yayınlama + gerçek ödeme + `activeTier` | **Ticari çekirdek.** En büyük ve en riskli dilim |
| **F4** | Asistan (giriş duvarı + gerçek uç) | F1'e bağlı (429/503 kodları), F3'ten bağımsız |
| **F5** | ETag + polling | Faz 4/5'in yazılmış ama kullanılmayan optimizasyonu |
| **F6** | `timezone` alanı + geri sayım | Küçük ama sessiz bir hata düzeltiyor |
| **F7** | Üretim: origin, CORS, silme uyarısı | Faz 9'un frontend'e düşen payı |
| **F8** | Uçtan uca doğrulama | Backend'in elle doğrulama betikleriyle birlikte |

---

## F1 — Hata çeviri katmanı (K20'nin frontend yarısı)

**Durum:** ✅ **Tamamlandı.** `src/contracts/error-codes.json` (tek yönlü kopya),
`src/contracts/errorCodes.ts` (tipli katman), `src/locales/{tr,en}/errors.json`
ve `src/utils/toDisplayError.ts` yazıldı. `apiErrorFields()` eklendi;
`LoginPage`, `RegisterPage` ve `InvitePage` katmana bağlandı.
`npm run verify:errors` sözleşme kapsamını denetler.

Kalan diller (`de, fr, es, pt, ru, ar, hi, zh`) `fallbackLng: 'en'` ile
İngilizce metinleri gösterir — arayüzün geri kalanı da bugün çevrilmiş
değil; hata sözlüğünü tek başına on dile çıkarmak karışık dilli ekran üretirdi.

Backend tasarım gereği **metin döndürmez** (K20/K21) — yalnızca kod:

```json
{ "error": { "code": "PAYWALL_TIER_INSUFFICIENT", "params": { "requiredTier": "elit" } } }
```

Bu bir eksiklik değil, bir **sorumluluk ayrımı**: backend *ne olduğunu* bilir,
frontend *nasıl anlatılacağını*. O yüzden çeviri katmanı frontend'in işi ve
**hiç yazılmadı**.

### Yapılacaklar

1. `contracts/error-codes.json`'ı backend'den kopyala →
   `src/contracts/error-codes.json`. **Tek yönlü kopya** (K31): iki depo
   birbirine bağlanmaz.
2. `locales/<dil>/errors.json` — **21 kodun hepsi** için metin.
3. `src/utils/toDisplayError.ts`:

```ts
export function toDisplayError(error: unknown): string {
  const code = apiErrorCode(error);
  if (!code) return t('errors.NETWORK');          // ağ hatası / timeout
  return t(`errors.${code}`, apiErrorParams(error));
}
```

4. `VALIDATION_FAILED` ayrı ele alınır: `fields` içinde **kural adı** gelir,
   metin değil.

```json
{ "error": { "code": "VALIDATION_FAILED",
  "fields": { "guestCount": [{ "rule": "max", "params": { "max": 10 } }] } } }
```

→ `t('validation.max', { field: t('fields.guestCount'), max: 10 })`

### Kod kataloğu — 21 kodun tamamı

```
ASSISTANT_QUOTA_EXCEEDED   FILE_TOO_LARGE            INVALID_CREDENTIALS
INVITATION_ALREADY_PUBLISHED  INVITATION_LOCKED      MALFORMED_REQUEST
MEDIA_QUOTA_EXCEEDED       PAYMENT_PROVIDER_ERROR    PAYMENT_REQUIRED
PAYWALL_TIER_INSUFFICIENT  PROVIDER_UNAVAILABLE      RATE_LIMITED
REGISTRATION_FAILED        RESOURCE_NOT_FOUND        RSVP_DEADLINE_PASSED
RSVP_QUOTA_EXCEEDED        SERVER_ERROR              SLUG_TAKEN
TOKEN_EXPIRED              UNAUTHENTICATED           VALIDATION_FAILED
```

> ⚠️ `SLUG_TAKEN` bugün hiçbir yerden dönmüyor (K66) ama katalogda **duruyor**:
> yayınlanmış bir kod adı sözleşmenin parçasıdır. Çeviri yazmak zorunda
> değilsin, ama eksik anahtar uyarısı verirse sebebi bu.

---

## F2 — Yanlış uçlar ve eksik honeypot

**Durum:** ✅ **Tamamlandı.** Üç servis de doğru uçlara bağlandı; `website`
tuzağı `components/ui/HoneypotField.tsx` üzerinden **üç** formda render
ediliyor (LCV modalı, satır içi şablon LCV formu, iletişim).
`npm run verify:endpoints` yolları ve gövdeleri denetler.

Plan'da öngörülmeyen üç ek iş bu dilimde zorunlu çıktı:

1. **`RsvpStatus` İngilizce'ye çevrildi.** `RsvpResource` ilk günden
   `status->value` gönderiyordu; tip Türkçe olduğu için sözleşme hep uyuşmazdı.
   Sunum `utils/rsvpStatus.ts`'e indi.
2. **LCV kapsamı (`invitationId`) store'a eklendi.** Üç ucun üçü de kimliği
   URL'de istiyor; frontend bunu hiçbir akışta taşımıyordu. `null` = önizleme
   yüzeyi (editör simülatörü, ana sayfa tanıtımı) → ağa çıkılmaz.
3. **Panel sayfasına davetiye seçici eklendi.** Birden fazla yayınlanmış
   davetiyede sessizce yalnızca birinin yanıtlarını göstermek yanıltıcıydı.

### F2.1 `services/media.ts`

```diff
- const { data } = await api.post<unknown>('/media/upload', form);
- return toHostedUrl(data);          // { url } bekliyor
```

Backend **iki ayrı uç** sunuyor ve ikisi de `MediaResource` döner:

```json
{ "data": { "id": "01j…", "url": "https://…" } }
```

| Kim yüklüyor | Uç | Auth |
|---|---|---|
| Sahip (galeri) | `POST /invitations/{id}/media` | ✅ |
| Misafir (LCV foto/video) | `POST /public/invitations/{id}/media` | — |

🔴 **`id` alanı kritik ve bugün kullanılmıyor.** LCV gönderiminde misafir
`photoMediaId` / `videoMediaId` gönderiyor — yani yükleme yanıtındaki `id`
saklanmalı. Yalnızca `url` alınırsa LCV'ye fotoğraf **hiçbir zaman
bağlanamaz**.

Arayüz şöyle değişmeli:

```ts
export interface UploadedMedia { id: string; url: string }

export interface MediaService {
  uploadForOwner(invitationId: string, file: File): Promise<UploadedMedia>;
  uploadAsGuest(invitationId: string, file: File): Promise<UploadedMedia>;
}
```

### F2.2 `services/rsvps.ts`

```ts
list(invitationId)          → GET  /invitations/{invitationId}/rsvps   (auth)
create(invitationId, body)  → POST /public/invitations/{invitationId}/rsvps
remove(id)                  → DELETE /rsvps/{id}                        ✅ değişmiyor
```

LCV gövdesi (camelCase, backend `StoreRsvpRequest`):

```ts
{
  guestName: string;          // zorunlu, 2-120
  guestCount: number;         // 1..config (varsayılan tavan 10)
  status: 'attending' | 'pending' | 'declined';
  menuPreference?: string | null;
  message?: string | null;
  photoMediaId?: string | null;   // F2.1'den gelen id
  videoMediaId?: string | null;
  website: '';                    // 🔴 HONEYPOT — aşağıya bak
}
```

> 🔴 `status` değerleri **İngilizce**: `attending | pending | declined`.
> Frontend'in `'Katılıyor' | 'Bekleniyor' | 'Katılamıyor'` değerleri **sunum**
> katmanıdır (K21) ve çeviri frontend'de yapılır — ağda İngilizce gider.

### F2.3 `services/contact.ts`

```diff
- await api.post('/contact', payload);
+ await api.post('/public/contact', payload);
```

Ve docblock'taki *"destek ekibine yönlendirilir"* ifadesi **yanlış** — bugün
böyle bir kanal yok (K79 hâlâ açık). Dokümanda verilen söz, kodda karşılığı
yoksa yalandır (**B4**); cümle silinmeli.

### F2.4 🔴 Honeypot alanları — tuzak hiç kurulmamış

Backend iki formda honeypot bekliyor ve alan adı **`website`**
(`HasHoneypot::HONEYPOT_FIELD`):

| Form | Dosya | Durum |
|---|---|---|
| LCV | `components/preview/RsvpModal.tsx` | ⬜ kontrol et |
| İletişim | `pages/ContactPage.tsx` | 🔴 **yok** |

Görünmez alan şöyle eklenir:

```tsx
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  className="absolute left-[-9999px] h-0 w-0 opacity-0"
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>
```

🔴 `display: none` **kullanma**: bazı botlar gizli alanları atlar, ekran
dışına taşınan alanı doldurur. Amaç botun onu **görüp doldurmasıdır**.

> **B9:** *bir savunmanın karşı tarafta karşılığı yoksa savunma
> kurulmamıştır.* Backend tarafı yazıldı ve testleri yeşil; ama form o alanı
> hiç render etmiyorsa tuzak **hiç kurulmamış** demektir. Backend testi bunu
> göremez.

Dolu gelirse backend **204 döner ve kaydetmez** — sessiz tuzak (L2). Yani
frontend hiçbir fark görmez; bu kasıtlıdır.

---

## F3 — 🔴 Yayınlama, gerçek ödeme ve `activeTier`

**Durum:** ✅ **Tamamlandı.**

- `invitationService.publish()` yazıldı; `useInvitationStore.publishInvitation()`
  önce kaydedip sonra yayınlıyor (uç kimlik ister).
- `paymentService` mock'tan çıktı: `checkoutForInvitation()` ve
  `checkoutForAccount()`. `status: 'pending'` doğru yorumlanıyor; kullanıcı
  `redirectUrl`'e yönlendiriliyor ve **hiçbir metin "ödendi" demiyor**.
- `activeTier` **silindi** (Seçenek A). Yayınlamada ön kontrol yok: deneriz,
  402 gelirse paywall sunucunun bildirdiği `requiredTier` ile açılır.
- İki 402 kodu iki ayrı ekran: `PaywallReason = 'purchase' | 'upgrade'`.
- `getRequiredTier()` **korundu** ama yalnızca *"Tavsiye Edilen"* rozeti için.

⚠️ **Açık:** `POST /payments/checkout` (hesap paketi) servis ve store
düzeyinde destekleniyor, ancak bugün onu tetikleyen bir arayüz yok —
`PricingPage` yalnızca bilgilendirme sayfası. Paket satışı bir ürün kararı
olarak bekliyor.


Bu dilim projenin **ticari çekirdeği** ve frontend'in en yanlış yeri.

### F3.1 Bugünkü hata zinciri

```
Kullanıcı "Satın Al"a basar
  → paymentService.checkout()   1.8 sn bekler, status:'paid' döner   ← MOCK
  → useSubscriptionStore.activeTier = 'gold'                          ← OTURUM İÇİ
  → Kullanıcı "Yayınla"ya basar
  → 🔴 Böyle bir çağrı YOK. Davetiye hiçbir zaman yayınlanmaz.
```

Gerçek ödeme açıldığında zincir şuna dönüşür ve **daha kötü** olur:

```
  → POST /invitations/{id}/checkout   →  201 { status: 'pending', redirectUrl }
  → Frontend 'paid' bekliyordu, 'pending' gördü                       ← SESSİZ HATA
  → Kullanıcı yayınlamaya basar → 402 PAYMENT_REQUIRED
```

### F3.2 Checkout sözleşmesi

| Ne alınıyor | Uç | Gövde |
|---|---|---|
| Bu davetiye için | `POST /invitations/{id}/checkout` | `{ tier: 'standart' \| 'gold' \| 'elit' }` |
| Hesap için (paket) | `POST /payments/checkout` | aynı |

Yanıt (**201**, zarflı):

```json
{ "data": { "orderId": "01j…", "tier": "gold", "status": "pending",
            "redirectUrl": "https://…" } }
```

🔴 **Üç kural:**

1. **Fiyat gövdeye KONULMAZ.** Backend onu `config`'ten okur (M6). Gönderirsen
   sessizce yok sayılır — ama göndermek, sözleşmeyi yanlış anladığının işareti.
2. **`status` her zaman `pending`.** `paid`'e geçişi **webhook** yapar; yani
   kullanıcı `redirectUrl`'e gidip ödemesini tamamlamalı.
3. **`redirectUrl` opsiyoneldir** (C7: yoksa anahtar **hiç gelmez**,
   `null` değil). `data.redirectUrl === undefined` kontrolü doğru yazılmalı.

### F3.3 Yayınlama sözleşmesi

```
POST /api/invitations/{id}/publish        (auth)
```

| Durum | Yanıt |
|---|---|
| ✅ | **200** + tam `InvitationResource` (`status: 'published'`) |
| Hiç ödeme yok | **402** `PAYMENT_REQUIRED` + `params.requiredTier` |
| Plan yetmiyor | **402** `PAYWALL_TIER_INSUFFICIENT` + `params.requiredTier` |
| Zaten yayında | **409** `INVITATION_ALREADY_PUBLISHED` |
| Başkasının davetiyesi | **404** (403 değil — H7) |

🔴 **İki ayrı 402 kodu var ve ikisi farklı ekran gerektirir:**

| Kod | Kullanıcının önündeki eylem |
|---|---|
| `PAYMENT_REQUIRED` | *"Önce bir plan al"* → paywall aç |
| `PAYWALL_TIER_INSUFFICIENT` | *"Planını yükselt"* → paywall'ı `requiredTier` ile aç |

Aynı ekranı göstermek, backend'in bu ayrımı yapmak için ödediği bedeli çöpe
atar.

### F3.4 🔴 `activeTier` mock'u kaldırılmalı

```ts
// stores/useSubscriptionStore.ts — BUGÜN
activeTier: SubscriptionTier | null;   // yalnızca bu oturumda, mock checkout'tan
```

Sunucu tek doğruluk kaynağıdır (`orders` tablosu). İki seçenek:

| Seçenek | Nasıl |
|---|---|
| **A** (önerilen, bugün mümkün) | `activeTier`'ı **sil**. Yayınlamayı dene; 402 gelirse paywall'ı `error.params.requiredTier` ile aç |
| **B** | Backend'den bir *"siparişlerim"* ucu iste (bugün **yok**, açık karar) |

**A neden daha iyi:** `getRequiredTier()` frontend'de zaten var ve backend'de
`TierResolver` olarak **ikizi** duruyor. İki kopya bir gün ayrışır. Tek
otoritenin sunucu olması, ayrışmanın **görünür** olmasını sağlar — 402
gelir, kullanıcı doğru ekranı görür.

> `getRequiredTier()` **silinmemeli**: paywall'da *"Tavsiye Edilen"* rozetini
> sürüyor ve bu bir **sunum** kararı. Yalnızca **yetki** kararı olmaktan
> çıkmalı.

### F3.5 `types.ts` düzeltmeleri

```diff
  export interface CheckoutResult {
    orderId: string;
    tier: SubscriptionTier;
-   status: 'paid';
+   status: 'pending' | 'paid' | 'failed' | 'refunded';
+   redirectUrl?: string;
  }
```

---

## F4 — Asistan

**Durum:** ✅ **Tamamlandı.**

- `services/assistant.ts` yazıldı; `POST /assistant/chat`, zarflı yanıt
  (`{ data: { reply } }`). Zaman aşımı **uzatılmadı** — 15 sn backend'in
  ayarlandığı sınır (K78).
- Giriş duvarı **Seçenek B**: widget gizlenmiyor, sohbetin yerini
  `AssistantLoginCta` alıyor. Gizlenen bir özellik kullanıcıya hiçbir şey
  anlatmaz.
- Üç hata kodu üç farklı davranış üretiyor (`AssistantBlock`):
  kota → yazma alanı bugünlük kapanır; hız sınırı ve sağlayıcı → `retryAfter`
  kadar kapanır, sonra kendiliğinden açılır.
- Hata sohbetin **içinde** gösteriliyor (ayrı kılıkta baloncuk), toast'a
  düşürülmüyor: kullanıcı mesajını yazdı ve bir karşılık bekliyor.
- Girdi `maxLength={2000}` — backend'in `assistant.max_prompt_chars` değeri.


### F4.1 🔴 Giriş duvarı (K72) — en kritik madde

`components/layout/AppLayout.tsx` `AssistantWidget`'ı **her sayfada**, giriş
yapmamış ziyaretçide de render ediyor. Uç ise **auth'lu**.

Backend bu çelişkiyi bilerek kendi lehine çözdü ve maliyeti frontend'e yazdı:

> **Q1:** *bir maliyet kontrolü ancak harcamanın bir kimliğe yazılabildiği
> yerde kurulabilir.* Anonim çağrıda tek anahtar IP'dir ve IP aynı anda hem
> çok geniş (CGNAT arkasındaki on binlerce abone) hem çok dardır (saldırgan
> için IP döndürmek saatlik birkaç kuruş).

İki çözümden biri:

```tsx
const { token } = useAuthStore();
{token && <AssistantWidget />}                       // A: hiç gösterme
{token ? <AssistantWidget /> : <AssistantLoginCta/>} // B: "sohbet için giriş yap"
```

**B önerilir**: widget'ın varlığı bir özellik vaadidir; sessizce kaybolması
kullanıcıya bir şey anlatmaz.

### F4.2 Gerçek uç

```diff
- async function generateReply(_userText: string): Promise<string> {
-   await new Promise(r => setTimeout(r, 1100 + Math.random() * 900));
-   return 'Mesajınız için teşekkürler! …';
- }
+ async function generateReply(text: string): Promise<string> {
+   const { data } = await api.post<{ data: { reply: string } }>(
+     '/assistant/chat', { message: text },
+   );
+   return data.data.reply;
+ }
```

Üç yeni hata durumu ve üçü farklı:

| Kod | HTTP | Ne göstermeli |
|---|---|---|
| `ASSISTANT_QUOTA_EXCEEDED` | 429 | *"Günlük hakkın doldu"* + `params.limit`, `params.retryAfter` |
| `RATE_LIMITED` | 429 | *"Çok hızlısın, biraz bekle"* |
| `PROVIDER_UNAVAILABLE` | 503 | *"Asistan şu an yanıt veremiyor"* |

🔴 İlk ikisi **aynı HTTP kodunu** taşıyor ama farklı şeyler söylüyor:
*"hakkın bitti"* ile *"hızlısın"* aynı metni gösteremez (K74). Ayrım
`error.code`'dadır, statüde değil.

> **15 saniye kuralı:** backend'in en kötü durumu ~12.6 sn (K78) ve `api.ts`
> timeout'u 15 sn. Marj dar; asistan isteğinde timeout'u **uzatma** — backend
> zaten o sınıra göre ayarlandı.

---

## F5 — ETag ve polling (Faz 4/5'in kullanılmayan optimizasyonu)

**Durum:** ✅ **Tamamlandı.**

- `services/conditionalGet.ts` — tek yerde `If-None-Match`, `validateStatus`
  ve ETag önbelleği. İki uç da kullanıyor:
  `GET /public/invitations/{id}` ve `GET /invitations/{id}/rsvps`.
- Polling `useRsvpStore.startPolling()` içinde, 15 sn. Sekme arka plandayken
  durur, sekmeye dönüldüğünde beklemeden bir kez tazeler; üst üste binen
  istek yok; arka plan yenilemeleri spinner yakmaz ve tek bir başarısız
  yenileme paneli hata ekranına düşürmez.
- ETag okunamıyorsa **sürüm saklanmaz** ve geliştirme ortamında bir kez
  uyarı basılır — `exposed_headers` eksikliği sessizce ölmesin diye.
- `npm run verify:etag` beş davranışı sınar.


Backend iki uçta `ETag` üretiyor (`SetEtag` middleware, K46):

```
GET /api/public/invitations/{id}
GET /api/invitations/{id}/rsvps
```

Frontend **hiç `If-None-Match` göndermiyor** — yani her istek tam gövde
çekiyor. LCV paneli 15 saniyede bir yenilenecekse bu, her poll'de tüm listenin
yeniden indirilmesi demek.

```ts
let etag: string | null = null;

const { data, status, headers } = await api.get(url, {
  headers: etag ? { 'If-None-Match': etag } : {},
  validateStatus: (s) => s === 200 || s === 304,   // 🔴 304 hata DEĞİL
});

if (status === 304) return cached;                 // gövde yok
etag = headers.etag ?? null;
```

🔴 **İki tuzak:**

1. **`validateStatus`** ayarlanmazsa axios 304'ü **hata** sayar ve
   `catch` bloğuna düşer.
2. **Üretimde `ETag` okunabilir mi?** Backend Faz 9'da `config/cors.php`'ye
   `exposed_headers: ['ETag']` ekledi — çünkü ETag CORS'un güvenli liste
   başlıklarından **değildir**. O satır olmasa `headers.etag` çapraz kaynakta
   **her zaman `undefined`** olurdu ve bu optimizasyon sessizce ölürdü.
   Doğrulaması F8'de.

Polling `useRsvpStore` içine kurulacak (`config`'teki
`rsvp.poll_interval_seconds` = 15).

---

## F6 — `timezone` alanı ve geri sayım

**Durum:** ✅ **Tamamlandı.**

- `Invitation.timezone` eklendi; `INITIAL_INVITATION` varsayılanı
  `Europe/Istanbul` (backend'in `default_timezone` değeriyle aynı).
- `utils/eventTime.ts` — duvar saati ↔ an dönüşümü, `Intl` ile; sabit offset
  varsaymaz, yaz saati geçişlerinde de doğrudur.
- `useCountdown(date, timeZone)` — saat dilimi **zorunlu parametre**.
  22 hero + `Summary` güncellendi.
- Editöre saat dilimi seçici eklendi (`utils/timeZones.ts`); liste
  `Intl.supportedValuesOf` ile çalışma zamanında okunuyor, paketlenmiş ölü
  bir kopya tutulmuyor.
- Takvim dışa aktarımı da mekânın dilimine bağlandı; `DTSTAMP` UTC'ye
  düzeltildi (RFC 5545 §3.8.7.2 — etkinlik saatinin aksine yüzer olamaz).
- `npm run verify:time` 16 iddiayı sınar.


Backend **her iki** davetiye Resource'unda `timezone` gönderiyor (K63/K71) ve
misafir ucunda **her zaman dolu**. `types.ts`'te bu alan **yok**.

```diff
  export interface Invitation {
    …
    eventAt: string;
+   timezone: string;      // IANA: 'Europe/Istanbul'
  }
```

🔴 Neden önemli: `event_at` bir **duvar saatidir** — *"19:00"* düğünün
olduğu yerin saatidir, tarayıcının değil. Berlin'deki bir misafirin geri
sayımı, saat dilimi hesaba katılmazsa **iki saat kayar**.

```ts
// Yanlış: tarayıcının saat dilimi
const diff = new Date(invitation.eventAt).getTime() - Date.now();

// Doğru: davetiyenin saat dilimi
// (Intl.DateTimeFormat ya da date-fns-tz / temporal-polyfill ile)
```

> Backend bu bedeli üç faz erteleyip Faz 7'de ödedi (K71): *bir tarihin saat
> dilimi yoktur; `setTimezone()` tarihi bir gün kaydırır.* Frontend o bedelin
> karşılığını ancak alanı okuyunca alır.

---

## F7 — Üretim (Faz 9'un frontend'e düşen payı)

### F7.1 🔴 Origin ve CORS

Bugün `vite.config.ts` `/api`'yi `localhost:8000`'e proxy'liyor — yani tarayıcı
açısından her şey **aynı kaynaktan** geliyor ve CORS hiç devreye girmiyor.
**Üretimde proxy yok.**

```env
# .env.production
VITE_API_BASE_URL=https://api.davetkart.com/api
```

Ve **aynı origin** backend'in `.env`'inde tanımlı olmalı:

```env
CORS_ALLOWED_ORIGINS=https://davetkart.com
```

🔴 Sondaki `/` **yazılmaz** — bir origin şema + alan adı + porttur, yol
içermez. `https://davetkart.com/` yazılırsa hiçbir istek eşleşmez.

### F7.2 Silme + 3 günlük pencere (K82)

Backend Faz 9'da yeni bir ticari kural kazandı: **yayınlanmış bir davetiye
silinirse, yayından 3 gün geçmediyse ödenen tekil siparişin hakkı serbest
kalır** ve kullanıcı onu yeni bir davetiyede kullanabilir. 3 gün geçtiyse hak
yanar.

🔴 Backend bunu **söylemiyor**: `DELETE /invitations/{id}` → **204, gövde yok**.
Yani kullanıcı ne olduğunu öğrenemiyor.

Bu bir **sunum** boşluğudur ve frontend'de kapanır: silme onayı, yayın
tarihine bakıp kullanıcıyı uyarmalı.

```
published_at + 3 gün > şimdi  → "Hakkınızı 3 gün içinde yeni bir davetiyede
                                  kullanabilirsiniz."
aksi hâlde                    → "Bu davetiye için ödenen plan hakkı silinecek."
```

> Bu, K20'nin doğal sonucu: backend *ne olduğunu* bilir, frontend *nasıl
> anlatılacağını*. Ama burada backend olayı **hiç bildirmiyor** — bir
> *"siparişlerim"* ucu doğana kadar frontend hesabı kendisi yapmak zorunda.
> Backend tarafında açık madde olarak kayıtlı (`FAZ-9.md` §8).

### F7.3 `window.confirm` yerine modal

Eski bir borç (`PHP-LARAVEL-SETUP.md` §15). F7.2 ile birlikte yapılmalı:
üç günlük uyarıyı `confirm()` içine sığdırmak mümkün değil.

---

## F8 — Uçtan uca doğrulama

Backend'in `FAZ-9-ELLE-DOGRULAMA.md` betiğiyle **birlikte** koşulur.

| # | Senaryo | Beklenen |
|---|---|---|
| 1 | Kayıt → giriş → davetiye oluştur → autosave | ✅ (bugün çalışıyor) |
| 2 | Galeriye foto yükle | `POST /invitations/{id}/media` → `{data:{id,url}}` |
| 3 | Yayınlamayı dene, ödeme yok | **402** `PAYMENT_REQUIRED`, paywall açılır |
| 4 | Yetersiz planla dene (galerili davetiyeye Gold) | **402** `PAYWALL_TIER_INSUFFICIENT`, `requiredTier: 'elit'` |
| 5 | Checkout → `status: 'pending'` | Kullanıcı "ödeme tamamlandı" **görmemeli** |
| 6 | Webhook sonrası yayınla | **200**, `status: 'published'` |
| 7 | İkinci kez yayınla | **409** `INVITATION_ALREADY_PUBLISHED` |
| 8 | Misafir davetiyeyi açar | `GET /public/invitations/{id}` + **ETag** |
| 9 | 🔴 `response.headers.etag` okunabiliyor mu? | **Üretim origin'inden** — `null` dönerse `exposed_headers` eksik |
| 10 | Misafir LCV gönderir + foto ekler | `photoMediaId` gerçekten bağlanmalı |
| 11 | Honeypot'u doldur | **204** döner, kayıt **oluşmaz** |
| 12 | LCV paneli 15 sn'de bir yenilenir | İkinci poll **304** almalı |
| 13 | Asistan, giriş yapmadan | Widget ya yok ya *"giriş yap"* diyor |
| 14 | Asistan, 30 mesajdan sonra | **429** `ASSISTANT_QUOTA_EXCEEDED` + `limit` |
| 15 | İletişim formu | `POST /public/contact` → **204** |
| 16 | Yayınlanmış davetiyeyi sil (1 gün sonra) | Uyarı: *"hakkını 3 gün içinde kullanabilirsin"* |
| 17 | Yeni davetiye oluştur → yayınla | Serbest hak **bağlanmalı**, 200 |

---

## 3. 🔴 Frontend'e özgü tuzaklar

| # | Tuzak | Neden |
|---|---|---|
| 1 | **401'i tek olay sanmak** | `api.ts` zaten ayırıyor: `UNAUTHENTICATED` → oturumu düşür; `INVALID_CREDENTIALS` → **formda kal**. Bu ayrım bozulursa yanlış parola girişi kullanıcının yazdıklarını siler |
| 2 | **Zarfı varsaymak** | Auth uçları **zarfsız** `{user, token}`, diğerleri `{data: …}`. `unwrapEnvelope()` ikisini de kabul eder — kullan |
| 3 | **Kapalı modülün alanını beklemek** | `GET /public/invitations/{id}` kapalı modülün verisini **hiç göndermez** (C6) — `null` değil, **anahtar yok**. `publicInvitation.ts` bunu zaten doğru yapıyor |
| 4 | **304'ü hata sanmak** | axios varsayılanı öyle sayar (F5) |
| 5 | **`redirectUrl`'i `null` sanmak** | Yoksa **anahtar hiç gelmez** (C7) |
| 6 | **Program adımı kimliği uydurmak** | `id: null` = yeni satır, `id: "7"` = güncelle (K44). React anahtarı için ayrı `localKey` var |
| 7 | **`getRequiredTier()`'a yetki kararı vermek** | O bir **sunum** kopyası; yetki kararı sunucuda (`TierResolver`) |
| 8 | **Honeypot'u `display:none` yapmak** | Bot görmeli ki doldursun (F2.4) |
| 9 | ~~**`api.ts` docblock'una güvenmek**~~ | *"microservices gateway"* ve *"JWT"* diyordu; ikisi de yanlıştı — **modüler monolit** ve **Sanctum token**. ✅ F1'de düzeltildi (**B4**) |
| 10 | **Timeout'u uzatmak** | 15 sn backend'in ayarlandığı sınır (K78); uzatmak sorunu gizler |

---

## 4. Kapanış listesi

- [x] **F1** `errors.json` (21 kod) + `toDisplayError()` + `VALIDATION_FAILED` haritası
- [x] **F2** `media.ts` · `rsvps.ts` · `contact.ts` uçları düzeltildi
- [x] **F2.4** 🔴 Honeypot (`website`) iki formda da render ediliyor
- [x] **F3** `publish` ucu eklendi, iki 402 kodu ayrı ele alınıyor
- [x] **F3** Checkout gerçek, `status: 'pending'` doğru yorumlanıyor
- [x] **F3** 🔴 `activeTier` mock'u kaldırıldı
- [x] **F4** 🔴 Asistan giriş duvarının arkasında + gerçek uca bağlı
- [x] **F5** ETag + `If-None-Match` + LCV polling
- [x] **F6** `timezone` alanı + geri sayım düzeltmesi
- [ ] **F7** `VITE_API_BASE_URL` + backend `CORS_ALLOWED_ORIGINS` eşleşiyor
- [ ] **F7.2** Silme uyarısı (3 günlük pencere)
- [ ] **F8** 17 senaryonun tamamı elle koşuldu
- [ ] `.gitattributes` eklendi (491 dosya sahte "değişmiş" görünüyor)
- [ ] `docs/rehber/src/` kılavuzları güncellendi (K18 frontend tarafı)

---

## 5. Bir cümlelik özet

Frontend bugün kendi kurduğu bir dünyada çalışıyor: ödeme mock, plan mock,
asistan mock, yayınlama hiç yok. Bu yakalama fazının işi yeni özellik yazmak
değil — **backend'in dokuz fazda kurduğu sözleşmeyi frontend'in gerçekten
konuşmasını sağlamak**; ve o sözleşmenin en pahalı maddesi, kullanıcının
ödediğini sandığı ama backend'in henüz tahsil etmediği o `status: 'pending'`
satırıdır.
