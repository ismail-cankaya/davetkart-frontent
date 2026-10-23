# `dogum-gunu/sergi/DogumGunuSergiDevamEden` — "Devam Eden"

> **ID:** `dogum-gunu-sergi-devam-eden` · **Konsept:** [Sergi Açılışı](../../../../../../tasarim/SERGI-KONSEPTI.md) · eksen **Tek eser** (yatay)
> **Tarih:** 2026-10-23 · dal `design/sergi`

---

## 1. Fikir

Retrospektifin son odası: duvarda tek bir eser, henüz bitmemiş. Yatay tuvalde kalın bir kobalt yay ortada
kesilir; devamı ve bir daire yalnızca kesik kurşun kalem çizgisiyle eskizdir. Eserin adı **Yeni Yaş**: yeni
yaş henüz çiziliyor. Etiket beyaz plakada; galerilerin nokta işaretiyle **Sürüyor** — preset'in tek
esprisi (eser satılmadı, bitmedi de).

| | |
|---|---|
| Eser rengi | `kobalt` — eser, üst etiket, nokta, düğmeler |
| Eser | `SOYUT_ESERLER.yeniYas` (`EserYeniYas`, 5 / 4) |
| Kapı | `SergiKapi`, silueti karanlıktaki yatay tuval (`TUVAL_SILUETI`) |
| Kardeşinden farkı | Retrospektif çok çerçeveli salon + duvar etiketi; burada tek büyük yatay tuval + plaka |
| Düğün Beyaz Küp'ten farkı | Dikey, bitmiş tek eser değil; yatay ve yarım; plaka, küratör ve nokta satırı |

## 2. Metinler

| Yer | Veri | Biçim |
|---|---|---|
| Üst etiket | `title` (harf büyüklüğü olduğu gibi) | Sans 600, 11 px, `tracking-[0.22em]`, kobalt |
| Ad (`h1`) | `names`'in ilk adı (sahibi); adsızsa "Davetlisiniz" | Serif italik; 48/40/32 px (mobil) → 70/58/50 px (1024+) |
| Oda etiketi | "Retrospektif · Son oda" (sabit) | Sans 600, 11 px, büyük harf CSS ile (`lang="tr"`), etiket rengi |
| Etiket (plaka) | sanatçı (sahibi) → *Yeni Yaş*, yıl (etkinlik tarihinden) → "Tuval üzerine akrilik ve kurşun kalem" → ● Sürüyor → Küratör (ev sahibi) → **AÇILIŞ**: tarih + saat, mekân | `Etiket levha nokta kurator` |
| Duvar metni + sayaç | `subtitle`, `showTimer` ("Açılışa kalan") | Sans 15–16 px; `SergiSayac` |

Yıl etkinliğin tarihinden gelir (veridir); tarih yoksa yazılmaz. Boş alanın kabı çizilmez (Retrospektif'teki
gibi). Eser künyesi kurgusaldır (§11 K6).

## 3. Düzen (asimetrik)

| Kap genişliği | Yerleşim |
|---|---|
| < 512 px | Yazı üstte sola yaslı; tuval %90 genişlikte sağa yaslı; plaka tuvalin sağ alt köşesinde (§4.1 mobil istisnası) |
| 512–1023 px | Tuval (%60) ve plaka yan yana; plaka tuvalin altına hizalı |
| ≥ 1024 px | İki sütun 10 : 14 — solda yazı, mesaj ve sayaç; sağda tuval + yanında plaka |

Paspartu %7. 360×780'de ad, tuval ve plakanın tamamı ilk ekrandadır (kısa ad, iki satırlık başlık).

## 4. Hareket (son öğe ≤ 1.0 s; ölçülen 861–866 ms)

Spot 0–0.5 s → yazı font hazır olunca +0.1, 0.4 s → tuval 0.15–0.75 s asılır → plaka 0.55–0.85 s → mesaj
0.45–0.85 s → sayaç 0.5–0.8 s.

## 5. Erişilebilirlik

- Çizilmiş ekranda ölçülen en düşük kapak metni oranı **5.04** (12 px sayaç birimi; kenar yumuşatması
  dahil); plakadaki gri satırlar 5.83, kobalt üst etiket formülle 7.49. Kapı: 6.67.
- Eser ve nokta `aria-hidden` (süs); "Sürüyor" gerçek metindir. Kapakta etkileşimli öğe yok.

## 6. Sınırlar

- Kapı silueti kısa adlı kapaktaki tuvalin ölçülen yerine konur (360: üst %29.7; 768: sağ %41.8, üst %33.5;
  1280: sağ %22.8, üst %28.7); uzun adda tuval biraz aşağıda kalır.
- Mobil iskelet §4.1 gereği Beyaz Küp ve Diptik'le aynı (yazı üstte, eser sağda, etiket köşede); ayrım yatay
  ve yarım eser, plaka ve küratör satırıyla kuruluyor.
