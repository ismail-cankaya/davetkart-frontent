# `shared/Summary.tsx` — kullanıcı metninin harfi korunur

> **Kullananlar:** `renderHero` vermeyen bütün şablonlar (varsayılan kapak): `*Aurora`, `*Krom`,
> `PartiNeon`, `NisanSampanya`, `MezuniyetLacivert`, `DogumGunuKonfeti`, `BabyShowerKabarcik`…
> **Tarih:** 2026-10-22 · dal `design/konsept-ortak` · Karar: N3 (KONSEPT-ORTAK §4)

---

## 1. Neden?

Veri sözleşmesi: `title`, `subtitle`, `venue` kullanıcı metnidir; **büyük/küçük harfi değiştirilmez**
(KONSEPT-ORTAK §4). Özet kapak, üst etiketteki başlığı ve mekân satırını CSS `uppercase` ile büyük
harfe çeviriyordu: kullanıcı "Çırağan Sarayı, Beşiktaş" yazıyor, misafir "ÇIRAĞAN SARAYI, BEŞİKTAŞ"
görüyordu.

## 2. Değişiklik

| Satır | Önce | Sonra |
|---|---|---|
| Üst etiket (`invitation.title`) | `text-[10px] font-semibold uppercase tracking-[0.35em]` | `uppercase` yok; punto ve aralık aynı |
| Mekân | `font-medium tracking-[0.15em] uppercase`, 11 px (`@md` 12 px) | `font-medium tracking-[0.12em]`, **12 px** (`@md` 13 px) |

- Başlık önerileri zaten büyük harfle gelir (sihirbaz); öneriyi kullanan davetiyede görünüm aynıdır.
  Kullanıcı başlığı küçük harfle yazarsa artık öyle görünür.
- Küçük harfli mekân aynı puntoda büyük harften küçük durduğu için 1 px büyütüldü; harf aralığı
  0.15 → 0.12 em. Satır yine aralıklı bir etiket gibi okunur.
- Geri sayım birimleri ("GÜN", "SAAT") üretilen etiketlerdir; büyük harf kalır.

Ölçülen (`parti-neon`, 360 px, headless Chrome): mekân `text-transform: none`, 12 px, harf aralığı
1.44 px; üst etiket `text-transform: none`.

## 3. Aynı düzeltme ortak hero'larda

Aynı iki kalıp (başlık üst etiketi, mekân satırı) `shared/heroes/*`'ta da `uppercase` taşıyordu.
Sınıftan yalnızca `uppercase` kaldırıldı; punto ve aralık aynı:

| Dosya | Başlık | Mekân |
|---|---|---|
| `BentoHero` | ✓ | — |
| `BrutalHero` | ✓ başlık çipi | ✓ bilgi satırında yalnız "Mekan" değeri `normal-case` (tarih ve saat büyük harf kalır) |
| `CiniHero`, `DecoHero`, `DokumaHero`, `EbruHero`, `HatHero`, `MermerHero`, `MonogramHero`, `PaperHero`, `SuluboyaHero`, `TakvimHero`, `YildizHero` | ✓ | ✓ |
| `FilmHero`, `PanoHero`, `TicketHero`, `UfukHero`, `VitrayHero` | ✓ | — |
| `TerrazzoHero` | ✓ (`title \|\| envelopeLabel`) | — |
| `KinetikHero`, `RisoHero` | — | ✓ |
| `NoirHero` | ✓ | ✓ büyük harfli bilgi şeridinde mekân öğesi `normal-case` |
| `PlakHero` | ✓ plak etiketindeki yay yazısı (`textTransform` kaldırıldı) | — |

**Bilerek dokunulmayanlar** — adların ya da başlığın büyük harfli **gösterim başlığı** olduğu yerler;
o şablon ailelerinin tipografik kimliği, ayrı karar bekliyor: `BlueprintHero` adlar, `BrutalHero` adlar,
`DecoHero` adlar, `GazeteHero` manşet (adlar) ve logotip (`masthead || title`), `MermerHero` adlar,
`RisoHero` adlar ve gölge kopyası, `KinetikHero` kayan yazı (`toLocaleUpperCase('tr-TR')`, `aria-hidden`).
Üretilen sabit etiketler ("Tarih", "Saat", "Davet No", sayaç birimleri, `flavor.envelopeLabel`) büyük
harf kalır.
