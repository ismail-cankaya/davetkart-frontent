# `nisan/kitap/ortak.ts` — `NISAN_KITAP_FLAVOR`, `ONSOZ_ETIKETI`, `NISAN_BEZI`

> **Tarih:** 2026-10-22 · dal `design/kitap`

---

| Dışa aktarım | Ne |
|---|---|
| `NISAN_KITAP_FLAVOR` | `NISAN_FLAVOR`'ın kopyası; tek değişiklik hediye notunun kitap dili |
| `ONSOZ_ETIKETI` | Bölüm üst etiketi: "Önsöz · II", "Önsöz · III"… (`useKitapFlavor`'ın 4. değişkeni) |
| `NISAN_BEZI` | `murdum` (`#3D2337`) |

Hediye notu:

> Hikâyemizin bu ilk sayfasında yanımızda olmanız en güzel armağan; yine de takdirinizi iletmek
> isterseniz hesap bilgilerimiz aşağıdadır.

Kategoriden aynen kalanlar: zarf etiketi "Nişan Davetiyesi" (Kurdele'nin kapı etiketi ve sayfa başı),
italik satır "Söz Verdik, Nişanlanıyoruz" (kapaktaki italik satır). Bölüm adları kitten gelir
(*İçindekiler · Yer ve Zaman · Resimli Sayfalar · Armağan · Cevabınız*; K8'in "içindekiler" düzeni
ortak `Timeline`'a gelince kullanılır).

**Neden "Önsöz · II", "Bölüm II" değil?** Düğünde hero "Bölüm I"dir. Nişan önsözdür; birinci bölüm
henüz yazılmadı. Bölümler önsözün devamıdır: hero önsözün ilk sayfası (sayfa "i"), sonra II, III…
Numara açık bölümlerden, atlamasız (duman testi). Etiket ortak bileşende CSS ile büyük harfe
çevrildiğinden kitabın küçük Roma rakamı (ii, iii) etikette kullanılamadı; küçük "i" yalnızca
preset'in kendi çizdiği sayfa numarasındadır.

Nişan kimliğinin süsü (`NisanOrnament`, kesik çizgili halka) ve deseni kitap preset'lerinde
kullanılmaz: deseni `useKitapFlavor` kapatır, `Ornament` ortak `Envelope` ve `Summary`'de çizilir ve
iki preset de bunları kendi parçalarıyla değiştirir.
