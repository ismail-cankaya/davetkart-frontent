# `dogum-gunu/kitap/DogumGunuKitapMasal` — "Masal"

> **ID:** `dogum-gunu-kitap-masal` · **Konsept:** Hikâye Kitabı ([KITAP-KONSEPTI](../../../../../../tasarim/KITAP-KONSEPTI.md)) ·
> **Eksen:** masal kitabı (çocuk) · **Tarih:** 2026-10-23 · dal `design/kitap`

---

## 1. Fikir

Çocuğun doğum günü bir masal kitabıdır. İlk ekran kestane bez kapak: ekranı yaldız çift çizgi çerçeve
çevreler, köşelerde ışıltı; üstte italik "Bir varmış, bir yokmuş…", ortada **kayan yıldız**
([KayanYildiz](KayanYildiz.md) — doğum gününde dilek tutulur) ve çocuğun adı, altında ev sahibi, çizgi
ve italik satır; en altta tarih. Kapağın ardında kurdele çerçeveli **birinci sayfa**: başlık,
başharfli alt metin, tarih ve mekân, geri sayım. Bölümler "İkinci Sayfa, Üçüncü Sayfa…".

Yaş veride yok: mum, rakam, "x yaşında" yok.

| | |
|---|---|
| Bez | `kestane` `#3B2A1E` (yeni; öbür dört bez başka kategorilerin — bkz. [palet §4](../../../konsept/kitap/palet.md)) |
| Açılış satırı | "Bir varmış, bir yokmuş…" — Türk masallarının geleneksel açılışı (anonim, telif yok) |
| Hero parçaları | `MasalKapak` + `MasalSayfasi` + `BolumAcilisi` (kit) + `SahipAdi` ([ortak](../ortak.md)) + `KayanYildiz` |
| Sayfa başı (≥ 64 rem) | solda adlar, sağda "Masal" |

Yeni Bölüm'den farkı: [Yeni Bölüm §1](../DogumGunuKitapYeniBolum/index.md) tablosu.

## 2. İki hâl

| Zarf modülü | İlk ekran | Hero |
|---|---|---|
| Kapalı | Masal kapağı (tam ekran boyu), altta "Sayfayı çevirin" | Kapak + altından çerçeveli birinci sayfa; kapaktaki ad `h1` |
| Açık | Masal kapağı **kapı olarak** ("Kapağı açın") | Yalnızca çerçeveli birinci sayfa; ad ve ev sahibi orada, ad `h1` |

## 3. Hareket

Yeni Bölüm ile aynı (kit kalıpları). Ölçüldü (sıcak önbellek, 360 px): kapaktaki son stil değişikliği
519–523 ms. Kapı 831 ms (360) / 836 ms (1280) sonra kalkar; azaltılmışken 35 ms. Yıldız kıpırdamaz
("bir kez oynayan" hareket dili; parıltı yok).

## 4. Erişilebilirlik ve kontrast (çizilmiş ekranda ölçüldü, 2026-10-23)

| | Sonuç |
|---|---|
| En kötü metin (dolu · uzun · zarflı açılmış; 360 / 1280) | **5.88** — yaldız / kestane bez dokusu; AA altı yok |
| Çerçeveli sayfa | 6.17 (`soluk`) |
| Klavye (zarflı) | Sekme "Kapağı açın"a gelir (158 × 44) |
| Dokunma hedefleri | Yeni Bölüm ile aynı |
| Süs | Çerçeve, ışıltılar, figür, fleuron `aria-hidden` |
