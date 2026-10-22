# `konsept/sergi/Etiket.tsx` — müze etiketi

> **Tarih:** 2026-10-17 · dal `design/sergi` · Kaynak: SERGI-KONSEPTI §4.1

---

## 1. Satırlar (sıra kuraldır)

| Prop | Çizim | Renk |
|---|---|---|
| `sanatci` | Instrument Sans 600, 13 px, dengeli satır | mürekkep |
| `eser` + `yil` | Eser adı Instrument Serif italik 18 px, `, 2027` | mürekkep |
| `teknik` | 13 px; konseptin tek espri satırı da buraya | etiket |
| `nokta` | Galeri işareti: 10 px eser renginde daire (`aria-hidden`) + söz, 13 px — ör. nişan Diptik'te "Rezerve" | etiket |
| `bilgiBasligi` | 11 px 600, `tracking-[0.22em]`, büyük harf (`lang="tr"`) — ör. "Açılış" | etiket |
| `bilgi[]` | Tarih, mekân; ilki mürekkep, gerisi etiket | — |

Boş satır çizilmez; hiçbir satır yoksa etiket de yok. Yalnızca `bilgiBasligi` + `bilgi` verilirse kıl
çizgisiz tek bilgi bloğu çizilir (nişan Bir Ömür). `bilgi` satırları varsa kıl çizgiyle ayrılır.
Rakamlar `tabular-nums`; uzun mekân kesilmez (`overflow-wrap: break-word`).

`levha` verilirse küçük beyaz plaka (kart gölgesi, kenarsız); verilmezse etiket doğrudan duvardadır.

## 2. Hareket

`etiketBelirir`: yalnızca opaklık, 0.3 s, varsayılan gecikme 0.5 s (eser asıldıktan hemen sonra).

## 3. Sınırlar

- Eser adı italik olsun diye serif kullanır: Instrument Sans'ın italiği yüklenmiyor (fazladan dosya).
