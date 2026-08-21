# `src/hooks/useDashboardData.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/hooks/useDashboardData.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F5/8

---

## 1. Tek kayıt varsayımının son kalesi

Devraldığımız kod tek bir kayıt tutuyor ve onu diziye sarıyordu:

```ts
const [record, setRecord] = useState<InvitationRecord | null>(null);
...
published: record?.status === 'published' ? [record] : [],
saved:     record?.status === 'saved' ? [record] : [],
```

Yorumu bile geçiciliğini itiraf ediyordu: *"the array shape keeps the card grid's
rendering contract stable and leaves room for a multi-invitation plan later."*

O "later" bu faz. Artık gerçek bir dizi:

```ts
const [records, setRecords] = useState<InvitationRecord[]>([]);
...
const published = useMemo(() => records.filter((r) => r.status === 'published'), [records]);
const saved     = useMemo(() => records.filter((r) => r.status === 'saved'), [records]);
```

`DashboardPage`'in kart ızgarası zaten dizi üzerinden çalıştığı için **hiç
değişmedi** — devraldığımız kod bu geçişi öngörmüş.

---

## 2. `useMemo` neden gerekli?

`filter()` her çağrıldığında **yeni bir dizi nesnesi** üretir. `useMemo` olmadan
her render'da yeni referanslar doğar ve onları prop olarak alan bileşenler
gereksiz yere yeniden çizilir.

```ts
useMemo(() => records.filter(...), [records])
```

İkinci parametre **bağımlılık dizisi**: yalnızca `records` değiştiğinde yeniden
hesaplanır, aksi hâlde önceki dizi aynen döner.

`DashboardPage` bu değerleri kendi `useMemo`'suna sokuyor (`cardsByTab`);
referans kararlı olmasaydı o memo da her render'da boşa çalışırdı.

---

## 3. Sınır düzeltildi

```ts
import { persistenceService } from '../services/persistence';   // ✅
// import { invitationService } from '../services/invitations'; ❌ eskiden boyleydi
```

Bu hook, `persistence.ts`'in *"store'lar yalnızca bu arayüzle konuşur"* sözünü
delen tek yerdi (F3 §3). Artık söz tutuluyor.

---

## 4. 🔴 `remove()` — iyimser güncelleme

```ts
const remove = useCallback(async (id: string) => {
  setRecords((prev) => prev.filter((record) => record.id !== id));   // once ekranda sil
  try {
    await persistenceService.deleteInvitation(id);
  } catch (error) {
    await load();      // basarisizsa sunucudaki gercek durumu geri yukle
    throw error;
  }
}, [load]);
```

İki yaklaşım vardı:

| | Karamsar | **İyimser** (seçilen) |
|---|---|---|
| Kart ne zaman kaybolur | Sunucu yanıtından sonra | **Hemen** |
| Kullanıcı deneyimi | Tıklar, bekler, sonra kaybolur | Anında tepki |
| Hata olursa | Hiçbir şey olmamıştır | Kart **geri gelir** |

İyimser güncelleme, işlemin başarılı olacağını varsayıp arayüzü önce değiştirir.
Silme için uygun: neredeyse her zaman başarılı olur ve başarısızlık **geri
alınabilir**.

🔴 Kritik olan `catch` bloğu: hata durumunda `load()` çağrılıyor, yani ekran
sunucudaki gerçek duruma geri dönüyor. Bu olmadan kullanıcı silinmiş sandığı bir
davetiyenin aslında durduğunu ancak sayfayı yenileyince fark ederdi.

> **Kural:** İyimser güncelleme, geri alma yolu yazıldığında iyimserdir.
> Yazılmadığında sadece yalandır.

`throw error` ile hata çağırana da iletiliyor — `DashboardPage` bunu yakalayıp
kullanıcıya bildirim gösteriyor (F6).

---

## 5. Hata durumunda liste neden boşaltılıyor?

```ts
} catch {
  setRecords([]);
  setRemoteError(true);
}
```

Ağ hatasında eski listeyi ekranda bırakmak cazip görünür ("hiç yoktan iyidir").
Bırakmıyoruz: kullanıcı o kartlara tıklar, düzenler, kaydeder — hâlâ ulaşılamayan
bir sunucuya. **Bayat veri, olmayan veriden daha yanıltıcıdır.**

`remoteError` bayrağı `DashboardPage`'de "Sunucuya ulaşılamadı" uyarısını ve
"Tekrar Dene" düğmesini gösteriyor. Durum kullanıcıya **dürüstçe** bildiriliyor.

---

## 6. `useCallback` neden var?

```ts
const load = useCallback(async () => { ... }, []);

useEffect(() => { void load(); }, [load]);
```

`useEffect`'in bağımlılığı `load`. `useCallback` olmadan `load` her render'da
yeni bir fonksiyon olurdu, `useEffect` her render'da tekrar çalışırdı ve **sonsuz
istek döngüsü** doğardı.

Boş bağımlılık dizisi (`[]`) `load`'un kimliğini sabitliyor.

`void load()` yazımı ise "bu promise'i bilerek beklemiyorum" demek — ESLint'in
"floating promise" uyarısını susturan, niyeti açık eden bir işaret.

---

## 7. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | `filter()` sonucunu memo'lamamak | Her render'da yeni referans, gereksiz çizim |
| 2 | `useCallback` kullanmamak | `useEffect` sonsuz döngüye girer |
| 3 | İyimser silmede `catch` yazmamak | Silinmemiş kayıt silinmiş görünür |
| 4 | Hata durumunda bayat listeyi bırakmak | Kullanıcı ulaşılamayan sunucuya yazar |
| 5 | Servisi doğrudan çağırmak | `persistence` sınırı delinir |

---

## 8. Sırada ne var?

**F6 — `pages/DashboardPage.tsx`.** Kartlar kaydın tamamını taşıyacak (kimlik
düşmesin), ve silme düğmesi bağlanacak.
