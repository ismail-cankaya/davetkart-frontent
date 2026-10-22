# `konsept/harita/veri.ts` — haritanın veriden kurulan parçaları

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (nişan sözlüğü, K9) · dal `design/harita` · Sözleşme: [KONSEPT-ORTAK §4](../../../../../tasarim/KONSEPT-ORTAK.md)

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

Durak başlığı Türkçe küçük harfe çevrilip başına ve sonuna boşluk eklenerek sözlükte aranır; **sıra
önemlidir**, ilk eşleşen simge döner, yoksa `null` (durak sıra numarasıyla çizilir).

| Sıra | Simge | Sözcükler (parça eşleşmesi) |
|---|---|---|
| 1 | `pasta` | pasta |
| 2 | `halka` | nişan, nisan, "söz " (boşluklu: "Söz", "Söz kesme" evet; "Sözleşme" hayır) |
| 3 | `yuzuk` | nikâh, nikah, tören, toren, yüzük, **yüzüğ** ("Nişan yüzüğü" → halka, "Yüzüğün takılması" → yüzük), evlilik, imza |
| 4 | `kurdele` | kurdele |
| 5 | `kahve` | kahve — kadehten önce: "Kahve ikramı" kahve alır, kadeh değil |
| 6 | `cay` | " çay" |
| 7 | `tatli` | tatlı, tatli, baklava, lokum, çikolata |
| 8 | `yemek` | yemek, **yemeğ** (ünsüz yumuşaması: "Akşam yemeği"), ziyafet, menü, sofra, kahvaltı, öğle |
| 9 | `kadeh` | karşılama, kokteyl, hoş geldin, ikram, içecek |
| 10 | `muzik` | dans, müzik, eğlence, kutlama, parti, konser, sahne, halay, " dj " |
| 11 | `kamera` | fotoğraf, fotograf, çekim |

Denendi (`npx tsx`, 2026-10-22): Karşılama → kadeh · Tören → yüzük · Akşam yemeği → yemek · Kutlama →
müzik · Söz, Söz kesme, Nişan, Nişan töreni, Nişan yüzüğü → halka · Yüzük takma, Yüzüklerin takılması
→ yüzük · Kurdele kesimi → kurdele · Kahve ikramı, Kahve ve tatlı ikramı → kahve · Tatlı ikramı,
Baklava, Çikolata ikramı → tatlı · Çay ikramı → çay · Fotoğraf çekimi → kamera · Pasta kesimi → pasta ·
Sözleşme, Gelin alma, Kına → sıra numarası. Düğün örnek programının dört simgesi değişmedi.

Bu bir eşleme, bilgi üretimi değil: simge kullanıcının yazdığı başlıktan türer, eşleşmezse sayı çizilir.
"Kız isteme" gibi geleneği ima eden ama simgeyi adlandırmayan başlıklar bilerek eşlenmedi (kahve
çıkarımı veri uydurmak olurdu). Kına, sünnet gibi kategorilerde sözlük genişleyecek ("Kına töreni"
bugün yüzük alır — kına kategorisinde düzeltilmeli).
