# `konsept/harita/HaritaZarf.tsx` — katlanmış harita (`renderEnvelope`)

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (K3: masaüstünde büyür) · dal `design/harita`

---

## 1. Fikir

Zarf modülünün haritadaki karşılığı: katlanmış bir harita. Kapak küçük bir kartuştur — üst etiket
(`flavor.envelopeLabel`), adlar, haritadan küçük bir pencere (preset'in kendi arazisi + iğne), altta
"GÜNÜN HARİTASI" ve pusula gülü. Altında açılan ilk panel: arazi, iki kat izi, iğne.

Kompozisyon bu bileşeni yalnızca `showEnvelope` açıkken çağırır; modül kapalıyken zarf hiç görünmez.

## 2. Boyut (K3)

Pilotta kart her genişlikte 17 rem'di; 1280 px'te boş zeminin ortasında küçük kalıyordu. Şimdi kapı
bir **boyut kabıdır** (`container-type: size`) ve kart kapının kendisine göre ölçülür (pencereye göre
değil: editörün önizleme çerçevesinde de doğru):

| Kapının iç genişliği | Kart genişliği (en/boy 3:4) |
|---|---|
| < 42 rem (telefon) | `min(17rem, (100cqh − 8rem) × 0.75)` — dikey telefonda bugünkü 17 rem; yatay telefonda boya sığar |
| ≥ 42 rem (`@2xl`; 768 px tablet dahil — kapının `px-6` dolgusu yüzünden `@3xl` 768'de tutmaz) | `min(70cqh × 0.75, 100cqw − 6rem)` — kart kapı boyunun %70'i |

Geniş kartta yazı ve boşluklar da büyür: üst etiket 14 px, adlar 46 px, dolgu 36/40 px, gölge 6 px,
pusula 56 px, penceredeki iğne ×1.25.

**Ölçüm** (kart, `dugun-harita-kir-yolu` ve `dugun-harita-kiyi-kenti` aynı):

| Ekran | Önce | Sonra | Kart boyu / ekran |
|---|---|---|---|
| 360 × 780 | 272 × 363 | 272 × 363 (değişmedi) | 0.46 |
| 768 × 1024 | 272 × 363 | 538 × 717 | 0.70 |
| 1280 × 800 | 272 × 363 | 420 × 560 | 0.70 |
| 740 × 360 (yatay telefon) | 272 × 363 (taşıyordu) | 189 × 252, düğmenin altı 342 | 0.70 |

## 3. Zamanlama

| s | Olay |
|---|---|
| 0.00–0.45 | Kapak sol kenarından açılır (`rotateY` 0 → −165°, arka yüz gizli) |
| 0.40 | `onRevealStart` — kapak girişini başlatır |
| 0.45–0.85 | Kapı solar → `onOpened` |

**Ölçüm** (Tab → Enter, kapının DOM'dan kalkışı): 902 ms. Hareket azaltıldığında 68 ms (dönme ve
solma yok, kapı anında kalkar). Zarf açılırken fontlar yüklenmiş olur; kapak rotayı beklemeden kurar
(ölçüldü: 1280 px'te iğne kapakla birlikte, giriş 974 ms).

## 4. Erişim

"Haritayı açın" gerçek bir `<button>` (147 × 44 px, görünür odak çerçevesi). Ortak dal sonrasında
(2026-10-22) canlı modda kompozisyon odağı kapının ilk düğmesine **kendisi** koyar ve arkadaki içerik
`inert`'tir: sayfa açılınca odak düğmededir, Tab kapıdan dışarı kaçmaz. Enter ile açılır (ölçüldü:
Kır Yolu 908 ms, Kroki 899 ms kapının kalkışına kadar). Kapının herhangi bir yerine dokunmak da açar.

## 5. Sınır

Pilotta kapı açıkken arkadaki bölümler Tab ile odaklanabiliyordu; ortak dalda (`5fd5861`) çözüldü.

## Doğum günü eki (2026-10-23)

`isaret?: (olcek) => ReactNode` — kapak penceresindeki ve iç paneldeki mekân işareti. Varsayılan iğne; Hazine
Avı `Carpi` (X) verir. Ölçek iç panelde 0.9, kapakta 0.75.
