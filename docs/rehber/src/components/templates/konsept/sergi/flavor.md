# `konsept/sergi/flavor.ts` — bölüm başlıkları ve salon numaraları

> **Tarih:** 2026-10-17 · dal `design/sergi` · Kaynak: SERGI-KONSEPTI §4.2

---

`useSergiFlavor(taban, invitation, metinler)` kategori flavor'ının sergi kopyasını döner.

| Alan | Değer |
|---|---|
| `headings` | Program *Açılış akışı*, Detay *Ziyaret bilgileri*, Galeri *Eserler*, Hediye `metinler.hediye`, LCV *Açılış listesi*; `metinler.basliklar` verilen başlıkları ezer (hediye hariç) |
| `eyebrows` | Görünen bölümlere sırayla *Salon 1, Salon 2…* |
| `giftNote` | `metinler.hediyeNotu` (yoksa tabanınki) |
| `BackgroundPattern` | `undefined` — duvar düzdür |

## Kategori başlıkları

`SergiMetinleri.basliklar` kategori yorumunun dili rehberin başlıklarıyla çeliştiğinde kullanılır. Nişanda
kapak "açılış yakında, bu akşam önizleme" der; program ve LCV *Önizleme akışı* / *Önizleme listesi* olur.
Nesne modül düzeyinde sabit olmalıdır (`useMemo` bağımlılığı).

## Salon numarası

Misafir sergiyi salon salon gezer. Numara yalnızca **görünen** bölümleri sayar; görünürlük ortak
bölümlerin kendi koşullarıyla hesaplanır (Timeline en az bir dolu adım, Details tarih/mekân/harita,
Gallery en az bir görsel, Hediye ve LCV bayrak). Bir modül kapanınca sıra kaymaz, boşluk kalmaz.
Hesap `useMemo` ile görünür bölüm listesine bağlıdır (KONSEPT-ORTAK §3).

## Sınırlar

- Koşullar ortak bölümlerden kopyalandı; bir bölümün gizlenme koşulu değişirse burası da güncellenmeli.
