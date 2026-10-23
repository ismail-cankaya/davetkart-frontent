# `konsept/harita/araziler/SehirPlani.tsx` — şehir planı ekseni

> **Tarih:** 2026-10-17 · dal `design/harita` · Eksen: [HARITA-KONSEPTI §4.3](../../../../../../tasarim/HARITA-KONSEPTI.md)

---

## 1. Çizim

Kurgusal bir kıyı kenti, 1200 × 1500 tuval, `xMidYMid slice`. Tonlar: **arazi** (zemin ve bloklar),
**yol** (sokaklar, kordon), **su**; rota kapakta ayrı katmandır.

| Öğe | Nasıl |
|---|---|
| İki mahalle ızgarası | İki `<pattern>` (62 × 94, −8°; 84 × 58, 42°), bulvarın iki yanına `clipPath` ile |
| Sokak kenarı | Her sokağın altında 2.5 px daha geniş mürekkep %20 — beyaz sokak açık zeminde okunsun |
| Bulvar, dik cadde, çevre yolu, güney caddesi | Kenarlı beyaz bantlar (14–18) |
| Göbek | Bulvarla dik caddenin kesişimi (540, 734) |
| Kordon | Kıyı çizgisinin 36 px beyaz izi; denizin altında kalan yarısı örtülür |
| Deniz, ada, iskele, fener | Düz su; ada arazi rengi; iskele kenarlı bant; fener mürekkep %50 |
| Dalgalar, tekneler | Beyaz %75 kısa yaylar; mürekkep %50 tekneler |
| Su adı | *Sakin Sular* — Newsreader italik, geniş aralık, kıyı boyunca −58° (süs metni, bilgi değil) |

Kıyı, bulvar ve göbek her kadrajın görünen çekirdeğindedir (dikey telefonda x 307–893, yatayda
y 307–1192).

## 2. Ölçü

Kaynak 3.98 KB (küçültülmüş); DOM'da 6.6 KB, 52 öğe. Raster görsel yok.

## 3. Telif ve doğruluk

Hiçbir gerçek şehre, kıyıya ya da harita sağlayıcısının renk şemasına dayanmaz; sokak adı yok. Su adı
şiirsel bir süstür ve gerçek bir yer adı değildir.
