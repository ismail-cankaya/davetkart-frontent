# `src/data.ts` — Faz 3 değişikliği

> **Kod dosyası:** `davetkart-frontent/src/data.ts`
> **Faz:** 3 — frontend uyarlaması, dosya F8/8 (son)
> **İlgili karar:** K44 — kimliği backend üretir

---

## 1. Değişen tek şey: `DEFAULT_TIMELINE_EVENTS`

```ts
// Once
{ id: 'tl-1', time: '17:00', title: 'Karşılama & Kokteyl', ... }

// Sonra
{ id: null, localKey: 'tl-default-1', time: '17:00', title: 'Karşılama & Kokteyl', ... }
```

Dosyanın 2400+ satırlık geri kalanına (şablon presetleri, kategoriler, plan
tanımları) dokunulmadı.

---

## 2. 🔴 `tl-1` neden tehlikeliydi?

Bu sabit, **her yeni davetiyenin** başlangıç programı. Yani varsayılanla başlayan
her kullanıcının programında `tl-1`, `tl-2`, `tl-3`, `tl-4` vardı.

Backend planlamasında bunu fark ettiğimizde K44'ün ikinci gerekçesi doğdu:

> Gelen id **evrensel olarak benzersiz değil** — `tl-1` her davetiyede aynı.

Sunucunun bu kimliklerle yapabileceği güvenli bir şey yoktu. `id: null` ile
belirsizlik ortadan kalkıyor: *"bu adım henüz kaydedilmedi, kimliği sen ver."*

---

## 3. `localKey` neden sabit, `Date.now()` değil?

```ts
localKey: 'tl-default-1'
```

`TimelineEditor` yeni adımlar için `tl-${Date.now()}-${index}` üretiyordu (F7).
Burada sabit metin yeterli, çünkü:

- `localKey` yalnızca **aynı liste içinde** benzersiz olmak zorunda
- Bu dört değer hiçbir zaman aynı listede tekrarlanmıyor
- Sabit değer **deterministik**: modül her yüklendiğinde aynı, testte öngörülebilir

`Date.now()` kullansaydık, modül seviyesinde bir sabit **çalışma anına bağlı**
olurdu — aynı davetiye iki farklı sekmede farklı anahtarlar alırdı. Zararsız ama
gereksiz bir belirsizlik.

> **İlke:** Sabit veriye rastgelelik veya zaman katma. Deterministik başlangıç,
> ayıklanabilir davranış demektir.

---

## 4. Aynı `INITIAL_INVITATION` nesnesi paylaşılıyor — sorun mu?

```ts
export const INITIAL_INVITATION: Invitation = {
  ...
  timelineEvents: DEFAULT_TIMELINE_EVENTS,
};
```

`resetInvitation()` her çağrıldığında **aynı** dizi referansı store'a giriyor.
Mutasyon olsaydı bu tehlikeli olurdu — bir davetiyedeki düzenleme diğerine
sızardı.

Sızmıyor, çünkü store hiçbir yerde diziyi **yerinde değiştirmiyor**:

```ts
commit(events.map((event) => ...))       // yeni dizi
commit([...events, yeniAdim])            // yeni dizi
commit(events.filter(...))               // yeni dizi
```

Üçü de yeni dizi üretiyor; `DEFAULT_TIMELINE_EVENTS` hiç dokunulmadan kalıyor.
Buna **değişmezlik** (immutability) denir ve React/Zustand ekosisteminin temel
varsayımıdır: durum değiştirilmez, **yerine yenisi konur**.

Backend'de aynı ilkeyi `CarbonImmutable` ile uygulamıştık (K23) — orada
`subDays()` orijinali bozuyordu, burada `push()` bozardı. Aynı sınıf hata, iki
farklı dilde.

---

## 5. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | Varsayılanlarda uydurma `id` bırakmak | Sunucu tanımadığı kimlik alır (K44 ihlali) |
| 2 | `localKey`'i `Date.now()` ile üretmek | Sabit veri deterministik olmaktan çıkar |
| 3 | `DEFAULT_TIMELINE_EVENTS`'i yerinde değiştirmek | Bir davetiyenin düzenlemesi diğerine sızar |
| 4 | Her davetiyeye ayrı sabit yazmak | Gereksiz tekrar; anahtar liste içinde benzersiz olsa yeter |

---

## 6. Frontend uyarlaması bitti

Sekiz dosyanın tamamı hazır. Doğrulama:

```powershell
npm run lint     # TypeScript: F1'de acilan uc hata kapandi mi?
npm run dev
```

Uçtan uca senaryo:

| # | Adım | Beklenen |
|---|---|---|
| 1 | Giriş yap, dashboard | Seeder'ın iki davetiyesi listelenir |
| 2 | "Düzenlemeye Devam Et" | Editör o kaydı açar |
| 3 | Başlığı değiştir, 2 sn bekle | Network: `PUT /api/invitations/{id}` — **POST değil** |
| 4 | Dashboard'a dön | Değişiklik görünür, **yeni kart oluşmaz** |
| 5 | "Yeni Davetiye Oluştur", bir şey yaz | Network: `POST` — ilk kayıt |
| 6 | Yazmaya devam et | Network: `PUT` — aynı kayıt |
| 7 | Program adımı ekle, kaydet, tekrar yaz | Giden gövdede `id` artık dolu |
| 8 | Bir kartta "Sil" → onayla | Kart anında kaybolur, sayfa yenilenince geri gelmez |

3. ve 4. adım F6'nın, 5-6 F4'ün, 7 `adoptServerIds`'in, 8 F5'in kanıtı.

---

## 7. Sırada ne var?

Faz 3'ün kalan iki işi backend tarafında, ikisi de doküman:

1. `docs/rehber/fazlar/FAZ-3.md` — faz özeti, yazılan 12+8 dosya, kurulan
   kurallar (K37-K44, D6, T13) ve Faz 4'e devir
2. `docs/rehber/fazlar/FAZ-3-ELLE-DOGRULAMA.md` — uçtan uca doğrulama betiği

Ve `claude/Notlar/03-FRONTEND-YAPILACAKLAR.md` güncellenecek: bu fazda kapanan
maddeler işaretlenip kalanlar (K20 çeviri katmanı, `restoreSession`) bırakılacak.
