# `konsept/sergi/tema.ts` — "aynı duvar" teması

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

## 1. Fikir

Ortak bölümler (program, mekân, galeri, hediye, LCV) `SectionTheme` sınıflarıyla boyanır. `SERGI_TEMASI`
onları kapakla aynı beyaz duvarda asılı gösterir; bileşenlerin kendisine dokunmadan (SERGI-KONSEPTI §4.2).

| Alan | Sergi karşılığı |
|---|---|
| `base` | Düz duvar; gövde Instrument Sans; `font-serif` → Instrument Serif **400** (`[&_.font-serif]:font-normal`: tek ağırlıklı fontta sahte kalın çizilmesin) |
| `surface` | Paspartu kart: beyaz, tek yumuşak gölge, **köşesiz** |
| `border` | Çerçeve kenarı `#D6D6D2` + `rounded-none` |
| `accent`, `accentBg` | Eser rengi (safranda mürekkep); dolgular da köşesiz |
| `input` | Beyaz alan, `#8A8A86` sınır (3.47), odakta vurgu rengi + 1 px halka |
| `buttonPrimary` | Eser rengiyle dolu blok, köşesiz, `min-h-11` |
| `buttonGhost` | Vurgu kenarlı, `min-h-11 min-w-11` |
| `timelineLine` | Üç durak da vurgu rengi: düz çizgi (degrade yalnızca spottadır, §2.2 kural 3) |
| `footer` | Tam etiket rengi (6.05); ortak varsayılan opaklıkla AA altına düşüyordu |

## 2. Köşe sıfırlama neden `border` ve dolgularda?

Bölümler `rounded-3xl`, `rounded-xl`, `rounded-lg`, `rounded-full` sınıflarını kendileri yazar; tema
sınıfları `cn` (tailwind-merge) ile bunlardan **sonra** gelir. `rounded-none` aynı gruptaki önceki
sınıfı siler. Sonuç: kartlar, galeri karesi, hediye çipleri, program noktası ve harita iğnesi köşesiz.

## 3. Dokunma hedefi

Ortak bölümlerin düğmeleri 28–40 px'ti. `min-h-11` (44 px) birincil düğmelere ("Yol Tarifi Al",
takvim), `min-h-11 min-w-11` hayalet düğmelere (kişi sayısı −/+, IBAN kopyala) eklendi. Ölçüm:
kalan küçük hedefler yalnızca tema dışı sınıflı olanlar (pilot raporu §5).

## 4. Sınırlar

- Kişi sayısı kutusu 44 px düğmelerle 56 px'e uzar; yanındaki menü seçimi 46 px kalır (hafif hizasızlık).
- Galeri ok ve noktaları, hediye çipleri, LCV durum seçicisi sabit boyutlu; tema büyütemez.
- Harita başlığındaki yol çizgileri ortak bileşende sabit sıcak gri.
