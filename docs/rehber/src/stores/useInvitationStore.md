# `src/stores/useInvitationStore.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/stores/useInvitationStore.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F4/8 — **uyarlamanın kalbi**
> **İlgili kararlar:** K37 (REST) · K44 (kimliği backend üretir)

---

## 1. Üç yeni sorumluluk

| # | Ne | Neden |
|---|---|---|
| 1 | `recordId` durumu | Editör hangi kaydı düzenlediğini bilmeli |
| 2 | Kaydetme kuyruğu | Autosave yarışı iki kayıt üretmesin |
| 3 | Sunucu kimliklerini geri yazmak | Her kaydetmede program satırları yeniden yaratılmasın |

Üçü de aynı kökten geliyor: **upsert gitti, POST/PUT ayrımı geldi.**

---

## 2. `recordId` — editörün hafızası

```ts
recordId: string | null;   // null = bu tasarim henuz kaydedilmedi
```

Kaydetme kararı buna bakıyor:

```ts
const record = recordId
  ? await persistenceService.updateInvitation(recordId, invitation)
  : await persistenceService.createInvitation(invitation);
```

Eskiden bu karar **sunucudaydı** (upsert). Artık istemcide, çünkü REST'te niyet
açıkça ifade edilir: `POST` oluşturur, `PUT` günceller.

### 🔴 `resetInvitation` neden `recordId`'yi de sıfırlıyor?

```ts
resetInvitation: () =>
  set({ recordId: null, invitation: INITIAL_INVITATION, ... }),
```

Unutulsaydı şu olurdu: kullanıcı A davetiyesini düzenler, "Yeni Davetiye
Oluştur"a basar, tasarım sıfırlanır ama `recordId` hâlâ A'yı gösterir. İlk
autosave `PUT /invitations/A` atar ve **kullanıcının mevcut davetiyesinin
üzerine yazar.**

Bu, tek satırlık bir unutmanın veri kaybına dönüştüğü türden bir hatadır. Aynı
sebeple `loadRecord` da `saveState`'i `idle`'a çeker — önceki kaydın "kaydedildi"
rozeti yeni kayda taşınmamalı.

---

## 3. 🔴 Kaydetme kuyruğu — yarış durumu

```ts
let saveQueue: Promise<void> = Promise.resolve();

saveInvitation: () => {
  saveQueue = saveQueue.then(runSave);
  return saveQueue;
}
```

### Problem

Autosave 1,5 saniyelik boşluktan sonra tetikleniyor, ama ağ isteği daha uzun
sürebilir. Kuyruk olmasaydı:

```
t=0.0  Kullanici yazar        → autosave planlanir
t=1.5  1. kaydetme baslar     → POST  (recordId hala null)
t=1.8  Kullanici tekrar yazar → autosave planlanir
t=3.3  2. kaydetme baslar     → recordId HALA null → IKINCI POST
t=3.5  1. yanit doner         → recordId = A
t=3.9  2. yanit doner         → recordId = B

Sonuc: kullanici tek davetiye yaptigini sanir, dashboard'da IKI tane gorur.
```

### Çözüm

`saveQueue = saveQueue.then(runSave)` her kaydetmeyi bir öncekinin **sonuna**
ekler. İkinci kaydetme, birincisi bitip `recordId` yazılana kadar başlamaz;
başladığında `recordId` doludur ve `PUT` atar.

`runSave` hatayı kendi içinde yakalıyor (`catch` ile `saveState: 'error'`), yani
zincir **asla reddedilmez**. Bir kaydetme başarısız olsa bile sonrakiler
çalışmaya devam eder — reddedilen bir promise zinciri kırar ve autosave sessizce
ölürdü.

> **Genel ders:** Eşzamanlılık hatası "bazen olur" — testte görülmez, üretimde
> kullanıcı yazma hızına bağlı olarak ortaya çıkar. Yarışı **yapısal olarak**
> imkânsız kılmak, sonradan ayıklamaktan ucuzdur.

---

## 4. 🔴 `adoptServerIds()` — program satırları neden yeniden yaratılmıyor?

Bu, uyarlamanın en ince kısmı.

### Problem

İlk kaydetmede program adımları `id: null` ile gider; backend onlara kimlik verip
geri döner. O kimlikleri belleğe **yazmazsak**, bir sonraki autosave yine
`id: null` gönderir. Backend K44'e göre `null` gördüğünde ne yapar?

> Yeni satır oluşturur — ve gelen listede olmayan eskileri **siler**.

Yani her autosave'de bütün program satırları silinip yeniden yaratılır: 3.10'da
"yapmayacağız" dediğimiz sil-ve-yeniden-yarat davranışı, bu kez **frontend
yüzünden** gerçekleşir.

### Neden yanıtı olduğu gibi kopyalayamıyoruz?

İstek uçarken kullanıcı yazmaya devam ediyor olabilir. `set({ invitation:
record.invitation })` yazsaydık, sunucuya gitmemiş son harfler **geri alınırdı** —
kullanıcı yazdığı şeyin gözünün önünde silindiğini görürdü.

### Çözüm: yalnızca eksik kimlikleri, konumdan eşleyerek doldur

```ts
const sentKeys = invitation.timelineEvents.map((e) => e.localKey);   // gonderim ANINDA
...
const position = sentKeys.indexOf(event.localKey);
const serverId = position >= 0 ? saved[position]?.id ?? null : null;
```

