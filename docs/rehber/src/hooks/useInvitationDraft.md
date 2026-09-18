# `src/hooks/useInvitationDraft.ts` — Formların gecikmeli store yazımı

> **Kullananlar:** `src/components/create/DetailsFormStep.tsx`,
> `src/components/editor/DesignerPanel.tsx`
> **İlgili:** `src/components/create/CoupleNameFields.tsx`, `useInvitationStore.documentVersion`
> **Denetim:** `npm run verify:state` (belge sürümü sözleşmesi)

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
| `flush()` | Bekleyen her şeyi hemen yazar (ör. form gönderimi) |

---

## 2. 🔴 Kapatılan hatalar

Hepsi sessizce veri kaybettiriyordu; hiçbiri derleme hatası vermiyordu.

| # | Hata | Nasıl oluyordu | Düzeltme |
|---|---|---|---|
| 1 | Yalnızca son alan yazılıyordu | Tasarım Stüdyosu'nda zamanlayıcı son düzenlenen alanın değerini yazıyordu. 400 ms içinde başlık, ardından mekân düzenlenince başlığın son harfleri kayboluyordu | Zamanlayıcı bekleyen **tüm** alanları yazar |
| 2 | Başka bileşenin yazdığı alan eziliyordu | Karşılaştırma yerel kopyanın tüm anahtarları üzerinden yapılıyordu. İsimler, program akışı ve galeri gibi store'a doğrudan yazılan alanlar eski değerleriyle geri yazılıyordu | Yalnızca formun **sahip olduğu** `fields` yazılır. Karşılaştırma store'un güncel hâliyle yapılır |
| 3 | Store senkronu yazılanı siliyordu | Yazım beklerken gelen bir store değişikliği (ör. kaydetme yanıtı) yerel kopyayı eziyordu | Senkron yalnızca bekleyen yazım yokken yapılır |
| 4 | Sıfırlanan davetiyeye eski metin geri yazılıyordu | Metin yazılıp hemen "Bütün Alanları Sıfırla"ya basılınca, 400 ms sonra bekleyen yazım sıfırlanmış belgeye düşüyordu | Store'daki `documentVersion` değişince bekleyen yazım **atılır** |

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
