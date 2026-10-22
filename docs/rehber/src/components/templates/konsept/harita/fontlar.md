# `konsept/harita/fontlar.ts` — üç aile, tek bağlantı

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (`haritaFontlari`) · dal `design/harita` · Denetim: [font-denetimi/harita.png](../../../../../tasarim/font-denetimi/harita.png)

---

## 1. Aileler

| Sabit | Aile | Ağırlık | Rol |
|---|---|---|---|
| `HARITA_YAZI.etiket` | Barlow Condensed | 400, 600 | Harita etiketleri, üst etiket, lejant başlığı, düğme |
| `HARITA_YAZI.govde` | Barlow Semi Condensed | 400, 500 | Gövde, lejant satırları, form |
| `HARITA_YAZI.italik` | Newsreader **italik** (opsz 6–72) | 400–600 | Adlar, su adları, bölüm başlıkları |

Newsreader'ın düz hâli istenmez: konseptte her serif italiktir.

## 2. Yükleme

| İşlev | Ne yapar |
|---|---|
| `useHaritaFontlari()` | `HaritaKok`'ta; etki içinde `haritaFontlari()`'nı başlatır. Sunucu çiziminde hiçbir şey yapmaz |
| `haritaFontlari()` | Tek `<link>` ekler (`id="hr-font"`, ikinci kez eklenmez) ve bir söz döner: **stil sayfası** yüklenince kapağın dört yüzü (`600 Barlow Condensed`, `400/500 Barlow Semi Condensed`, `italic 500 Newsreader`) `document.fonts.load` ile istenir; hepsi inince çözülür. Bağlantı hatası (çevrimdışı) da çözer. Söz modül düzeyinde bir kez kurulur |
| `haritaFontlariHazir()` | Söz bu sayfada çözüldü mü? (Zarf açılırken yüklendiyse kapak beklemez) |

`display=swap`: metin önce yedek fontla görünür. Genel `index.css`'e eklenmedi.

**Tuzak:** stil sayfası gelmeden çağrılan `document.fonts.load` eşleşen `@font-face` bulamaz ve boş
diziyle **hemen** çözülür; bu yüzden önce bağlantının `load` olayı beklenir. Örnek metin Türkçe
harfleri içerir (`ÇçĞğİıÖöŞşÜü`): yalnızca latin alt kümesi değil, adlar için gereken latin-ext de
indirilir.

Kapak harita katmanını bu söz çözülene (en çok 6 s) kadar kurmaz; böylece rota son fontlarla ölçülür
ve font gelince yerinden oynamaz ([HaritaKapak §4.1](HaritaKapak.md)).

## 3. Sınırlar

- Google Fonts'a bağlı (projenin mevcut yöntemi). Çevrimdışında yedek font görünür.
- `font-synthesis: none` temadadır: Barlow Semi Condensed'in yüklenmeyen 600/700 kalınlığı sahte kalın
  üretmez, 500'e düşer (ortak bölümlerdeki `font-semibold`/`font-bold` etiketleri).
- Bu makinede (dört ajan, soğuk önbellek) stil sayfası 0.4–1.6 s, yüzler ondan 0.5–1.9 s sonra geldi;
  kapak o sürede rotasız kalır, sonra rota animasyonsuz belirir.
