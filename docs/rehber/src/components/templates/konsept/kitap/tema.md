# `konsept/kitap/tema.ts` — iç sayfa teması

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

## 1. Fikir

Ortak bölümler (program, mekân, galeri, hediye, LCV) düzenleri değişmeden şamua bir kitap sayfasına
dizilir. Kâğıt kitinin "ek kart" dilinden bilerek ayrılır: doku, gölge, kesik çizgi yok.

| Alan | Değer | Neden |
|---|---|---|
| `base` | `bg-[#F2EAD3]`, kök font Caslon Text | Sayfa düz şamua |
| `surface` | şamua, 2 px köşe, gölge yok | Kart değil, kılçizgiyle ayrılmış kutu; program noktası küçük köşeli sekme olur |
| `border` | mürekkep %20 | Süs çizgisi (bilgi taşımaz) |
| `input` | saydam, `soluk` tam çerçeve, italik yer tutucu | Form sınırı 6.17 (WCAG 1.4.11 ≥ 3) |
| `buttonPrimary` | kurdele dolgu, şamua yazı | 6.82; üstüne gelince 8.52 |
| `mapHeader` | `#E8DDC0` | Ortak Detaylar'ın harita başlığı sayfadan bir ton koyu |
| `footer` | tam `soluk` | Ortak varsayılanın opaklığı yerine 6.17 |

## 2. Başlık çevirisi

```
[&_.font-serif]:[font-family:var(--kt-metin-font)]
[&_h2.font-serif]:[font-family:var(--kt-baslik-font)] font-normal text-[2.125rem] leading-[1.12]
```

Bölüm başlıkları (`h2`) Caslon Display'e, **34 px**'e ve 400 ağırlığa döner: Display'in kıl çizgileri
32 px altında kopar ve tek ağırlıktır (`font-bold` sahte kalınlık üretirdi). Öbür `font-serif`
öğeler (program adımı, mekân satırı, LCV başarı başlığı) Caslon Text'te kalır. Varyant seçicileri
iki sınıflıdır (`.x h2.font-serif`); bileşenin `text-2xl md:text-3xl font-bold`'unu sıradan bağımsız yener.

## 3. Çizilmiş ekranda ölçüm (2026-10-17)

Yöntem: metin kutuları toplanır, metin saydam yapılıp zemin çekilir, her kutuda zeminin **en kötü
pikseline** karşı oran hesaplanır. İki preset × dört senaryo × 360 / 768 / 1280 px.

| Sonuç | Değer |
|---|---|
| Şamua sayfalardaki en düşük metin | 6.17 (`soluk`: etiketler, açıklamalar, yer tutucu, alt bilgi) |
| Kurdele etiketler | 6.82 |
| AA altı | Yalnızca ortak Galeri sayacı (`text-white/85`, fotoğraf üstünde) — bkz. §4 |

## 4. Sınırlar (ortak bileşenlerde, tema ile çözülemeyen)

- Galeri sayacı fotoğrafın üstündedir; örnek görselde 2.49 ölçüldü. Ortak `Gallery` değişikliği ister.
- Ortak bölümlerin girişleri 0.9 s ve 24 px'tir; konseptin "bölüm girişi 0.4 s, 10 px"i ortak dosyada.
- Hediye "Kopyalandı" (`emerald-500`, 2.11) ve LCV hata metni (`rose-500`, 3.06) bileşende sabit.
- Dokunma hedefleri: galeri okları 36 px, noktaları 6 px, IBAN kopyala ~32 px, kişi sayısı ± 28 px.
- Detaylar'ın soyut harita başlığı konseptin "harita yok" kuralıyla çelişir; düzen ortak.
