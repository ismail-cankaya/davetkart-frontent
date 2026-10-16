# `nisan/parts/kagitOrtak.ts`

> **Kullananlar:** `NisanSozMektubu`, `NisanGulKurusu`, `NisanSozSenedi` · Geri sayım: [KagitSayac](KagitSayac.md)
> **Tarih:** 2026-10-15 · dal `design/kagit`

---

| Dışa aktarım | Ne |
|---|---|
| `NISAN_KAGIT_FLAVOR` | `NISAN_FLAVOR`, desen (`BackgroundPattern`) kapalı: masa zaten dokulu kâğıt |
| `kagitTarih(date)` | Duvar saatini `{ gun: "14 Kasım 2026", haftaGunu: "Cumartesi", saat: "19:00" }` olarak ayırır; tarih yoksa üçü de boş |
| `kisiler(names)` | Adları `&` ile kişi kişi ayırır; boşları atar |

`kagitTarih` saat dilimine çevirmez: davetiye etkinliğin kendi saatini yazar (`formatDateStr` ile aynı tutum).

## Sınırlar

Kategoriden bağımsız; pilot raporunda kite taşınması önerildi (kit değişikliği onay ister).
