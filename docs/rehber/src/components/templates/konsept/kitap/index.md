# `konsept/kitap/` — "Hikâye Kitabı" kiti

> **Tarih:** 2026-10-17 · dal `design/kitap` · Konsept: [KITAP-KONSEPTI](../../../../../tasarim/KITAP-KONSEPTI.md) ·
> Ortak kurallar: [KONSEPT-ORTAK](../../../../../tasarim/KONSEPT-ORTAK.md)

---

## 1. Ne için?

Dokuz kategorinin kitap preset'leri aynı kapağı, aynı sayfa temasını ve aynı bölüm numaralamasını
kullanır. Kit, bunların kategori klasörlerine kopyalanmaması için açıldı; tek sahibi kitap
konseptidir. Kategoriler yalnızca `index.ts`'ten içe alır.

## 2. Parçalar

| Dosya | İş | Kılavuz |
|---|---|---|
| `KitapKok.tsx` | Font değişkenleri, font yükleme, `lang="tr"` | [KitapKok](KitapKok.md) |
| `tema.ts` | İç sayfa teması (`SectionTheme`) | [tema](tema.md) |
| `palet.ts` | Bezler, sayfa renkleri, yan kâğıdı | [palet](palet.md) |
| `fontlar.ts` | Libre Caslon Display + Text yükleme, başlık fontu bekleme | [fontlar](fontlar.md) |
| `doku.ts` · `doku/bez.webp` | Bez dokuma dokusu (2.5 KB) | [doku](doku.md) |
| `BezKapak.tsx` | Bez yüzey + kapak dizgisi | [BezKapak](BezKapak.md) |
| `KapakKapisi.tsx` | Zarf modülünün kitap karşılığı (`renderEnvelope`) | [KapakKapisi](KapakKapisi.md) |
| `BolumAcilisi.tsx` | Başharfli ilk sayfa (bez cilt ekseni) | [BolumAcilisi](BolumAcilisi.md) |
| `IcKapak.tsx` | Künye düzenli başlık sayfası (iç kapak ekseni) | [IcKapak](IcKapak.md) |
| `Adlar.tsx` | Adlar alt alta, Caslon italik `&` | [Adlar](Adlar.md) |
| `KitapSayac.tsx` | Dizgi satırı geri sayım | [KitapSayac](KitapSayac.md) |
| `bolumBasliklari.ts` | Kitap dilinde başlıklar, açık bölümlerden Roma rakamı | [bolumBasliklari](bolumBasliklari.md) |
| `SayfaBasi.tsx` | Geniş ekranda sayfa başları (`renderBackdrop`) | [SayfaBasi](SayfaBasi.md) |
| `Ayrac.tsx` | Ayraç kurdelesi | [Ayrac](Ayrac.md) |
| `Fleuron.tsx` | Sarmaşık yaprağı ve yatay matbaa süsü | [Fleuron](Fleuron.md) |
| `hareket.ts` | Süreler ve giriş kalıpları | [hareket](hareket.md) |
| `tarih.ts` | Duvar saatinden tarih satırları, ad ayırma | [tarih](tarih.md) |
| `useEkranBoyu.ts` | Kaydırma kabının yüksekliği | [useEkranBoyu](useEkranBoyu.md) |
| `useSikiBlok.ts` | Sola yaslı paragrafı en uzun satırına daraltır (ortalı sütunda simetri) | [useSikiBlok](useSikiBlok.md) |

## 3. Bir preset nasıl kurulur?

```tsx
const flavor = useKitapFlavor(KATEGORI_KITAP_FLAVOR, invitation);
<KitapKok>
  <InvitationComposition
    themeOverride={KITAP_TEMASI}
    flavor={flavor}
    renderHero={…}                                   // BezKapak / BolumAcilisi / IcKapak
    renderBackdrop={({ heroExit }) => <SayfaBasi … />}
    renderEnvelope={(p) => <KapakKapisi {...p} bez="…" etiket="…" />}
  />
</KitapKok>
```

Örnekler: [`DugunKitapBirinciBolum`](../../dugun/kitap/DugunKitapBirinciBolum/index.md),
[`DugunKitapIcKapak`](../../dugun/kitap/DugunKitapIcKapak/index.md).

## 4. Kâğıt kitinden ayrım

`shared/paper/` hiçbir yerde içe alınmaz: doku, mum mühür, tırtıklı kenar, el yazısı, suluboya yok.
Yüzeyler düz şamuadır; tek doku bez kapaktadır.

## 5. Sınırlar

- Önizleme düzeneği `templates/*/*/index.ts` barrel'larını konsept preset'i sayar; bu kitin
  `index.ts`'i de listede (`?preset` verilmeden açılan sayfa) "konsept/kitap" altında görünür.
  Preset çizimi etkilenmez (kimlik → `<kategori>/<slug>`).
