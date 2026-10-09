# `src/components/templates/dugun/parts/heroText.ts` — Hero metin yardımcıları

> **Kullananlar:** `parts/KurdeleHero.tsx`
> **Denetim:** duman testi (a: "Sophia & Elias" + tarih, b: boş alanlar)

---

## 1. `splitDateLabel(label)`

`formatDateStr` çıktısını ("14 Kasım 2026 19:00") düğün kartı düzenine dağıtır.

| Girdi | Sonuç |
|---|---|
| `14 Kasım 2026 19:00` | `{ day: '14', month: 'Kasım', year: '2026', time: '19:00' }` |
| `14 Kasım 2026, 19:00` / `14 Kasım 2026 saat 19:00` | aynı (tarayıcı farkları) |
| tanınmayan biçim | `null` → çağıran tek satırlık etikete düşer |

🔴 Tarih yeniden ayrıştırılmaz (`new Date` yok); yalnızca biçimlenmiş metin bölünür.
Duvar saati + saat dilimi kuralı (`utils/eventTime.ts`) böylece tek yerde kalır.

## 2. `splitCouple(names)`

| Girdi (`displayNames` sonrası) | Sonuç |
|---|---|
| `Ayşe & Ali` | `pair` — iki satır |
| `Ayşe` | `single` |
| `""` | `single`, "Davetlisiniz" |
| `Ayşe & ` (tek taraf) | `single`, "Ayşe" |
