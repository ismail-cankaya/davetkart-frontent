# `dugun/kitap/index.ts` — düğünün kitap preset'leri

> **Tarih:** 2026-10-17 · dal `design/kitap` · Konsept: [KITAP-KONSEPTI](../../../../../tasarim/KITAP-KONSEPTI.md)

---

Konsept barrel'ı. Birleştirmede kategori barrel'ına (`dugun/index.ts`) tek satır eklenir:
`export * from './kitap';`

| Preset | Eksen | Kılavuz |
|---|---|---|
| `DugunKitapBirinciBolum` (`dugun-kitap-birinci-bolum`) | Bez cilt | [index](DugunKitapBirinciBolum/index.md) |
| `DugunKitapIcKapak` (`dugun-kitap-ic-kapak`) | İç kapak | [index](DugunKitapIcKapak/index.md) |

Ortak flavor tabanı: [`ortak.ts`](ortak.md). Kit: [`konsept/kitap`](../../konsept/kitap/index.md).

Önizleme (kayıt dosyasına dokunmadan):
`/onizleme.html?preset=dugun-kitap-birinci-bolum&senaryo=dolu[&zarf=1]`.
