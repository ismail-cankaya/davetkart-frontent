# `shared/paper/Baski.tsx` — kabartma ve mürekkep damgası

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. `Kabartma` (kör kabartma)

Harf kâğıdın kendi rengindedir; yalnızca zıt yönlü ışık/gölgeyle (`--kg-kabartma-*`) okunur.
Kontrastı bilerek düşüktür → **bilgi taşımaz**, `aria-hidden`.

## 2. `MurekkepDamga`

Yuvarlak damga: çift dış halka, üst/alt yayda metin (`textPath`), ortada kısa metin ya da baş harf.

- Boya eşit dağılmaz: `murekkep.webp` alfa maskesi damganın her yerinde başka bir doygunluk bırakır.
- Açık kâğıtta `multiply` ile kâğıda işler; koyu kartonda `screen` (`--kg-karisim`).
- Yay metni `toLocaleUpperCase('tr-TR')` ile büyütülür ("Nişan töreni" → "NİŞAN TÖRENİ").
- Eğim `aci` ile (−12°…+8° önerilir); canlandırılacaksa `basmaGirisi`.

## 3. Erişilebilirlik

İkisi de `aria-hidden`; damgadaki tarih ve ad sayfada gerçek metin olarak bulunmalı.

## 4. Sınırlar

- Yay metni ~24 karakteri geçerse halkaya sığmaz; uzun metin damgaya konmaz.
