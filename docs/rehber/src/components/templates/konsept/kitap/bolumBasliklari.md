# `konsept/kitap/bolumBasliklari.ts` — numaralı bölümler

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (etiket biçimi) · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §4.2](../../../../../tasarim/KITAP-KONSEPTI.md)

---

## 1. Başlıklar

| Bölüm | Başlık (`KITAP_BASLIKLARI`) | Üst etiket |
|---|---|---|
| Program | İçindekiler | `Bölüm II`… |
| Detaylar | Yer ve Zaman | |
| Galeri | Resimli Sayfalar | |
| Hediye | Armağan | |
| LCV | Cevabınız | |

Hero **Bölüm I**'dir; ilk çizilen bölüm **II**'den başlar. Etiket CSS ile büyür (`BÖLÜM II`).

## 2. Numara atlamaz

`cizilenBolumler(invitation)` kompozisyonun gerçekten çizeceği bölümleri sayar — yalnızca bayrağı
değil, ortak bileşenin kendini gizlediği durumları da:

| Bölüm | Çizilir |
|---|---|
| Program | `showTimeline` **ve** en az bir dolu adım (sihirbazın iki boş adımı sayılmaz) |
| Detaylar | tarih, mekân ya da harita bağlantısından biri varsa (bayrağı yok) |
| Galeri | `showGallery` **ve** en az bir fotoğraf |
| Hediye / LCV | bayrak |

## 3. `useKitapFlavor(temel, invitation, basliklar?, bicim?)`

Kategori flavor'ının kopyasını döner: kategori deseni kapalı (`BackgroundPattern: undefined`),
başlıklar kitap dilinde, `eyebrows` numaralı. Liste her çizimde hesaplanır (ucuz); flavor nesnesi
yalnızca açık bölümlerin listesi değişince yenilenir (`useMemo`). `basliklar` ve `bicim` çağıranın
modül sabiti olmalıdır.

`bicim: EtiketBicimi` (`(sira) => string`) etiketin dilini verir; varsayılan `bolumEtiketi`
("Bölüm II"). Nişan önsözdür, henüz bölüm yoktur: `ONSOZ_ETIKETI` → "Önsöz · II", "Önsöz · III"
(`nisan/kitap/ortak.ts`). Numara yine açık bölümlerden, atlamasız.

Duman testi (geçici, 2026-10-17): 2 preset × 4 senaryo × zarf açık/kapalı × modüller tek tek kapalı
= 96 durum; her durumda etiketler `II…` sırasıyla, atlamasız.

## 4. "İçindekiler" önerisi

Programı noktalı satırlarla (`Karşılama ........ 17:00`) dizmek ortak `Timeline`'da değişiklik ister.
Onaya kadar başlık "İçindekiler", düzen ortak (pilot raporunda öneri).
