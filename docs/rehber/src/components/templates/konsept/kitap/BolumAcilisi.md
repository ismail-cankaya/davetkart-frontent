# `konsept/kitap/BolumAcilisi.tsx` — başharfli ilk sayfa

> **Tarih:** 2026-10-17 · dal `design/kitap`

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

Paragraf **sola yaslı** (`text-wrap: pretty`), en çok 26 em. İki yana yaslama denendi (≥ @sm,
`hyphens: auto`): alt metin çoğu zaman iki satır olduğundan 768 / 1280 px'te ilk satırın kelime
araları açıldı; kaldırıldı.

## 3. İki kullanım

| | `adlar` | `giris` |
|---|---|---|
| Zarf açık — kapak kapıydı, gitti | `true` (adlar `h1`) | `yuklenince` (0.5 s) |
| Zarfsız — kapak hemen üstünde | `false` (tekrar yok) | `gorununce` (0.4 s, bir kez) |

Boş alanlar çizilmez: başlık, alt metin, tarih, mekân, sayaç tek tek.