Üç güvence:

| Durum | Davranış |
|---|---|
| Adım hâlâ listede, kimliği yok | Sunucunun kimliği takılır ✅ |
| Kullanıcı istek uçarken yeni adım ekledi | `localKey` gönderimde yoktu → dokunulmaz, sonraki kaydetmede oluşur |
| Kullanıcı istek uçarken adım sildi | Zaten listede yok → eşleşme aranmaz |
| Adımın zaten kimliği var | Erken `return` — dokunulmaz |

Konum eşleştirmesi güvenli, çünkü backend `sort_order`'ı **listedeki konumdan**
yazıyor (3.10 §6) ve ilişki `orderBy('sort_order')` ile dönüyor (3.4). Yani
yanıt, gönderdiğimiz sırayı korur.

`localKey`'in asıl değeri burada ortaya çıkıyor: `id` null olduğu için adımları
kimlikle eşleştiremezdik; yerel anahtar bu boşluğu dolduruyor (F1 §4).

---

## 5. Modül yüklenirken hidrasyon kaldırıldı

Eski dosyanın sonunda şu vardı:

```ts
if (useAuthStore.getState().isAuthenticated) {
  persistenceService.getInvitation().then((saved) => { ... });   // ❌ kaldirildi
}
```

Tek davetiye varsayımının kalıntısı. Çoklu davetiyede karşılığı yok: **hangisini**
yüklesin?

Yeni davranış:

| Kullanıcı nereden gelir | Editör durumu |
|---|---|
| `/create` (doğrudan veya "Yeni Davetiye") | Boş taslak, `recordId: null` |
| Dashboard → "Düzenlemeye Devam Et" | O kayıt yüklü, `recordId` dolu |

Yan fayda: modül yüklenirken ağ isteği atan bir yan etki gitti. Modül seviyesinde
iş yapan kod test edilemez ve sıraya bağımlıdır; artık her yükleme açık bir
kullanıcı eylemine bağlı.

---

## 6. `loadInvitation` → `loadRecord`

```ts
loadRecord: (record: InvitationRecord) => set({ recordId: record.id, ... })
```

Ad değişikliği bilinçli: metot artık **tasarımı** değil **kaydı** alıyor.
Eskisi gibi kalsaydı, çağıran yerlerde kimliği geçirmeyi unutmak kolay olurdu.

TypeScript de yardım ediyor: `DashboardPage` `loadInvitation(card.invitation)`
demeye devam etseydi derleme hatası alırdı. **Sözleşme değişince adı da
değiştirmek**, sessiz uyumsuzluğu derleme hatasına çevirir.

---

## 7. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | `resetInvitation`'da `recordId` sıfırlamamak | "Yeni davetiye" mevcut kaydın üzerine yazar |
| 2 | Kaydetmeleri sıraya almamak | Hızlı yazan kullanıcıda iki kayıt oluşur |
| 3 | Sunucu kimliklerini geri yazmamak | Her autosave programı silip yeniden yaratır |
| 4 | Yanıtın tamamını belleğe kopyalamak | Kullanıcının son yazdıkları geri alınır |
| 5 | Kuyruğun `catch`'ini unutmak | Bir hata zinciri kırar, autosave sessizce ölür |
| 6 | Modül seviyesinde ağ isteği bırakmak | Test edilemez yan etki |

---

## 8. Kendin dene

Tarayıcı konsolunda:

```js
const s = (await import('/src/stores/useInvitationStore.ts')).useInvitationStore;

s.getState().recordId;                       // => null (yeni taslak)
s.getState().updateField('title', 'Deneme');
await s.getState().saveInvitation();
s.getState().recordId;                       // => "01K3..."  ✅ POST atildi

// Program kimlikleri geri yazildi mi?
s.getState().invitation.timelineEvents.map((e) => e.id);
// => ["12", "13", "14", "15"]   ✅ hepsi dolu, artik null degil

// Ikinci kaydetme PUT olmali (Network sekmesinden dogrula)
s.getState().updateField('title', 'Ikinci');
await s.getState().saveInvitation();

// Yaris denemesi: iki kaydetmeyi ayni anda tetikle
s.getState().resetInvitation();
await Promise.all([s.getState().saveInvitation(), s.getState().saveInvitation()]);
// Network: 1 POST + 1 PUT  ✅  (kuyruk olmasaydi 2 POST olurdu)
```

Son deneme §3'ün kanıtı.

---

## 9. Terim sözlüğü

| Terim | Anlamı |
|---|---|
| **Yarış durumu** (*race condition*) | İki işlemin sırasına bağlı, öngörülemeyen sonuç |
| **Promise zinciri** | `.then()` ile sıraya alınmış asenkron işlemler |
| **İyimser/karamsar güncelleme** | Yanıtı beklemeden / bekleyerek arayüzü değiştirme |
| **Hidrasyon** | Store'u sunucudaki veriyle doldurma |
| **Yan etki** | Fonksiyonun dönüş değeri dışında dünyayı değiştirmesi |

---

## 10. Sırada ne var?

**F5 — `hooks/useDashboardData.ts`.** Tek kayıt varsayımının son kalesi ve silme
işleminin iyimser güncellemesi.
