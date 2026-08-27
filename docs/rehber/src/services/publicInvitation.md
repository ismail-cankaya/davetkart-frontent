# `src/services/publicInvitation.ts`

> **Kod dosyası:** `src/services/publicInvitation.ts`
> **Faz:** 4 — Public davetiye, dosya 4.8a
> **Önce oku:** [`invitations.md`](invitations.md) — sahibin servisi
> **Backend karşılığı:** `app/Http/Resources/PublicInvitationResource.php`

---

## 1. Neden ikinci bir servis?

Elimizde zaten `invitationService.get(id)` var. Kullanmıyoruz, çünkü **aynı
kaynağın iki farklı temsili** var:

| | `invitationService` (sahip) | `publicInvitationService` (misafir) |
|---|---|---|
| Uç | `GET /api/invitations/:id` | `GET /api/public/invitations/:id` |
| Kimlik | Token zorunlu | Yok |
| `status`, `updatedAt` | Gelir | **Gelmez** |
| Kapalı modülün verisi | Gelir (sahip düzenlemeye devam edecek) | **Gelmez** |
| Program adımı `id`'si | Gelir (K44 — güncelleme için) | **Gelmez** |

Backend tarafında bu ayrım **C4** kuralıyla yapılmıştı: *aynı veri, farklı
okuyucular için farklı Resource*. Frontend'de de aynı ayrım olmak zorunda,
yoksa tek bir tip iki farklı gövdeyi anlatmaya çalışır ve ikisi hakkında da
yalan söyler.

---

## 2. 🔴 Sözleşmeyi tip sistemine yazmak

```ts
type PublicCore = Omit<Invitation,
  | 'timelineEvents' | 'galleryImages'
  | 'bankName' | 'accountHolder' | 'iban' | 'giftOptions'
  | 'rsvpDeadline' | 'askMenuPreference'>;

type PublicModules = Partial<Pick<Invitation, /* ... aynı alanlar ... */>> & {
  timelineEvents?: WireTimelineEvent[];
};

type WirePublicInvitation = PublicCore & PublicModules;
```

İlk bakışta dolambaçlı duruyor; `Partial<Invitation>` yazmak daha kısa olurdu.
Yazmadık çünkü `Partial<Invitation>` **her alanı** isteğe bağlı yapar — o zaman
`title` de gelmeyebilirmiş gibi görünür, oysa `title` her zaman gelir.

Bu iki tip, backend'in `PublicInvitationResource`'undaki dört `if` bloğunun
birebir aynası:

```php
if ($this->show_gift) { $design += ['bankName' => ..., 'iban' => ...]; }
```

> **Kalıp:** Sözleşme belgede değil, **tipte** durmalı. Belgede duran sözleşme
> eskir ve kimse fark etmez; tipte duran sözleşme, ihlal edildiği anda derleme
> hatası verir.

`Omit` ve `Pick` kullanmanın ikinci faydası: alan adları `Invitation`'dan
**türetiliyor**. Yarın `iban` alanı `ibanNumber` olsa, bu dosya derlenmez ve
düzeltmeyi unutamayız. Elle `{ iban?: string }` yazsaydık sessizce ölü kod
kalırdı.

---

## 3. Eksik alanı doldurmak — Faz 3'te reddettiğimiz şey bu değil mi?

Haklı bir itiraz. Faz 3'te `whenLoaded()`'ı tam olarak bu yüzden reddetmiştik:

> *"`whenLoaded` ilişki yüklü değilse anahtarı düşürür, frontend eksik alanı
> varsayılanla doldurur ve kullanıcı **hiç yazmadığı bir programı** görür."*

Burada `hydrate()` tam da onu yapıyor:

```ts
iban: wire.iban ?? '',
timelineEvents: (wire.timelineEvents ?? []).map(...)
```

Fark, eksikliğin **ne anlama geldiğinde**:

| | Faz 3'ün reddettiği | Buradaki |
|---|---|---|
| Eksikliğin sebebi | **Kaza** — ilişki yüklenmemiş | **Karar** — modül kapalı |
| Anlamı | "Bilinmiyor" | "Sana ait değil" |
| Doldurulan değer çizilir mi | **Evet** — kullanıcı yanlış veri görür | **Hayır** — bileşen mount bile olmaz |

Üçüncü satır belirleyici. `InvitationComposition.tsx`:

```tsx
{invitation.showGift && <GiftRegistry invitation={invitation} ... />}
```

`showGift` kapalıysa `GiftRegistry` hiç oluşturulmaz, yani `iban: ''` değeri
hiçbir yerde okunmaz. Doldurduğumuz varsayılan **görünmeyen bir yer tutucudur.**

