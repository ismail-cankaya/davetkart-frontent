# `src/hooks/useInvitationDraft.ts` — Formların gecikmeli store yazımı

> **Kullananlar:** `src/components/create/DetailsFormStep.tsx`,
> `src/components/editor/DesignerPanel.tsx`
> **İlgili:** `src/components/create/CoupleNameFields.tsx`, `useInvitationStore.documentVersion`
> **Denetim:** `npm run verify:state` (belge sürümü sözleşmesi · 🆕 Faz 10: "Form taslağı (bekleyen yazım)")
> 🆕 **Faz 10**, adım 10.8c: hata 5 ve `pendingWrites()` (§6)

---

## 1. Neden var?

Formlar her tuşta store'a yazsaydı canlı önizleme de her tuşta yeniden
çizilirdi. Bu yüzden iki form da yerel bir kopya tutar, store'a ise yazma durunca
(400 ms) yazar.

Sihirbaz formu ve Tasarım Stüdyosu bu mantığı **ayrı ayrı** yazmıştı ve ikisi
de farklı biçimlerde veri kaybediyordu. Hook ikisini tek yerde topladı.

```ts
const { draft, setField, commit, flush } = useInvitationDraft(['title', 'date', 'venue', 'subtitle']);
```

| Dönen | Ne yapar |
|---|---|
| `draft` | Formun çizdiği yerel kopya — her tuşta anında güncellenir |
| `setField(name, value)` | Metin alanı: yerelde hemen, store'da yazma durunca |
| `commit(patch)` | Anahtar veya seçim gibi anında yazılan değişiklik. Bekleyen metni de birlikte yazar |
| `flush()` | Bekleyen her şeyi hemen yazar (ör. form gönderimi) — 🆕 ve taslağı store'a eşitler |

---

## 2. 🔴 Kapatılan hatalar

Hepsi sessizce veri kaybettiriyordu; hiçbiri derleme hatası vermiyordu.

| # | Hata | Nasıl oluyordu | Düzeltme |
|---|---|---|---|
| 1 | Yalnızca son alan yazılıyordu | Tasarım Stüdyosu'nda zamanlayıcı son düzenlenen alanın değerini yazıyordu. 400 ms içinde başlık, ardından mekân düzenlenince başlığın son harfleri kayboluyordu | Zamanlayıcı bekleyen **tüm** alanları yazar |
| 2 | Başka bileşenin yazdığı alan eziliyordu | Karşılaştırma yerel kopyanın tüm anahtarları üzerinden yapılıyordu. İsimler, program akışı ve galeri gibi store'a doğrudan yazılan alanlar eski değerleriyle geri yazılıyordu | Yalnızca formun **sahip olduğu** `fields` yazılır. Karşılaştırma store'un güncel hâliyle yapılır |
| 3 | Store senkronu yazılanı siliyordu | Yazım beklerken gelen bir store değişikliği (ör. kaydetme yanıtı) yerel kopyayı eziyordu | Senkron yalnızca bekleyen yazım yokken yapılır |
| 4 | Sıfırlanan davetiyeye eski metin geri yazılıyordu | Metin yazılıp hemen "Bütün Alanları Sıfırla"ya basılınca, 400 ms sonra bekleyen yazım sıfırlanmış belgeye düşüyordu | Store'daki `documentVersion` değişince bekleyen yazım **atılır** |
| 5 | 🆕 Store'un geri aldığı alan geri yazılıyordu (Faz 10) | Yazım beklerken store formun **kendi** alanlarından birini değiştirince (402 ile geri alınan modül anahtarı) yazım o alanı taslaktaki bayat değerle geri yazıyordu | Yalnızca formun **değiştirdiği** alanlar (`dirty`) yazılır; yazımdan sonra taslak store'a eşitlenir (§6) |

### Neden ayrılırken yazılır, belge değişince atılır?

- **Bileşen ayrılıyor** (ör. form gönderildi, sahne değişti): Belge aynıdır ve
  kullanıcının yazdığı veri o belgeye aittir → **yazılır**.
- **Belge değişti** (`resetInvitation`, `loadRecord`): Bekleyen yazım eski
  belgeye aittir. Yeni belgeye yazılması, bir belgenin içeriğini ötekine
  taşımak olur → **atılır**.

`CoupleNameFields` kendi zamanlayıcısını tutar (iki alan tek `names` metnine
yazılır). Aynı `documentVersion` kuralını o da uygular.

---

## 3. `documentVersion` sözleşmesi

| İşlem | `documentVersion` |
|---|---|
| `updateField`, `selectTemplate` | Değişmez |
| `saveInvitation` yanıtı | Değişmez |
| `applyGallery` | Değişmez |
| `resetInvitation`, `loadRecord` | **Artar** |

> **Kritik:** Kaydetme yanıtı sürümü artırsaydı, kullanıcının o anda yazdığı
> metin her otomatik kayıtta sessizce silinirdi. `verify:state` bunu sınar.

---

## 4. Tarayıcıda doğrulananlar

