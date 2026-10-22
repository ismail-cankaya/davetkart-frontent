# `shared/palette.ts` — `SectionTheme` alanları

> **Kullananlar:** bütün ortak bölümler; değerleri şablonların tema nesneleri verir
> **Tarih:** 2026-10-11 · dal `design/ortak` · Son güncelleme: 2026-10-22 · dal `design/konsept-ortak` (§4–§5)

---

## 1. Neden tema, neden flavor değil?

Zarf ve harita başlığı renkleri `theme.id`'ye (koyu/açık) göre sabitti. Koyu temada zarf
mührü ve ışıması **altın**dı: "altın yok" diyen bir kategori kimliği (düğün, kurumsal)
zarfta bozuluyordu.

Üç ajan üç yol önerdi. `TemplateFlavor` **kategori başına tektir**; oysa aynı kategoride
hem açık hem koyu şablon vardır. Bu yüzden alanlar şablon başına olan `SectionTheme`'e
eklendi.

## 2. Yeni alanlar (hepsi isteğe bağlı)

| Alan | Ne boyar | Verilmezse |
|---|---|---|
| `envelope.paper` | Zarf gövdesi | slate / stone degrade |
| `envelope.flap` | Kapak ve yan katlar | `slate-700` / `stone-300` |
| `envelope.seal` | Mühür zemini + yazısı | **`amber-300`** / `stone-800` |
| `envelope.glow` | Zarfın arkasındaki ışıma | **`amber-300/10`** / `rose-200/40` |
| `envelope.card` | Açılırken görünen iç kart | `slate-950` / beyaz |
| `mapHeader` | Detaylar kartının harita başlığı | `slate-900` / `stone-100` |

Değerler Tailwind sınıf dizgesidir (tema nesnesinin geri kalanı gibi). Varsayılanlar
bugünkü görünümün aynısıdır: hiçbir şablon kendiliğinden değişmez.

## 3. `footer` (2026-10-15 · dal `design/kagit`)

| Alan | Ne boyar | Verilmezse |
|---|---|---|
| `footer.names` | Alt bilgideki adlar satırı | `body` + `opacity-60` |
| `footer.branding` | "DavetKart ile hazırlandı" imzası | `body` + `opacity-40` |

**Neden:** opaklıkla soluklaştırılan alt bilgi, zemini bilmeden kontrastı düşürür. Kâğıt
setinde (pamuk kâğıt, `is` mürekkep) ölçüldü: ad **3.01**, imza **1.98** — 10 ve 9 px metin için
AA (4.5) altında. Zemini bilen tema ölçülmüş renklerini verir; kâğıt teması tam gövde
mürekkebini verir (en kötü 4.52). Alanı vermeyen 296 şablonun çıktısı birebir aynı kalır.

## 4. Konsept kancaları (2026-10-22 · dal `design/konsept-ortak`, K8 · K10)

Üç yeni konseptin (Sergi, Kitap, Harita) düğün pilotlarında istenen ayarlar. Hepsi isteğe bağlı;
**vermeyen şablonun çıktısı aynıdır** (sınıf dizgesi, süre, mesafe).

| Alan | Tür | Verilmezse | Ne yapar | Kılavuz |
|---|---|---|---|---|
| `headingAlign` | `'center' \| 'start'` | `center` | Beş bölüm başlığının hizası; `start` başlığı içerik sütununun sol kenarına oturtur | [SectionHeading](SectionHeading.md) §3 |
| `sectionMotion` | `{ duration?, distance? }` (s, px) | parça başına bugünkü değer | Bölüm girişinin süresi ve kayma mesafesi | [SectionHeading](SectionHeading.md) §4 |
| `hideMapHeader` | `boolean` | `false` | Detaylar kartının soyut harita başlığını (pin dahil) çizmez | [Details](Details.md) |
| `timelineLayout` | `'kart' \| 'icindekiler'` | `kart` | Programın düzeni | [Timeline](Timeline.md) §2 |
| `timelineNode` | sınıf dizgesi | `surface` + `border`, yuvarlak | Program düğümünün zemini, kenarı, biçimi | [Timeline](Timeline.md) §3 |
| `status.success` | sınıf dizgesi | §5 | "Kopyalandı" çipi ve LCV onay rozeti (zemin + yazı) | [GiftRegistry](GiftRegistry.md), [RSVPForm](RSVPForm.md) |
| `status.error` | sınıf dizgesi | §5 | LCV hata metni | [RSVPForm](RSVPForm.md) |
| `status.errorInput` | sınıf dizgesi | `border-rose-500/70 …` (bugünkü) | Hatalı alanın kenarı ve odak halkası | [RSVPForm](RSVPForm.md) |

