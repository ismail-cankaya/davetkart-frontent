# `src/services/invitations.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/services/invitations.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F2/8
> **İlgili kararlar:** K37 (REST koleksiyonu) · K44 (kimliği backend üretir)

---

## 1. Ne değişti?

**Önce** — iki metot, hesap başına tek davetiye varsayımı:

```ts
get(): Promise<InvitationRecord | null>      // GET  /invitations  → TEK kayit
save(invitation): Promise<...>                // POST /invitations  → upsert
```

**Sonra** — beş metot, tam REST koleksiyonu:

```ts
list():                     Promise<InvitationRecord[]>
get(id):                    Promise<InvitationRecord>
create(invitation):         Promise<InvitationRecord>
update(id, invitation):     Promise<InvitationRecord>
remove(id):                 Promise<void>
```

Eski `save()` **upsert**'tü: sunucu "kayıt var mı?" diye bakıp ya oluşturuyor ya
güncelliyordu. K37'yle bu ayrım istemciye geçti — hangi işlemin yapılacağını
artık **çağıran** biliyor (`recordId` var mı yok mu), ve bunu F4'te
`useInvitationStore` üstlenecek.

Neden daha iyi? Upsert'te "yeni mi, mevcut mu?" sorusunun cevabı sunucunun
tahminiydi. REST'te niyet açıkça ifade ediliyor: `POST` oluşturur, `PUT`
günceller. Belirsizlik yok.

---

## 2. `Wire*` tipleri — sunucunun biçimi ile tarayıcının biçimi aynı değil

```ts
type WireTimelineEvent = Omit<TimelineEvent, 'localKey'>;
type WireInvitation = Omit<Invitation, 'timelineEvents'> & {
  timelineEvents: WireTimelineEvent[];
};
type WireRecord = Omit<InvitationRecord, 'invitation'> & { invitation: WireInvitation };
```

F1'de `localKey` alanını ekledik ama o **sunucuya ait değil**. Yani iki farklı
biçim var:

| Biçim | Nerede | `localKey` |
|---|---|---|
| `TimelineEvent` | Tarayıcı belleği, React | ✅ var |
| `WireTimelineEvent` | HTTP gövdesi | ❌ yok |

### `Omit` ne yapıyor?

TypeScript'in **yardımcı tipi** (*utility type*): bir tipten belirli alanları
çıkararak yeni bir tip üretir.

```ts
Omit<TimelineEvent, 'localKey'>
// => { id: string | null; time: string; title: string; description: string }
```

`&` ise **kesişim tipi** (*intersection*): iki tipi birleştirir. `WireInvitation`
şöyle okunur: *"`Invitation`'ın `timelineEvents` dışındaki her şeyi, artı
kendi `timelineEvents` tanımım."*

### Neden elle yazmadık?

`WireTimelineEvent`'i dört alanıyla elle yazabilirdik. Yazmadık çünkü o zaman
sözleşme **iki yerde** dururdu: `types.ts`'te ve burada. Yarın `TimelineEvent`'e
bir alan eklendiğinde birini güncellemeyi unutmak sessiz bir uyumsuzluk üretirdi.

`Omit` ile türetince tek doğruluk kaynağı korunuyor — backend'de `values()`
metodunu enum'dan beslememizle aynı fikir (C3).

---

## 3. `hydrate()` — gelen adımlara yerel anahtar takmak

```ts
timelineEvents: (record.invitation.timelineEvents ?? []).map((event) => ({
  ...event,
  localKey: `srv-${event.id}`
}))
```

Sunucu `localKey` göndermiyor (göndermemeli). Ama React'in ona ihtiyacı var
(F1 §4). Bu yüzden **ağ sınırında** üretiliyor.

`srv-` öneki bilinçli: bir anahtarın nereden geldiğini okurken görebiliyorsun.
Kullanıcının eklediği yeni adımlar `tl-` önekini taşıyacak (F7). İkisi asla
çakışmaz.

### Neden bileşende değil de burada?

`TimelineEditor` her çizimde `localKey` üretseydi, anahtar her render'da
değişirdi — React her seferinde satırı yok edip yeniden yaratırdı, yani
anahtarın var olma sebebi ortadan kalkardı.

Anahtar **veriyle birlikte doğmalı** ve veri yaşadığı sürece aynı kalmalı. Verinin
tarayıcıya girdiği yer burası.

---

## 4. 🔴 `?? []` — savunma kodu burada neden haklı?

Backend'de sürekli "savunma kodu yazmadan önce framework'ün ne yaptığını oku"
dedik (Faz 2, ders 20). Action'lara gelen veriyi doğrulamıyorduk çünkü
FormRequest zaten doğrulamıştı.

Burada tersini yapıyoruz — ve çelişki değil:

```ts
(record.invitation.timelineEvents ?? []).map(...)
```

Fark **güven sınırında**:

| Yer | Veri nereden geliyor | Güvenilir mi |
|---|---|---|
| Backend Action | Aynı süreçteki FormRequest'ten | ✅ Evet |
| **Bu servis** | **Ağdan** | ❌ Hayır |

Ağın diğer ucunda beklediğin uygulama olmayabilir: bir vekil sunucu araya
girebilir, dev sunucusu SPA fallback'i olarak HTML dönebilir, backend'in eski bir
sürümü deploy edilmiş olabilir.

`isWireRecord()` kontrolü de aynı sebeple var:

```ts
if (!isWireRecord(body)) {
  throw new Error('Unexpected /invitations response shape');
}
```

`body is WireRecord` yazımına TypeScript'te **tip koruyucu** (*type guard*) denir:
fonksiyon `true` döndürdüğünde derleyici o değişkeni artık `WireRecord` olarak
kabul eder. `unknown` ile başlayıp güvenli biçimde daraltmanın yolu budur.

