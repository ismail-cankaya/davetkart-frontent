# `src/components/create/TimelineEditor.tsx` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/components/create/TimelineEditor.tsx`
> **Faz:** 3 — frontend uyarlaması, dosya F7/8
> **İlgili karar:** K44 — kimliği backend üretir

---

## 1. K44'ün doğduğu dosya

Bu bileşen, backend planlamasında kararı değiştiren kanıttı:

```ts
// Devraldigimiz hal
const addEvent = () =>
  commit([...events, { id: `tl-${Date.now()}`, time: '20:00', title: '', description: '' }]);
```

Tarayıcı kendi kimliğini uyduruyor ve sunucuya gönderiyordu. Senin kararın:
*"frontend id üretmesin, id'ler backend tarafında üretilsin, o şekilde daha
güvenilir olur."*

Yeni hâli:

```ts
const addEvent = () =>
  commit([
    ...events,
    {
      id: null,                                    // sunucu verecek
      localKey: `tl-${Date.now()}-${events.length}`, // React icin
      time: '20:00',
      title: '',
      description: ''
    }
  ]);
```

---

## 2. `localKey` neden `Date.now()` **artı** indeks?

```ts
`tl-${Date.now()}-${events.length}`
```

`Date.now()` milisaniye döndürür. Kullanıcı "Program Adımı Ekle" düğmesine
hızlıca iki kez basarsa iki çağrı **aynı milisaniyeye** düşebilir ve anahtarlar
çakışır — React o iki satırı ayırt edemez.

Liste uzunluğunu eklemek bu ihtimali kapatıyor: aynı milisaniyede eklenen ikinci
adımda `events.length` zaten bir artmıştır.

`tl-` öneki de anlamlı: sunucudan gelen adımlar `srv-` taşıyor (F2 §3). Bir
anahtara bakınca kaynağını görüyorsun ve iki küme asla çakışmıyor.

---

## 3. 🔴 Eşleştirme `id` ile değil `localKey` ile

```ts
const patchEvent = (localKey: string, patch: Partial<TimelineEvent>) =>
  commit(events.map((event) => (event.localKey === localKey ? { ...event, ...patch } : event)));

const removeEvent = (localKey: string) =>
  commit(events.filter((event) => event.localKey !== localKey));
```

Eskiden `id` kullanılıyordu. Artık kullanılamaz, çünkü `id` **null olabilir** —
ve kullanıcı üç yeni adım eklerse üçünün de `id`'si `null` olur:

```ts
events.map((e) => (e.id === id ? ... : e))    // ❌ id === null → UCU BIRDEN eslesir
```

Somut sonuç: kullanıcı 2. adımın başlığını yazar, aynı metin 1. ve 3. adımda da
belirir. Ve silme düğmesi üç satırı birden siler.

`localKey` her adımda benzersiz olduğu için bu sınıf hataların tamamını kapatıyor.

> **Kalıp:** Bir listede eleman güncelliyorsan, eşleştirme anahtarının **her
> zaman dolu ve benzersiz** olduğundan emin ol. "Genelde dolu" yeterli değildir.

---

## 4. `key={event.localKey}`

```tsx
<motion.div key={event.localKey}>
```

React'in `key`'i listedeki elemanları render'lar arasında takip etmesini sağlar.
Anahtar değişirse React o elemanı **yok edip yeniden yaratır**: input'un içeriği,
imleç konumu ve animasyon durumu sıfırlanır.

`key={event.id}` yazsaydık iki sorun birden:

| Sorun | Sonuç |
|---|---|
| Yeni adımlarda `id === null` | React uyarı verir, satırları ayırt edemez |
| İlk kaydetmede `null` → `"12"` | Anahtar değişir, satır yeniden yaratılır → **kullanıcı yazarken imleç kaybolur** |

İkincisi özellikle sinsi: autosave 1,5 saniyede bir çalışıyor, yani kullanıcı
yazarken kimlikler geliyor. `localKey` kaydetmeden etkilenmediği için satırlar
kararlı kalıyor.

Bu, `localKey`'i ayrı bir alan yapmamızın en somut gerekçesi (F1 §4).

---

## 5. Değişmeyenler

Görsel yapı, animasyonlar ve erişilebilirlik etiketleri (`aria-label`) aynen
korundu. Faz 3 frontend uyarlaması bir **veri sözleşmesi** işi; tasarıma
dokunmuyor.

