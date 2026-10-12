# `src/components/templates/kina/parts/heroText.ts` — Hero metin yardımcıları

> **Kullananlar:** `KinaHero`
> **Denetim:** kına duman testi (boş senaryoda "Davetlisiniz", tarih yokken künye yok)

---

| Fonksiyon | Girdi → çıktı |
|---|---|
| `splitKinaNames` | `"Ayşe & Ali"` → `{ first: 'Ayşe', second: 'Ali' }`; `"Ayşe"` → `second: ''`; boş → `first: 'Davetlisiniz'` |
| `kinaDateParts` | `2027-02-06T19:00` → `{ weekday: 'Cumartesi', day: '6 Şubat 2027', time: '19:00' }`; boş/geçersiz → hepsi `''` |

🔴 Tarih bir **duvar saatidir**: parçalar metinden okunur, `new Date(invitation.date)`
çağrılmaz. Gün adı için takvim günü yerel tarih olarak kurulur (`new Date(y, m-1, d)`),
`formatCalendarDay` ile aynı yol. Biçim tanınmazsa `formatDateStr` çıktısı tek parça döner.
