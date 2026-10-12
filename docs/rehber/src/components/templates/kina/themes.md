# `src/components/templates/kina/themes.ts` — Kına bölüm temaları

> **Kullananlar:** 35 kına şablonu (`KINA_<ŞABLON>` → `themeOverride`)
> **Denetim:** kontrast betiği bu dosyanın dökümünü okur (bkz. [KIMLIK.md](KIMLIK.md) §6)

---

## 1. Neden tek dosya

Eskiden 31 şablon kendi yerel `SectionTheme`'ini taşıyordu; dördü (`Sade`, `Manzara`,
`Sekilli`, `Modern`) düğün ve nişanla ortak `shared/themeTokens.ts`'ten türüyor, üstüne
Tailwind `red-*` vurgusu ekliyordu. Renkler dağınıktı (pembe `#dd6b7a`, petrol `#1f6f6a`,
mor `#8a4f7a`, altın `#cf9f4e`…) ve kategori bir aile gibi okunmuyordu. Şimdi 35 tema
tek dosyada, tek paletten (`parts/palette.ts`) ve tek betikle denetleniyor.

`themeTokens` artık hiç import edilmiyor: kına dört ortak şablonu da kendi değerleriyle yazar.

## 2. Gruplar

| Grup | Şablonlar | Zemin | Vurgu |
|---|---|---|---|
| Kategori hero'lu | Sade, Manzara, Sekilli, Modern, Bordo, Saray, Mum, Aurora, Krom | her biri kendi sahnesine göre (avuç, kayısı, kadife, turuncu, şarap, kemer, ıs, ateş, bakır) | kına / al / sırma |
| Ortak hero'lu açık aile | Bento, Kağıt, Riso, Tek Çizgi, Suluboya, Dokuma, Mermer, Gazete, Posta, Brutal, Terrazzo, Herbaryum, Çini, Ebru, Takvim | avuç `#f8ebdf` çevresi | al `#a8261c` ya da kına `#a4451a`; Tek Çizgi ve Herbaryum zeytin |
| Ortak hero'lu koyu aile | Noir, Deco, Vitray, Kinetik, Plak, Pano, Yıldız, Film, Teknik Çizim, Ufuk, Monogram | ıs `#1b0c07` çevresi (Kinetik al `#8c1a14`) | kına ışığı `#f2a066` |

## 3. Bölüm karakteri — "tepsi"

| Alan | Karakter | Neden |
|---|---|---|
| `buttonPrimary`, `buttonGhost` | `rounded-[10px]` dolgu düğme | Tepsi kenarı: düğünün hap düğmesinden ve kurumsalın keskin köşesinden ayrı |
| `input` | Dolgulu kutu alan (`bg` + `border` + `rounded-[10px]`) | Düğünün alt çizgili "yazılacak satır"ından bilerek farklı |
| `envelope` | `ZARF_AVUC` (açık) / `ZARF_IS` (koyu) ya da şablona özel | Koyu temada varsayılan altın mühür yerine kına turuncusu mühür |
| `mapHeader` | `HARITA_AVUC` `#f1dccb` / `HARITA_IS` `#2a130b` | Detaylar kartının harita başlığı aile tonunda |

Kendi geometrisi olan diller (Brutal köşesiz + gölge, Teknik Çizim köşesiz büyük harf,
Noir köşesiz, Terrazzo hap, Herbaryum/Çini/Ebru/Takvim/Monogram `rounded-sm`) tepsi
köşesini almaz; yalnızca renk ailesini alır.

## 4. Tailwind notu

- Sınıflar literal yazılır; hex'i şablon dizgisiyle üretmek derlenmeyen sınıf demektir.
  Bu yüzden `palette.ts`'teki değerler burada tekrar açık yazılır.
- `body`'si saydamlıkla verilen tek tema `KINA_BLUEPRINT` (`text-[#fbe3cf]/72`); kontrast
  betiği bunu zemine karıştırarak ölçer.

## 5. Bu turdaki düzeltme

| Tema | Sorun | Düzeltme |
|---|---|---|
| `KINA_SULUBOYA` | Gövde `#76412e`, hero'daki al lekenin (`#e1a8a3`) üstünde 4.0 (görsel öz-kontrolde ölçüldü) | `#5e2f1f` → 5.43 |
