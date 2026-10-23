# `konsept/kitap/tema.ts` — iç sayfa teması

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (ortak kancalar, KONSEPT-ORTAK §3.1) · dal `design/kitap`

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
| `footer` | tam `soluk` | Ortak varsayılanın opaklığı yerine 6.17 |
| `timelineLayout` | `'icindekiler'` | K8: program kitap içindekiler sayfası gibi (`Karşılama ........ 18:00`) |
| `hideMapHeader` | `true` | Kitapta harita yok: Detaylar kartı soyut harita başlığı olmadan başlar (`mapHeader` kaldırıldı) |
| `sectionMotion` | `{ duration: 0.4, distance: 12 }` | §6 "bölüm girişi": kısa, bir kez |
| `status.success` | `bg-[#1F3A2E]/10 text-[#1F3A2E]` | "Kopyalandı" ve LCV onayı kitabın şişe yeşili mürekkebiyle |
| `status.error` | `text-[#74262A]` | LCV hata metni koyu kurdele (vurgu kurdelesinden bir ton koyu) |
| `status.errorInput` | `border-[#74262A] …ring-[#74262A]/25` | Hatalı alanın kenarı aynı ton |

## 2. Başlık çevirisi

```
[&_.font-serif]:[font-family:var(--kt-metin-font)]
[&_h2.font-serif]:[font-family:var(--kt-baslik-font)] font-normal text-[2.125rem] leading-[1.12]
```

Bölüm başlıkları (`h2`) Caslon Display'e, **34 px**'e ve 400 ağırlığa döner: Display'in kıl çizgileri
32 px altında kopar ve tek ağırlıktır (`font-bold` sahte kalınlık üretirdi). Öbür `font-serif`
öğeler (program adımı, mekân satırı, LCV başarı başlığı) Caslon Text'te kalır. Varyant seçicileri
iki sınıflıdır (`.x h2.font-serif`); bileşenin `text-2xl md:text-3xl font-bold`'unu sıradan bağımsız yener.

### İçindekiler noktaları

Ortak satırda noktalar `theme.body` rengi, %60 opaklık: şamuada nokta/zemin **2.63** ölçüldü (süs,
`aria-hidden`; WCAG zorunlu tutmaz ama gözü saate taşıyan çizgi silik kalıyordu). Tema kökü
`[&_.border-dotted]:opacity-80` ile **3.95**'e çıkarır (`border-dotted` ortak bileşenlerde yalnızca
bu satırdadır).

## 3. Çizilmiş ekranda ölçüm (2026-10-17, kancalar 2026-10-22)

Yöntem: metin kutuları toplanır, metin saydam yapılıp zemin çekilir, her kutuda zeminin **en kötü
pikseline** karşı oran hesaplanır. İki preset × dört senaryo × 360 / 768 / 1280 px.

| Sonuç | Değer |
|---|---|
| Şamua sayfalardaki en düşük metin | 6.17 (`soluk`: etiketler, açıklamalar, yer tutucu, alt bilgi) |
| Kurdele etiketler | 6.82 |
| AA altı | 2026-10-17: yalnızca ortak Galeri sayacı. 2026-10-22 (ortak düzeltmeden sonra): **yok** (`nisan-kitap-onsoz` 360 px, 76 metin) |
| İçindekiler saati (kurdele, 16 px) | 6.82 |
| İçindekiler noktaları | 3.95 (360 ve 1280 px; 50 karakterlik adım başlığıyla da) |
| "Kopyalandı" (11 px, çip üstünde) | **8.60** (360 / 1280 px; düğün İç Kapak ve nişan Önsöz) |
| LCV hata metni (11 px) | **8.52** |
| LCV onay rozeti | Aynı `status.success` sınıfı; gönderim sunucu ister, çizilmiş hâli **denenmedi** (hesap: şişe / şamua+%10 şişe ≈ 9.3) |

## 4. Sınırlar

2026-10-17'de burada yazan ortak sorunların hepsi `design/konsept-ortak`'ta çözüldü ve 2026-10-22'de
tema kancalarıyla bağlandı (galeri sayacı, giriş süresi, durum renkleri, dokunma hedefleri, harita
başlığı). Kalanlar:

- Bölüm üst etiketi ortakta büyük harfe çevrilir; nişanın ön sayfa numarası (küçük Roma rakamı) etikette
  kullanılamaz (öneri: eyebrow büyük harf kancası).
- İçindekilerde sarılan uzun başlıkta noktalar kutunun sağ kenarından başlar (ortak `Timeline` §2,
  bilinen sınır).
