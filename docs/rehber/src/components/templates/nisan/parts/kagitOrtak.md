# `nisan/parts/kagitOrtak.ts`

> **Kullananlar:** `NisanSozMektubu`, `NisanGulKurusu`, `NisanSozSenedi` · Geri sayım: [KagitSayac](KagitSayac.md)
> **Tarih:** 2026-10-15 · dal `design/kagit` · Ortak yardımcılara bağlandı: 2026-10-22, dal `design/konsept-ortak`

---

| Dışa aktarım | Ne |
|---|---|
| `NISAN_KAGIT_FLAVOR` | `NISAN_FLAVOR`, desen (`BackgroundPattern`) kapalı: masa zaten dokulu kâğıt |
| `kagitTarih(date)` | Duvar saatini `{ gun: "14 Kasım 2026", haftaGunu: "Cumartesi", saat: "19:00" }` olarak ayırır; tarih yoksa üçü de boş. Gövde ortak [`eventDateParts`](../../shared/eventDate.md)'tır (`day`, `weekday`, `time`) |
| `kisiler(names)` | Adları `&` ile kişi kişi ayırır; boşları atar. `utils/names.ts` → [`splitPeople`](../../../../utils/names.md)'in yeniden dışa aktarımı |

`kagitTarih` saat dilimine çevirmez: davetiye etkinliğin kendi saatini yazar (`formatDateStr` ile aynı tutum).

İki dışa aktarımın adı ve davranışı değişmedi; üç Kâğıt preset'i dokunulmadan derleniyor. Eski ve yeni
uygulama 12 tarih (boş, boşluk, saatsiz, geçersiz, `Date`'in okuduğu başka biçim, `Z`'li) ve 11 ad
girdisiyle karşılaştırıldı: çıktılar aynı.

## Sınırlar

Kategoriden bağımsız; `NISAN_KAGIT_FLAVOR` nişana özgü olduğu için dosya `nisan/parts/`'ta kalır.
