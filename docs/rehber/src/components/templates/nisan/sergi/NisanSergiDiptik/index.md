# `nisan/sergi/NisanSergiDiptik` — "Diptik"

> **ID:** `nisan-sergi-diptik` · **Konsept:** [Sergi Açılışı](../../../../../../tasarim/SERGI-KONSEPTI.md) · eksen **Tek eser** (iki panolu)
> **Tarih:** 2026-10-22 · dal `design/sergi`

---

## 1. Fikir

Önizlemede duvarda tek bir eser var, ama iki panodan oluşuyor: **"İki Yarım"**. Bir daire iki panonun
arasındaki boşlukta bölünür; soldaki yarı fuşya zeminde duvar beyazı, sağdaki duvar beyazı zeminde fuşya.
Alttaki mürekkep çizgi iki panodan da geçer: iki kişi, tek eser ("iki yarım bir bütün"). Panolar ayrı
ayrı asılır.

Etiket beyaz bir plakada; teknik satırının altında galerilerin "satıldı/ayrıldı" işareti olan renkli nokta
ve **Rezerve** — konseptin bu preset'teki tek esprisi (§7: bir preset en çok bir espri satırı, yalnızca
etiketin alt satırında).

| | |
|---|---|
| Eser rengi | `fusya` — eser, üst etiket, `&`, nokta, düğmeler |
| Eser | `SOYUT_ESERLER.ikiYarim` (`EserIkiYarim pano="sol" \| "sag"`) |
| Kapı | `SergiKapi`, silueti karanlıktaki iki pano (`DIPTIK_SILUETI`) |
| Düğün kardeşinden farkı | Beyaz Küp tek dikey çerçeve + duvarda etiket; burada iki pano + plaka + "Rezerve" |

## 2. Metinler

| Yer | Veri | Biçim |
|---|---|---|
| Üst etiket | `title` (harf büyüklüğü olduğu gibi) | Sans 600, 11 px, `tracking-[0.22em]`, fuşya |
| Adlar (`h1`) | `names`; boşsa "Davetlisiniz" | Serif italik; 44/38/32 px (mobil) → 66/56/50 px (1024+) |
| Etiket (plaka) | sanatçı `names` → *İki Yarım*, yıl (tarihten) → "Diptik, tuval üzerine akrilik" → ● Rezerve → **ÖNİZLEME**: tarih + saat, mekân | `Etiket levha nokta` |
| Duvar metni + sayaç | `subtitle`, `showTimer` ("Önizlemeye kalan") | Sans 15–16 px; `SergiSayac` |

Boş alanın kabı çizilmez: tarih yoksa yıl, saat ve sayaç; mekân yoksa o satır; ikisi de yoksa plakanın
ÖNİZLEME bölümü yok (eser künyesi ve Rezerve kalır). Eser künyesi kurgusaldır (§11 K6).

## 3. Düzen (asimetrik)

| Kap genişliği | Yerleşim |
|---|---|
| < 768 px | Yazı üstte sola yaslı; diptik %88 genişlikte sağa yaslı; plaka diptiğin sağ alt köşesinde (§4.1'in mobil istisnası) |
| 768–1023 px | Diptik (%58) ve plaka yan yana, sağa yaslı; plaka diptiğin altına hizalı |
| ≥ 1024 px | İki sütun 10 : 14 — solda yazı, mesaj ve sayaç; sağda diptik + yanında plaka |

Panolar `2 / 3`, paspartu %8, aralarında 10 px (448 px'ten itibaren 14 px). 360×780'de adlar, diptik ve
plakanın tamamı ilk ekrandadır.

## 4. Hareket (son öğe ≤ 1.0 s; ölçülen 896–923 ms, azaltılmış 913 ms)

Spot 0–0.5 s → yazı font hazır olunca (≤ 400 ms) +0.1, 0.4 s → sol pano 0.15–0.75 s asılır → sağ pano
0.28–0.88 s → plaka 0.55–0.85 s → mesaj 0.45–0.85 s → sayaç 0.5–0.8 s.

## 5. Erişilebilirlik

- Çizilmiş ekranda ölçülen en düşük metin oranı **6.12** (fuşya üst etiket, duvarda); plakadaki gri
  satırlar 6.48, adlar 15.75. Kapı: 6.67.
- Eser ve nokta `aria-hidden` (süs); "Rezerve" gerçek metindir. Kapakta etkileşimli öğe yok.

## 6. Sınırlar

- Mobil düzen §4.1 gereği Beyaz Küp'le aynı iskelettedir (yazı üstte, eser sağda altta, etiket köşede);
  ayrım eserin kendisi, plaka ve Rezerve satırıyla kuruluyor.
- Kapı silueti kısa adlı kapaktaki diptiğin ölçülen yerine konur (360: sağ %6.7, üst %29; 768: sağ %42.7,
  üst %37; 1280: sağ %23.7, üst %33); uzun adlarda diptik biraz aşağıda kalır.
- "Rezerve" esprisi galeri âdetini bilmeyen misafire düz okunabilir (açık soru, kategori raporu).
