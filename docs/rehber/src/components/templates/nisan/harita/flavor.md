# `nisan/harita/flavor.ts` — `NISAN_HARITA_FLAVOR`

> **Tarih:** 2026-10-22 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.2, §7](../../../../../tasarim/HARITA-KONSEPTI.md)

---

`NISAN_FLAVOR`'ın kopyası; kategori flavor'ı değişmez.

| Alan | Değer |
|---|---|
| `BackgroundPattern` | `undefined` — arkada harita durur |
| `headings.timeline` | Duraklar |
| `headings.details` | Varış |
| `headings.gallery` | Yol üstünden |
| `headings.gift` | Hediye (kategorinin) |
| `headings.rsvp` | Rotaya katılın |
| `eyebrows.timeline` | **Rotamız belli** — rehberin nişan yorumu (§7); düğündeki "Günün rotası"nın yerine |
| `envelopeLabel`, `tagline`, `Ornament` | Kategorinin (zarf kapağında "NİŞAN DAVETİYESİ") |

Diğer üst etiketler ortak varsayılandır ("Ne Zaman & Nerede", "Özel Anlarımız", "Hediye Takdiri",
"LCV — Katılım Bildirimi"). Başlıklar modül bayraklarından hesaplanmadığı için sabittir (`useMemo`
gerekmez).
