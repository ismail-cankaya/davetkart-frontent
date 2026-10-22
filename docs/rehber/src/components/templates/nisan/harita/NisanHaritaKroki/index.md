# `nisan/harita/NisanHaritaKroki` — "Kroki"

> **ID:** `nisan-harita-kroki` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** mahalle krokisi
> **Tarih:** 2026-10-22 · dal `design/harita`

---

## 1. Fikir

Nişan çoğu zaman bir eve, bir salona "gelin, burası" diye çağırır; misafire peçeteye çizilmiş bir
**adres krokisi** verilir. Davetiye o krokidir: birkaç titrek sokak, sıra sıra ev simgesi, bir meydan
ve çeşmesi. Rota kesik çizgi ve yön oklarıyla başlık bloğundan çıkar, durakları (program adımları)
geçer, iğnede **"Buradayız"** der.

| | |
|---|---|
| Arazi | [`MahalleKrokisi`](../../../konsept/harita/araziler/MahalleKrokisi.md) — arazi + yol + park + rota |
| Kapak | `duzen="kenar"`, `rota="kroki"`, `sus="kuzey"`, `etiketUstu="Buradayız"` ([HaritaKapak](../../../konsept/harita/HaritaKapak.md)) |
| Zarf | [`HaritaZarf`](../../../konsept/harita/HaritaZarf.md), kapakta kroki penceresi |
| Tema, flavor | [`HARITA_TEMASI`](../../../konsept/harita/tema.md), [`NISAN_HARITA_FLAVOR`](../flavor.md) |

## 2. Düzen

- **360 px:** harita ekranın başında (≥ 160 px); iğne sağ üstte, etiketi solunda iki satır
  ("BURADAYIZ" + mekân); kuzey oku sağ köşede. Kartuş ve lejant altta tam genişlikte üst üste: tek bir
  başlık bloğu. Rota kartuşun üst kenarından çıkar, solda yükselir, sağa döner, iğneye alttan varır.
- **1280 px:** başlık bloğu sağ sütunda (25 rem) dikeyde ortada; kroki solda, meydan ortada; rota
  kartuşun sol kenarından çıkıp meydanın yanından aşağı kıvrılır, soldaki iğneye aşağıdan varır.

**360 × 780 ölçümleri** (y px; düğme ve not ilk ekranda mı?):

| Senaryo | Kartuş | Lejant | Yol tarifi | Temsilî harita | Kapak |
|---|---|---|---|---|---|
| dolu | 180–430 | 440–744 | 727 ✓ | 767 ✓ | 791 |
| uzun | 180–524 | 534–877 | 860 ✗ (kaydırınca) | 900 ✗ | 924 |
| kapalı | 290–540 | 550–733 | 716 ✓ | 756 ✓ | 780 |
| boş | 545–731 | — | — | 756 ✓ | 780 |

Dört senaryoda rota noktası mekân etiketine binmez, durak kutuların altında kalmaz (ölçüm).

## 3. Ayrışma

| Karşı | Fark |
|---|---|
| Nişan Kavuşak (aynı kategori, aynı konsept) | Mahalle krokisi × arazi; harita **üstte**, başlık bloğu altta × kartuş üstte, lejant altta; kesik çizgi + yön oku × halkalı patika; tek rota × iki kol |
| Düğün Kıyı Kenti (şehir planı) | Izgara ve dolu bloklar yok; sokaklar titrek çift çizgi, evler simge. Kıyı'da kartuş ve lejant karşı köşelerde; Kroki'de tek kenarda üst üste |
| Nişan Yıldız Haritası | Gece gökyüzü, daire kadraj × gündüz, yeryüzü, sokak |
| Nişan Teknik Çizim (Blueprint) | Lacivert, ölçü kotası × açık zemin, elle çizilmiş kroki; ölçü yok |
| Nişan Posta Damgası | Yolculuğunu bitirmiş mektup × gidilecek yolun tarifi |
| Kâğıt pilotu (Gül Kurusu, Söz Mektubu, Söz Senedi) | Kâğıt dokusu, mektup/senet nesnesi, eğik kart × düz renk harita, nesne değil plan |
| Mezuniyet Pusula | Antika dünya haritası, altın × yerel kroki, altın yok |

## 4. Doğrulama

- Ekran görüntüleri: `node_modules/.cache/onizleme/nisan-harita-kroki/` (dolu, uzun, boş, kapalı ×
  360/768/1280; zarf; hareket azaltılmış; her modül tek tek kapalı) ve
  `node_modules/.cache/onizleme-nisan/` (nişan programı, tek ad, boş tarih, boş mekân).
- Giriş (sıcak önbellek): 960 ms (360), 953 ms (1280); zarf açılarak 973 ms; zarf kalkışı (Tab → Enter) 896 ms.
- Kontrast (çizilmiş ekrandan, metin saydam yapılıp zeminin en kötü pikseli): bölüm üst etiketi
  (rota, 10 px) en kötü **4.64** (1280) / 4.72 (360); gövde gri en kötü 4.86; kapaktaki bütün metin
  beyaz zeminde ≥ 6.69.
- Klavye: ilk Tab "Yol tarifi" (294 × 44, 2 px mürekkep çerçeve); zarfta "Haritayı açın" (147 × 44).
- DOM: arazi SVG 25.7 KB / 20 öğe; harita katmanı 5.4 KB / 54 öğe. Kaynak 1.3 KB.
