# `konsept/harita/IzKapak.tsx` — lejantsız harita kapağı

> **Tarih:** 2026-10-23 · dal `design/harita` · İlk kullananlar: [Hazine Avı](../../dogum-gunu/harita/DogumGunuHaritaHazineAvi/index.md), [Kutlama Hattı](../../dogum-gunu/harita/DogumGunuHaritaKutlamaHatti/index.md)

---

## 1. Neden ayrı bir kapak?

[`HaritaKapak`](HaritaKapak.md) iki kutu (kartuş, lejant) ölçer; durakları rotanın üstüne eşit aralıkla
süs olarak dizer, bilgi lejanttadır. Telefonda bunun üç iskeleti kullanıldı (HARITA-KONSEPTI §11). İz kapağı
lejantı kaldırır: program adımları haritanın üstünde **tek tek gerçek metin kutularıdır**, rota onların
ölçülen rozetlerinden geçer. Böylece telefonda yeni iskeletler kurulur.

## 2. Props

`HeroRenderProps` + :

| Prop | Tür | Ne |
|---|---|---|
| `duzen` | `'hazine' \| 'hat'` | Yerleşim ve rota geometrisi ([izPlani](izPlani.md)) |
| `rota` | `RotaStili` | `kroki` (hazine), `cadde` (hat) — [Rota](Rota.md) |
| `sus` | `KoseSusu` | Pusula gülü / kuzey oku |
| `hedefEtiketi` | `string?` | Varış kartında mekânın üstündeki üretilen satır; yalnızca mekân varsa |
| `sozluk` | `SimgeSozlugu?` | Durak simgesi için preset sözlüğü, genelden önce ([veri](veri.md)) |
| `vurgu` | `'esit' \| 'ilk'` | [Kartuş](Kartus.md) ad vurgusu |
| `enCok` | `number` (4) | Haritada en çok durak; kalanı "+N durak programda" |

## 3. Parçalar

| Parça | Ne |
|---|---|
| Durak kutusu | Hazine: rozet + saat (rota, 12 px) + ad; sağdakinde rozet solda, soldakinde sağda (içe bakar). Hat: rozet omurgada (kutunun 39 px solu), 13 px rota çizgisi, iri saat (20 px) + ad |
| Varış kartı | Lejantın kalanı: `hedefEtiketi` + mekân, program yoksa tarih satırı, [`Varisa`](Lejant.md), [`YolTarifi`](Lejant.md). Satırı yoksa çizilmez |
| Hedef işareti | Hazine: [`Carpi`](Igne.md) (X), kartın ilk satırı hizasında. Hat: [`Igne`](Igne.md) omurgada, ucu kartın ilk satırında |
| Başlangıç halkası | Hat: rota katmanında beyaz halka (r 8, 3 px mürekkep) |
| Köşe süsü, dipnot | Dar: altta bir satırda; geniş: mutlak köşelerde |

Erişim: kutular `<ol aria-label="{flavor.headings.timeline}">` içinde gerçek metin; rota katmanı ve işaretler
`aria-hidden`. Bütün bilgi yataydır (döndürülmez).

## 4. Ölçü

Çapalar `data-iz="bas" | "durak" | "hedef"` ile işaretlenir; kapağa göre yerleri `offset*` zinciriyle
okunur (dönüşümü saymaz — girişteki y 8 → 0 kayması ölçüyü oynatmaz; ara kapların kenar kalınlığı eklenir).
Her çizimden sonra bir kez ve `ResizeObserver` ile okunur. **2 px tolerans:** giriş biterken alt piksel
yuvarlaması bir rozeti 1 px kaydırıyordu (~1.03 s, ölçüldü) ve rota yeniden kurulunca oklar dönüyordu.

Zamanlama [`kapakOrtak`](kapakOrtak.md) ile: rota katmanı fontları bekler, geç açılırsa çizelgesi sıkışır ya
da hiç oynamaz. Kutular yer değiştirirse (font sınırdan da geç geldi) rota onları animasyonsuz izler.

## 5. Hareket

Kartuş 0 s, duraklar 0.12 + i·0.06 s (0.4 s, y 8 → 0), varış kartı 0.3 s, işaret 0.55 s (iğne düşer), rota
0.15 s'den 10 parça, dipnot 0.6 s. Son öğe ≤ 0.9 s; ölçülen giriş 870–908 ms (sıcak önbellek).

## 6. Bilinen sınırlar

- Program 4 adımdan uzunsa kalan haritada değil, "+N durak programda" notunda; tamamı Duraklar bölümünde.
- Uzun ad + uzun mekânda yol tarifi ilk ekranın altına iner (Nişan kararıyla aynı).
