# `konsept/sergi/` — "Sergi Açılışı" konsept kiti

> **Kullananlar:** sergi konseptinin preset'leri (9 kategori × 2; düğün pilotu, nişan)
> **Konsept:** [SERGI-KONSEPTI](../../../../../tasarim/SERGI-KONSEPTI.md) · **Ortak kurallar:** [KONSEPT-ORTAK](../../../../../tasarim/KONSEPT-ORTAK.md)
> **Tarih:** 2026-10-17 · dal `design/sergi`

---

## 1. Neden ayrı bir kit?

18 preset aynı duvarı, çerçeveyi, etiketi, spotu ve kapıyı kullanacak. Her kategori bunları kopyalasaydı
dokuz ayrı "galeri" çıkardı. Kit konseptin tek sahibidir (KONSEPT-ORTAK §2); kategori preset'i yalnızca
kendi düzenini (hangi eksen, nereye ne asılır) ve eser rengini seçer.

## 2. Dosyalar

| Dosya | Ne | Kılavuz |
|---|---|---|
| `index.ts` | Tek giriş noktası | bu dosya |
| `palet.ts` | Duvar, yazı, dört eser rengi; eser → CSS değişkenleri | [palet](palet.md) |
| `fontlar.ts` | Instrument Serif + Sans; yükleme, "font hazır mı?" | [fontlar](fontlar.md) |
| `tema.ts` | "Aynı duvar" `SectionTheme`'i | [tema](tema.md) |
| `SergiKok.tsx` | Değişkenleri ve fontları dağıtan kök | [SergiKok](SergiKok.md) |
| `Duvar.tsx` | `renderBackdrop` sahnesi: düz duvar | [Duvar](Duvar.md) |
| `Spot.tsx` | Tek spot ışığı | [Spot](Spot.md) |
| `Cerceve.tsx` | Paspartulu çerçeve, asılma hareketi | [Cerceve](Cerceve.md) |
| `Etiket.tsx` | Müze etiketi | [Etiket](Etiket.md) |
| `Adlar.tsx` | Duvar yazısının adları | [Adlar](Adlar.md) |
| `SergiSayac.tsx` | Etiket dilinde geri sayım | [SergiSayac](SergiSayac.md) |
| `SergiKapi.tsx` | Zarf kapısı: "Işığı yakın" | [SergiKapi](SergiKapi.md) |
| `soyutEserler.tsx` | Özgün soyut eserler (Eşik, İki Yarım) | [soyutEserler](soyutEserler.md) |
| `flavor.ts` | Bölüm başlıkları, salon numaraları | [flavor](flavor.md) |
| `metin.ts` | Etiket satırları için tarih/ad yardımcıları | [metin](metin.md) |
| `hareket.ts` | Hareket dili | [hareket](hareket.md) |

## 3. Bir preset nasıl kurulur

```tsx
<SergiKok eser="kobalt">
  <InvitationComposition
    flavor={useSergiFlavor(DUGUN_FLAVOR, invitation, METINLER)}
    themeOverride={SERGI_TEMASI}
    renderBackdrop={() => <Duvar />}
    renderHero={(props) => <Kapak {...props} />}
    renderEnvelope={(props) => <SergiKapi {...props} />}
    …
  />
</SergiKok>
```

Kapak (hero) preset'e aittir: kit parçaları (`Spot`, `Cerceve`, `Etiket`, `Adlar`, `SergiSayac`) orada
konseptin eksenine (§4.3) göre yerleştirilir.

## 4. Sınırlar

- Kit preset'e bağlanmadıkça `npm run build` onu ağaçtan atar; `verify:render` ancak kayıt satırları
  eklenince kiti çizer. Pilotta ayrı bir SSR duman testi koşuldu (pilot raporu).
- Alt bölümlerin (`shared/`) düzeni değişmez; kit onları yalnızca tema ve flavor ile boyar. Ortalanmış
  bölüm başlıkları ve 0.9 s'lik bölüm girişleri ortak dosyalardadır (raporda öneri).
