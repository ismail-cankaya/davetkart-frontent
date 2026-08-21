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
