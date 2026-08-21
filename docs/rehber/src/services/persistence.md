# `src/services/persistence.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/services/persistence.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F3/8

---

## 1. Bu dosyanın işi: sınır çizmek

Dosyanın kendi yorumu amacını söylüyor: *"Stores talk only to this interface,
never to a transport directly."*

Yani store'lar `axios` görmez, URL görmez, HTTP durum kodu görmez. Yalnızca
**ne istediklerini** söyler:

```
useInvitationStore  →  persistenceService.updateInvitation(id, invitation)
                          ↓
                       invitationService  →  api.put('/invitations/...')
```

Kazancı: yarın çevrimdışı destek veya önbellek eklemek istersen tek bir
uyarlayıcı yazarsın; hiçbir store değişmez. Buna **bağımlılığın tersine
çevrilmesi** (dependency inversion) denir — üst katman somut taşımaya değil,
soyut arayüze bağlıdır.

---

## 2. Ne değişti?

**Önce:**

```ts
getInvitation(): Promise<Invitation | null>;
saveInvitation(invitation: Invitation): Promise<void>;
```

**Sonra:**

```ts
listInvitations(): Promise<InvitationRecord[]>;
createInvitation(invitation: Invitation): Promise<InvitationRecord>;
updateInvitation(id: string, invitation: Invitation): Promise<InvitationRecord>;
deleteInvitation(id: string): Promise<void>;
```

Üç fark var.

### 2.1 Metotlar artık **kimlik** taşıyor

Eski arayüz "kullanıcının davetiyesi" diye tekil bir şeyden bahsediyordu. K37
ile bu varsayım kalktı: bir hesabın birden çok davetiyesi olabilir, dolayısıyla
"hangisi?" sorusu arayüzün parçası oldu.

### 2.2 `Invitation` değil, `InvitationRecord` dönüyor

Eski `getInvitation()` yalnızca **tasarımı** döndürüyordu; kimlik ve durum
"dashboard'un işi" diye dışarıda bırakılmıştı.

Artık dönüş `InvitationRecord` — yani `{id, status, updatedAt, invitation}`.
Sebep: store kaydettikten sonra **sunucunun verdiği kimliğe** ihtiyaç duyuyor.
Bilgi zaten yanıtta; onu düşürmek çağıranı ikinci bir istek atmaya zorlardı.

### 2.3 `deleteInvitation` yeni

Backend'in DELETE ucu (3.11) için. `Promise<void>` çünkü sunucu 204 dönüyor —
gövde yok.

---

## 3. Sınır neden yeniden düzenlendi?

Faz 3'ten önce bir tutarsızlık vardı: `useDashboardData` bu arayüzü **atlayıp**
doğrudan `invitationService`'i çağırıyordu.

```ts
import { invitationService } from '../services/invitations';   // ❌ sinir delinmis
```

Küçük bir kaçak gibi görünür ama sınırın anlamını yok eder: "store'lar yalnızca
bu arayüzle konuşur" sözü artık doğru değildi. Faz 2'nin **B4** kuralı burada da
geçerli — *dokümanda verilen söz, kodda karşılığı yoksa yalandır.*

F5'te `useDashboardData` bu arayüze döndürüldü. Şimdi söz gerçekten tutuluyor.

---

## 4. `getInvitation()` neden tamamen kaldırıldı?

Eski store, modül yüklenirken "kullanıcının davetiyesini" çekip editöre
dolduruyordu. Çoklu davetiyede bunun karşılığı yok: **hangisini** doldursun?

Yeni akış:

```
/create'e dogrudan gir      → bos taslak (recordId: null)
Dashboard'dan "Duzenle"     → o kayit yuklenir (recordId dolu)
```

Tekil okuma (`get(id)`) `invitationService`'te duruyor ama arayüze eklemedik:
bugün çağıranı yok. İhtiyaç doğduğunda (örneğin `/create?id=...` derin bağlantısı)
eklenir — **YAGNI**.

---

## 5. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | Store'dan doğrudan `invitationService` çağırmak | Sınır delinir, soyutlama yalana döner |
| 2 | `Invitation` döndürüp kimliği düşürmek | Çağıran ikinci istek atmak zorunda kalır |
| 3 | Arayüze bugün kullanılmayan metot eklemek | Ölü kod, YAGNI |
| 4 | HTTP ayrıntısını (durum kodu, header) arayüze sızdırmak | Uyarlayıcı değiştirilemez hâle gelir |

---

## 6. Sırada ne var?

**F4 — `stores/useInvitationStore.ts`.** Frontend uyarlamasının kalbi: editör
ilk kez "hangi kaydı düzenliyorum?" sorusunun cevabını taşıyacak, ve autosave'in
yarış durumu kapatılacak.
