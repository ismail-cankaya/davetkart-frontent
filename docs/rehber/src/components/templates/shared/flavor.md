# `shared/flavor.ts` — `eyebrows` ve `giftNote`

> **Kullananlar:** `Timeline`, `Details`, `Gallery`, `GiftRegistry`, `RSVPForm`; değerleri her kategorinin `flavors.tsx`'i verir
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

Bölüm **başlıkları** (`headings`) zaten kategoriye göreydi; üstlerindeki küçük **etiketler**
ve hediye cümlesi ise sabitti. Kurumsalda romantik okunuyorlardı.

| Alan | Bölüm | Varsayılan |
|---|---|---|
| `eyebrows.timeline` | Program | "Program Akışı" |
| `eyebrows.details` | Detaylar | "Ne Zaman & Nerede" |
| `eyebrows.gallery` | Galeri | "Özel Anlarımız" |
| `eyebrows.gift` | Hediye | "Hediye Takdiri" |
| `eyebrows.rsvp` | LCV | "LCV — Katılım Bildirimi" |
| `giftNote` | Hediye açıklaması | "Varlığınız en büyük hediyemiz; …" |

`eyebrows` `Partial`'dır: bir kategori yalnızca değiştirmek istediğini verir.
