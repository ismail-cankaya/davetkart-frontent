# `shared/Timeline.tsx` — program akışı

> **Kullananlar:** `InvitationComposition`
> **Tarih:** 2026-10-11 · dal `design/ortak` · Güncelleme: 2026-10-22 · dal `design/konsept-ortak` (K8, K10)

---

## 1. Üst etiket (2026-10-11)

Başlığın üstündeki küçük etiket `flavor.eyebrows?.timeline ?? "Program Akışı"`. Kategori vermezse
metin aynıdır. Alanların tamamı ve gerekçesi: `flavor.md`. Başlık bloğu artık ortak
[`SectionHeading`](SectionHeading.md)'tir.

## 2. İki düzen (`theme.timelineLayout`)

| Değer | Görünüm | Kim |
|---|---|---|
| `kart` (varsayılan) | Kaydırmayla çizilen dikey omurga, düğüm, kart; adımlar sağdan/soldan kayar | Bütün eski şablonlar |
| `icindekiler` | Kitap içindekiler sayfası: `Karşılama ........ 17:00`, açıklama altta küçük | Hikâye Kitabı (K8) |

Düzenler ayrı alt bileşenlerdedir (`CardFlow`, `ContentsList`): içindekiler düzeni kaydırma dinleyicisi
(`useScroll`) kurmaz.

### İçindekiler satırı

- Yapı `<ol>` → `<li>`: başlık `<h3>`, saat düz metin, açıklama `<p>`. Ekran okuyucu "liste, 4 öğe"
  der; noktalar `aria-hidden`.
- Noktalar CSS'tir: başlıkla saat arasındaki `flex-1` boşluğun `border-b-2 border-dotted` kenarı
  (`theme.body` renginde, %60 opaklık). En az 24 px nokta kalır.
- Uzun başlık **sarılır** (`min-w-0`, `overflow-wrap:anywhere`); saat `shrink-0 whitespace-nowrap`
  olduğu için hiç küçülmez ve son satırın hizasında (`items-end`) kalır.
- Saat yoksa nokta da yoktur; başlık yoksa noktalar satırın başından başlar.
- **Bilinen sınır:** sarılan başlıkta kutu sütunun genişliğini alır; noktalar son satırın bittiği yerden
  değil, kutunun sağ kenarından başlar. Noktaları metnin arkasına gizleyen klasik teknik opak zemin
  ister; dokulu kâğıtta kullanılamadığı için bu kabul edildi.
- Yazı sınıfları: başlık `font-serif text-lg font-bold` + `theme.heading`, saat
  `font-serif text-base font-semibold tabular-nums` + `theme.accent`, açıklama `theme.body`.

## 3. Düğüm (`theme.timelineNode`) — K10

Düğüm `theme.surface` + `theme.border` alıyordu; `surface`'ta köşe yuvarlaklığı olan temalarda
(`rounded-2xl`, Kâğıt'ın `rounded-[3px]`) `twMerge` düğümün `rounded-full`'unu siliyor, düğüm
kareleşiyordu (Kâğıt'ta ölçülen köşe yarıçapı 3 px).

| Tema | Düğüm |
|---|---|
| `timelineNode` vermez | `surface` + `border` + **her zaman** `rounded-full` (düzeltme) |
| `timelineNode` verir | Taban sınıflar + `timelineNode` (zemin, kenar, biçim; `rounded-none rotate-45` gibi) |

İçteki nokta `theme.accentBg`'dir; tema onu `[&>span]:…` varyantıyla değiştirebilir.

## 4. Saat büyük harfe çevrilmez

Adımın saati kullanıcı metnidir (`"17:00"`, ama `"Akşam"` da olabilir). Satırdaki `uppercase`
kaldırıldı (KONSEPT-ORTAK §4: kullanıcı metninin harfi değiştirilmez). Rakamlı saatte görünüm aynı.

## 5. Giriş hareketi

`theme.sectionMotion` → [`SectionHeading`](SectionHeading.md) §4. Kart düzeninde adım `x` ±`distance`
(varsayılan 36 px, 0.85 s), içindekilerde `y` `distance` (varsayılan 24 px, 0.85 s).