> **İlke:** Savunma kodu her yere değil, **güven sınırına** yazılır. İçeride
> tekrarlanırsa iki doğruluk kaynağı üretir; sınırda yoksa çökme üretir.

---

## 5. `toPayload()` — giden gövdeyi açıkça kurmak

```ts
timelineEvents: timelineEvents.map((event) => ({
  id: event.id,
  time: event.time,
  title: event.title,
  description: event.description
}))
```

Dört alanı tek tek yazıyoruz. Kısayolu vardı:

```ts
timelineEvents.map(({ localKey, ...event }) => event)      // ❌ tercih edilmedi
```

Çalışır ama iki sorunu var: `localKey` kullanılmayan bir değişken olarak durur
(lint gürültüsü), ve daha önemlisi **ne gönderdiğini görmezsin** — gelecekte
`TimelineEvent`'e eklenen her alan otomatik olarak gövdeye sızar.

Açık liste, backend'deki `InvitationPayloadResource`'un aynası: orada **gelen**
veriyi beyaz listeliyorduk (C1), burada **giden** veriyi.

### `const { timelineEvents, ...design } = invitation;`

Buna **destructuring** denir: `timelineEvents` alanını ayırır, geri kalan 23 alanı
`design` nesnesinde toplar. Sonra ikisini yeniden birleştiriyoruz.

Neden gerekli? Çünkü `timelineEvents` dönüşecek, diğerleri olduğu gibi geçecek.
23 alanı elle kopyalamak yerine tek satırda ayırıyoruz.

---

## 6. `get(id)` artık `null` döndürmüyor

Eski kod 404'ü "boş hesap" sayıp `null` döndürüyordu:

```ts
if (axios.isAxiosError(error) && error.response?.status === 404) return null;   // ❌ kaldirildi
```

Artık 404 gerçekten bir hata: **belirli bir kimlik istedin ve o kayıt yok** (ya da
senin değil — backend ikisini ayırt edilemez kılıyor, H7).

Boşluk durumu artık `list()`'in işi: hesabın hiç davetiyesi yoksa **boş dizi**
döner, hata değil.

> Bir API'de "yok" ile "hata" farklıdır. Koleksiyonda boşluk normaldir; tekil
> kaynakta yokluk bir hatadır.

---

## 7. Neden `remove()` bir şey döndürmüyor?

Backend 204 (No Content) dönüyor (3.11 §5) — gövde yok. `Promise<void>` bunu
sözleşmede de ifade ediyor.

Silme sonrası listeyi tazelemek çağıranın işi; F5'te `useDashboardData`'nın
`refresh()` metodu bunu yapacak.

---

## 8. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | `Wire*` tiplerini elle yazmak | Sözleşme iki yerde durur, ayrışır |
| 2 | `localKey`'i bileşende üretmek | Her render'da değişir, anahtar işlevini yitirir |
| 3 | Gövdeyi `...event` ile kurmak | Yeni alanlar sessizce sızar |
| 4 | Ağ yanıtını doğrulamamak | HTML gövdede `.map()` çöker |
| 5 | Servis içinde doğrulamayı tekrarlamak | Sınır dışında iki doğruluk kaynağı |
| 6 | `list()`'in boşluğunu hata saymak | Yeni hesap "arıza" görünür |

---

## 9. Kendin dene

Bu dosya tarayıcı konsolundan denenebilir. `npm run dev` sonrası giriş yap ve
konsolda:

```js
const { invitationService } = await import('/src/services/invitations.ts');

await invitationService.list();
// => [] veya kayit dizisi

const r = await invitationService.create({
  ...(await import('/src/data.ts')).INITIAL_INVITATION,
  title: 'Konsoldan'
});
r.id;                                    // => "01K3..." (ULID)
r.invitation.timelineEvents[0].localKey; // => "srv-12"  ✅ hydrate calisti
r.invitation.timelineEvents[0].id;       // => "12"      ✅ metin

await invitationService.update(r.id, { ...r.invitation, title: 'Guncellendi' });
await invitationService.remove(r.id);
(await invitationService.list()).length; // silinen listede yok
```

🔴 IDOR denemesi — başka bir hesabın davetiye id'sini iste:

```js
await invitationService.get('BASKASININ_ULIDI');
// => AxiosError 404, {"error":{"code":"RESOURCE_NOT_FOUND"}}
```

⚠️ Bu dosya tek başına henüz derlenmiyor: `data.ts` ve `TimelineEditor`
`localKey` vermediği için `npm run lint` hâlâ kırmızı. F7 ve F8'de kapanacak.

---

## 10. Terim sözlüğü

| Terim | Anlamı |
|---|---|
| **`Omit<T, K>`** | `T` tipinden `K` alanlarını çıkaran yardımcı tip |
| **Kesişim tipi** (`&`) | İki tipi birleştiren tip |
| **Tip koruyucu** (*type guard*) | `x is T` döndürerek derleyiciye tip daraltan fonksiyon |
| **Destructuring** | Nesneden alan ayırma / geri kalanı toplama (`...rest`) |
| **Güven sınırı** | Verinin denetimsiz bir kaynaktan geldiği nokta |
| **Upsert** | "Varsa güncelle, yoksa oluştur" tek işlemi |

---

## 11. Sırada ne var?

**F3 — `src/services/persistence.ts`**

Store'ların konuştuğu arayüz. `getInvitation/saveInvitation` ikilisi, kimlik
taşıyan yeni sözleşmeye uyarlanacak — ve editörün "hangi kaydı düzenliyorum?"
sorusu ilk kez ortaya çıkacak.
