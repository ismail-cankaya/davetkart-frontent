# `konsept/kitap/tarih.ts` — tarih satırları ve adlar

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (ortak yardımcılar, K10) · dal `design/kitap`

---

| İşlev | Girdi → çıktı |
|---|---|
| `kitapTarihi(date)` | `2027-02-13T19:00` → `{ gun: '13 Şubat 2027', haftaGunu: 'Cumartesi', saat: '19:00' }` |
| `tamTarih(t)` | → `Cumartesi, 13 Şubat 2027 · 19:00` (boş parçalar atılır) |
| `kisiler(names)` | `"A & B"` → `['A', 'B']`; boş → `[]` |

Duvar saati saat dilimine çevrilmez (bkz. `utils/eventTime.ts`): davetiye etkinliğin kendi saatini
yazar. Tarih boş ya da okunamıyorsa alanlar boştur; sayfa o satırı hiç çizmez. Gün metni
`formatCalendarDay` iledir (takvim günü UTC'ye kaymaz).

## Ortak yardımcılara bağlandı (2026-10-22)

| Kit | Bağlantı |
|---|---|
| `kisiler` | `export { splitPeople as kisiler } from 'utils/names'` |
| `kitapTarihi` | `eventDateParts(displayText(date))` → `{ gun: day, haftaGunu: weekday, saat: time }` |
| `tamTarih` | Kitte kalır (kitabın satır dili) |

Değer önce kırpılır (`displayText`): ortak ayrıştırıcı `new Date(' 2027-02-19T09:05 ')`'i okuyamıyor,
eski kit okuyordu.

**Önce/sonra karşılaştırması** (eski uygulamanın kopyası ile yenisi, aynı 28 girdi: 16 tarih, 12 ad):
26 aynı, 2 farklı — ikisi de backend'in göndermediği değerler:

| Girdi | Eski | Yeni |
|---|---|---|
| `2026-13-45T10:00` (geçersiz ay) | `14 Şubat 2027` (taşma) | boş |
| `Fri Feb 19 2027 19:00:00` (ISO değil) | boş | gün: `19 Şubat 2027 19:00` (ortak yardımcının belgeli davranışı, eventDate.md §2) |

Aynı kalanlar: saatli/saatsiz ISO, boşluklu ISO, `yyyy-MM-dd HH:mm`, `:ss`'li, yıl/ay sınırları, boş,
yalnızca boşluk, `null`, `undefined`, serbest metin, 30 Şubat (taşma iki tarafta aynı); adlarda
`A & B`, `& B`, `A &`, ` & `, boş, `A & B & C`, boşluksuz `&`, çevresi boşluklu uzun adlar, tek ad.
Duman testleri (düğün 96, nişan 384 sunucu çizimi) 0 hata.
