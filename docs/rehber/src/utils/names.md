# `src/utils/names.ts` — İki isim, tek metin

> **Kullananlar:** `CoupleNameFields.tsx` (yazma), `TemplateRenderer.tsx` ve
> `DashboardPage.tsx` (gösterme); `splitPeople` → `nisan/parts/kagitOrtak.ts` ve konsept kitleri
> **Denetim:** `npm run verify:content` ("İsim alanları")

---

## 1. Sorun

Davetiye isimleri tek bir metinde saklanır: `"Ayşe & Ali"`. Form ise iki ayrı
alan gösterir ("Gelin Adı" / "Damat Adı").

Eski `joinNames('', 'Ali')` yalnızca `'Ali'` döndürüyordu. Form yeniden
açıldığında `splitNames('Ali')` sonucu `['Ali', '']` oluyordu. Yani **yalnızca
damadın adı girilmişse isim gelinin alanına kayıyordu**.

## 2. Çözüm: saklama biçiminde ayraç

| Girilen | Saklanan | Formda geri okunan | Ekranda |
|---|---|---|---|
| Gelin: Ayşe, Damat: Ali | `Ayşe & Ali` | `['Ayşe', 'Ali']` | `Ayşe & Ali` |
| Yalnızca gelin: Ayşe | `Ayşe` | `['Ayşe', '']` | `Ayşe` |
| Yalnızca damat: Ali | `& Ali` | `['', 'Ali']` | `Ali` |
| İkisi de boş | `''` | `['', '']` | Şablonun yedek metni |

`& Ali` bir **saklama** biçimidir; ekrana basılmaz.

## 3. 🔴 `displayNames` nerede uygulanır?

Tek tek şablonlarda **değil**, giriş kapılarında:

| Kapı | Neden |
|---|---|
| `TemplateRenderer` | 180+ şablonun, zarfın ve takvim kısayolunun tek girişi. İsim değişmediyse aynı nesne geçer, şablon memo'su bozulmaz |
| `DashboardPage` | Kart başlığı, alt başlık, silme onayı, LCV kapsam düğmeleri |

Yeni bir yerde isim gösterecekseniz `invitation.names` yerine
`displayNames(invitation.names)` kullanın. Aksi hâlde kullanıcı `& Ali` görür.

Backend isimleri yalnızca saklar ve geri döndürür (e-posta ya da paylaşım
metninde kullanmaz). Bu yüzden backend tarafında değişiklik gerekmedi.

## 4. Tarayıcıda doğrulananlar

- Yalnızca "Damat Adı"na `Ali` yazıldı. Store'a `& Ali` olarak yazıldı.
- Sihirbazdan Tasarım Stüdyosu'na geçildi, alanlar yeniden oluştu: `Ali` hâlâ
  "Damat Adı"nda.
- Önizlemede `Ali` görünüyor, `& Ali` hiçbir yerde görünmüyor.

## 5. `splitPeople` — adları kişi kişi ayırmak (2026-10-22, dal `design/konsept-ortak`)

Kâğıt kiti (`kagitOrtak.kisiler`) ve üç konsept kiti (Sergi `metin.ts`, Kitap `tarih.ts`, Harita
`veri.ts`) aynı dört satırı ayrı ayrı yazmıştı. Ortak hâli buradadır:

| Girdi | `splitPeople` | `splitNames` |
|---|---|---|
| `Ayşe & Ali` | `['Ayşe', 'Ali']` | `['Ayşe', 'Ali']` |
| `& Ali` (saklama biçimi) | `['Ali']` | `['', 'Ali']` |
| `A & B & C` | `['A', 'B', 'C']` | `['A', 'B & C']` |
| `''`, `null`, `undefined` | `[]` | — |

`splitNames` form alanlarının sırasını korur (hangi alan boş); `splitPeople` yalnızca **çizilecek**
adları verir. Davranış eski `kisiler` ile birebir aynıdır (12 tarih + 11 ad girdisiyle eski ve yeni
uygulama karşılaştırıldı).

Kitler kendi `kisiler`'lerini silip `export { splitPeople as kisiler } from '…/utils/names';` ile
bağlanır; çağıran kod değişmez.

