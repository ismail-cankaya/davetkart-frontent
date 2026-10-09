# `src/components/templates/sunnet/themes.ts` — Şehzade paleti ve 28 tema

> **Kullananlar:** 28 sünnet şablonu (`themeOverride`), `parts/*` (`SEHZADE` sabitleri)
> **Denetim:** kontrast betiği — 346 bölüm çifti, eşik altı 0 (bkz. [KIMLIK](KIMLIK.md) §6)

---

## 1. Neden tek dosya

Eskiden her şablon kendi `SectionTheme`'ini kendi dosyasında taşıyordu ve
kategori "açık gri-mavi + petrol" ile "lacivert + şampanya altın" arasında
dağınıktı. Temalar artık tek yerde: kategori kimliği bir bakışta okunur ve
kontrast betiği hepsini tek modülden içe aktarır.

Tema sınıfları değerleriyle **açık** yazılır (`bg-[#f5f7fd]`): Tailwind
kaynağı tarar, `bg-[${renk}]` gibi kurulan sınıfları göremez. `SEHZADE`
nesnesi bu yüzden yalnızca hero parametreleri (SVG, parçacık, kuşak) içindir.

## 2. `SEHZADE` paleti

| Ad | Hex | Kaynak | Kural |
|---|---|---|---|
| `sax` | `#2348c6` | Pelerin satenı | Ana mavi; açık zeminde metin olabilir (6.97:1) |
| `lacivert` | `#101a4a` | Nazar boncuğu | Mürekkep, başlık |
| `nar` | `#c3263c` | Maşallah kuşağı | Dolgu ve süs |
| `narMetin` | `#b8233a` | — | Açık zeminde kırmızı **metin** (5.87:1) |
| `pirinc` | `#e9b23a` | Sırma, pul | Açık zeminde **asla metin** |
| `fener` | `#f2c14e` | Kandil ışığı | Koyu zeminde metin |
| `turkuaz` | `#2aa7b8` | Nazar halkası | Dolgu ve süs |
| `turkuazMetin` | `#0d6f80` | — | Açık zeminde turkuaz metin (5.44:1) |
| `seker` | `#f5f7fd` | Şeker beyazı | Gündüz zemini (fildişi değil) |
| `gece` | `#0e1650` | — | Gece zemini (slate lacivert değil) |

## 3. İki aile, ortak bölüm karakteri

| | Gündüz şenliği (15) | Gece şenliği (13) |
|---|---|---|
| Zemin | soğuk beyazlar `#f3f4fa`–`#f6f8fd` | kraliyet mavisi `#070d33`–`#1b2f9e`, Maşallah `#1d0910`, Lunapark `#120f3d` |
| Vurgu | nar / sax / turkuaz (sırayla dağıtıldı) | fener pirinci / nar `#ff8a96` / turkuaz `#6fd6e2` |
| Kart | `bg-white/85–90` + sax tonlu saten gölge | sax tonlu cam (`#16206a/55`) ya da beyaz cam |
| Düğme | `rounded-full` hap; Klasik'te pirinç iç halka (sırma) | `rounded-full` hap |

Kendi dili olan tasarım şablonları dilini korur: Brutal ve Blueprint
köşesiz, Herbaryum köşeli (`rounded-sm`), Terrazzo yuvarlak. Onlarda yalnızca
renkler aileye geçti.

## 4. 🔴 Bilinçli kararlar

- **`theme-cormorant` kaldırıldı** (Yıldız, Maşallah, Deco). Cormorant
  düğünün ince zarafeti; sünnet Playfair'in iri, kontrastlı italiğiyle konuşur.
- `accentBg` üstündeki yazı ortak bölümlerde sabittir (koyu temada
  `slate-950`, açıkta `stone-50`; LCV seçimi, hediye çipleri). Her `accentBg`
  buna göre seçildi; en düşük 5.58:1 (Modern/Herbaryum turkuaz).
- Placeholder metni de AA'yı geçer; en dar çift Krom (4.60:1).
