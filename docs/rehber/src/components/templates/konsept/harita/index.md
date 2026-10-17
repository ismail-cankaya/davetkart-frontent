# `konsept/harita/` — "Günün Haritası" kiti

> **Kılavuz:** [HARITA-KONSEPTI](../../../../../tasarim/HARITA-KONSEPTI.md) · [KONSEPT-ORTAK](../../../../../tasarim/KONSEPT-ORTAK.md)
> **Tarih:** 2026-10-17 · dal `design/harita` · ilk kullanan: düğün (pilot)

---

## 1. Ne için?

Dokuz kategorinin harita preset'leri aynı parçaları kullanır; kit her kategoride kopyalanmasın diye
burada durur. Klasörün tek sahibi Harita ajanıdır. `index.ts` kitin tek giriş noktasıdır; preset'ler
yalnızca buradan alır.

## 2. Parçalar

| Dosya | İş |
|---|---|
| [`palet.ts`](palet.md) | Rehberin §2.1 paleti, adlarıyla |
| [`fontlar.ts`](fontlar.md) | Üç aile, tek `<link>`, şablon açılınca |
| [`HaritaKok.tsx`](HaritaKok.md) | Yazı değişkenleri + kapak/sahne bağlamı |
| [`baglam.ts`](baglam.md) | Kapağın alt kenarını sahneye taşıyan MotionValue |
| [`tema.ts`](tema.md) | `HARITA_TEMASI` — bölümlerin teması |
| [`veri.ts`](veri.md) | Tarih, adlar, lejant, durak simgesi — saf hesap |
| [`hareket.ts`](hareket.md) | "İğne düşer, rota ilerler" giriş tanımları |
| [`HaritaKapak.tsx`](HaritaKapak.md) | `renderHero`: kartuş + lejant + ölçülen rota |
| [`Kartus.tsx`](Kartus.md), [`Lejant.tsx`](Lejant.md) | Başlık bloğu, lejant, yol tarifi, dipnot |
| [`Rota.tsx`](Rota.md), [`rotaGeometri.ts`](rotaGeometri.md), [`rotaPlani.ts`](rotaPlani.md) | Rotanın çizimi, eğrisi, yerleşimi |
| [`Igne.tsx`](Igne.md), [`simgeler.tsx`](simgeler.md) | Toplu iğne, 24 px piktogramlar |
| [`HaritaSahnesi.tsx`](HaritaSahnesi.md) | `renderBackdrop`: sabit harita + perde |
| [`HaritaZarf.tsx`](HaritaZarf.md) | `renderEnvelope`: katlanmış harita |
| [`araziler/`](araziler/cizim.md) | Eksen başına durağan SVG: [şehir planı](araziler/SehirPlani.md), [arazi](araziler/KirArazisi.md) |

## 3. Bir preset nasıl kurulur?

```tsx
<HaritaKok>
  <InvitationComposition
    themeOverride={HARITA_TEMASI}
    flavor={<KATEGORİ>_HARITA_FLAVOR}
    renderBackdrop={(d) => <HaritaSahnesi {...d}><SehirPlani /></HaritaSahnesi>}
    renderHero={(p) => <HaritaKapak {...p} duzen="capraz" rota="cadde" sus="kuzey" />}
    renderEnvelope={(p) => <HaritaZarf {...p} arazi={<SehirPlani />} />}
  />
</HaritaKok>
```

`HaritaKok` zorunludur: fontları yükler ve kapakla sahnenin paylaştığı bağlamı kurar. Kökün dışında
`HaritaSahnesi` yedek yola (opaklıkla inen perde) düşer.

## 4. Henüz olmayanlar

Mahalle krokisi, hazine haritası ve alan planı eksenlerinin arazileri ilgili kategoriler gelince
`araziler/`e eklenecek. Kapak ve rota onlar için de aynı kalır; yalnızca arazi ve `duzen`/`rota`/`sus`
seçimi değişir.
