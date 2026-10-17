# `konsept/kitap/tarih.ts` — tarih satırları ve adlar

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

| İşlev | Girdi → çıktı |
|---|---|
| `kitapTarihi(date)` | `2027-02-13T19:00` → `{ gun: '13 Şubat 2027', haftaGunu: 'Cumartesi', saat: '19:00' }` |
| `tamTarih(t)` | → `Cumartesi, 13 Şubat 2027 · 19:00` (boş parçalar atılır) |
| `kisiler(names)` | `"A & B"` → `['A', 'B']`; boş → `[]` |

Duvar saati saat dilimine çevrilmez (bkz. `utils/eventTime.ts`): davetiye etkinliğin kendi saatini
yazar. Tarih boş ya da okunamıyorsa alanlar boştur; sayfa o satırı hiç çizmez. Gün metni
`formatCalendarDay` iledir (takvim günü UTC'ye kaymaz).

Kâğıt kitindeki `kagitTarih` / `kisiler` ile aynı işi yapar; kit kategoriler arası taşındığı için
nişan klasörüne bağımlı kalmasın diye ayrı yazıldı. Birleştirmede `templates/utils.ts`'e taşınması
önerilir.
