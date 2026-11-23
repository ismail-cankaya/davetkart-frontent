# `src/styles/fonts.css` · `public/fonts/`

> **Faz:** 19.17 — `SEC-12` · **Karar:** K226 · **Lisans:** her aile klasöründe `LICENSE` (33 × OFL-1.1, Special Elite Apache-2.0)

## Neden

Her sayfa `index.css`'in ilk satırıyla Google Fonts'tan CSS + dosya çekiyordu: ziyaretçinin IP'si
Google'a gidiyor (KVKK), CSP iki dış alan adına açık kalıyordu.

## Ne var

| Dosya | İçerik | Ne zaman yüklenir |
|---|---|---|
| `src/styles/fonts.css` | Inter, Playfair Display, Cormorant Garamond (`index.css` `@import` eder) | Ana CSS ile, her sayfa |
| `public/fonts/templates.css` | 31 şablon ailesi | Şablon çizilince (`src/utils/templateFonts.ts`) |
| `public/fonts/<aile>/*.woff2` | Yalnızca `latin` + `latin-ext` alt kümeleri (§A-2) | Aile ekranda kullanılınca (`unicode-range`) |

Değişken (variable) aileler tek dosyada tüm ağırlıkları taşır (`woff2-variations`); `opsz` ekseni
gereken ailelerde (Inter, Newsreader, Bodoni Moda, Fraunces) `opsz` dosyası. `font-display: swap`.

## Nasıl üretildi / yeni aile nasıl eklenir

Kaynak: fontsource paketleri (`@fontsource/<id>`, `@fontsource-variable/<id>`) **bağımlılık olarak
eklenmedi**: `npm pack` ile indirilip woff2 + `LICENSE` kopyalandı, `@font-face` bloklarının
`unicode-range`'i paketin CSS'inden alındı. Yeni aile: aynı paketten `latin`/`latin-ext` dosyalarını
`public/fonts/<id>/`'ye, bloğu `templates.css`'e ekle; `verify:fonts` eksik aileyi yakalar.

Arapça vb. alt kümeler yok: `FE-01` (K220) arayüzü tr/en'e indirdi.
