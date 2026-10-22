# `shared/GiftRegistry.tsx` — hediye

> **Kullananlar:** `InvitationComposition`
> **Tarih:** 2026-10-11 · dal `design/ortak` · Güncelleme: 2026-10-22 · dal `design/konsept-ortak` (K10)

---

## 1. Üst etiket ve açıklama (2026-10-11)

Başlığın üstündeki küçük etiket `flavor.eyebrows?.gift ?? "Hediye Takdiri"`, açıklama cümlesi
`flavor.giftNote ?? (eski metin)`. Alanların tamamı ve gerekçesi: `flavor.md`. Başlık bloğu artık
ortak [`SectionHeading`](SectionHeading.md)'tir; başa yaslı temada açıklamanın `mx-auto`'su `mx-0` olur.

## 2. "Kopyalandı" rengi temadan (K10)

Kopyalandı hâli sabit `bg-emerald-500/15 text-emerald-500` idi. Artık
[`statusClasses(theme).success`](palette.md): tema `status.success` verirse onu, vermezse `id`'ye göre
ölçülmüş varsayılanı alır (palette.md §5).

| Zemin | Önce (en kötü) | Sonra (en kötü) |
|---|---|---|
| Açık (`sade`, kart beyazımsı) | 2.11 | 8.22 |
| Kâğıt (`nisan-soz-senedi`) | 1.42 | 5.53 |
| Koyu (`modern`) | 5.49 | 7.01 |
| Koyu (`dugun-noir`) | 5.85 | 7.47 |

## 3. Dokunma hedefleri ≥ 44 px (K10)

| Hedef | Görünen (aynı) | Tıklama alanı önce → sonra | Nasıl |
|---|---|---|---|
| IBAN "Kopyala" | ~88 × 34.5 | 35 → 49 | `relative before:absolute before:-inset-y-2` |
| Tutar çipi | ~75 × 34 | 34 → 44 | `before:-inset-y-1.5` |

🔴 Sözde öğe düğmenin **kenarlığının içinden** (dolgu kutusundan) ölçülür: 1 px kenarlıklı çipte
`-inset-y-[5px]` 44 değil 42 veriyordu (ölçüldü). Değerler kenarlık payıyla seçildi; IBAN düğmesi 2 px
kenarlıklı bir `buttonGhost`'ta da ≥ 44 kalır.

Çipler alt satıra kaydığında iki satırın tıklama alanları çakışmasın diye satır arası 8 → 10 px
(`gap-y-2.5`): tek satırda görünüm aynı, sarılınca satırlar 2 px açılır.
