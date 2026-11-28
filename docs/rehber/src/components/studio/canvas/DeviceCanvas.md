# `src/components/studio/canvas/DeviceCanvas.tsx`

Faz 27.1 (K320). Tasarım stüdyosunun tuvali.

## Neden iframe

Şablonların 116 dosyası `sm:`/`md:`/`lg:` sınıfları kullanır. Bu sınıflar **belgenin görüntü alanına** bakar. Eski
önizleme (`preview/DeviceSimulator`) şablonu sayfadaki bir kutuya çiziyordu: masaüstü tarayıcıda telefon çerçevesinin
içinde de `lg:` geçerliydi, "tablet" ve "bilgisayar" düğmeleri cihazı taklit etmiyordu.

Tuval içeriği aynı uygulamadaki boş bir iframe'e `createPortal` ile çizer:

| Konu | Davranış |
|---|---|
| Genişlik | Cihazın gerçek görüntü alanı: telefon 390×844, tablet 820×1180, bilgisayar 1280×800 (`deviceViewports.ts`) |
| Ölçek | `fit`: çerçeve dahil alana sığar, en çok %100. Sayı: sabit yüzde, alan taşarsa kaydırılır |
| React ağacı | Aynı: store'lar, bağlam (`InvitationTextProvider`, Suspense) ve olaylar portal üzerinden çalışır (React portal kabını kendisi dinler) |
| Stiller | `useFrameDocument` kopyalar ve izler |
| `position: fixed` | Iframe'in görüntü alanına göre (eski kutuda `contain: strict` taklit ediyordu) |

## Tıklanan metnin konumu

`EditableTextMark` kutusunu iframe'in görüntü alanına göre ölçer. Tuval, kendisine verilen editör köprüsünü sarar ve
`select()`'teki kutuyu ana pencereye çevirir: `iframe.getBoundingClientRect()` + `kutu × ölçek`
(ölçek = iframe'in ekrandaki genişliği / görüntü alanı genişliği). Yerinde düzenleyici (`InlineTextEditor`) böylece
değişmeden metnin yanında açılır.

## Ölçüm (27.1, 1440×900 pencere)

| Cihaz | `innerWidth` | `md` | `lg` | Ölçek | Düzenleyici |
|---|---|---|---|---|---|
| Telefon | 390 | hayır | hayır | %94 | metnin altında |
| Tablet | 820 | evet | hayır | %67 | metnin altında |
| Bilgisayar | 1280 | evet | evet | %98 | metnin altında |

Kaydet iframe'e anında yansır; Ctrl+Z odak iframe'deyken de çalışır (`useFrameDocument` kısayolları iletir).

## Bilinen sınırlar

- Birkaç şablon fare konumunu `window.innerWidth`'e oranlar (`DugunKristalBalo`, `KurumsalLansman`, `PartiKokteyl`,
  `useTilt`) ya da `document.fonts.ready`'yi ana belgeden okur (`DugunKelebek`, `DugunAltinToz`, `useSikiBlok`):
  tuvalde süs hareketleri hafif kayık olabilir; misafir sayfası etkilenmez.
- Misafir sayfası (`/invite/:id`) ve ana sayfa vitrini iframe kullanmaz.

## Yer işareti (Faz 29.5)

Portal içeriği iframe'de `<main aria-label={title}>` içinde çizilir; misafir sayfasının kökü de `<main>` olduğundan
şablonlar aynı yapıyı görür. Ad zorunlu: stüdyo ve panelin kendi `main`'i var (axe `landmark-unique`).
