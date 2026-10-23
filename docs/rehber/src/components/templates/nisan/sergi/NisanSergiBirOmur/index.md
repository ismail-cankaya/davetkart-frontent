# `nisan/sergi/NisanSergiBirOmur` — "Bir Ömür"

> **ID:** `nisan-sergi-bir-omur` · **Konsept:** [Sergi Açılışı](../../../../../../tasarim/SERGI-KONSEPTI.md) · eksen **Duvar yazısı**
> **Tarih:** 2026-10-22 · dal `design/sergi`

---

## 1. Fikir

Açılışı yakında olacak bir serginin duyuru duvarı. Sergi adı **"Bir Ömür"**, duvarın sağ kenarında aşağıdan
yukarı okunan dev fuşya vinil; dibinde, aynı taban çizgisinde küçük **YAKINDA**. Çift, sergiyi açacak
sanatçılar gibi sol altta; altlarında etiket dilinde **ÖNİZLEME** başlığıyla bu akşamın tarihi ve mekânı.
Nişan bu sergiyi önizlemektir; açılış düğündür (§7). Çerçeve yok; vinil eserin yerini tutar. Şakasız.

| | |
|---|---|
| Eser rengi | `fusya` — vinil, "Yakında", düğmeler, program çizgisi |
| Kapı | `SergiKapi`, silueti karanlıkta seçilen vinil (`VINIL_SILUETI`) |
| Düğün kardeşinden farkı | Duvar Yazısı'nda adlar yatay vinildir; burada vinil sergi adıdır ve dikeydir, adlar sanatçı satırıdır |

## 2. Metinler

| Yer | Veri | Biçim |
|---|---|---|
| Üst etiket | `title` (harf büyüklüğü olduğu gibi) | Sans 600, 11 px, `tracking-[0.22em]`, etiket grisi |
| Vinil | sabit: "Yakında" + "Bir Ömür" (`ONIZLEME`) | Serif italik, `clamp(96px, 30cqi, 172px)`; "Yakında" Sans 600 11 px |
| Sanatçılar (`h1`) | `names`; boşsa "Davetlisiniz" | Serif italik; en uzun satıra göre 46/40/34 px (mobil) → 76/64/54 px (1024+); `&` etiket grisi |
| Etiket | **ÖNİZLEME** → tarih + saat, mekân | `Etiket` (yalnızca bilgi bölümü) |
| Duvar metni + sayaç | `subtitle`, `showTimer` ("Önizlemeye kalan") | Sans 15–16 px; `SergiSayac` |

Boş alanın kabı çizilmez: tarih ve mekân yoksa etiket yok; tarih yoksa sayaç yok; başlık silinmişse üst
etiket yok, vinil yerinde kalır. Tek ad tek satırdır.

## 3. Düzen (çapraz denge)

| Kap genişliği | Yerleşim |
|---|---|
| < 768 px | İki sütun `[1fr auto]`: solda üstte başlık, sağda vinil (üst iki satır); adlar, etiket, mesaj ve sayaç altta tam genişlikte. Vinil ile adlar arasındaki sol üst duvar boş |
| ≥ 768 px | Vinil sağda bütün satırları kaplar; sol sütunda başlık üstte, adlar ve etiket altta (`1fr` aralık) |
| ≥ 1024 px | Adların altında etiket ile mesaj + sayaç yan yana |

360×780'de başlık, vinil, adlar ve etiketin tamamı ilk ekrandadır; mesaj ilk ekranın altından başlar.

### Dikey vinil

`writing-mode: vertical-rl` + `rotate-180` aşağıdan yukarı okutur; `text-orientation: sideways` küçük
"Yakında"yı büyük adın taban çizgisine oturtur (varsayılan `mixed` ortaya hizalardı). Boy **yatay** kapta
(`motion.div`) tanımlanır: dikey öğenin kendi `cqi`'si kabın genişliğine çözülmedi, 360 px'te vinil tavana
(172 px) çıkıp ekranı dolduruyordu. Satır kırılmaz (`whitespace-nowrap`).

## 4. Hareket (son öğe ≤ 1.0 s; ölçülen 863–880 ms, azaltılmış 880 ms)

Spot 0–0.5 s → başlık 0.1–0.5 s → vinil font hazır olunca (≤ 400 ms) +0.05, 0.55 s: kesimin altından yukarı
kayarak "yapışır" (`overflow-y: clip` + `y 100% → 0`) → adlar font hazır +0.15, 0.4 s → etiket 0.5–0.8 s →
mesaj 0.45–0.85 s → sayaç 0.5–0.8 s. "Hareketi azalt"ta vinil kaymaz, font gelince yerinde görünür.

Ölçüm: headless Chrome, `uzun` senaryo, 360/768/1280; kapak bölümünün eklendiği andan kapaktaki son stil
değişikliğine kadar.

## 5. Erişilebilirlik

- Çizilmiş ekranda ölçülen en düşük metin oranı **5.99** (başlık, spot kenarındaki `#F6F6F4`); vinil 6.07,
  "Yakında" 6.12, adlar 15.89. Kapı: 6.67 (zarf etiketi).
- Vinil gerçek metindir (`lang="tr"`), DOM'da adlardan sonra gelir: ekran okuyucu başlık → adlar →
  "Yakında Bir Ömür" → önizleme bilgisi okur. Kapı silueti `aria-hidden`.
- Kapakta etkileşimli öğe yok.

## 6. Sınırlar

- Kapı siluetinin konumu bölüm dolgularına göre sabit; kısa adlı kapakla birebir, başlıksız kapakta da aynı yerde.
- Vinilin kapladığı yükseklik 1280×800'de ekranın ~%90'ı; daha alçak masaüstü pencerelerinde kapak ilk
  ekranı aşar (kayar, kesilmez).