---

## 6. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | `key={event.id}` | Null anahtar + kaydetmede satır yeniden yaratılır |
| 2 | `id` ile eşleştirmek | Birden çok yeni adım aynı anda güncellenir/silinir |
| 3 | `localKey`'i yalnızca `Date.now()` yapmak | Hızlı tıklamada çakışma |
| 4 | `localKey`'i render sırasında üretmek | Her çizimde değişir, anahtar işlevini yitirir |
| 5 | `id: null` yerine yine metin uydurmak | K44 ihlali; sunucu tanımadığı kimlik alır |

---

## 7. Kendin dene

`npm run dev` → giriş yap → `/create` → editörde program bölümüne in.

1. **Üç adım ekle**, her birine farklı başlık yaz → başlıklar karışmamalı
2. Ortadaki adımı **sil** → yalnızca o gitmeli
3. Network sekmesini aç, bir harf yaz ve 1,5 saniye bekle → giden gövdede
   `"id": null` görmelisin
4. Yanıt döndükten sonra tekrar yaz → bu kez `"id": "12"` gibi **sunucu
   kimlikleri** gitmeli (F4'ün `adoptServerIds` işi)
5. Yazarken imleç kaybolmamalı — anahtarların kararlı olduğunun kanıtı

---

## 8. Sırada ne var?

**F8 — `src/data.ts`.** Varsayılan programın `tl-1`…`tl-4` kimlikleri.

---

## 9. Güncelleme — boş adımlar ve güvenilir anahtar

> **İlgili dosya:** `src/utils/timelineEvents.ts`
> **Denetim:** `npm run verify:content`

### Yeni adım artık boş doğuyor

§1'deki `time: '20:00'` kaldırıldı. Yeni adım `createTimelineEvent()` ile
üretilir ve **tüm alanları boştur**; sihirbazın başlangıçtaki iki adımıyla aynı
biçimdedir. Örnek saat, kullanıcı fark etmeden misafire giden gerçek bir saate
dönüşüyordu. Placeholder'lar da örnek etkinlik yerine talimat taşır: "Adım
başlığını giriniz", "Kısa açıklama giriniz (opsiyonel)".

### 🔴 `tl-${Date.now()}-${events.length}` neden yetmedi?

§2'nin gerekçesi *"aynı milisaniyede eklenen ikinci adımda liste uzunluğu bir
artmıştır"* idi. Silme bu varsayımı bozar:

```
[a, b]           → ekle          → [a, b, tl-T-2]
[a, b, tl-T-2]   → a'yı sil      → [b, tl-T-2]      (uzunluk yine 2)
[b, tl-T-2]      → aynı ms'de ekle → tl-T-2         ❌ çakışma
```

Yeni anahtar modül içinde **tekdüze artan bir sayaçla** üretilir
(`tl-<zaman36>-<sayaç36>`): aynı oturumda iki kez aynı değeri veremez. Zaman
damgası yalnızca Vite HMR modülü yeniden yüklediğinde sıfırlanan sayaca karşı
sigortadır.

### İşleyiciler store'dan taze okur

`patchEvent`, `addEvent` ve `removeEvent` render anındaki `events` kopyasıyla
değil `useInvitationStore.getState()` ile çalışır. Kaydetme yanıtı araya girip
adımlara sunucu kimliği yazmışsa eski kopyayla yazmak o kimlikleri `null`'a
geri çevirir; bir sonraki kaydetme satırları silip yeniden oluştururdu.

### Tüm adımlar silinirse

| Katman | Davranış |
|---|---|
| Editör | "Program akışında henüz adım yok…" notu + ekleme düğmesi |
| Önizleme | Program bölümü başlığıyla birlikte gizlenir |
| Kaydetme | `timelineEvents: []` gider; backend bunu "hepsini sil" olarak uygular (`null` "dokunma" demektir) |

### Önizleme

`shared/Timeline.tsx` artık `key={event.localKey}` kullanıyor. Eskiden
`event.id` idi — §4'te editör için anlatılan iki sorun önizlemede de
vardı. Yalnızca `hasTimelineEventContent` olan adımlar çizilir; saat, başlık ve
açıklama satırları da ayrı ayrı, yalnızca doluysa basılır.
