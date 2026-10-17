# `konsept/harita/fontlar.ts` — üç aile, tek bağlantı

> **Tarih:** 2026-10-17 · dal `design/harita` · Denetim: [font-denetimi/harita.png](../../../../../tasarim/font-denetimi/harita.png)

---

## 1. Aileler

| Sabit | Aile | Ağırlık | Rol |
|---|---|---|---|
| `HARITA_YAZI.etiket` | Barlow Condensed | 400, 600 | Harita etiketleri, üst etiket, lejant başlığı, düğme |
| `HARITA_YAZI.govde` | Barlow Semi Condensed | 400, 500 | Gövde, lejant satırları, form |
| `HARITA_YAZI.italik` | Newsreader **italik** (opsz 6–72) | 400–600 | Adlar, su adları, bölüm başlıkları |

Newsreader'ın düz hâli istenmez: konseptte her serif italiktir.

## 2. Yükleme

`useHaritaFontlari()` şablon açılınca tek bir `<link>` ekler (`id="hr-font"`, ikinci kez eklenmez).
`display=swap`: metin önce yedek fontla görünür. Genel `index.css`'e eklenmedi. Etki içinde çalışır;
sunucu çiziminde hiçbir şey yapmaz.

Font geç gelince kartuşun boyu değişir ve rota yeniden ölçülür; bu durumda yeni doğan parçalar
oynamaz (bkz. [hareket](hareket.md)).

## 3. Sınırlar

- Google Fonts'a bağlı (projenin mevcut yöntemi). Çevrimdışında yedek font görünür.
- `font-synthesis: none` temadadır: Barlow Semi Condensed'in yüklenmeyen 600/700 kalınlığı sahte kalın
  üretmez, 500'e düşer (ortak bölümlerdeki `font-semibold`/`font-bold` etiketleri).