| Senaryo | Sonuç |
|---|---|
| Formda metin yazılıp hemen "Davetiyeni Oluştur" | `flush` metni store'a yazdı |
| Stüdyoda başlığa yazılıp hemen "Bütün Alanları Sıfırla" | 4 sn sonra bile metin geri gelmedi |
| Stüdyoda mekân, hemen ardından başlık | İkisi de store'a ve önizlemeye yazıldı |

---

## 5. Yeni bir forma eklerken

1. Formun **sahip olduğu** alanları sabit bir dizi olarak tanımlayın. Dizi satır
   içinde de verilebilir: hook onu ref'te tutar.
2. Metin alanlarında `setField`, anahtar ve seçimlerde `commit` kullanın.
3. Gönderimde `flush()` çağırın.
4. Aynı alanı iki bileşene birden yazdırmayın: iki yerel kopya birbirini ezer.

---

## 6. 🆕 Faz 10 — yalnızca değiştirilen alanlar yazılır (10.8c)

### 6.1 Hatanın senaryosu

Yayındaki bir davetiye, Standart plan. Kullanıcı **Hediye / İBAN** anahtarını açar
ve beliren alanlara hemen banka adını yazmaya başlar:

```
t=0.0  commit({ showGift: true })      → store: showGift = true, otomatik kaydetme planlanır
t=0.2  setField('bankName', 'Z…')      → yazım 400 ms bekliyor (zamanlayıcı kurulu)
t=1.5  otomatik kaydetme → PUT {showGift: true} → 402
       store: showGift = false  (10.8b geri aldı)
       taslak senkronu ATLANIR — yazım bekliyor (hata 3'ün kuralı)
t=1.7  kullanıcı durur → flush()
```

Eski `flush()`:

```ts
for (const key of fieldsRef.current) {                        // formun TÜM alanları
  if (snapshot[key] !== stored[key]) updateField(key, snapshot[key]);
}
// showGift: taslak true ≠ store false → updateField('showGift', true)   🔴
```

Anahtar **geri açılır**, bir sonraki kaydetme yine 402 alır, duvar yine açılır.
Hata 2'nin düzeltmesi (*"yalnızca formun sahip olduğu alanlar"*) burada yetmiyor,
çünkü `showGift` gerçekten formun alanı. Ayrım **sahiplik** değil, **değişiklik**:
bu yazımda kullanıcı `showGift`'e dokunmadı.

### 6.2 Düzeltme: `dirty` kümesi

```ts
const dirtyRef = useRef<Set<F>>(new Set());

setField(name, value)  →  dirtyRef.current.add(name)
commit(patch)          →  patch'in anahtarları eklenir
flush()                →  yalnızca dirty alanlar yazılır, küme boşaltılır
belge değişti          →  küme boşaltılır (bekleyen yazım atılıyordu zaten)
```

Karar saf bir fonksiyonda:

```ts
export function pendingWrites<F extends keyof Invitation>(
  dirty: ReadonlySet<F>, draft: Invitation, stored: Invitation
): F[] {
  return [...dirty].filter((key) => draft[key] !== stored[key]);
}
```

**Neden ayrı ve dışa açık?** Hook'un kendisi React'e bağlı (`useState`,
`useEffect`); `verify:state` betiği React çizmeden çalışıyor. Kararı saf bir
fonksiyona çıkarmak onu **test edilebilir** kıldı — hatanın senaryosu betikte
birebir sınanıyor:

```ts
const stored = { ...INITIAL_INVITATION, showGift: false, bankName: '' };             // store geri aldı
const draft  = { ...INITIAL_INVITATION, showGift: true,  bankName: 'Ziraat Bankası' }; // taslak bayat
pendingWrites(new Set(['bankName']), draft, stored);   // → ['bankName']  ✅ showGift yok
```

### 6.3 `flush()`'ın sonunda taslak store'a eşitlenir

```ts
const latest = useInvitationStore.getState().invitation;
draftRef.current = latest;
setDraftState(latest);
```

`dirty` düzeltmesi store'u korur, ama **ekranı** değil: taslakta `showGift` hâlâ
`true` kalırsa anahtar ekranda açık görünür. Hata 3'ün senkron efekti bunu çoğu
zaman düzeltir (yazım store'u değiştirince efekt yeniden çalışır). Ama yazılacak
hiçbir şey kalmadıysa store değişmez, efekt çalışmaz ve taslak bayat kalır.
`flush()` bittiğinde bekleyen yazım yoktur; taslağın store'dan farklı olması için
bir sebep de yoktur. Eşitleme bu değişmezi **açıkça** kurar.

### 6.4 Mutasyon

`pendingWrites`'ın gövdesini eski davranışa çevir (`Object.keys(draft)` üzerinden
tüm farklı alanlar) → `verify:state`'in iki kontrolü kırılır:
*"store'un geri aldığı anahtar geri yazılmıyor"* ve *"store'dakiyle aynı olan alan
yeniden yazılmıyor"*. Kum havuzunda koşturuldu.

### 6.5 Yeni bir forma eklerken (5. maddeye ek)

5. Store'un formun alanlarından birini **kendisinin** değiştirebileceğini varsay
   (sunucu reddi, sıfırlama). Formun yazacağı şey, kullanıcının bu yazımda
   değiştirdiği şeydir — gördüğü her şey değil.
