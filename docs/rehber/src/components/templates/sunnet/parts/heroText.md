# `src/components/templates/sunnet/parts/heroText.ts` — Ad ve tarih parçaları

> **Kullananlar:** `SehzadeHero`, `KusakHero`
> **Denetim:** sünnet duman testi (b: boş ad/tarih; d: "Emir Kerem & Yılmaz Ailesi")

---

## 1. `splitSehzadeNames`

Sünnet sihirbazının iki alanı **"Çocuğun Adı"** ve **"Aile Adı"**dır
(`data.ts` → `nameLabels`). Ortak hero'lar ikisini aynı boyda dizer; aile
adı ikinci bir çocuk gibi okunur. Kategori hero'ları iki rolü ayırır:

| Saklanan (`displayNames` sonrası) | `prince` | `family` |
|---|---|---|
| `Emir Kerem & Yılmaz Ailesi` | Emir Kerem | Yılmaz Ailesi |
| `Emir Kerem` | Emir Kerem | — (çizilmez) |
| `Ali & Veli & Yılmaz Ailesi` | Ali | Veli & Yılmaz Ailesi |
| `''` | Davetlisiniz (Summary'nin yedeği) | — |

## 2. `eventDateParts`

`formatDateStr` boş dönerse (tarih yok / ayrıştırılamıyor) üç parça da
boştur ve künye çizilmez. Aksi hâlde duvar saati metinden okunur:

| Girdi | `weekday` | `day` | `time` |
|---|---|---|---|
| `2027-02-06T19:00` | Cumartesi | 6 Şubat 2027 | 19:00 |
| `2027-02-06` | Cumartesi | 6 Şubat 2027 | — |
| Tanınmayan ama `Date`'in okuduğu biçim | — | `formatDateStr` çıktısının tamamı | — |

🔴 `new Date(invitation.date)` kullanılmaz. Haftanın günü takvim
parçalarından (`new Date(y, m-1, d)`) kurulur: takvim gününün saat dilimi
yoktur, `formatCalendarDay` ile aynı yol.
