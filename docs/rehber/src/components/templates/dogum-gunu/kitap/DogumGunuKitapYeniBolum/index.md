# `dogum-gunu/kitap/DogumGunuKitapYeniBolum` — "Yeni Bölüm"

> **ID:** `dogum-gunu-kitap-yeni-bolum` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** anı defteri (yetişkin) · **Tarih:** 2026-10-23 · dal `design/kitap`

---

## 1. Fikir

Doğum günü hikâyenin yeni bölümüdür; yeni bölüm yeni bir defterle başlar. İlk ekran kara kaplı bir
anı defteri: sağ kenarından dikine kurdele renkli lastik geçer, ortadaki şamua etiket kâğıdında
"YENİ BÖLÜM" ve sahibinin adı, altında ev sahibi künye satırı. Tarih kapağın üstünde, italik "Yeni
Yaşımı Birlikte Kutlayalım" etiketin altında. Kapağın ardında **çizgili defter sayfası**: kullanıcının
başlığı, başharfli alt metin, tarih ve mekân, geri sayım, sayfa "1". Bölümler "Yeni Bölüm · II…".

Yaş veride yok: "Otuzuncu Bölüm" gibi bir sayı yazılmaz; bölüm adsızdır (KITAP-KONSEPTI §7, §8).

| | |
|---|---|
| Kapak | `DefterKapak` (kit), renk `murekkep` `#231F1A` — bez değil, dokusuz mukavva; yeni renk yok |
| Kapak etiketi | "Yeni Bölüm" (sayfa başının sağ yanı da bu) |
| Hero parçaları | `DefterKapak` + `CizgiliSayfa` + `BolumAcilisi` (kit) + `SahipAdi` ([ortak](../ortak.md)) |

### Masal'dan farkı (360 px'te)

| | Yeni Bölüm | Masal |
|---|---|---|
| Kapağın merkezi | Açık dikdörtgen etiket kutusu, içinde mürekkep ad | Açık yüzey yok; yaldız figür + yaldız ad |
| Süs | Sağ kenarda dikine kurdele lastik | Ekranı çevreleyen çift çizgi çerçeve, köşe ışıltıları |
| Tarih | Üstte | Altta |
| İlk sayfa | Çizgili defter sayfası, solda kenar boşluğu çizgisi, sayfa "1" | Kurdele çift çerçeveli sayfa, numarasız |
| Bölüm etiketleri | Yeni Bölüm · II… | İkinci Sayfa… |

## 2. İki hâl

| Zarf modülü | İlk ekran | Hero |
|---|---|---|
| Kapalı | Defter kapağı (tam ekran boyu, `useEkranBoyu`), altta "Sayfayı çevirin" | Kapak + altından çizgili sayfa (ad tekrar edilmez); etiketteki ad `h1` |
| Açık | Defter kapağı **kapı olarak** (`KapakKapisi yuz=…`, "Kapağı açın") | Yalnızca çizgili sayfa; sahibinin adı ve ev sahibi orada (`adlarDizgisi`), ad `h1` |

## 3. Hareket

Zarfsız: kapak içeriği font beklemesi (≤ 0.4 s) + 0.5 s belirme; çizgili sayfa görününce 0.4 s
(`sectionMotion` ortak bölümlerde de 0.4 s / 12 px). Ölçüldü (sıcak önbellek, 360 px): kapaktaki
son stil değişikliği ilk karenin 523–524 ms ardından. Zarflı: kapı 832 ms (360) / 829 ms (1280)
sonra kalkar; hareket azaltılmışken 34 ms.

## 4. Erişilebilirlik ve kontrast (çizilmiş ekranda ölçüldü, 2026-10-23)

| | Sonuç |
|---|---|
| En kötü metin (dolu · uzun · zarflı açılmış; 360 / 1280) | **4.92** — `soluk` bir satır çizgisinin üstünde; AA altı yok |
| Etiket kâğıdı | 6.17 (ev sahibi) · 6.82 ("Yeni Bölüm") · mürekkep ad 13.6 |
| Kapak yaldızı (tarih, italik, ipucu, "Kapağı açın") | 6.92 |
| Klavye (zarflı) | Sekme "Kapağı açın"a gelir (158 × 44) |
| Dokunma hedefleri | Kapı düğmesi 44 px; galeri noktaları 24 × 44 (N2 istisnası); 24 px'lik bir ortak `input` (LCV, ortak bileşen) |
| Süs | Lastik, oluk, etiket çizgisi, satır çizgileri, fleuron `aria-hidden` |
