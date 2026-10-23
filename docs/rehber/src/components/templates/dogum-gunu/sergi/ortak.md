# `dogum-gunu/sergi/ortak.ts`

> **Kullananlar:** `DogumGunuSergiRetrospektif`, `DogumGunuSergiDevamEden` · **Tarih:** 2026-10-23 · dal `design/sergi`

---

| Dışa aktarım | Ne |
|---|---|
| `DOGUM_GUNU_SERGI_METINLERI` | `useSergiFlavor`'a verilen kategori metinleri: hediye **Armağan**, notu "En güzel armağan aramızda olmanız. Yine de bir şey getirmek isterseniz bilgiler aşağıda." Diğer başlıklar konseptin: *Açılış akışı*, *Ziyaret bilgileri*, *Eserler*, *Açılış listesi* |
| `RETROSPEKTIF` | Kapakta tekrar eden sabit sözler: `sergi` "Retrospektif", `baslik` "Açılış" (etiketin tarih başlığı) |
| `sergiKisileri(names)` | `{ sahibi, kurator }`: ilk ad sahibi, kalanlar (`&` ile) küratör. Tek ad sahibidir; adsızsa ikisi de boş |

Taban flavor `DOGUM_GUNU_FLAVOR`'dır (`dogum-gunu/flavors.tsx`, değiştirilmedi); zarf etiketi ("Doğum Günü
Davetiyesi") ondan gelir. Kategori deseni kitte kapatılır (duvar düzdür).

## Neden "Küratör"?

`names` doğum gününde *Sahibi & Ev sahibi*dir. Ev sahibi daveti düzenleyen kişidir; sergide bu küratörün
işidir. "Küratör" sözü etiketin dilidir, ad veriden gelir; ikinci ad yoksa satır çizilmez. Yalnızca ikinci
alan doluysa (`& Mehmet Çağrı`) saklama işareti `splitPeople`'da düşer ve ad **sahibi** sayılır: kapakta
tek ad olarak görünmesi, küratör diye görünmesinden doğal.

## Neden "Armağan"?

Rehber §4.2 hediyeyi kategoriye bırakır ve bağış kutusu metaforunu yasaklar. Düğün ve nişandaki "Katkı"
doğum gününde resmî kalıyor; "Armağan" hem sıcak hem sergi diline uygun.
