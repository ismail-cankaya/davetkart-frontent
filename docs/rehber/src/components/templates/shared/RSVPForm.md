# `shared/RSVPForm.tsx` — LCV formu

> **Kullananlar:** `InvitationComposition`
> **Tarih:** 2026-10-11 · dal `design/ortak` · Güncelleme: 2026-10-22 · dal `design/konsept-ortak` (K10)

---

## 1. Üst etiket (2026-10-11)

Başlığın üstündeki küçük etiket `flavor.eyebrows?.rsvp ?? "LCV — Katılım Bildirimi"`. Kategori vermezse
metin aynıdır. Alanların tamamı ve gerekçesi: `flavor.md`. Başlık bloğu (son gün satırı dahil) artık
ortak [`SectionHeading`](SectionHeading.md)'tir.

## 2. Hata ve onay renkleri temadan (K10)

| Ne | Önce | Sonra |
|---|---|---|
| "Lütfen adınızı yazın." | `text-rose-500` | `statusClasses(theme).error` |
| Hatalı alanın kenarı | `border-rose-500/70 …` | `statusClasses(theme).errorInput` (varsayılanı aynı dizge) |
| Onay rozeti (✓) | `bg-emerald-500/15 text-emerald-500` | `statusClasses(theme).success` ("Kopyalandı" ile aynı) |

Hata metni kontrastı (en kötü nokta):

| Zemin | Önce | Sonra |
|---|---|---|
| Açık (`sade`) | 3.67 | 7.73 |
| Kâğıt (`nisan-soz-senedi`) | 2.45 | 5.16 |
| Koyu (`modern`) | 4.61 | 6.05 |
| Koyu (`dugun-noir`) | 4.83 | 6.34 |

## 3. Dokunma hedefleri ≥ 44 px (K10)

Görünüm aynı; tıklama alanı `relative` + `before:absolute` sözde öğesiyle büyür (sözde öğe düğmenin
parçasıdır, dokunuşu düğme alır).

| Hedef | Görünen | Tıklama alanı önce → sonra | Sözde öğe |
|---|---|---|---|
| Kişi sayısı − / + | 28 × 28 | 28 → 44 × 44 | `before:-inset-2` |
| Katılıyorum / Katılamıyorum | ~124 × 32 | 32 → 44 | `before:-inset-y-1.5` |
| Google / Apple Takvim (onaydan sonra) | 40 yükseklik | 40 → 48 (hesap; önizlemede gönderim yapılamadığı için çizilmiş ekranda denenmedi) | `before:-inset-y-1` |
| Katılımımı Bildir | 44 | değişmedi | — |
