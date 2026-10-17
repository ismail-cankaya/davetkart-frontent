# `konsept/harita/veri.ts` — haritanın veriden kurulan parçaları

> **Tarih:** 2026-10-17 · dal `design/harita` · Sözleşme: [KONSEPT-ORTAK §4](../../../../../tasarim/KONSEPT-ORTAK.md)

---

Saf hesap; bileşenler yalnızca çizer. Veride olmayan hiçbir şey üretilmez: boş alan `''` döner ve onu
çizecek satır hiç çizilmez.

## 1. `haritaTarihi(date)` → `{ gun, haftaGunu, saat }`

Duvar saatini (`2027-02-14T19:00`) saat dilimine çevirmeden parçalar: "14 Şubat 2027", "Pazar",
"19:00". Tarih boş ya da okunamıyorsa üçü de boş. Gün metni `formatCalendarDay`, okunamayan biçimde
`formatDateStr` ile gelir (ortak `templates/utils`).

## 2. `kisiler(names)`

`"A & B"` → `['A', 'B']`; boşlar atılır. Tek ad tek eleman döner, `&` çizilmez (duman testi: tek adda
`h1` = "Gülşen İrem").

## 3. `lejantKur(invitation, enCok = 3)`

| Durum | Lejant satırları |
|---|---|
| Program açık, dolu adım var | İlk en çok 3 adım (saat + başlık; başlık yoksa açıklama) + mekân; sığmayan adım sayısı `kalan` |
| Program kapalı ya da dolu adım yok | Tarih satırı ("Pazar, 14 Şubat 2027 · 19:00") + mekân |
| Hiçbiri yok | `bos: true` — lejant kutusu çizilmez |

Boş adım (sihirbazın iki boş satırı) `hasTimelineEventContent` ile elenir.

## 4. `durakSimgesi(baslik)`

Durak başlığı Türkçe küçük harfe çevrilip sözlükte aranır; ilk eşleşen simge döner, yoksa `null` (durak
sıra numarasıyla çizilir).

| Simge | Sözcükler (parça eşleşmesi) |
|---|---|
| `pasta` | pasta |
| `yuzuk` | nikâh, nikah, tören, yüzük, evlilik, "söz ", imza |
| `yemek` | yemek, **yemeğ** (ünsüz yumuşaması: "Akşam yemeği"), ziyafet, menü, sofra, kahvaltı, öğle |
| `kadeh` | karşılama, kokteyl, hoş geldin, ikram, içecek |
| `muzik` | dans, müzik, eğlence, kutlama, parti, konser, sahne, halay, " dj " |

Bu bir eşleme, bilgi üretimi değil: simge kullanıcının yazdığı başlıktan türer, eşleşmezse sayı çizilir.
Kına, sünnet gibi kategorilerde sözlük genişleyecek ("Kına töreni" bugün yüzük alır — kına
kategorisinde düzeltilmeli).
