# `konsept/sergi/tema.ts` — "aynı duvar" teması

> **Tarih:** 2026-10-17 (N1: 2026-10-23) · dal `design/sergi`

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
| `buttonPrimary` | Eser rengiyle dolu blok, köşesiz |
| `buttonGhost` | Vurgu kenarlı, köşesiz |
| `timelineLine` | Üç durak da vurgu rengi: düz çizgi (degrade yalnızca spottadır, §2.2 kural 3) |
| `timelineNode` | Beyaz, ince kenar, kart gölgesi, **köşesiz** (ortak varsayılan artık hep yuvarlak) |
| `headingAlign` | `'start'`: bölüm başlığı duvarda etiket gibi sola yaslı |
| `sectionMotion` | `{ duration: 0.4, distance: 10 }`: kısa, yakın giriş (SERGI-KONSEPTI §6) |
| `status` | Başarı: gölgedeki duvar üstünde mürekkep (14.53); hata metni ve alan kenarı `--sg-hata` `#9F1239` (duvarda 7.47, beyazda 8.02). İkinci bir eser rengi değil, durum rengi |
| `footer` | Tam etiket rengi (6.05); ortak varsayılan opaklıkla AA altına düşüyordu |

## 2. Köşe sıfırlama neden `border` ve dolgularda?

Bölümler `rounded-3xl`, `rounded-xl`, `rounded-lg`, `rounded-full` sınıflarını kendileri yazar; tema
sınıfları `cn` (tailwind-merge) ile bunlardan **sonra** gelir. `rounded-none` aynı gruptaki önceki
sınıfı siler. Sonuç: kartlar, galeri karesi, hediye çipleri, program noktası ve harita iğnesi köşesiz.

## 3. Dokunma hedefi

Pilotta tema düğmeleri `min-h-11` ile büyütüyordu. K10'dan sonra ortak bölümler hedefi kendisi
44 px'e çıkarır (`::before` ile görünmez alan); tema düğmeyi büyütmez, görünüm değişmez. Tek
istisna galeri noktalarıdır: 24 px adım (N2).

## 4. Sınırlar

- Harita başlığındaki yol çizgileri ortak bileşende sabit sıcak gri.
