# `src/components/templates/dugun/themes.ts` — Düğün bölüm temaları

> **Kullananlar:** 40 düğün şablonu (`DUGUN_THEMES.<Şablon>` → `themeOverride`)
> **Denetim:** kontrast betiği bu dosyanın dökümünü okur (bkz. [KIMLIK.md](KIMLIK.md) §6–7)

---

## 1. Neden tek dosya

Eskiden her şablon kendi `SectionTheme`'ini taşıyordu; dört şablon (`Sade`, `Manzara`,
`Sekilli`, `Modern`) ise kına ve nişanla ortak `shared/themeTokens.ts`'i kullanıyordu.
Renk ailesini tek yerde görmek ve kontrastı tek betikle denetlemek için 40 tema burada.
Kına ve nişan sonraki turda bu dosyayı okuyup bilerek ayrışabilir.

## 2. Bölüm karakteri — `kurdele()`

| Alan | Karakter | Neden |
|---|---|---|
| `base` | `theme-cormorant` | Bölüm başlıkları (`font-serif`) Cormorant Garamond olur |
| `input` | Kutu değil alt çizgi (`border-0 border-b rounded-none bg-transparent`) | Basılı LCV kartındaki "yazılacak satır" |
| `buttonPrimary` | `rounded-full tracking-[0.12em]` | Hap buton, kartın geniş aralıklı küçük başlıklarıyla aynı dil |
| `buttonGhost` | `rounded-full border` | Kişi sayısı +/− düğmeleri de daire olur |
| `surface` | Açıkta uzun yumuşak gölge, koyuda üst kenarda tek inci ışığı | Tül kart |

`uppercase` bilinçli olarak yok: ortak bölümler `lang` taşımaz, arayüz dili
İngilizceyken "Katılımımı Bildir" CSS ile "KATILIMIMI BILDIR" olurdu.

Kendi sert geometrisi olan diller (`DugunBrutal`, `DugunBlueprint`, `DugunNoir`)
`kurdele()` kullanmaz; yalnızca renk ailesini alır.

## 3. Çekirdekler

| Çekirdek | Zemin | Mürekkep | Gövde | Vurgu | Buton |
|---|---|---|---|---|---|
| `TUL` (açık) | `#f8f6f9` | `#211b2d` | `#655d74` | `#9b3a63` | mürekkep dolgu |
| `GECE` (koyu) | `#16121d` | `#f6f1f8` | `#b1a8bd` | `#eba9c6` | inci dolgu `#efe8f3` |

Şablon temaları bu iki çekirdekten türer; yalnızca zemin ve vurgu tonu şablonun
görseline göre kayar (ör. Dugun2 mersin `#4f6b55`, Gökyüzü gök mavisi zemin).

## 4. Tailwind notu

- Sınıflar literal yazılır; hex'i şablon dizgisiyle üretmek derlenmeyen sınıf demektir.
- `DecoHero` sayaç ayırıcısını `theme.divider.replace('bg-', 'divide-')` ile üretir.
  `divide-[#d9d0e2]/22` sınıfı Deco temasının JSDoc'unda literal geçer ki derlensin.
