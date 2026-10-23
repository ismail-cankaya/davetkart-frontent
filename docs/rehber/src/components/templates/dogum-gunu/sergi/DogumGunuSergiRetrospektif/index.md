# `dogum-gunu/sergi/DogumGunuSergiRetrospektif` — "Retrospektif"

> **ID:** `dogum-gunu-sergi-retrospektif` · **Konsept:** [Sergi Açılışı](../../../../../../tasarim/SERGI-KONSEPTI.md) · eksen **Salon asması**
> **Tarih:** 2026-10-23 · dal `design/sergi`

---

## 1. Fikir

Doğum günü bir retrospektiftir. Duvarda sahibinin adı, altında "Retrospektif". İnce bir duvar rayından,
farklı boy tellerle dört küçük çerçeve sarkar; her biri bir dönem. Çerçevenin altında Roma rakamı ve dönemin
adı yazılıdır; **yıl yoktur** (yaş ve yıllar veride yok, uydurulmaz). Dönemler her yaşa uyar: ilk resim,
oyun, keşif, bugün.

| No | Dönem | Eser (`SOYUT_ESERLER`) | Oran | Biçim |
|---|---|---|---|---|
| I | İlk işler | `ilkIsler` | 1 / 1 | Duvar zeminde tek safran daire, mürekkep yer çizgisi |
| II | Oyun dönemi | `oyunDonemi` | 3 / 4 | Üst üste üç blok, en üstteki hafif eğik |
| III | Keşif dönemi | `kesifDonemi` | 4 / 3 | Safran alan, köşeden köşeye mürekkep yörünge, ucunda beyaz nokta |
| IV | Bugün | `bugun` | 2 / 3 | Tek mum: mürekkep gövde, safran alev |

| | |
|---|---|
| Eser rengi | `safran` — eser yüzeyi ve düğme; duvarda yazı olamaz (2.04), vurgu yazısı mürekkep (kit `palet.ts`) |
| Kapı | `SergiKapi`, silueti karanlıktaki ray ve dört çerçeve (`SALON_SILUETI`) |
| Espri | Etiketin teknik satırı: *Karışık teknik: sabır, kahkaha, çay* (§7 örneği; preset'in tek esprisi) |

## 2. Metinler

| Yer | Veri | Biçim |
|---|---|---|
| Üst etiket | `title` (harf büyüklüğü olduğu gibi) | Sans 600, 11 px, `tracking-[0.22em]`, mürekkep |
| Ad (`h1`) | `names`'in ilk adı (sahibi); adsızsa "Retrospektif" | Serif italik; 52/42/34 px (mobil) → 76/62/52 px (1024+), tek satır uzunluğuna göre |
| Sergi adı | "Retrospektif"; adsızsa `h1`'e çıktığı için çizilmez | Serif 26 → 34 px, etiket rengi |
| Dönem adları | Sabit (yukarıdaki tablo) | 12 px; rakam 600 mürekkep, ad etiket rengi |
| Etiket (duvarda) | sanatçı (sahibi) → *Dört dönem* → teknik (espri) → Küratör (ev sahibi) → **AÇILIŞ**: tarih + saat, mekân | `Etiket kurator` |
| Duvar metni + sayaç | `subtitle`, `showTimer` ("Açılışa kalan") | Sans 15–16 px; `SergiSayac` |

Boş alanın kabı çizilmez: tarih yoksa saat ve sayaç; mekân yoksa o satır; ikisi de yoksa etiketin AÇILIŞ
bölümü yok. Tek ad: küratör satırı yok. *Dört dönem* ve teknik satırı kurgusal künyedir (§11 K6).

## 3. Düzen (asimetrik)

| Kap genişliği | Yerleşim |
|---|---|
| < 768 px | Yazı üstte sola yaslı; salon tam genişlikte; etiket salonun sağ alt köşesinde (%66, §4.1 mobil istisnası) |
| 768–1023 px | Salon %72, etiket yanında, rayın altına hizalı |
| ≥ 1024 px | İki sütun 9 : 15 — solda yazı, mesaj ve sayaç; sağda salon + yanında etiket |

Ray 2 px `kenar-guclu`; çerçeveler rayın %24 / %19 / %30 / %15'i, teller 20 / 8 / 36 / 14 px (768+: 24 / 8 /
44 / 16). Paspartu %9. 360×780'de ad, salon ve etiketin tamamı ilk ekrandadır.

## 4. Hareket (son öğe ≤ 1.0 s; ölçülen 940–947 ms)

Spot 0–0.5 s → yazı font hazır olunca (≤ 400 ms) +0.1, 0.4 s → çerçeveler soldan sağa 70 ms arayla
asılır (0.12–0.72 … 0.33–0.93 s) → dönem adları 0.45 s'den 50 ms arayla, 0.3 s → etiket 0.6–0.9 s →
mesaj 0.45–0.85 s → sayaç 0.5–0.8 s. Ölçüm: ilk kareden kapakta son stil değişimine kadar (geçici betik,
360 / 768 / 1280).

## 5. Erişilebilirlik

- Dönemler `ol` (`aria-label="Dönemler"`): ekran okuyucu sırayı ve adları okur; eserler, ray ve teller
  `aria-hidden` (süs).
- Çizilmiş ekranda ölçülen en düşük kapak metni oranı **4.87** (360 px'te 12 px dönem adı; ölçüm kenar
  yumuşatmasını da sayar, formülle 6.05). Kapı: 6.67. Kapakta etkileşimli öğe yok.

## 6. Sınırlar

- 360 px'te çerçeveler küçük (en dar 47 px); salon asmasının doğası. Dönem adları iki satıra kırılabilir.
- Kapı silueti kısa adlı kapaktaki rayın ölçülen yerine konur (360: üst %31; 768: üst %40.4; 1280: sol
  %41.9, sağ %20.9, üst %37.6); uzun adda salon biraz aşağıda kalır.
- Dönem adları sabittir; kullanıcı değiştiremez.
