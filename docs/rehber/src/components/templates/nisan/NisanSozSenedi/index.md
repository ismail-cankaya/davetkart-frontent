# `nisan/NisanSozSenedi` — "Söz Senedi"

> **ID:** `nisan-soz-senedi` · **Aile:** Kâğıt / el yapımı ([KAGIT-KONSEPTI](../../../../../tasarim/KAGIT-KONSEPTI.md))
> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Fikir

Nişan bir sözdür; davetiye iki imzalı bir **söz senedi**: mürekkepsiz kabartılmış iç içe iki
halka, her ad kendi imza çizgisinin üstünde, köşede tarih damgası. Ailenin "mürekkep damgası +
kabartma" yorumu. Halka motifi düğün kimliğinin notunda nişana bırakılmıştı.

| | |
|---|---|
| Set | masa `fildisi`, kart `pamuk`, mürekkep `lacivert`, vurgu `lacivert`, mum `yaldiz` (yalnızca zarf), doku `keten` |
| Adlar | Caveat (imza), kişi başına 32 / 26 / 22 px (≤ 12 / ≤ 22 / üstü karakter) |
| Süs | Basılı çift çerçeve + kabartma halkalar + `MurekkepDamga` |

## 2. Düzen

- Halkalar SVG'dir ve kitin kabartma değişkenlerini kullanır (`--kg-kabartma-*`, `--kg-kart`):
  B halkası A'nın üstünden geçer, sonra A'nın üst kesişme yayı yeniden çizilir → iki halka
  birbirine geçmiş okunur. Kendi dokusu ya da filtresi yok.
- İmzalar 384 px altında alt alta, üstünde yan yana (`@sm:grid-cols-2`).
- **Tek ad** girildiyse tek imza çizgisi (dar, ortalı); ad yoksa çizginin üstünde "Davetlisiniz".
- Künye: **TARİH** (`Cuma, 12 Şubat 2027 · 19:00`) ve **YER**. Boş olan satır hiç çizilmez.
- Damga sağ alt köşeye vurulur ve kartın kenarını aşar: üst yay `flavor.envelopeLabel`
  ("NİŞAN DAVETİYESİ"), alt yay tarih, ortada baş harfler. Kart alt dolgusu (`pb-24`) damgaya yer açar.

## 3. Hareket

Kart kayar 0–0.6 s → halkalar 0.1, başlık 0.15, metin 0.2 → imzalar 0.35 / 0.5 → künye 0.55 →
damga 0.7–0.94 s basılır → sayaç 0.6 s.

## 4. Erişilebilirlik

En düşük metin çifti 7.18 (gövde / pamuk kart, keten ×0.906). İmza çizgisi tam gövde mürekkebi
(süs değil, imza alanı). Halkalar, çerçeve, damga `aria-hidden`; damgadaki tarih künyede gerçek metin.

## 5. Sınırlar

- "Tarih" ve "Yer" etiketleri yeni metindir (önerilen i18n anahtarları: `davetiye.kunye.tarih`,
  `davetiye.kunye.yer`).
- Damganın üst yayı 24 karakteri aşarsa sığmaz; nişanın etiketi 16 karakter.
