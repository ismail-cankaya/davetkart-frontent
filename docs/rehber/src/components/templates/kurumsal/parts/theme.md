# `kurumsal/parts/theme.ts` — Palet sabitleri ve kategori biçimi

> **Kullananlar:** 26 kurumsal şablonun tamamı (`kurumsalTheme`), `KurumsalHero`,
> `KurumsalFrame`, `GlassPanes` (`KURUMSAL_EASE`)
> **Denetim:** duman testi yoklaması (`probe.tsx`): grotesk takası ve kart köşesi
> çıktıda doğrulanır. Kimlik özeti: [KIMLIK.md](../KIMLIK.md)

---

## 1. Sorun

Kategori biçimi 26 şablonda tekrar eder: 4 px kart köşesi, aralıklı büyük harf
düğme ve grotesk başlık takası. Bunu her `SectionTheme`'e elle yazmak 26 ayrı
kopya demektir. Biri unutulduğunda kategori sessizce dağılır.

Öte yandan renkler bir fabrikada üretilemez. `bg-[${hex}]` gibi dinamik bir
sınıfı Tailwind kaynakta göremez ve CSS'ini üretmez.

## 2. Çözüm: renk şablonda, biçim burada

```ts
const THEME = kurumsalTheme({ ...renk sınıfları açık yazılı... }, { edge: 'kesin', type: 'grotesk' });
```

`kurumsalTheme` yalnızca **sabit** sınıfları ekler. Bunlar bu dosyada düz metin
olduğu için Tailwind onları görür.

| Alan | Eklenen | Etki |
|---|---|---|
| `base` | `[&_.font-serif]:font-sans [&_.font-serif]:not-italic` (`type: 'grotesk'`) | Ortak bölümlerin ve hero'nun serif başlıkları Inter'e döner, dik yazılır |
| `surface`, `border` | `rounded-[4px]` / `rounded-none` / — | Ortak bölümler bu tokenları `rounded-3xl`'den **sonra** birleştirir; twMerge son yarıçapı tutar |
| `input` | `rounded-[2px]` / `rounded-none` / — | Girdi köşesi |
| `buttonPrimary`, `buttonGhost` | köşe + `uppercase tracking-[0.16em]` | Kayıt masası etiketi gibi düğme |

### Köşe tavrı (`edge`)

| Değer | Kart | Kontrol | Kullananlar |
|---|---|---|---|
| `kesin` (varsayılan) | 4 px | 2 px | Şablonların çoğu |
| `sert` | 0 | 0 | Brutal, Blueprint, Noir |
| `serbest` | dokunulmaz | dokunulmaz | Terrazzo (yuvarlak taş), Ufuk (hap rozet) |

`serbest` neden var: `surface` bazı ortak hero'larda da kullanılır.
`TerrazzoHero` kartını `rounded-[2.25rem]` + `surface` ile, `UfukHero` rozetini
`rounded-full` + `surface` ile basar. Kesin köşe orada hero'nun kendi dilini
bozardı.

## 3. 🔴 Bağımlılık: twMerge sırası

Köşe ezme, ortak bölümlerin `cn('rounded-3xl …', theme.surface, theme.border)`
sırasına dayanır. Bir ortak bölüm sırayı tersine çevirirse (önce token, sonra
`rounded-3xl`) kartlar yeniden 24 px olur. Bu bir hata vermez; ancak duman
testi yoklaması `kart=rounded-3xl` göstererek yakalar.

## 4. Palet ve hareket

`KURUMSAL_INK`, hero parametrelerinde ve stil nesnelerinde kullanılan hex
değerlerini toplar (tablo: [KIMLIK.md §2](../KIMLIK.md#2-palet-hex)).
`KURUMSAL_EASE = [0.16, 1, 0.3, 1]` kategorinin hareket eğrisidir.
