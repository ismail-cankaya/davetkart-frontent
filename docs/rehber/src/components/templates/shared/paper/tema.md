# `shared/paper/tema.ts` — "davetiye seti" teması

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Fikir

Ortak bölümler (program, mekân, hediye, LCV) `SectionTheme` sınıflarıyla boyanır. Bu tema onları
birer **ek karta** çevirir; bileşenlerin kendisine dokunmadan.

| Alan | Davetiye setindeki karşılığı |
|---|---|
| `base` | Masa: dokulu kâğıt; gövde fontu EB Garamond, `font-serif` başlıklar Cormorant |
| `surface` | Ek kart: dokulu, 3 px köşe, `--kg-golge` gölgesi, **düz kesim** |
| `input` | Cevap kartı: saydam zemin, kesik alt çizgi (tam gövde mürekkebi), italik yer tutucu |
| `buttonPrimary` | Mürekkeple doldurulmuş blok, 3 px köşe |
| `envelope` | Ortak `Envelope` kâğıt renklerini alır (renderEnvelope kancası gelene kadar) |

## 2. Neden düz kesim?

Gerçek setlerde ana kart el yapımı (tırtıklı), ek kartlar makine kesimidir. Tırtıklı kenarı
`clip-path` ile her karta vermek gölgeyi de keserdi (maske/clip gölgeyi kırpar) ve yuvarlak program
noktası gibi küçük öğeleri bozardı.

## 3. `font-serif` çevirisi

`[&_.font-serif]:[font-family:var(--kg-baslik-font)]` utilities katmanında, iki sınıflı seçiciyle
`.font-serif`'i her sırada yener. `index.css`'teki `.theme-cormorant` deseninin kit içi karşılığı;
genel CSS'e kural eklenmedi.

## 4. Erişilebilirlik

- Form sınırı tam gövde mürekkebi: WCAG 1.4.11 (≥ 3:1) en kötü çiftte 4.52.
- Odak: alt çizgi düz ve vurgu rengine döner, zemin %6 vurgu tonu alır (`focus-visible`).

## 5. Sınırlar

- `KAGIT_TEMASI_KOYU` yalnızca `id: 'midnight'` farkı taşır; renkler yine değişkenden.
- Bölümlerin içindeki bazı yuvarlak öğeler (haplar, durum seçici) bileşende sabittir.
- `surface` program noktasına da uygulanır → nokta küçük köşeli bir sekme olur (kabul edildi).
