# `dugun/harita/flavor.ts` — `DUGUN_HARITA_FLAVOR`

> **Tarih:** 2026-10-17 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.2](../../../../../tasarim/HARITA-KONSEPTI.md)

---

`DUGUN_FLAVOR`'ın kopyası; kategori flavor'ı değişmez.

| Alan | Değer |
|---|---|
| `BackgroundPattern` | `undefined` — arkada harita durur (`renderBackdrop` verildiğinde kompozisyon deseni zaten çizmez; açıkça kapatıldı) |
| `headings.timeline` | Duraklar |
| `headings.details` | Varış |
| `headings.gallery` | Yol üstünden |
| `headings.gift` | Takı & Hediye (kategorinin) |
| `headings.rsvp` | Rotaya katılın |
| `eyebrows.timeline` | Günün rotası (diğer üst etiketler ortak varsayılan) |
| `envelopeLabel`, `tagline`, `Ornament` | Kategorinin (zarf kapağında "DÜĞÜN DAVETİYESİ") |

Başlıklar modül bayraklarından hesaplanmadığı için sabittir (`useMemo` gerekmez).
