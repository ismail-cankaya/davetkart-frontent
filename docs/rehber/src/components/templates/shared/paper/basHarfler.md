# `shared/paper/basHarfler.ts` — mühür harfleri

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

Adlardan 1–2 baş harf üretir; `&` ya da " ve " ile ayırır.

| Kural | Ne zaman | Örnek |
|---|---|---|
| `cift` | İki kişi (düğün, nişan, kına) | "Gülşen İrem & Çağrı" → `GÇ` |
| `ilk` | İkinci alan kişi değil: mezuniyet (okul), sünnet (aile), kurumsal (etkinlik); ya da boş olabilir (baby shower) | "Ali & Boğaziçi Üniv." → `A` |

🔴 Büyük harf `tr-TR` ile: "ilker" → `İ`. Düz `toUpperCase` `I` verir ve mühüre yanlış ad yazar.
İlk karakter `Array.from` ile alınır (vekil çift güvenli).
