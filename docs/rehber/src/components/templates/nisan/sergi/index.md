# `nisan/sergi/` — nişanın "Sergi Açılışı" preset'leri

> **Konsept:** [SERGI-KONSEPTI](../../../../../tasarim/SERGI-KONSEPTI.md) · **Kit:** [konsept/sergi](../../konsept/sergi/index.md)
> **Tarih:** 2026-10-22 · dal `design/sergi` · ikinci kategori (düğün pilotundan sonra)

---

## 1. Kategori yorumu

*Önizleme* — "Yakında: Bir Ömür" (§7). Nişan, açılışı düğünde olacak "Bir Ömür" sergisinin
önizlemesidir: bu akşam davetliler eseri açılıştan önce görür. Eser rengi **fuşya**. Bu yüzden
etiketin tarih başlığı "Açılış" değil **Önizleme**, sayaç "Önizlemeye kalan", program ve LCV
başlıkları *Önizleme akışı* / *Önizleme listesi*dir ([ortak](ortak.md)).

| Kimlik | Bileşen | Eksen (§4.3) | Eser rengi | Fikir |
|---|---|---|---|---|
| `nisan-sergi-bir-omur` | `NisanSergiBirOmur` | **Duvar yazısı** | fuşya | Sergi adı "Bir Ömür" sağ kenarda dikey dev vinil, dibinde "Yakında"; çift sol altta sanatçı gibi. Şakasız |
| `nisan-sergi-diptik` | `NisanSergiDiptik` | **Tek eser** (iki panolu) | fuşya | "İki Yarım": iki panoda bölünen tek daire; plakalı etiket, galerinin satıldı noktası: **Rezerve** |

360 px'te ayrışma: Bir Ömür'de üstte sağda dikey fuşya yazı, adlar altta; Diptik'te adlar üstte,
altta sağa yaslı iki çerçeve ve beyaz plaka. Ortak tek öğe duvar ve eser rengidir.

Ayrıştığı diller: Noir (koyu zemin, ortalı dev ad), Bento/Brutal (kutu, ızgara), Mermer/Monogram
(yüzey malzemesi, varak), Kâğıt nişanı (ortalı kart, el yazısı, mühür, senet) — Sergi'de zemin düz
beyaz duvar, yerleşim asimetrik, bilgi etiket dilinde.

## 2. Dosyalar

| Dosya | Ne | Kılavuz |
|---|---|---|
| `index.ts` | Barrel; kategori barrel'ına `export * from './sergi';` ile bağlanır | bu dosya |
| `ortak.ts` | İki preset'in ortak metinleri: hediye, bölüm başlıkları, "Önizleme" sözleri | [ortak](ortak.md) |
| `NisanSergiBirOmur/index.tsx` | Bir Ömür | [NisanSergiBirOmur](NisanSergiBirOmur/index.md) |
| `NisanSergiDiptik/index.tsx` | Diptik | [NisanSergiDiptik](NisanSergiDiptik/index.md) |

## 3. Kitte bu kategori için eklenenler

| Kit dosyası | Ek |
|---|---|
| `soyutEserler.tsx` | `EserIkiYarim` (`pano: 'sol' \| 'sag'`), `SOYUT_ESERLER.ikiYarim` |
| `Etiket.tsx` | `nokta` satırı (eser renginde nokta + söz) |
| `SergiKapi.tsx` | `siluet` artık öğe de alır (diptik, vinil) |
| `flavor.ts` | `SergiMetinleri.basliklar` — kategori dilinde bölüm başlıkları |

## 4. Kayıt (birleştirmede orkestratör ekler)

`TemplateRenderer`, `data.ts` ve kategori barrel'ı satırları kategori raporunda önerildi; bu dalda
commit'lenmedi. Önizleme düzeneği preset'leri barrel'dan doğrudan yükler
(`onizleme.html?preset=nisan-sergi-…`).