Adlar dosyadaki düzene uyar: İngilizce alan, Türkçe JSDoc; değerler (`kart`, `icindekiler`) karar
metnindeki adlardır.

### Konseptlerden örnek

```ts
// Hikâye Kitabı — içindekiler, harita yok, kısa giriş
{ ...KITAP_TEMASI, timelineLayout: 'icindekiler', hideMapHeader: true, sectionMotion: { duration: 0.4, distance: 12 } }

// Sergi Açılışı — başa yaslı başlık, kısa giriş
{ ...SERGI_TEMASI, headingAlign: 'start', sectionMotion: { duration: 0.4, distance: 10 } }

// Günün Haritası — ikinci harita yok, rota işaretine benzeyen düğüm
{ ...HARITA_TEMASI, hideMapHeader: true,
  timelineNode: 'bg-[#EEF0E6] border-2 border-[#A8321F] rounded-none rotate-45 [&>span]:-rotate-45' }
```

## 5. Durum renkleri — `statusClasses(theme)` (2026-10-22, K10)

"Kopyalandı" çipi, LCV onay rozeti ve LCV hata metni sabit `emerald-500` / `rose-500` idi. Açık zeminde
AA'nın altındaydı. Artık `statusClasses(theme)`: tema `status.*` verirse onu, vermezse `id`'ye göre
varsayılanı döndürür.

| Alan | Koyu (`midnight`) | Açık (`stone`) |
|---|---|---|
| `success` | `bg-emerald-500/15 text-emerald-400` | `bg-emerald-500/15 text-emerald-900` |
| `error` | `text-rose-400` | `text-rose-800` |
| `errorInput` | `border-rose-500/70 focus:border-rose-500/70 focus:ring-rose-500/15` (değişmedi) | aynı |

Ölçüm: metin saydam yapılıp arkası kırpılarak alındı; her pikselde kontrast hesaplandı, **en kötü
piksel** yazıldı (headless Chrome, 360 px; Kâğıt'ta doku tanesi en kötü noktadır).

| Preset (zemin) | "Kopyalandı" önce → sonra | Hata metni önce → sonra |
|---|---|---|
| `sade` (açık) | 2.11 → **8.22** | 3.67 → **7.73** |
| `nisan-soz-senedi` (Kâğıt, dokulu) | 1.42 → **5.53** | 2.45 → **5.16** |
| `nisan-kagit` (açık) | — → **8.13** | — → **7.71** |
| `modern` (koyu) | 5.49 → **7.01** | 4.61 → **6.05** |
| `dugun-noir` (koyu) | 5.85 → **7.47** | 4.83 → **6.34** |
| `kina-bordo` (koyu) | 6.71 → **8.56** | 5.26 → **6.90** |

Şamua (`#F2EAD3`, Kitap) için hesap: `emerald-900` çip üstünde 7.2, `rose-800` 6.6.
`emerald-800` / `rose-700` ilk denendi; Kâğıt dokusunun en kötü noktasında 4.38 / 3.93 kaldığı için
bir ton koyulaştırıldı.

`id` açık/koyu ayrımının tek işaretidir (`GiftRegistry`'nin etkin çipi de aynı yolu izler); `id`'si
zemine uymayan bir tema `status`'u kendisi vermelidir.

