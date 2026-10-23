# `dogum-gunu/harita/flavor.ts` — `DOGUM_GUNU_HARITA_FLAVOR`

> **Tarih:** 2026-10-23 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.2, §7](../../../../../tasarim/HARITA-KONSEPTI.md)

---

`DOGUM_GUNU_FLAVOR`'ın kopyası; kategori flavor'ı değişmez.

| Alan | Değer |
|---|---|
| `BackgroundPattern` | `undefined` — arkada harita durur |
| `headings.timeline` | Duraklar |
| `headings.details` | Varış |
| `headings.gallery` | Yol üstünden |
| `headings.gift` | Hediye Kutusu (kategorinin) |
| `headings.rsvp` | Rotaya katılın |
| `eyebrows.timeline` | **Kutlama rotası** (Kutlama Hattı). Hazine Avı kendi kopyasında **Hazineye giden yol** |
| `envelopeLabel`, `tagline`, `Ornament` | Kategorinin (zarf kapağında "DOĞUM GÜNÜ DAVETİYESİ") |

Başlıklar modül bayraklarından hesaplanmaz; sabittir (`useMemo` gerekmez).
