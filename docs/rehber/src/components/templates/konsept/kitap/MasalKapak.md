# `konsept/kitap/MasalKapak.tsx` — masal kitabı kapağı, çerçeve ve çerçeveli sayfa

> **Tarih:** 2026-10-23 · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §4.3, §5](../../../../../tasarim/KITAP-KONSEPTI.md) (masal kitabı ekseni)

---

## 1. `MasalKapak`

Bez kapak + yaldız çift çizgi çerçeve + basit özgün figür. Rehberin "süslü çerçeveli kapak, basit
özgün figür (taç, yıldız, ay)" satırı. Doğum günü (Masal) kullanır; sünnet ve baby shower da aynı
eksendedir — figürü ve bezi kategori verir.

```
╔═══════════════════════════╗  ✦ köşelerde ışıltı
║  Bir varmış, bir yokmuş…  ║  `acilis` — yaldız italik 17 px
║          ★ ⁓              ║  `figur` yuvası (yaldız, aria-hidden)
║       Gülşen İrem         ║  `baslik` yuvası
║          ——               ║
║ Yeni Yaşımı Birlikte …    ║  `altSatir`
║      20 ŞUBAT 2027        ║
║     SAYFAYI ÇEVİRİN       ║  `alt`
╚═══════════════════════════╝
```

| Prop | |
|---|---|
| `bez` | `BEZLER` anahtarı; `BezYuzey` ile dokulu |
| `acilis` | Etiket yerine italik açılış satırı (büyük harf değil: masal sesi) |
| `figur` | Figür düğümü; rengi `currentColor` (yaldız), yuva `aria-hidden` |
| `baslik`, `altSatir`, `alt` | BezKapak ile aynı rol |

**Bez kapaktan farkı:** çerçeve ve figür yalnızca bu eksende (KITAP-KONSEPTI §5); üstte aralıklı
büyük harf etiket yerine italik açılış.

## 2. `MasalCercevesi`

İnce çift çizgi (dış %80, iç %50, 5 px ara) ve dört köşede dört kollu ışıltı (özgün SVG). Rengi
`text-*` ile; `kenar` kabın kenarından içeri mesafe. Kapakta sol kenar 30 px (sırt oluğunun sağı),
öbürleri 14 px; ≥ @3xl 44 / 22 px. Süstür (`aria-hidden`).

## 3. `MasalSayfasi`

Kapağın ardındaki birinci sayfa da çerçevelidir: kurdele %70, 12 px içeride; geniş ekranda 42 rem'lik
ortalı sütunu çevreler. Çocuk kitabının resimli sayfası gibi. Çerçeve yalnızca hero sayfasındadır;
ortak bölümlere girmez.

## 4. Ölçüm (çizilmiş ekranda, 2026-10-23)

| Metin | En kötü |
|---|---|
| Yaldız / kestane bez (dokuyla): başlık, italikler, tarih, "Kapağı açın" | **5.88** (360 ve 1280 px) |
| Çerçeveli sayfa: `soluk` | 6.17 (çerçeve çizgisi metne değmez) |
