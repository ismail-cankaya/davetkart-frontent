# `shared/InvitationComposition.tsx` — kapı, alt bilgi, erişilebilirlik

> **Kullananlar:** bütün şablonlar (kompozisyon kökü); `renderEnvelope` → kâğıt ailesi (`KagitZarf`)
> **Tarih:** 2026-10-15 · dal `design/kagit` · Onay: Aşama 2 raporu, öneri §8
> **Güncelleme:** 2026-10-22 · dal `design/konsept-ortak` · K10 (§4, §5)

---

## 1. `renderEnvelope`

Zarf kapısı her şablonda ortak `Envelope` ile çiziliyordu; şablonun elinde yalnızca
`theme.envelope` renk sınıfları vardı (mühürde baş harf yerine kategori süsü, kapak tek renk,
açılış süresi sabit). Kâğıt ailesinin zarfı (`KagitZarf`: dokulu kâğıt, astar, kırılan mum mühür,
yükselen kart) bu sınıflarla kurulamıyordu.

```ts
renderEnvelope?: (props: EnvelopeRenderProps) => React.ReactNode;

interface EnvelopeRenderProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  onRevealStart: () => void;  // hero girişini başlatır (intro kapısı)
  onOpened: () => void;       // kapı kalkar, kaydırma açılır
}
```

- Sözleşme ortak `Envelope`'un props'unun aynısı; kompozisyon iki anı bilmeye devam eder
  (intro kapısı ve kaydırma kilidi değişmedi).
- **Yalnızca `invitation.showEnvelope` açıkken** çağrılır. Zarf bir modüldür (Gold); şablon onu
  bayraktan bağımsız gösteremez.
- Verilmezse `<Envelope {...props} />` çizilir: mevcut şablonların hiçbiri etkilenmez.

## 2. Alt bilgi

Adlar ve imza `theme.footer` verilirse onun sınıflarını, verilmezse bugünkü
`opacity-60` / `opacity-40` + `body` sınıflarını alır. Gerekçe ve ölçüm: [palette](palette.md) §3.

## 3. Doğrulama

`npm run check` yeşil; `verify:render` 296 şablonun hepsinde imzanın varlığını/yokluğunu sınıyor
(alanı vermeyen şablonların sınıf dizgesi değişmedi).

## 4. Kapı açıkken arkası `inert` (2026-10-22, K10)

**Sorun:** zarf ekranı örterken bölümler (lazy) zaten çizilmiş oluyordu; Tab mühürden sonra
görünmeyen "Yol Tarifi Al" bağlantısına, oradan galeri oklarına kaçıyordu (ölçülen: Tab sırası
`Davetiyeyi aç → Yol Tarifi Al → Önceki fotoğraf → …`). Ekran okuyucu da kapının arkasını okuyordu.

**Çözüm kompozisyon düzeyinde**, böylece ortak `Envelope`, `renderEnvelope` ile verilen her kapı
(`KagitZarf`, konsept kapıları) aynı davranır:

| Katman | Kapı açıkken |
|---|---|
| Kaydırma kabı (hero + bölümler + alt bilgi) | `inert` |
| `renderBackdrop` sahnesi / kategori deseni | `inert` |
| Kapı | Sarmalayıcı `<div className="contents">` — kutu üretmez, kapının konumu ve katmanı değişmez |

- `inert` React 19'da boolean prop'tur; `envelopeVisible` `false` olunca öznitelik kalkar (zarf `onOpened`
  çağırdığı anda).
- **Odak kapının ilk düğmesinde başlar:** misafir sayfasında (`mode === 'live'`) kapı ilk çizildiğinde
  sarmalayıcıdaki ilk odaklanabilir öğeye `focus({ preventScroll: true })`. Editör önizlemesinde
  (`preview`) odak çalınmaz; kullanıcı sihirbaz alanında yazmaya devam eder.
- Betikle verilen odak, sayfada henüz klavye etkileşimi yokken `:focus-visible` almaz: mühürde
  halka görünmez (zarflı önce/sonra görüntüleri aynı).
- Konsept kapısı için kural: ilk düğmesi **ilk çizimde** DOM'da olmalı (geç beliren düğmeye odak
  verilmez; Tab yine yalnızca kapıda kalır).
- Kapı içindeki `exit` animasyonları `AnimatePresence`'tan sarmalayıcı üzerinden yine geçer.

Ölçülen (headless Chrome, `onizleme.html?…&zarf=1`, 360 px):

| | Önce | Sonra |
|---|---|---|
| Yüklemede odak | `body` | `Davetiyeyi aç` (mühür) |
| Tab ×4 | `Davetiyeyi aç → Yol Tarifi Al → Önceki fotoğraf → Sonraki fotoğraf` | mühür → sayfa dışı (tarayıcı) → mühür → …; içerikteki hiçbir öğe odak almıyor |
| Kapı kalkınca `inert` | yok | kalkıyor (`inert` false) |
| Kapı kalkınca ilk Tab | `Yol Tarifi Al` | `Yol Tarifi Al` (içeriğin ilk odaklanabilir öğesi) |

## 5. Alt bilgideki adlar büyük harfe çevrilmez (2026-10-22, K10)

Adlar kullanıcı metnidir (KONSEPT-ORTAK §4: harfi değiştirilmez). `uppercase` kaldırıldı; aralıklı
imza görünümü harf aralığıyla korunur:

| | Önce | Sonra |
|---|---|---|
| Sınıf | `text-[10px] font-medium tracking-[0.3em] uppercase` | `text-[11px] font-medium tracking-[0.2em]` |
| Görünüm | `GÜLŞEN İREM & MEHMET ÇAĞRI` | `Gülşen İrem & Mehmet Çağrı` |

Küçük harfli metin aynı punto büyük harften küçük göründüğü için 10 → 11 px; geniş harf aralığı küçük
harfte kopuk durduğu için 0.3 → 0.2 em. Alt bilgi satırı 1.5 px uzar: sayfanın son ekranı 1 px
yukarı kayar (önce/sonra karşılaştırmasında görülen tek düzen farkı). Renk (`theme.footer`) değişmedi.

