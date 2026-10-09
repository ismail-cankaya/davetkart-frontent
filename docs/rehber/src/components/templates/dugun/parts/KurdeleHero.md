# `src/components/templates/dugun/parts/KurdeleHero.tsx` — Düğün kategorisinin hero'su

> **Kullananlar:** 17 düğün şablonu `renderHero` ile (Dugun1–5, DugunSade, DugunManzara,
> DugunSekilli, DugunModern, DugunGokyuzu, DugunMumIsigi, DugunGulYapraklari,
> DugunDenizIsiltisi, DugunSahil, DugunOnyx, DugunAurora, DugunKrom)
> **Denetim:** duman testi (a/b/c senaryoları) ve kontrast betiği — bkz. [KIMLIK.md](../KIMLIK.md) §7

---

## 1. Neden var

Bu 17 şablon eskiden `shared/Summary.tsx`'i kullanıyordu. Summary dokuz kategoride
aynıdır (ızgara + radyal parıltı + karo sayaç); arka planı ne olursa olsun bir düğün
davetiyesi kına ya da nişan davetiyesinden ön planda ayırt edilemiyordu. Hero, sayfanın
ilk izlenimidir; kategori kimliği en çok burada görünmeli.

## 2. Dil

| Öğe | Karar |
|---|---|
| Açılış imzası | `KurdeleCizim`: iki kurdele ucu kenarlardan gelip ortada buluşur, düğüm çizilir |
| İsimler | İlk `&`'den ikiye bölünür; gelin soldan, damat sağdan kayarak gelir, `&` buluştukları yerde belirir. Cormorant italik |
| Başlık | 10–11 px, `tracking-[0.42em]`, vurgu renginde; harf aralığının kaydırdığı merkez `pl-[0.42em]` ile dengelenir |
| Slogan | `flavor.tagline` ("Evleniyoruz") — Summary'de olmayan kategori sesi |
| Tarih | Düğün kartı düzeni: ay üstte, gün iri rakam, saat ve yıl iki yanda kıl çizgiler arasında |
| Geri sayım | Karo yok; iki kıl çizgi arasında tek bant, birimler dikey çizgiyle ayrılır |
| Kaydırma işareti | İpliğe dizili tek inci (`animate-bob-down-6`) |

## 3. Boş alan sözleşmesi (Summary ile aynı)

| Alan | Boşsa |
|---|---|
| `names` | "Davetlisiniz"; tek taraf doluysa tek satır (`splitCouple`) |
| `title`, `subtitle` | Satır hiç çizilmez |
| `date` | `formatDateStr` `''` döner → tarih bandı çizilmez; biçim tanınmazsa tek satır etiket |
| `venue` | Satır çizilmez; tarih ve mekânın ikisi de yoksa grup çizilmez |
| `showTimer` | Kapalıysa ya da tarih geçersizse (`useCountdown().valid`) bant çizilmez |

Tarih asla `new Date(invitation.date)` ile ayrıştırılmaz: `formatDateStr` çıktısı
`heroText.splitDateLabel` ile parçalanır. Geri sayım `useCountdown(date, timezone)`.

## 4. Seçenekler

| Prop | Ne zaman |
|---|---|
| `density="compact"` | Süslerin metin kolonunu daralttığı şablonlar (Dugun1, Dugun4, Dugun5) |
| `panelClassName` | Metnin arkasındaki parlaklığın kontrol edilemediği video (DugunSahil): metin bloğu tül panelde durur |

## 5. Erişilebilirlik

- Kök `lang="tr"`: CSS `uppercase` ay ve mekânı arayüz dili İngilizce olsa da Türkçe
  kuralla büyütür ("İSTANBUL", "ISTANBUL" değil).
- İsimlerin rengi (`theme.heading`) her satırın kendi öğesindedir; Krom'un
  `bg-clip-text` degradesi kayan satırlarda da kesilir.
- Süs çizgileri `aria-hidden`; `<h1>` ekran okuyucuda "Ayşe & Ali" okunur.

## 6. Hareket

| Kaynak | "Hareketi azalt" |
|---|---|
| Düğüm (`pathLength`) ve kurdele çizgileri (`scaleX`) | `useReducedMotion()` → baştan çizili |
| İsim/öğe kayması, `&` ölçeği | `MotionConfig reducedMotion="user"` transform'u atlar |
| Kaydırma incisi | `index.css` reduce kuralı |
