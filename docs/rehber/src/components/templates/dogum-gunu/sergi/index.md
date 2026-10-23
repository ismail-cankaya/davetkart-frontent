# `dogum-gunu/sergi/` — doğum gününün "Sergi Açılışı" preset'leri

> **Konsept:** [SERGI-KONSEPTI](../../../../../tasarim/SERGI-KONSEPTI.md) · **Kit:** [konsept/sergi](../../konsept/sergi/index.md)
> **Tarih:** 2026-10-23 · dal `design/sergi` · üçüncü kategori (Nişan'dan sonra)

---

## 1. Kategori yorumu

*Retrospektif* (§7): doğum günü, sergi sahibinin bugüne kadarki dönemlerini gösteren bir sergidir. Duvar
yazısında sahibinin adı ve altında "Retrospektif"; dönemler numaralı ve adlıdır, **yıl yazılmaz** (yaş ve
doğum yılı veride yok). `names` doğum gününde *Sahibi & Ev sahibi*dir (KONSEPT-ORTAK §4): sahibi sanatçı
olarak duvar yazısında, ev sahibi etiketin **Küratör** satırında ([ortak](ortak.md)).

| Kimlik | Bileşen | Eksen (§4.3) | Eser rengi | Fikir |
|---|---|---|---|---|
| `dogum-gunu-sergi-retrospektif` | `DogumGunuSergiRetrospektif` | **Salon asması** | safran | Tek duvar rayından farklı boy tellerle sarkan dört küçük çerçeve: I *İlk işler*, II *Oyun dönemi*, III *Keşif dönemi*, IV *Bugün*. Duvar etiketi; espri: *Karışık teknik: sabır, kahkaha, çay* |
| `dogum-gunu-sergi-devam-eden` | `DogumGunuSergiDevamEden` | **Tek eser** (yatay) | kobalt | Retrospektifin son odası: tek, yatay, yarım kalmış tuval *Yeni Yaş*. Kobalt yay ortada kesilir, devamı kurşun kalem eskizi. Plakalı etiket; espri: ● *Sürüyor* |

360 px'te ayrışma: Retrospektif'te adın altında tam genişlikte bir ray ve ondan sarkan dört küçük, farklı
boy çerçeve, her birinin altında dönem adı; etiket doğrudan duvarda. Devam Eden'de ekran genişliğinin
%80'ini tutan tek yatay çerçeve ve köşesinde beyaz plaka. Eser rengi de farklı (safran / kobalt).

Ayrıştığı diller: Konfeti/Neşeli (renk ve süs bolluğu), Pano/Film (fotoğraf kolajı), Bento/Brutal (kutu,
ızgara), Takvim (tarih büyüklüğü) — Sergi'de zemin düz beyaz duvar, süs yok, bilgi etiket dilinde.

## 2. Dosyalar

| Dosya | Ne | Kılavuz |
|---|---|---|
| `index.ts` | Barrel; kategori barrel'ına `export * from './sergi';` ile bağlanır | bu dosya |
| `ortak.ts` | İki preset'in ortak metinleri ve `sergiKisileri` (sahibi / küratör) | [ortak](ortak.md) |
| `DogumGunuSergiRetrospektif/index.tsx` | Retrospektif | [DogumGunuSergiRetrospektif](DogumGunuSergiRetrospektif/index.md) |
| `DogumGunuSergiDevamEden/index.tsx` | Devam Eden | [DogumGunuSergiDevamEden](DogumGunuSergiDevamEden/index.md) |

## 3. Kitte bu kategori için eklenenler

| Kit dosyası | Ek |
|---|---|
| `soyutEserler.tsx` | `EserIlkIsler`, `EserOyunDonemi`, `EserKesifDonemi`, `EserBugun` (salon), `EserYeniYas` (tek eser) |
| `Etiket.tsx` | `kurator` satırı ("Küratör: …", künyenin sonunda) |

## 4. Kayıt (birleştirmede orkestratör ekler)

`TemplateRenderer`, `data.ts` ve kategori barrel'ı satırları kategori raporunda önerildi; bu dalda
commit'lenmedi. Önizleme düzeneği preset'leri barrel'dan doğrudan yükler
(`onizleme.html?preset=dogum-gunu-sergi-…`).

## 5. Görsel bütçesi

Raster görsel yok: beş eser de satır içi SVG (preset başına 0 KB görsel; bütçe ≤ 60 KB). Kart görseli
(`imageUrl`) birleştirmede boş kalır, mevcut doğum günü kartlarının çoğu gibi.
