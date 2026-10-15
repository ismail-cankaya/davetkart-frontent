# `shared/paper/palet.ts` — renk kaynağı ve CSS değişkenleri

> **Tarih:** 2026-10-15 · dal `design/kagit` · Renk tabloları ve kontrast: [KAGIT-KONSEPTI §2](../../../../../tasarim/KAGIT-KONSEPTI.md)

---

## 1. Fikir

Renkler sınıf adı değil **CSS değişkeni** olarak dağıtılır. Tailwind dinamik kurulmuş bir
`bg-[${hex}]` sınıfını derleme anında göremez; `bg-[var(--kg-kart)]` gibi sabit bir sınıfı görür.
Böylece tema (`tema.ts`) paletten bağımsız tek bir sabit olur, her preset yalnızca bir `KagitSeti` seçer.

## 2. `KagitSeti`

İki dallı bir birleşim tipi: `ton: 'acik'` iken masa/kart açık kâğıt ve mürekkep koyu; `ton: 'koyu'`
iken tersi. Koyu kartona koyu mürekkep yazmak **derleme hatasıdır**.

`ozel`: kimlikli kategoriler kendi KIMLIK değerlerini buradan verir (ör. düğünün `#211b2d` mürekkebi).

## 3. `kagitDegiskenleri(set)`

| Değişken | Ne |
|---|---|
| `--kg-masa`, `--kg-kart`, `--kg-kart-koyu` | Sayfa zemini, ek kart, zarfın içi/harita başlığı |
| `--kg-baslik`, `--kg-govde` | Mürekkep; kraft'ta gövde = başlık |
| `--kg-vurgu`, `--kg-vurgu-koyu`, `--kg-vurgu-ustu` | Etiket/düğme rengi, üzerine gelme, düğme yazısı |
| `--kg-cizgi`, `--kg-cizgi-guclu` | Kıl çizgi (%16) ve süs çizgisi (%38); **form sınırı değil** |
| `--kg-mum` | Mühür |
| `--kg-golge`, `--kg-levha-golge` | Ek kart `box-shadow`'u, ana kart `drop-shadow`'u |
| `--kg-kat-isik`, `--kg-kat-golge` | Kat izi |
| `--kg-kabartma-isik`, `--kg-kabartma-golge` | Kör kabartma |
| `--kg-karisim` | Damganın karışımı: açıkta `multiply`, koyuda `screen` |
| `--kg-doku`, `--kg-doku-boy` | Doku adresi ve döşeme boyu |
| `--kg-govde-font`, `--kg-baslik-font`, `--kg-el-font` | Font yığınları |

## 4. Erişilebilirlik

Bütün metin çiftleri doku koyulaşması dahil ölçüldü; en düşüğü 4.52 (kraft / gül mürekkep).
`--kg-cizgi*` saydam olduğu için 3:1'i tutmaz; yalnızca süs ve ayraçta kullanılır. Form alanının
sınırı tam gövde mürekkebidir (`tema.ts`).

## 5. Sınırlar

- Masa ve kartın tonu karışık olamaz (koyu masa + açık kart): bölüm başlığı masada, metni kartta
  ve ikisi aynı mürekkebi kullanıyor.
- Yeni bir kâğıt/mürekkep eklemek kontrast tablosunu yeniden hesaplamayı ve onayı gerektirir.
