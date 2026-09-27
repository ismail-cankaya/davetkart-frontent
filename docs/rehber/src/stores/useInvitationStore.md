# `src/stores/useInvitationStore.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/stores/useInvitationStore.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F4/8 — **uyarlamanın kalbi** ·
> 🆕 **Faz 10**, adım 10.8b (Ek — 402'de açılan modülün geri alınması)
> **İlgili kararlar:** K37 (REST) · K44 (kimliği backend üretir) · K88 (Faz 10)

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

> ⚠️ Sıfırlamanın doğru yazılması yetmez, **çağrılması** da gerekir. Paneldeki
> "Yeni Davetiye Oluştur" uzun süre yalnızca sihirbazı sıfırladı ve tam olarak bu
> hatayı üretti. Artık iki store'u birlikte sıfırlayan
> `stores/sessionActions.ts` → `startNewInvitation()` çağrılıyor. Bkz. Ek.

---

## 3. 🔴 Kaydetme kuyruğu — yarış durumu

```ts
let saveQueue: Promise<void> = Promise.resolve();

const enqueueSave = (): Promise<SaveOutcome> => {
  const generation = documentGeneration;          // bkz. Ek — kuşak
  const outcome = saveQueue.then(() => runSave(generation));
  saveQueue = outcome.then(() => undefined);
  return outcome;
};
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

`saveQueue.then(...)` her kaydetmeyi bir öncekinin **sonuna** ekler. İkinci
kaydetme, birincisi bitip `recordId` yazılana kadar başlamaz; başladığında
`recordId` doludur ve `PUT` atar.

`runSave` hatayı kendi içinde yakalıyor (`catch` ile `saveState: 'error'`) ve
reddetmek yerine bir **sonuç** döndürüyor (`{ ok: false, error }`), yani zincir
**asla reddedilmez**. Bir kaydetme başarısız olsa bile sonrakiler
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
| 7 | Autosave'i `invitation` referansına bağlamak | Kaydetme yanıtı bir sonraki kaydetmeyi tetikler: sonsuz PUT |
| 8 | Geç gelen yanıtı belge değişmiş mi diye bakmadan yazmak | Yeni belge eski kaydın üzerine yazılır |
| 9 | Yayınlamadan önce yalnızca `recordId`'ye bakmak | Kaydetme başarısızken eski sürüm yayına çıkar |
| 10 | Çıkışta yalnızca `useAuthStore`'u temizlemek | Sonraki hesap önceki hesabın tasarımını görür |

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

---

## Ek — Sonradan yakalanan sıralama hataları

Faz 3'ten sonra yapılan bir denetimde, derleme ve mevcut `verify` betiklerinin
göremediği dört hata bu dosyada bulundu. Hepsi **sıralama** hatasıdır. Artık
`npm run verify:state` (`scripts/verify-editor-state.ts`) her birini sınıyor.

| Hata | Kök neden | Düzeltme |
|---|---|---|
| Editör açık kaldıkça ~1,5 sn'de bir PUT | Autosave `invitation` referansını izliyordu; kaydetme yanıtı da referansı değiştiriyor | Yalnızca `updateField`/`selectTemplate`'in artırdığı `editRevision` izleniyor |
| Uçuştaki kaydetme bitince yeni açılan belge eski kaydın kimliğini alıyor | Yanıt, belge değişmiş mi bakılmadan yazılıyordu | `documentGeneration`: `loadRecord`/`resetInvitation` artırır; kuşağı değişen kaydetme atlanır, yanıtı yok sayılır |
| Güncelleme başarısızken yayınlama yapılıyor | `publishInvitation` yalnızca `recordId`'ye bakıyordu | Kaydetme sonucu (`SaveOutcome`) döner; başarısızsa kaydetmenin kendi hatası fırlatılır |
| Başka hesapla girince önceki hesabın tasarımı ve kaydı kalıyor | Çıkış yalnızca auth store'u temizliyordu | Açık çıkışta `signOut()` her şeyi temizler. Oturum düşüp **farklı** hesap girerse sahiplik bekçisi (`documentOwnerId`) belgeyi sıfırlar; aynı hesap veya anonim taslak korunur |

> **Kuşak ile ilgili bilinçli ödünleşim:** Kuyrukta bekleyen bir kaydetme,
> belge değiştiyse **atlanır**. Yani çok yavaş bir ağda editörden çıkıp
> saniyenin altında başka bir kart açılırsa, önceki belgenin son birkaç
> düzenlemesi kaydedilmeyebilir. Alternatif — o kaydetmeyi yeni belgenin
> kimliğiyle çalıştırmak — bir belgenin içeriğini ötekinin üzerine yazmaktır.

---

## Ek — `documentVersion` ve `applyGallery`

### `documentVersion`

`documentGeneration` modül içinde kalır ve kaydetme kuyruğunu korur.
`documentVersion` ise aynı sayacın **bileşenlerin izleyebildiği** kopyasıdır.
`loadRecord` ve `resetInvitation` ikisini birlikte artırır.

Formlar (`useInvitationDraft`, `CoupleNameFields`) sürüm değişince bekleyen
gecikmeli yazımlarını **atar**. Yoksa "Bütün Alanları Sıfırla"dan hemen önce
yazılan metin 400 ms sonra sıfırlanmış davetiyeye geri yazılırdı.

> 🔴 Düzenleme, kaydetme yanıtı ve galeri güncellemesi sürümü **artırmaz**.
> Artırsaydı kullanıcının o anda yazdığı metin her otomatik kayıtta silinirdi.
> `verify:state` → "Belge sürümü (bekleyen form yazımları)".

Ayrıntı: `docs/rehber/src/hooks/useInvitationDraft.md`.

### `applyGallery(recordId, update)`

Galeri artık sunucuya aittir (`docs/rehber/src/services/media.md`). Yükleme ve
silme yanıtları yerel listeyi bu eylemle günceller:

```ts
applyGallery(invitationId, (images) => [...images, { id: media.id, url: media.url }]);
```

Yanıt gelene kadar başka bir kayıt açıldıysa (`recordId` farklıysa) güncelleme
**atlanır**. Böylece bir davetiyenin fotoğrafı ötekinin galerisinde görünmez.
`editRevision`'ı artırmaz: galeri kaydetme gövdesinde yoktur, otomatik kaydetme
tetiklemek için bir sebep yoktur.

---

## 🆕 Ek — Faz 10: sunucu bir modülü reddettiğinde (10.8b · K88)

### Ne değişti, neden?

Backend 10.1'den beri **yayındaki** bir davetiyede plan üstü bir modülün açılmasını
kayıt anında reddediyor: `PUT /invitations/{id}` → **402**
`PAYWALL_TIER_INSUFFICIENT`, `params.requiredTier`. Kaydın **tamamı** reddedilir;
aynı istekteki metin de yazılmaz (backend `PaywallTest` §11.2).

Editör bu 402'yi Faz 10'a kadar bir **bağlantı hatası** gibi karşılıyordu:

```
saveState = 'error'  →  "Kaydedilemedi — bağlantınızı kontrol edin"
anahtar AÇIK kalır   →  sonraki her düzenleme aynı PUT'u atar → yine 402
```

İki hata birden: yanlış mesaj ve **402 fırtınası** (plan tuzağı #2). Autosave 1,5
saniyelik boşluktan sonra her düzenlemede tüm davetiyeyi gönderdiği için,
açık kalan anahtar yazılan her harfle yeni bir 402 üretirdi.

### Akış

```
runSave → PUT → 402
   │
   ├─ paywallFromError(error, gönderilen, recordId)   ← useSubscriptionStore (10.8a)
   │     402 değilse → eski yol: saveState = 'error'
   │
   ├─ rollBackRejectedModules(gönderilen)
   │     açılan = gönderilende AÇIK ∧ son onaylananda KAPALI
   │     → o anahtarlar false, editRevision + 1, saveState = 'idle'
   │
   └─ openPaywall(…)   → reason 'upgrade', sunucunun requiredTier'ı
```

`editRevision + 1` otomatik kaydetmeyi yeniden kurar: 1,5 saniye sonra kalan
düzenlemeler (aynı penceredeki metin) **bayraksız** gider ve 200 alır.

### 🔴 "Hangi anahtar açılmıştı?" — `confirmedModules`

```ts
let confirmedModules: ModuleFlags | null = null;   // modül seviyesinde, render'a girmez
```

Sunucunun **son onayladığı** modül bayrakları. Üç yerde güncellenir:

| Ne zaman | Kaynak |
|---|---|
| `loadRecord` | Yüklenen kayıt |
| Başarılı `runSave` | Sunucunun yanıtı (`record.invitation`) |
| `publishInvitation` | Yayın yanıtı |

`resetInvitation`'da `null` olur: kaydedilmemiş bir belgenin onaylanmış bir hâli
yoktur (ve taslak 402 alamaz — backend taslağı serbest bırakır).

**Neden plan haritasına bakıp tahmin etmiyoruz?** Frontend'in de bir kopyası var
(`getRequiredTier()`). Ama o bir **sunum** kopyasıdır ve ayrışabilir. Ayrıştığı
gün geri alınması gereken anahtar geri alınmaz ve her kaydetme yeni bir 402
üretir — fırtına geri gelir. *"Sunucu en son neyi kabul etti?"* sorusu ise
tahmin gerektirmez: cevabı sunucunun kendi yanıtıdır.

| Seçenek | Aynı pencerede metin + Elit modül | Fiyat haritası ayrışınca |
|---|---|---|
| Plan haritasıyla tahmin | ✅ | 🔴 Geri alınmayan anahtar → fırtına |
| **Son onaylananla fark** ✅ | ✅ | ✅ |

Bilinen bedel: aynı 1,5 saniyelik pencerede **iki** modül açılırsa ve yalnızca biri
plan dışıysa, ikisi de geri alınır (kullanıcı plan içindekini yeniden açar).
Pencere tek tıklık; nadir ve zararsız.

### Geri alınacak bir şey yoksa

```ts
if (opened.length === 0) {
  set({ saveState: 'error' });
  return;                     // editRevision ARTIRILMAZ
}
```

Bu, ancak son onaylanan hâl **bayatsa** olur (aynı davetiye iki sekmede
düzenleniyor). Editör neyi geri alacağını bilemez. Sayaç artırılsaydı aynı 402'yi
otomatik olarak tekrarlayan bir döngü kurulurdu; artırılmayınca her 402 bir
**kullanıcı eylemine** bağlı kalır.

### Neden store paywall'ı açıyor?

Frontend `CLAUDE.md`: *"iş mantığı bileşenlerin dışında."* Otomatik kaydetmenin
sonucunu bekleyen bir bileşen yok (hook ateşler ve unutur), dolayısıyla 402'ye
cevap verebilecek tek yer kaydetmeyi yapan store'dur. `openPaywall` bir arayüz
çağrısı değil, başka bir store'un **durumunu** değiştirir; duvarı çizmek
`PaywallModal`'ın işi (CreatePage, 10.8d).

### Bu değişikliğin yapmadıkları

| Yapmaz | Nerede |
|---|---|
| Formdaki yerel taslağın bayat anahtarı geri yazmasını engellemek | `useInvitationDraft` (10.8c) |
| Duvarı formun olduğu aşamada da çizmek | `CreatePage` (10.8d) |
| Sayfadan ayrılırken boşaltılan kaydetmenin 402'sinden sonra kalanları kaydetmek | Otomatik kaydetme hook'u sayfayla birlikte ölür; kullanıcı döndüğünde bir sonraki düzenleme hepsini gönderir |

### Doğrulama

`npm run verify:state` → **"Yayındaki davetiyede plan üstü modül (Faz 10 · K88)"**
ve **"Geri alınacak modül yoksa"** bölümleri (10.8e). Mutasyonlar kum havuzunda
koşturuldu:

| Mutasyon | Kırılan kontrol |
|---|---|
| `rollBackRejectedModules` çağrısını sil | *"anahtar geri alınıyor"*, *"402 fırtınası yok"* (+4) |
| `editRevision + 1`'i sil | *"geri alma yeniden kaydetmeyi tetikliyor"* |
| `loadRecord`'da `confirmedModules`'ı yazma | *"anahtar geri alınıyor"* (+4) |
| Boş geri almada da sayacı artır | *"otomatik yeniden kaydetme döngüsü kurulmuyor"* |
| 402'yi bağlantı hatası say (`paywall && false`) | *"plan duvarı bir kez … açılıyor"* (+5) |

Elle: Standart ile bir davetiye yayınla → Panel → **Düzenle** → *Tasarımını
Düzenle* → **Fotoğraf Galerisi** anahtarını aç. Beklenen: 1,5 sn sonra plan duvarı
*"Planınızı Yükseltin"* başlığıyla **Elit** önerir, anahtar kendiliğinden kapanır,
Network sekmesinde 402'yi bir 200 izler. Duvarı kapatıp başka bir alan düzenle:
yeni bir duvar açılmamalı.
