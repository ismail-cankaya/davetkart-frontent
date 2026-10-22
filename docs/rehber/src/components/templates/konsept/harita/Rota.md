# `konsept/harita/Rota.tsx` — noktalı rota ve duraklar

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (`gizli`, `olcek`; nişan: `kroki` stili, `kol`) · dal `design/harita`

---

## 1. Çizim

Ara noktalar [`egriKur`](rotaGeometri.md) ile yumuşak bir eğriye, eğri `ornekle` ile eşit aralıklı
noktalara açılır. SVG, kapağın piksel boyutundadır (viewBox = ölçü): noktalar her genişlikte yuvarlak.

| Stil | Görünüş | Grafik kontrastı |
|---|---|---|
| `cadde` | Beyaz bant (13 px) + ince mürekkep kenar; üstünde 11 px arayla `rotaAcik` noktalar | nokta / beyaz 4.96 |
| `patika` | Bant yok; her noktanın arazi renginde 2.6 px halkası, 10 px aralık | nokta / halka 4.31 |
| `kroki` | 7 px'lik kesik çizgiler (3 px, `rotaAcik`, yuvarlak uç), her birinin altında 7 px beyaz kesik; yay boyunca ~110 px'te bir **yön oku** (`rota`, 2.4 px, beyaz alt çizgili), duraklara 26 px'ten yakın ok konmaz | çizgi / beyaz alt 4.96; ok / beyaz 6.69 |

`kroki`nin beyaz alt kesiği rotayı krokinin ev ve sokak çizgilerinden ayırır (halo değil: düz,
çizginin kendi biçiminde). Okların yönü teğetten hesaplanır; dönüş SVG `transform`'udur (durağan).

Duraklar: beyaz daire (r 14), rota kontur, içinde 16 px [simge](simgeler.md) ya da sıra numarası
(Barlow Condensed 600). Yerleri yay uzunluğunun ilk üçte ikisinde eşit aralıklı
([`durakOranlari`](rotaPlani.md)); son parça iğneye ve etiketine kalır.

`gizli` (px): rotanın başındaki, kartuşun altında kalan uzunluk ([gizli başlangıç](rotaPlani.md)).
Duraklar yalnızca görünen kısma dağıtılır: oran `g + o × (1 − g)`, `g = gizli / uzunluk` (en çok 0.5).

### 1.1 İkinci kol (`kol`, `kavsak`)

Kavşaklı rotada ([`kavsak` düzeni](rotaPlani.md)) ikinci kol ana rotayla aynı stilde çizilir. Kavşağın
ana rotadaki oranı, kavşağa kadarki eğrinin uzunluğundan hesaplanır; duraklar kavşaktan **sonraki**
ortak yola dizilir (bir kişinin kolunda değil). `cadde` stilinde kolun da beyaz bandı vardır.

## 2. Hareket

Noktalar on parçaya bölünür; her parça yalnızca **opaklıkla** ve sırayla belirir (`pathLength` ya da
`stroke-dashoffset` yok). Durak ve yön oku, içinde durduğu parçayla birlikte belirir. İkinci kol,
ana rotanın kavşağa kadarki parça sayısı kadar parçaya bölünür ve onlarla **aynı anda** belirir:
iki yol birlikte ilerleyip kavşakta buluşur. Kroki kesikleri parça sınırında kopmaz (her parçanın
son kesiği sonraki parçanın ilk noktasına uzanır).

Zamanlar [hareket](hareket.md)'te; `olcek` (kapak fontları beklediyse `1 − k`) gecikme ve süreleri
sıkıştırır.
