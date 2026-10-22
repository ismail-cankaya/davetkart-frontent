# `shared/eventDate.ts` — tarihin satır satır parçaları

> **Kullananlar:** `nisan/parts/kagitOrtak.ts` (`kagitTarih`); konsept kitleri bağlanacak (aşağıda)
> **Tarih:** 2026-10-22 · dal `design/konsept-ortak` · Karar: KONSEPT-ORTAK §8 (K10)

---

## 1. Neden?

Aynı ayrıştırıcı dört kez yazılmıştı: Kâğıt `kagitTarih`, Harita `haritaTarihi` (birebir kopya), Kitap
`kitapTarihi`, Sergi `etiketTarihi`. Hepsi `yyyy-MM-ddTHH:mm` duvar saatini gün, hafta günü ve saat
satırlarına ayırıyor; farkları yalnızca hangi parçayı nasıl yazdıkları.

Dosya `src/utils/` yerine `shared/`'dadır: biçimleyiciler (`formatDateStr`, `formatCalendarDay`)
`templates/utils.ts`'te durur ve `src/utils` bileşen katmanından içe aktarmaz.

## 2. `eventDateParts(date)`

| Alan | Örnek (`2026-11-14T19:00`) | Tarih boşsa |
|---|---|---|
| `day` | `14 Kasım 2026` | `''` |
| `dayMonth` | `14 Kasım` | `''` |
| `year` | `2026` | `''` |
| `weekday` | `Cumartesi` | `''` |
| `time` | `19:00` (saat girilmemişse `''`) | `''` |
| `hour`, `minute` | `19`, `00` | `''` |

- Saat dilimine çevrilmez: davetiye etkinliğin kendi saatini yazar (`utils/eventTime.ts`).
- Boş, yalnızca boşluk ya da okunamayan değer → bütün alanlar boş.
- `yyyy-MM-dd` ile başlamayan ama `Date`'in okuyabildiği bir değer → yalnızca `day` dolar ve tam
  metindir (`formatDateStr`, saatli). Kâğıt'ın eski davranışı budur; backend bu biçimi göndermez.

## 3. Konsept kitleri nasıl bağlanır

| Kit | Bugün | Bağlantı |
|---|---|---|
| Kâğıt (`nisan/parts/kagitOrtak.ts`) | kendi ayrıştırıcısı | **bağlandı**: `{ gun: day, haftaGunu: weekday, saat: time }` |
| Harita (`konsept/harita/veri.ts`) | `haritaTarihi`, `kagitTarih`'in kopyası | Gövde `const { day, weekday, time } = eventDateParts(date); return { gun: day, haftaGunu: weekday, saat: time };` — davranış birebir aynı |
| Kitap (`konsept/kitap/tarih.ts`) | `kitapTarihi` | Aynı eşleme. Tek fark: `yyyy-MM-dd` ile başlamayan değerde Kitap boş döner, ortak yardımcı `day`'e tam metni yazar (backend bu biçimi göndermez) |
| Sergi (`konsept/sergi/metin.ts`) | `etiketTarihi` | `{ gun: day, kisa: dayMonth, yil: year, saat: hour ? `${hour}.${minute}` : '' }` — Türkçe saat ayracı (`19.00`) kitte kalır |

`tamTarih`, `tarihSatiri` gibi satır birleştiriciler kitin dilidir; kitte kalır.
