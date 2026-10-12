# `src/components/templates/kina/KinaSuluboya/index.tsx` — Suluboya

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-suluboya'`), `src/data.ts` (`kina-suluboya` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kâğıda damlayan kına, duvak alı ve kına yaprağı lekeleri; kınanın kendisi gibi kenarda koyulaşan su izleri.

Hero: SuluboyaHero (ortak) — `washes={[kına, al, zeytin]}`, `seed={19}`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#b8434f`) | `KINA_SULUBOYA`; gövde `#5e2f1f` (al leke üstünde AA) |
| Hero parametreleri | gül/altın/petrol lekeler | kına/al/zeytin lekeler |

Vurgu rengi: `#b8434f` → `#a4451a`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.12 | accent/zemin |
| Hero | 5.43 | gövde / `#e1a8a3` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Leke yayılması | Ortak dosyada |

## 5. Görsel öz-kontrol

Öz-kontrolde gövde satırı al lekenin üstünde 4.0 ölçüldü; gövde koyulaştırıldı → 5.43.
