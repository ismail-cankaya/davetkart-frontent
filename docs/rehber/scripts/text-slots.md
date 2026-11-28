# `scripts/text-slots/`

Faz 24.

| Betik | Komut | Ne |
|---|---|---|
| `export.ts` | `npm run text-slots:export` | `tr.json`'dan `src/contracts/text-slots.json`'ı üretir. Var olan anahtarın `maxLength`/`multiline` değeri korunur, yeni anahtara en uzun varsayılan × 1,6 önerilir. Çıktı backend'e aynen kopyalanır |
| `baseline.ts` | `npm run text-slots:baseline` | Şablonlarda koda gömülü kalan metin sayısını dosya başına `baseline.json`'a yazar. Yalnızca metin taşıdıktan sonra: tavan iner, çıkamaz |
| `scan.ts` | — | Gömülü metin tarayıcısı (TypeScript AST): JSX metni, `aria-label`/`title`/`alt`/`placeholder`/`label`, Türkçe harfli ya da cümle gibi dize sabitleri |
| `snapshot.tsx` | `node scripts/run-check.mjs scripts/text-slots/snapshot.tsx <klasör>` | Bütün şablonları her kategorisinde, bütün modüller açık, zarflı/zarfsız HTML'e çizer (sabit saat ve tohum). Taşımadan önce ve sonra alınan klasörler karşılaştırılır (`<!-- -->` ayraçları hariç birebir aynı olmalı) |

## Tarayıcının kuralları (`scan.ts`, Faz 26.3)

Sayılanlar:

- JSX metni; `aria-label`/`title`/`alt`/`placeholder`/`label` öznitelikleri.
- Diğer JSX prop'ları (`eyebrow="…"`, `masthead="…"`, `teknik="…"`) **Türkçe harf taşıyorsa**.
- Değer konumundaki dize sabitleri (prop değeri, dizi öğesi, `return`, `?:`, `||`, parametre varsayılanı) Türkçe harf
  taşıyorsa ya da cümleye benziyorsa (büyük harfle başlar; `.`, `!`, `…`, `?`, `:` ile bitebilir). Türkçe harflere
  şapkalılar (`â`, `î`, `û`: "Mekân", "Hikâye") dahildir.
- Şablon dizeleri (`` `${ad} şehzademizin…` ``): sabit parçalarında Türkçe harf varsa.
- Çağrı argümanı: yalnızca Türkçe harf taşıyorsa (anahtarlar ve sınıf adları sayılmaz).

Sayılmayan: **metin olmayan** dizeler `// text-slots: kod — <neden>` ile işaretlenir (aynı satırda ya da bir önceki
satırda). Bugün işaretli olanlar: tuş adları (`'Enter'`, `'Escape'`, `'Tab'`), simge seçimi için aranan sözcükler
(`konsept/harita/veri.ts`, hazine avı sözlüğü), yazı tipi aileleri ve yükleme örnek harfleri, GLSL gölgelendiricileri.
Ekranda görünen ya da ekran okuyucuya söylenen bir metin bu işaretle **gizlenmez**: anahtara taşınır.

## Metni taşıma yolları

| Metin nerede | Yol |
|---|---|
| JSX içinde, düğüm alabilen yer | `<InvText k="…" />` (editörde tıklanır) |
| Dize bekleyen prop, dizi, `.length`/`.split()` | Bileşende `const t = useInvText()` → `t('…')`; bileşen dışındaki yardımcıya `t` parametre olarak geçer (`satirlar(d, t)`) |
| Modül sabiti (dizi, nesne) | Sabit **anahtarı** tutar (`SOZLER = ['design.…soz1', …]`), çizim `t(SOZLER[i])` |
| Erişilebilirlik etiketi, sayfa konumu | `fixed` bölümü (`staticFixedText`/`useFixedText`); düzenlenemez |
| Değişken parçalı metin | Yer tutuculu anahtar: `'{count} mum kaldı'` → `t(k).replace('{count}', …)` |
| Ay ve gün adları | Anahtar değil, `Intl.DateTimeFormat(locale)` (`TakvimHero`) |

🔴 Metne bakarak karar veren kod (başlığı `textContent` ile aramak, `label === 'Mekan'`) metin değişince bozulur;
karar anahtara ya da sabit bir kimliğe bağlanır (Faz 26.3: `KurumsalIzometrik`, `BrutalHero`).
