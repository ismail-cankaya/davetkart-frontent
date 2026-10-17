# `dugun/sergi/DugunSergiBeyazKup` — "Beyaz Küp"

> **ID:** `dugun-sergi-beyaz-kup` · **Konsept:** [Sergi Açılışı](../../../../../../tasarim/SERGI-KONSEPTI.md) · eksen **Tek eser**
> **Tarih:** 2026-10-17 · dal `design/sergi`

---

## 1. Fikir

Müzede düğün. Beyaz duvarda çiftin adı bir kişisel serginin adı gibi yazılı; yanında beyaz paspartulu
tek çerçeve — kobalt bir alanda iki kemer ve tek eşik ("Eşik": gelinin eşikten geçişi, iki kişinin aynı
kapıdan girişi) — ve müze etiketi. Spot eserin üst kenarına düşer. Şakasız (§7).

| | |
|---|---|
| Eser rengi | `kobalt` — düğme, üst etiket, `&`, program çizgisi |
| Eser | `SOYUT_ESERLER.esik` |
| Kapı | `SergiKapi` (çerçeve silueti açık) |

## 2. Metinler

| Yer | Veri | Biçim |
|---|---|---|
| Üst etiket | `title` (harf büyüklüğü olduğu gibi) | Sans 600, 11 px, `tracking-[0.22em]`, kobalt |
| Duvar yazısı | `names`; boşsa "Davetlisiniz" | Serif italik; en uzun satıra göre 44/38/32 px (mobil) → 68/58/52 px (1024+) |
| Etiket | sanatçı `names` → *Eşik*, yıl (tarihten) → "Tuval üzerine akrilik" → **AÇILIŞ**: tarih + saat, mekân | `Etiket` |
| Duvar metni | `subtitle` | Sans 15–16 px, en çok 34 karakter satır |
| Geri sayım | `showTimer` + geçerli tarih | `SergiSayac` |

Boş alanın kabı çizilmez: tarih yoksa yıl, saat ve sayaç; mekân yoksa o satır; başlık silinmişse üst
etiket yok.

## 3. Düzen (asimetrik)

| Kap genişliği | Yerleşim |
|---|---|
| < 512 px | Yazı üstte sola yaslı; çerçeve %76 genişlikte sağa yaslı; etiket çerçevenin sağ alt köşesinde (§4.1'in mobil istisnası) |
| 512–1023 px | Çerçeve (%54) ve etiket yan yana, sağa yaslı grup; etiket çerçevenin altına hizalı |
| ≥ 1024 px | İki sütun 11 : 13 — solda yazı, mesaj ve sayaç; sağda çerçeve + yanında etiket |

360×780'de adlar, eser ve etiketin tamamı ilk ekrandadır; mesaj ilk ekranın altından başlar.

## 4. Hareket (son öğe ≤ 1.0 s; ölçülen 886–892 ms)

Spot 0–0.5 s → adlar font hazır olunca (≤ 400 ms) +0.1, 0.4 s → eser 0.15–0.75 s asılır → etiket
0.5–0.8 s → mesaj 0.45–0.85 s → sayaç 0.5–0.8 s.

## 5. Erişilebilirlik

- Çizilmiş ekranda ölçülen en düşük metin oranı 5.99 (etiket rengi, spot kenarı); kapı 6.67.
- Eser `aria-hidden` (süs); etiket gerçek metindir. Kapakta etkileşimli öğe yok.

## 6. Sınırlar

- 768 px'te çerçeve + etiket grubu sağa yaslanır ama çerçeve kap ortasına yakın kalır.
- Galerinin ilk fotoğrafı çerçeveye konmadı (açık soru, pilot raporu §8).
