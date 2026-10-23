# `konsept/kitap/BolumAcilisi.tsx` — başharfli ilk sayfa

> **Tarih:** 2026-10-17 · güncelleme 2026-10-20 (alt metin bloğu, §11), 2026-10-22 (`dizgi`), 2026-10-23 (`adlarDizgisi`) · dal `design/kitap`

---

## 1. Düzen

```
BÖLÜM I                           (kurdele, 11 px aralıklı)
[Adlar — yalnızca zarf açıkken, h1]
Kullanıcının başlığı              (13 px aralıklı, harf büyüklüğü olduğu gibi)
——                                (48 px, mürekkep %40)
S izleri de bu mutlu günümüzde…   (alt metin, 17 px / 1.6, başharfli)
❧                                 (Fleuron yaprak)
Cumartesi, 13 Şubat 2027 · 19:00
Çırağan Sarayı, Beşiktaş          (italik)
KALAN SÜRE · geri sayım
1                                 (sayfa numarası, süs)
```

## 2. Başharf

`::first-letter`: Caslon Display, kurdele, 3.3 em (56 px), iki satır boyu, `float: left`. Paragraf
`display: flow-root` — tek satırlık metinde başharf altına taşmaz. Konseptin tek başharfi budur.
`I`/`İ` veride nasılsa öyle (`Işıl` → `I`).

Paragraf **sola yaslı** (`text-wrap: pretty`), en çok 26 em (KITAP-KONSEPTI §3.2, §11). İki yana
yaslama denendi (≥ @sm, `hyphens: auto`): alt metin çoğu zaman iki satır olduğundan 768 / 1280 px'te
ilk satırın kelime araları açıldı; kaldırıldı.

**Simetri:** sayfa ortalıdır; sola yaslı blok ortalı başlıkların altında sola kaymasın diye kutu en
uzun satırına göre daralır ([`useSikiBlok`](useSikiBlok.md)) ve ortada durur. Ölçüldü (1280 px,
`dolu`): önce metin 420–771 px (orta 595, 45 px sola kayık), şimdi 465–816 px (orta 640). 768 px
`uzun`: 171–597 (orta 384). Tek satırlık alt metin ortalı görünür. Kalan asimetri yalnızca sağ
kenarın dalgasıdır.

## 3. `dizgi`

| Değer | Alt metin | Kullanan |
|---|---|---|
| `basharf` (varsayılan) | Düz, başharfli — bölüm açılışı | Düğün · Birinci Bölüm ("Bölüm I", sayfa "1") |
| `italik` | İtalik, başharfsiz — önsöz | Nişan · Önsöz ("Önsöz", sayfa "i") |

Klasik kitapta önsöz italik dizilir ve başharf almaz; başharf bölüm açar. Nişanda konseptin tek
başharfi böylece hiç kullanılmaz.

## 4. İki kullanım

| | `adlar` | `giris` |
|---|---|---|
| Zarf açık — kapak kapıydı, gitti | `true` (adlar `h1`) | `yuklenince` (0.5 s) |
| Zarfsız — kapak hemen üstünde | `false` (tekrar yok) | `gorununce` (0.4 s, bir kez) |

Boş alanlar çizilmez: başlık, alt metin, tarih, mekân, sayaç tek tek.

## 5. `adlarDizgisi` (2026-10-23)

`adlar` açıkken `KitapAdlar`'ın (`A & B` eşit dizgi) yerine çağıranın düğümü dizilir. Doğum günü
`names`'i *Sahibi & Ev sahibi* olarak okur: sahibi büyük başlık, ev sahibi künye satırı
([`dogum-gunu/kitap/ortak`](../../dogum-gunu/kitap/ortak.md) → `SahipAdi`). Düğüm `h1`'i kendisi
taşımalıdır. Verilmezse çıktı değişmez.
