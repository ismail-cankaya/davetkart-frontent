# `konsept/harita/HaritaKapak.tsx` — harita kapağı (`renderHero`)

> **Tarih:** 2026-10-17 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.1](../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Fikir

Harita tam ekrandır (arka planda, [HaritaSahnesi](HaritaSahnesi.md)). Bir köşede [kartuş](Kartus.md),
karşı köşede [lejant](Lejant.md); rota ikisinin arasındaki boş alanda kartuşun kenarından çıkıp iğneye
iner. Ortalı simetri yok.

## 2. Parametreler

| Prop | Değerler | |
|---|---|---|
| `duzen` | `capraz` · `ayna` | Bkz. [rotaPlani](rotaPlani.md) |
| `rota` | `cadde` · `patika` | Bkz. [Rota](Rota.md) |
| `sus` | `kuzey` · `pusula` | Köşe süsü: kuzey oku (beyaz yuvarlakta "K") ya da pusula gülü |
| `olcekEsprisi` | boolean | Dipnotta "1 cm = bir ömür" (konsept başına en çok bir espri) |

## 3. Yerleşim

- **Dar** (`genisMi` yanlış): sütun. Kartuş sol üstte, genişliği `100% − 3rem` (köşe süsüne yer); arada
  en az 160 px'lik rota alanı; lejant `capraz`'da sağa, `ayna`'da sola yaslı.
- **Geniş** (≥ 880 px ve yatay): tek satırlık ızgara `27rem | 1fr | 22rem`. Kartuş ile lejant aynı
  satırı paylaşır; kapak ikisinin toplamı değil, büyüğü kadar uzar. `ayna`'da kartuş sol alta, lejant
  sağ üste geçer (DOM sırası değişmez: önce adlar).

## 4. Ölçüm

Kartuş ve lejant kutusu `offsetLeft/Top/Width/Height` ile okunur (dönüşümden bağımsız: giriş
animasyonu ölçüyü bozmaz). Boyut değişimi `ResizeObserver`, konum değişimi her çizimden sonraki bir
okumayla yakalanır; değer değişmediyse durum aynı nesne kalır, döngü olmaz. Ölçü gelmeden rota
çizilmez; sunucu çiziminde de çizilmez — bilgi kartuş ve lejantta eksiksizdir.

Kapak ayrıca alt kenarının ekrandaki yerini [baglam](baglam.md)'a yazar; perde oradan başlar.

## 5. Harita katmanı

Rota, iğne ve mekân etiketi kutuların **altında** (z-0) tek katmandadır; bütünü `aria-hidden`
(aynı bilgi lejantta gerçek metin). Mekân etiketi iğnenin yanında beyaz düz dikdörtgendir; dar
ekranda tek satır (`truncate`), genişte en çok iki satır. Kalan genişlik 80 px'ten azsa etiket
çizilmez. `venue` boşsa iğne kalır, etiket olmaz.

## 6. Sınırlar

- Mekân adı kullanıcı metnidir; rehber §3.2 "etiketler büyük harf" der ama veri sözleşmesi harf
  büyüklüğünü değiştirmeyi yasaklar — etiket yazıldığı gibi çizilir (açık soru, raporda).
- Font geç gelince rota yeniden ölçülür ve iğne yer değiştirebilir (animasyonsuz).
