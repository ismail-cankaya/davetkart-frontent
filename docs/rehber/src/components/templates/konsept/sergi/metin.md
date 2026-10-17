# `konsept/sergi/metin.ts` — etiket satırları

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

| Dışa aktarım | Ne |
|---|---|
| `etiketTarihi(date)` | Duvar saatini `{ gun: "14 Kasım 2026", kisa: "14 Kasım", yil: "2026", saat: "19.00" }` olarak ayırır; okunamazsa dördü de boş |
| `tarihSatiri(t)` | `"14 Kasım 2026, 19.00"`; olmayan parça atlanır |
| `kisiler(names)` | Adları `&` ile kişi kişi ayırır; boşları atar |

- Saat Türkçe ayraçla yazılır (`19.00`), etiket dilinin örneği gibi (SERGI-KONSEPTI §4.1).
- Saat dilimine çevrilmez: davetiye etkinliğin kendi saatini yazar (`utils/eventTime.ts` ile aynı tutum).
- Veri uydurulmaz: tarih yoksa yıl da yoktur; eser etiketi yalnızca eser adını yazar.

## Sınırlar

- `kisiler` Kâğıt'taki `nisan/parts/kagitOrtak.ts` ile aynı işi yapar; ortak bir yere taşınması önerildi.
