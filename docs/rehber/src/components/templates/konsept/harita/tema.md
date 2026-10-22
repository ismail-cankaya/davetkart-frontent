# `konsept/harita/tema.ts` — `HARITA_TEMASI`

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (ortak tema kancaları, K10 / N1) · dal `design/harita`

---

## 1. Karar

Bölümler haritanın üstünde `yol` beyazı kartlarda okunur: düz beyaz, keskin köşe (`rounded-[3px]`),
ince mürekkep kenar (%30). Cam, bulanıklık, gölge yok — gölge yalnızca kartuşta. Kart dışında kalan
bölüm başlıkları perdelenmiş haritanın üstündedir ([HaritaSahnesi](HaritaSahnesi.md)).

| Alan | Değer | Not |
|---|---|---|
| `base` | arazi zemin + `--hr-govde` + `font-synthesis:none` + `.font-serif` → Newsreader italik 500 | Bölüm `h2`'leri `font-bold` yazar; iki sınıflı seçici kalınlığı 500'e çeker |
| `surface` | `bg-white rounded-[3px]` | `twMerge` ortak bölümlerin `rounded-3xl`'ini ezer |
| `accent` / `accentBg` | `rota` | |
| `buttonPrimary` | rota, üzerine gelince `rotaKoyu` | |
| `timelineLine` | düz rota | Haritada degrade yok |
| `footer` | `gri` | Ortak alt bilginin opaklıkla soluklaşması kullanılmaz |

## 2. Ortak kancalar (KONSEPT-ORTAK §3.1, 2026-10-22)

| Kanca | Değer | Neden |
|---|---|---|
| `hideMapHeader` | `true` | Kapak zaten haritadır; Detaylar kartının soyut harita başlığı (pinli) ikinci bir harita oluyordu |
| `timelineNode` | `bg-white border-2 border-[#A8321F] rounded-full` | Program düğümü haritadaki **durak rozetiyle** aynı: beyaz daire, 2 px rota kenar; içteki nokta `accentBg` (rota). Ortak ajanın baklava örneği yerine kitin kendi durak dili seçildi |
| `sectionMotion` | `{ duration: 0.4, distance: 8 }` | Rehber §6: kartuş ve lejant 0.4 s, y 8 → 0. Bölümler aynı dille girer (varsayılan 0.85–0.95 s / 24–36 px yerine) |
| `status.success` | `bg-[#B7C9A2] text-[#23303A]` | "Kopyalandı" çipi, LCV onay rozeti: park yeşili zemin, mürekkep yazı |
| `status.error` | `text-[#8F2A1A]` | LCV hata metni: rotanın koyu tonu (vurgu kırmızısından ayrı) |
| `status.errorInput` | `border-[#8F2A1A] focus:border-[#8F2A1A] focus:ring-[#8F2A1A]/25` | Hatalı alanın kenarı |

Durum renkleri **kartta ölçüldü** (çizilmiş ekran, metin saydam, en kötü piksel; headless Chrome):

| Öğe | Preset, genişlik | Oran |
|---|---|---|
| "Kopyalandı" (mürekkep / park, gerçek tıklama + pano izni) | Nişan Kroki, 360 | **7.64** |
| "Lütfen adınızı yazın." (rotaKoyu / beyaz kart) | Nişan Kroki 360 · Düğün Kır Yolu 1280 | **8.35** · **8.35** |
| Hatalı alanın kenarı (rotaKoyu / beyaz) | aynı | 8.35 (grafik, ≥ 3) |

## 3. Kontrast (ölçüm: çizilmiş renklerden)

| Çift | Oran |
|---|---|
| mürekkep / beyaz | 13.50 |
| gri / beyaz | 7.00 |
| rota / beyaz | 6.69 |
| beyaz / rota (düğme) | 6.69 · üzerine gelince beyaz / rotaKoyu 8.35 |
| stone-50 / rota (ortak LCV ve hediye seçili hâli) | 6.40 |
| Bölüm üst etiketi (rota, 10 px) — en kötü zemin | **4.62** (düğün, %80 perde altında mürekkep %50 / su); nişan Kroki 4.64, Kavuşak 5.15 |
| Bölüm gövdesi, alt bilgi (gri) — en kötü zemin | **4.84**; nişan 4.86 / 5.05 |
| Bölüm başlığı (mürekkep, büyük) — en kötü zemin | 9.34 |

## 4. Sınırlar (ortak bölümlerden gelen)

- Detaylar'ın "Yol Tarifi Al" düğmesi ortak dal sonrasında 259 × 40 px (ölçüldü, 2026-10-22): hâlâ
  44 px'in 4 px altında. Galeri okları 44 × 44 (düzeldi); galeri noktaları 24 px adım (N2 istisnası).
- Zarf açıkken arkadaki içerik artık `inert`; canlı modda odak kapının düğmesinde başlar
  ([HaritaZarf](HaritaZarf.md)).
- Alt bilgi adları artık büyük harfe çevrilmiyor (ortak dal, K10).
