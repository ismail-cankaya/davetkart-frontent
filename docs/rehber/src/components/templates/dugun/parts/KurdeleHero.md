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

Bir kategori hero'su 17 şablona hizmet ettiği için aynı görünmemeleri bu seçeneklere ve
zemin kompozisyonuna bağlı (1. tur denetiminde 8 koyu şablon birbirinin kopyası gibiydi).

| Prop | Ne yapar | Kullanan |
|---|---|---|
| `density="compact"` | Boşlukları ve yazı boylarını sıkılaştırır | Dugun1, Dugun4, Dugun5 |
| `panelClassName` | Metin bloğunu bir panele koyar; varsayılan `rounded-[2rem] px-4 py-9`, verilen sınıflar üzerine yazılır (biçim de değişebilir) | DugunSahil (gece tülü panel), DugunSekilli (üstü kemerli plaket: `rounded-t-[999px] pt-24`) |
| `align="start"` | Sola yaslı editoryal düzen: düğüm solda, kurdele yalnız sağdan gelir; `&` satırı, tarih bandı (gün · yıl · saat) ve sayaç sola yaslanır | DugunModern |
| `anchor="end"` | Metin bloğu hero'nun altına iner, üstte görsel nefes alır | DugunMumIsigi |
| `nameClassName` | İsim satırlarının boy/biçim sınıfları; varsayılan italik serifin üzerine yazılır | DugunModern (dik, ince, iri), DugunOnyx (en iri) |

Kemerli plakette üst iç boşluk kemer yarıçapını karşılayacak kadar büyük tutulur: 360 px'te
plaket ~336 px geniş, kemer yarıçapı ~168 px; düğüm 96 px aşağıda başladığında kemerin o
derinlikteki genişliği (~304 px) kurdele satırını (~170 px) rahatça alır.

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
