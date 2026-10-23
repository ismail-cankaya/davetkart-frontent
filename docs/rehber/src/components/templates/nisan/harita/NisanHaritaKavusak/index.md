# `nisan/harita/NisanHaritaKavusak` — "Kavuşak"

> **ID:** `nisan-harita-kavusak` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** arazi
> **Tarih:** 2026-10-22 · dal `design/harita`

---

## 1. Fikir

*Rotamız belli*: iki kişi, iki yol, bir rota. Arazi, iki derenin birleştiği bir **kavuşak**tır; rota da
iki kolla başlar — kartuşun altından iki ayrı patika çıkar, bir kavşakta birleşir ve tek rota olarak
durakları geçip kavuşağın yanındaki iğneye varır. Kollar adlardan gelir: tek ad girildiyse rota tek
koldur (veride olmayan ikinci yol çizilmez).

| | |
|---|---|
| Arazi | [`KavusakArazisi`](../../../konsept/harita/araziler/KavusakArazisi.md) — arazi + park + su + rota |
| Kapak | `duzen="kavsak"`, `rota="patika"`, `sus="pusula"` ([HaritaKapak](../../../konsept/harita/HaritaKapak.md), [rotaPlani](../../../konsept/harita/rotaPlani.md)) |
| Zarf | [`HaritaZarf`](../../../konsept/harita/HaritaZarf.md), kapakta kavuşak penceresi |
| Tema, flavor | [`HARITA_TEMASI`](../../../konsept/harita/tema.md), [`NISAN_HARITA_FLAVOR`](../flavor.md) |

## 2. Düğün Kır Yolu ile aynı eksen — nişana özgü yerleşim (gerekçe)

Kavuşak, Kır Yolu gibi **arazi** eksenindedir. Fark yalnızca renk ya da arazi değil:

| | Kır Yolu (düğün) | Kavuşak (nişan) |
|---|---|---|
| Rota | Tek patika: başlık bloğundan tepeye | **İki kol + kavşak**: iki ad iki yoldan gelir, birleşir; duraklar ortak yolda |
| Telefon | Lejant üstte, kartuş altta, iğne üstte | Kartuş üst solda, lejant **alt solda**, iğne sağda; rota yukarıdan iner |
| Masaüstü | Kartuş sol alt, lejant sağ üst (çapraz) | Kartuş ve lejant **ikisi de üst satırda**, karşı köşelerde; rota aşağıdaki araziye iner, iğne kavuşağın yanında |
| Arazi | Tek dere + gölet, tepe doruğu | İki kol + ırmak (kavuşak), aradaki sırt |
| Köşe süsü | Pusula sağ altta | Pusula sol altta (genişte), sağ üstte (darda) |

Nişan "iki kişinin yollarının birleştiği" an olduğu için kavşaklı rota bu kategoriye özgüdür;
düğünde yollar zaten birleşmiştir.

## 3. Düzen

**360 × 780 ölçümleri** (y px):

| Senaryo | Kartuş | Lejant | Yol tarifi | Temsilî harita | Kapak |
|---|---|---|---|---|---|
| dolu | 20–270 | 438–742 | 725 ✓ | 765 ✓ | 789 |
| uzun | 20–387 | 555–897 | 880 ✗ (kaydırınca) | 920 ✗ | 944 |
| kapalı | 20–270 | 550–733 | 716 ✓ | 756 ✓ | 780 |
| boş (tek kol) | 20–206 | — | — | 756 ✓ | 780 |

Dört senaryoda rota noktası mekân etiketine binmez, durak kutuların altında kalmaz (ölçüm).

## 4. Ayrışma

| Karşı | Fark |
|---|---|
| Nişan Kroki | Arazi × mahalle; kartuş üstte, lejant altta × harita üstte, blok altta; iki kol × tek rota |
| Nişan Yıldız Haritası | Gökyüzü takımyıldızı × yeryüzü eş yükselti; gece × gündüz |
| Nişan Teknik Çizim (Blueprint) | Ölçü kotası, lacivert × resimli arazi, düz renk |
| Nişan Posta Damgası | Tamamlanmış yolculuk × başlayan rota |
| Kâğıt pilotu (Gül Kurusu, Söz Mektubu, Söz Senedi) | Kâğıt nesnesi (mektup, senet, iki halka kabartması) × harita; Söz Senedi'nin iki imzası nesnede, Kavuşak'ın iki adı yolda |
| Mezuniyet Pusula | Antika, altın pusula × yerel arazi, tek renk pusula gülü |

## 5. Doğrulama

- Ekran görüntüleri: `node_modules/.cache/onizleme/nisan-harita-kavusak/` (dolu, uzun, boş, kapalı ×
  360/768/1280; zarf; hareket azaltılmış; her modül tek tek kapalı) ve
  `node_modules/.cache/onizleme-nisan/` (nişan programı, tek ad, boş tarih, boş mekân).
- Giriş (sıcak önbellek): 962 ms (360), 963 ms (1280); hareket azaltılmış 20 ms; zarf kalkışı 906 ms.
- Kontrast (çizilmiş ekrandan): bölüm üst etiketi en kötü **5.15** (360 ve 1280), gövde gri 5.05;
  kapaktaki metin beyaz zeminde ≥ 6.69. *Kavuşak* su adı süs metnidir (mürekkep %50, `aria-hidden`),
  bilgi taşımaz.
- Klavye: ilk Tab "Yol tarifi" (254 × 44); zarfta "Haritayı açın" (147 × 44).
- DOM: arazi SVG 30.8 KB / 167 öğe; harita katmanı 9.1 KB / 82 öğe. Kaynak 1.2 KB.
