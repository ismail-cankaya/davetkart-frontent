# `src/components/templates/sunnet/parts/Kusak.tsx` — Kuşak şeridi

> **Kullananlar:** `SehzadeHero` (başlık şeridi)
> **Denetim:** kontrast betiği — şablon başına kuşak yazısı (en düşük 5.25:1)

---

## 1. Ne

Maşallah kuşağından türetilen etiket şeridi; kategorinin tipografik
aygıtı. Davetin başlığı (`invitation.title`) bu şeridin üstünde yazılır.

| Parça | Nasıl |
|---|---|
| Kırlangıç kuyruk | `clip-path` çokgeni, çentik her yükseklikte 12 px |
| Sırma dikiş | Üst ve alt kenarda kesikli çizgi (`colors.stitch`) |
| Saten parıltı | `sunnet-sheen` (7 s'de bir süpürür) |
| Gölge | Dış sarmalayıcıda `drop-shadow` — çentiği izler |

Uzun başlık iki satıra kırılır (`text-balance`); çentik bozulmaz.
Son harfin izleme boşluğu (`tracking-[0.28em]`) metni sola kaydırır;
negatif sağ pay ortalar.

## 2. Hareket

Ortadan iki yana açılır (`scaleX` 0 → 1, 0.9 s); yazı açılış bitince
belirir. "Hareketi azalt"ta MotionConfig `scaleX`'i atlar, şerit hemen
tam boy görünür; yazının opaklık geçişi kalır (hareket değil).

## 3. Renkler (şablondan)

| Şablon | `fill` | `ink` | Oran |
|---|---|---|---|
| Klasik | `#c3263c` | `#ffffff` | 5.73 |
| Modern | `#0d6f80` | `#ffffff` | 5.83 |
| Yıldız | `#c3263c` | `#fff4dc` | 5.25 |
| Lunapark | `#c3263c` | `#fff4e6` | 5.28 |
| Aurora | beyaz → `#d6f4f8` cam | `#0a1242` | 15.41 |
| Krom | `#e6eeff → #8fe3ec` krom | `#0a1018` | ≥ 11.44 |
