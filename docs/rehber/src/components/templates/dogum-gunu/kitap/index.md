# `dogum-gunu/kitap/index.ts` — doğum gününün kitap preset'leri

> **Tarih:** 2026-10-23 · dal `design/kitap` · Konsept: [KITAP-KONSEPTI §7](../../../../../tasarim/KITAP-KONSEPTI.md)

---

Doğum günü hikâyenin **yeni bölümü**dür. Yaş veride yok: bölüm numarasız, hiçbir yerde sayı yazılmaz.
Rehber iki yorum verir — yetişkinde *Yeni Bölüm*, çocukta *masal kitabı* — ikisi iki ayrı eksene oturdu.
Konsept barrel'ı; birleştirmede kategori barrel'ına (`dogum-gunu/index.ts`) tek satır eklenir:
`export * from './kitap';`

| Preset | Eksen | İlk ekran (360 px) | Kılavuz |
|---|---|---|---|
| `DogumGunuKitapYeniBolum` (`dogum-gunu-kitap-yeni-bolum`) | Anı defteri (yetişkin) | Kara kaplı defter, sağ kenarda dikine kurdele lastik, ortada açık etiket kâğıdında mürekkeple ad; tarih üstte | [index](DogumGunuKitapYeniBolum/index.md) |
| `DogumGunuKitapMasal` (`dogum-gunu-kitap-masal`) | Masal kitabı (çocuk) | Kestane bez, ekranı çevreleyen yaldız çift çerçeve, köşelerde ışıltı, kayan yıldız figürü, yaldız ad; tarih altta | [index](DogumGunuKitapMasal/index.md) |

**360 px'te ayrışma** (KONSEPT-ORTAK §7): biri koyu zemin + açık etiket kutusu + dikine renkli şerit
(asimetrik süs, simetrik metin), öbürü açık yüzeysiz koyu bez, ekran kenarını çevreleyen
çift çizgi çerçeve ve figür. Adın yeri (kâğıtta mürekkep / bezde yaldız), tarihin yeri (üst / alt) ve ilk sayfa
(çizgili defter sayfası / çerçeveli masal sayfası) da ayrı. Zarflı ilk ekranlar da ayrıdır (defter
kapı / masal kapı). Bölüm etiketleri: "Yeni Bölüm · II…" / "İkinci Sayfa…".

`names` doğum gününde *Sahibi & Ev sahibi*dir (KONSEPT-ORTAK §4): kitabın adı sahibidir, ev sahibi
künye satırı ([`ortak`](ortak.md) → `SahipAdi`).

Ortak taban: [`ortak.tsx`](ortak.md). Kit: [`konsept/kitap`](../../konsept/kitap/index.md).
Görsel: preset'lerin kendi görseli yok (0 KB); Masal kitin bez dokusunu (2.5 KB) kullanır.

Önizleme: `/onizleme.html?preset=dogum-gunu-kitap-yeni-bolum&senaryo=dolu[&zarf=1]`.

## Katalogdaki doğum günü şablonlarından ayrım

Kataloğun doğum günü dili balon, konfeti, pasta ve parlak renktir (`DogumGunuNeseli`, `Konfeti`,
`Kinetik`…). Kitap doğum günü bunların hiçbirini kullanmaz: kategori deseni (`DogumGunuPattern`) ve
süsü (`DogumGunuOrnament`, balon) kapalı; renk iki tondur (koyu kapak, şamua sayfa). Kutlamanın
işareti dizgidedir — "Yeni Bölüm", "Bir varmış, bir yokmuş…" — ve tek figürdedir (kayan yıldız: dilek).
