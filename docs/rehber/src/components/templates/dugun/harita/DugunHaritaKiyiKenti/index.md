# `dugun/harita/DugunHaritaKiyiKenti` — "Kıyı Kenti"

> **ID:** `dugun-harita-kiyi-kenti` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** şehir planı
> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Fikir

Düğün günü bir kıyı kentinin planıdır: kartuş sol üstte (adlar), lejant sağ altta (duraklar, mekân,
varışa kalan süre, yol tarifi). Rota beyaz bir caddenin üstünden kartuşun kenarından çıkar, durakları
(karşılama kadehi, nikâh yüzüğü, yemek) geçer ve göbeği dolanıp iğneye iner. Köşede kuzey oku, dipnotta
konseptin tek esprisi: *1 cm = bir ömür*.

| | |
|---|---|
| Arazi | [`SehirPlani`](../../../konsept/harita/araziler/SehirPlani.md) — arazi + yol + su + rota |
| Kapak | `duzen="capraz"`, `rota="cadde"`, `sus="kuzey"`, `olcekEsprisi` |
| Zarf | [`HaritaZarf`](../../../konsept/harita/HaritaZarf.md), kapakta şehir penceresi |
| Tema | [`HARITA_TEMASI`](../../../konsept/harita/tema.md) |

## 2. Düzen

- 360 px: kartuş üstte (`100% − 3rem`), sağ üstte kuzey oku; rota S çizerek iner, iğne solda, etiket
  sağında tek satır; lejant sağa yaslı, altında dipnot. Dolu senaryoda düğme ve dipnot ilk ekranda
  (dipnotun altı 768 px).
- 1280 px: kartuş sol üst, lejant sağ alt aynı satırda; rota üstten sağa, kıyıya kadar gider, kıvrılıp
  göbeğin yanından iğneye iner.

## 3. Doğrulama

Ekran görüntüleri: `node_modules/.cache/onizleme/dugun-harita-kiyi-kenti/` (dolu, uzun, boş, kapalı,
zarf, azalt, programsız × 360/768/1280). Giriş 928–951 ms; zarf 902 ms. Kontrast ve ölçümler kitin
kılavuzlarında.
