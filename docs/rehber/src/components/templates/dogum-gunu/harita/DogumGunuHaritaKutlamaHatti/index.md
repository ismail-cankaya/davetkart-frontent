# `dogum-gunu/harita/DogumGunuHaritaKutlamaHatti` — "Kutlama Hattı"

> **ID:** `dogum-gunu-harita-kutlama-hatti` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** şehir planı (akşam rotası)
> **Tarih:** 2026-10-23 · dal `design/harita`

---

## 1. Fikir

Yetişkin doğum günü şehirde bir akşamdır: davet, o akşamın **hat şeması**. Program adımları bir hattın
istasyonları; hat kartuşun yanındaki başlangıç halkasından iner, istasyonlardan geçer, son durakta iğneyle
biter. Arkada kurgusal bir çarşının yapı adaları. Harita gece değildir (§2.2): "akşam" yalnızca rotanın
kendisidir.

| | |
|---|---|
| Arazi | [`CarsiPlani`](../../../konsept/harita/araziler/CarsiPlani.md) — blok + yol + park + arazi (meydan) |
| Kapak | [`IzKapak`](../../../konsept/harita/IzKapak.md) `duzen="hat"`, `rota="cadde"`, `sus="kuzey"`, `hedefEtiketi="Son durak"`, `vurgu="ilk"` |
| Zarf | [`HaritaZarf`](../../../konsept/harita/HaritaZarf.md), çarşı penceresi |
| Tema, flavor | [`HARITA_TEMASI`](../../../konsept/harita/tema.md), [`DOGUM_GUNU_HARITA_FLAVOR`](../flavor.md) (*Kutlama rotası*) |

Durak simgeleri genel sözlükten (yetişkin partisinde karşılama kadehtir). `names`: sahibi tam boy, ev sahibi
küçük ikinci satır; yaş ve gerçek konum yok.

## 2. Düzen

- **360 px:** sayfanın sol kenarında 64 px'lik şerit; omurga x 38'de. Kartuş ilk istasyon (halka kartuşun
  üst hizasında), altında en çok 4 istasyon kutusu (iri saat + ad; rozet omurgada, kısa rota çizgisiyle
  kutuya bağlı), sonra iğne ve *Son durak* varış kartı. En altta kuzey oku ve not. Rota `cadde`: beyaz bant
  üstünde noktalar, dümdüz.
- **1280 px:** kartuş sol üstte, hat sağ sütunda (24 rem); rota kartuşun sağ kenarından çıkar, çarşının
  üstünden sarkıp hattın başındaki halkaya katılır, sonra aşağı iner. Kuzey oku haritanın altında, not sol
  altta.
- Program kapalı: istasyon yok; omurga kartuştan iğneye ≥ 120 px uzar, kartta tarih satırı.

**360 × 780 ölçümleri** (y px):

| Senaryo | Kartuş | İstasyonlar | İğne ucu | Yol tarifi | Not | Kapak |
|---|---|---|---|---|---|---|
| dolu | 20–240 | 264–475 | 545 | 633–677 ✓ | 745 ✓ | 780 |
| uzun | 20–359 | 383–594 | 646 | 778 ✗ (kaydırınca) | 890 ✗ | 925 |
| kapalı | 20–240 | — | 564 | 633–677 ✓ | 745 ✓ | 780 |
| boş | 20–206 | — | 686 | — | 745 ✓ | 780 |

## 3. Ayrışma

| Karşı | Fark |
|---|---|
| Hazine Avı (aynı kategori) | Bkz. o kılavuzun §3'ü |
| Düğün Kıyı Kenti (şehir planı) | Kıyı'da su, düzenli ızgara, arazi renginde bloklar, kartuş ve lejant karşı köşelerde; Çarşı'da su yok, dolu `blok` adaları, kesik sokaklar; lejant yok, hat omurgası |
| Nişan Kroki, Kavuşak; Düğün Kır Yolu | Telefonda omurgalı tek sütun hiçbirinde yok (§11 iskelet listesi) |
| Doğum günü Takvim, Bento | Izgara kartlar × harita üstünde hat |

## 4. Doğrulama

- Ekran görüntüleri: `node_modules/.cache/onizleme/dogum-gunu-harita-kutlama-hatti/` (Hazine Avı ile aynı set).
- Giriş (sıcak önbellek): 878 ms (360), 875 ms (1280); zarftan 908 ms; soğuk önbellekte 912 ms.
- Kontrast (çizilmiş ekran): en kötü **5.06** (360, *Hediye Takdiri* 10 px rota), 5.20 (768), 5.14 (1280);
  perde %80 yeterli. Kapak kutularında ≥ 6.69.
- Klavye: ilk Tab "Yol tarifi" (246 × 44); zarfta "Haritayı açın" (147 × 44).
- DOM: arazi SVG 8.6 KB / 16 öğe; rota katmanı 3.6 KB / 59 öğe. Kaynak 1.4 KB; raster görsel yok.
