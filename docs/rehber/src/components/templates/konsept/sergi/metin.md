# `konsept/sergi/metin.ts` — etiket satırları

> **Tarih:** 2026-10-17 (N1: 2026-10-23) · dal `design/sergi`

---

| Dışa aktarım | Ne |
|---|---|
| `etiketTarihi(date)` | Duvar saatini `{ gun: "14 Kasım 2026", kisa: "14 Kasım", yil: "2026", saat: "19.00" }` olarak ayırır; okunamazsa dördü de boş |
| `tarihSatiri(t)` | `"14 Kasım 2026, 19.00"`; olmayan parça atlanır |
| `kisiler(names)` | `utils/names.ts` → `splitPeople`'ın kit adı: adları `&` ile kişi kişi ayırır, boşları atar |

- Ayrıştırma ortaktır (KONSEPT-ORTAK §3.1, N1): `etiketTarihi` parçaları `shared/eventDate.ts` →
  `eventDateParts`'tan alır; kit yalnızca etiketin dilini (saat ayracı, boş değer) ekler.
- Etiket yalnızca `yyyy-MM-dd…` biçimini yazar. Başka biçimde ortak yardımcı tam metni verir (girilmemiş
  `00:00` saatiyle); etiket bu durumda boş kalır.
- Saat Türkçe ayraçla yazılır (`19.00`), etiket dilinin örneği gibi (SERGI-KONSEPTI §4.1).
- Saat dilimine çevrilmez: davetiye etkinliğin kendi saatini yazar (`utils/eventTime.ts` ile aynı tutum).
- Veri uydurulmaz: tarih yoksa yıl da yoktur; eser etiketi yalnızca eser adını yazar.

## Sınırlar

- Kopya kalmadı: kişi ayırma ve tarih parçaları ortak yardımcılarda (K10).