> **Ölçüt:** "Varsayılan doldurmak" tek başına iyi ya da kötü değildir. Soru
> şu: *doldurduğun değer kullanıcıya gösterilebilir mi?* Gösterilebiliyorsa
> yalan üretiyorsundur; gösterilemiyorsa yalnızca tipi tamamlıyorsundur.

### Alternatif neden seçilmedi?

`types.ts`'teki `Invitation` alanlarını isteğe bağlı yapabilirdik
(`iban?: string`). O zaman TypeScript **her** şablon bileşeninde `undefined`
kontrolü isterdi — `GiftRegistry`, `Gallery`, `RSVPForm`, `Timeline` ve
düzinelerce hero. Oysa o bileşenler zaten bayrakla korunuyor; eklenecek
kontroller **gereksiz ve yanıltıcı** olurdu ("demek ki açıkken de boş
gelebiliyor").

Sınırda tamamlamak, Faz 3'ün **30. dersiyle** aynı: *savunma kodu her yere
değil, güven sınırına yazılır.* Servis o sınırdır.

---

## 4. `id: null` neden dürüst tek değer?

```ts
timelineEvents: (wire.timelineEvents ?? []).map((event, index) => ({
  ...event,
  id: null,
  localKey: `pub-${index}`
}))
```

Backend misafire program adımlarının kimliğini **göndermiyor** (4.2a: artan
bigint, K40'ın kapattığı sayım sızıntısını geri getirirdi). O hâlde burada ne
yazmalıyız?

`TimelineEvent.id` tipi `string | null` ve `null`'ın sözleşmedeki anlamı *"bu
adım henüz kaydedilmedi"*. Tam olarak doğru değil ama **uydurmaktan iyi**:
elimizde sunucu kimliği yok, olmadığını söylüyoruz. Bir kimlik uydursaydık
(`pub-0` gibi) ve o değer bir gün sunucuya geri gönderilseydi, K44'ün çözdüğü
sorunun aynısını üretirdik.

`localKey` ise zaten bu iş için var (`types.ts:51`) — React'in liste anahtarı
ihtiyacını sunucu kimliğinden **bağımsız** karşılıyor. Faz 3'te alınan bir
karar, burada ikinci kez işe yarıyor.

---

## 5. Auth interceptor'ı public uçta sorun çıkarır mı?

`api.ts` her isteğe token ekliyor ve 401'de oturumu düşürüyor. Public uçta:

| Senaryo | Ne olur |
|---|---|
| Misafirde token yok | Başlık eklenmez, uç zaten auth istemiyor |
| Sahip kendi davetiyesine misafir gözüyle bakıyor | Token gider, backend `/api/public/` grubunda **umursamaz** |
| Davetiye yayında değil | Backend **404** döner — 401 değil, oturum düşmez ✅ |

Üçüncü satır önemli: backend'in "sahiplik yoksa 404" kuralı (H7) burada bir yan
fayda daha veriyor — yanlış bir link, kullanıcının oturumunu düşürmüyor.

---

## 6. Sık yapılan hatalar

| # | Hata | Ne olur | Doğrusu |
|---|---|---|---|
| 1 | `invitationService.get()`'i misafir sayfasında kullanmak | Auth ister; misafirde 401, sahipte cache'siz uç | Ayrı servis |
| 2 | `Partial<Invitation>` yazmak | `title` de eksik gelebilirmiş gibi görünür | `Omit` + `Pick` (§2) |
| 3 | Alan adlarını elle yazmak | Yeniden adlandırma sessizce kaçar | `Invitation`'dan türet |
| 4 | Kimlik uydurmak (`id: 'pub-0'`) | Bir gün sunucuya geri giderse K44'ün sorunu geri döner | `id: null` (§4) |
| 5 | Gövdeyi doğrulamadan kullanmak | SPA fallback'i HTML döndürebilir | `isWirePublicRecord` |
| 6 | 404 ile ağ hatasını aynı göstermek | Kullanıcı "bağlantım mı koptu?" der | Sayfa ikisini ayırır (4.8b) |

---

## 7. Kendin dene

```powershell
# 1. terminal — backend
php artisan serve

# 2. terminal — frontend
npm run dev
```

`tinker`'da yayınlanmış bir davetiye üret ve id'sini al, sonra tarayıcıda
`http://localhost:5173/invite/<id>` aç. DevTools → Network → istek gövdesine
bak: `showGift` kapalıyken `iban` anahtarının **hiç olmadığını** gör.

Konsola şunu yazarak hidrasyonu da doğrulayabilirsin:

```js
const r = await fetch('/api/public/invitations/<id>').then(r => r.json());
Object.prototype.hasOwnProperty.call(r.data.invitation, 'iban');   // false
```

---

## 8. Sırada ne var?

[`../pages/InvitePage.md`](../pages/InvitePage.md) — bu servisi çağıran sayfa
ve üç ayrı yükleme durumunun neden ayrı ayrı ele alındığı.
