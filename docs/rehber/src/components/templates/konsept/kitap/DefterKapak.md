# `konsept/kitap/DefterKapak.tsx` — anı defteri kapağı ve çizgili sayfa

> **Tarih:** 2026-10-23 · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §4.3](../../../../../tasarim/KITAP-KONSEPTI.md) (anı defteri ekseni)

---

## 1. `DefterKapak`

Kara kaplı sert defter. Rehberin "lastikli/kurdeleli defter kapağı, el yazısı yok — etiket kâğıdı
üstünde serif" satırının karşılığı. Doğum günü (Yeni Bölüm) kullanır; kına ve parti de aynı eksendedir.

```
20 ŞUBAT 2027                  (yaldız, 13 px aralıklı — tarih yoksa boş yer)
┌╱────────────────────╲┐  ║
│      YENİ BÖLÜM      │  ║    etiket kâğıdı: şamua, pahlı köşe, içte ince çizgi
│        ——            │  ║    `baslik` yuvası (adlar / SahipAdi)
│     Gülşen İrem      │  ║ ← lastik (kurdele, 11 px, sağdan 22 px · ≥ @3xl 40 px)
└╲────────────────────╱┘  ║
Yeni Yaşımı Birlikte Kutlayalım (yaldız italik)
SAYFAYI ÇEVİRİN / KAPAĞI AÇIN  (`alt` yuvası)
```

| Prop | |
|---|---|
| `renk` | Kapak rengi; varsayılan `SAYFA.murekkep` `#231F1A` (yaldız 6.92). Kategori başka bir koyu renk verebilir |
| `etiket` | Etiketin üst satırı, kurdele, büyük harf |
| `baslik` | Etiketin başlığı (düğüm) — `h1`'i çağıran verir; kapak kapısında `p` |
| `altSatir`, `alt` | İtalik satır ve en alttaki yuva (BezKapak ile aynı) |

**Bez kapaktan farkı düzendedir:** bezde adlar yaldızla kapağın üstündedir; defterde kapak boştur, adlar
etikette mürekkeptir. Tarih yukarı, italik satır aşağı. Kapak **dokusuz** (mat mukavva): bez dokusu
kullanılmaz, iki eksen karışmasın. Sırt oluğu ve kenar koyulaşması BezYuzey'le aynı.

Lastik metne girmez: etiket en çok `min(76cqi, 23rem)`; 360 px'te etiket 43–316 px, lastik 327–338 px.
Lastik, oluk, gölge ve etiketin iç çizgisi süstür (`aria-hidden`). Etiket köşesi `clip-path` pahı
(6 px): tırtık yok (Kâğıt kitinin imzası), gölge yok (`clip-path` keser; filtre kullanılmadı).

## 2. `CizgiliSayfa`

Defterin iç sayfası: şamua üstünde 32 px aralıklı satır çizgileri (`soluk` %16) ve solda kurdele %40
kenar boşluğu çizgisi (12 px; geniş ekranda sütunun 21 rem solunda). Kap ≥ 64 rem'de çizgiler 48 rem'lik
ortalı sayfadadır — iki yandaki sayfa başlarının (`SayfaBasi`) üstünden geçmez. Hepsi CSS degrade;
görsel yok.

## 3. Ölçüm (çizilmiş ekranda, 2026-10-23)

Yöntem tema.md §3 ile aynı (metin saydam, zeminin en kötü pikseli).

| Metin | En kötü |
|---|---|
| Etiket: `soluk` (ev sahibi, 10 / 15 px) | 6.17 |
| Etiket: kurdele "Yeni Bölüm" (11 px) | 6.82 |
| Kapak: yaldız tarih / italik / ipucu | 6.92 |
| Çizgili sayfa: `soluk` metin bir satır çizgisinin üstünde (13–15 px) | **4.92** (AA ≥ 4.5) |

Satır çizgisi `soluk`'un zeminini `#DAD2BC`'ye koyulaştırır; çizgi %16'dan koyu yapılmamalıdır.
