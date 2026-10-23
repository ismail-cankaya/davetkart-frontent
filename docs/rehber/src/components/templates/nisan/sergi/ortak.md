# `nisan/sergi/ortak.ts`

> **Kullananlar:** `NisanSergiBirOmur`, `NisanSergiDiptik` · **Tarih:** 2026-10-22 · dal `design/sergi`

---

| Dışa aktarım | Ne |
|---|---|
| `NISAN_SERGI_METINLERI` | `useSergiFlavor`'a verilen kategori metinleri: hediye **Katkı**, notu "En güzel katkı aramızda olmanız. Yine de bir katkıda bulunmak isterseniz hesap bilgileri aşağıda."; `basliklar`: program *Önizleme akışı*, LCV *Önizleme listesi* |
| `ONIZLEME` | Kapakta tekrar eden sabit sözler: `baslik` "Önizleme" (etiketin tarih başlığı), `sayac` "Önizlemeye kalan", `sergi` "Bir Ömür", `durum` "Yakında" |

Taban flavor `NISAN_FLAVOR`'dır (`nisan/flavors.tsx`, değiştirilmedi); zarf etiketi ("Nişan Davetiyesi")
ondan gelir. Salon numaraları ve kalan başlıklar (*Ziyaret bilgileri*, *Eserler*) kitte.

## Neden "Açılış" değil?

Rehber §4.2 bölüm başlıklarını *Açılış akışı* / *Açılış listesi* diye verir. Nişanda kapak "Bir Ömür"ün
açılışının **yakında** (düğünde) olduğunu, bu akşamın önizleme olduğunu söyler; aynı sayfada "Açılış
listesi" bu hikâyeyle çelişirdi. Kit bunun için `SergiMetinleri.basliklar`'ı aldı; rehbere kategori
istisnası olarak işlenmesi raporda önerildi.

"Bir Ömür" ve "Yakında" konseptin kategori yorumudur (§7), etkinlik verisi değildir. Düğünün tarihi
veride yoktur ve yazılmaz; "Yakında" yalnızca belirsiz bir gelecek söyler. Önerilen i18n anahtarları
kategori raporunda.
