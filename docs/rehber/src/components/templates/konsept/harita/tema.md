# `konsept/harita/tema.ts` — `HARITA_TEMASI`

> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Karar

Bölümler haritanın üstünde `yol` beyazı kartlarda okunur: düz beyaz, keskin köşe (`rounded-[3px]`),
ince mürekkep kenar (%30). Cam, bulanıklık, gölge yok — gölge yalnızca kartuşta. Kart dışında kalan
bölüm başlıkları perdelenmiş haritanın üstündedir ([HaritaSahnesi](HaritaSahnesi.md)).

| Alan | Değer | Not |
|---|---|---|
| `base` | arazi zemin + `--hr-govde` + `font-synthesis:none` + `.font-serif` → Newsreader italik 500 | Bölüm `h2`'leri `font-bold` yazar; iki sınıflı seçici kalınlığı 500'e çeker |
| `surface` | `bg-white rounded-[3px]` | `twMerge` ortak bölümlerin `rounded-3xl`'ini ezer. Yan etki: program düğümleri de kare olur |
| `accent` / `accentBg` | `rota` | |
| `buttonPrimary` | rota, üzerine gelince `rotaKoyu` | |
| `timelineLine` | düz rota | Haritada degrade yok |
| `footer` | `gri` | Ortak alt bilginin opaklıkla soluklaşması kullanılmaz |

## 2. Kontrast (ölçüm: çizilmiş renklerden)

| Çift | Oran |
|---|---|
| mürekkep / beyaz | 13.50 |
| gri / beyaz | 7.00 |
| rota / beyaz | 6.69 |
| beyaz / rota (düğme) | 6.69 · üzerine gelince beyaz / rotaKoyu 8.35 |
| stone-50 / rota (ortak LCV ve hediye seçili hâli) | 6.40 |
| Bölüm üst etiketi (rota, 10 px) — en kötü zemin | **4.62** (%80 perde altında mürekkep %50 / su) |
| Bölüm gövdesi, alt bilgi (gri) — en kötü zemin | **4.84** |
| Bölüm başlığı (mürekkep, büyük) — en kötü zemin | 9.34 |

## 3. Sınırlar (ortak bölümlerden gelen, temayla düzelmeyen)

- Detaylar'daki "Yol Tarifi Al" düğmesi 39 px, galeri okları 35 px, galeri noktaları 23 × 6 px, LCV
  kişi sayısı düğmeleri 28 px: 44 px'in altında. Ortak dosya önerisi raporda.
- Hediye bölümünün "kopyalandı" yeşili (`emerald-500`) temadan gelmez.
- Ortak alt bilgi adları büyük harfe çevirir (`uppercase`).
