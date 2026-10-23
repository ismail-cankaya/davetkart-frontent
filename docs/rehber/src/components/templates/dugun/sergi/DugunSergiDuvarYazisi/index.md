# `dugun/sergi/DugunSergiDuvarYazisi` — "Duvar Yazısı"

> **ID:** `dugun-sergi-duvar-yazisi` · **Konsept:** [Sergi Açılışı](../../../../../../tasarim/SERGI-KONSEPTI.md) · eksen **Duvar yazısı**
> **Tarih:** 2026-10-17 · dal `design/sergi`

---

## 1. Fikir

Sergi girişindeki vinil harfler: çerçeve yok, adlar duvarın üst yarısına büyük italik yazılı; ikinci
satır içeri girintili. Altta tek satır etiket (tarih, saat · mekân) ve konseptin tek espri satırı:
**"Kalıcı koleksiyon"** — müzenin kalıcı koleksiyonu, yani "ömür boyu". Eser rengi `gece`: yazı da
düğme de siyah vinil; `&` etiket grisi.

## 2. Metinler

| Yer | Veri | Biçim |
|---|---|---|
| Üst etiket | `title` (harf büyüklüğü olduğu gibi) | Sans 600, 11 px, etiket grisi |
| Vinil adlar | `names`; boşsa "Davetlisiniz" | Serif italik, `cqi` ile kap genişliğine göre (aşağıda) |
| Etiket satırı | `tarih, saat · mekân`; ikisi de yoksa çizilmez | Sans 13 px, mürekkep |
| Alt satır | "Kalıcı koleksiyon" (sabit) | Sans 13 px, etiket |
| Duvar metni + sayaç | `subtitle`, `showTimer` | 768+ px'te sağ alt sütunda |

## 3. Vinil boyu

`clamp(34px, 80 / (0.40 × harf + 0.7) cqi, tavan)`. Ölçüm: "& Mehmet Çağrı" girintisiyle 6.27 em →
harf başına ≈ 0.40 em + 0.7 em girinti; kabın %80'i yazıya ayrılır. `harf` en uzun satırdır; 16
karakterden uzunsa satır kırılacaktır ve en uzun kelimeye göre (en az 12) hesaplanır, tavan 116 px
(kısa adlarda 168 px). Kısa adlar 360'tan 1280'e her genişlikte iki satırda kalır.

## 4. Düzen

- Mobilde blok dikeyde ortalı, adlarla etiket arasında 80 px; 768+ px'te adlar üstte, etiket ve
  mesaj altta (`justify-between`): duvarın ortası boş kalır (§4.1 "duvarın %40'ı boş").
- Spot adların arkasında, sola kaymış.

## 5. Hareket (son öğe ≤ 1.0 s; ölçülen 882–895 ms)

Spot 0–0.5 s → adlar font hazır olunca +0.1, 0.4 s → etiket 0.5–0.8 s → mesaj 0.45–0.85 s → sayaç 0.5–0.8 s.

## 6. Erişilebilirlik

Çizilmiş ekranda ölçülen en düşük metin oranı 5.99; kapı (siluetsiz) 6.67.

## 7. Sınırlar

- Siyah vinil + açık zemin Noir Minimal'in tersine yakın okunabilir; ayrım asimetrik yerleşim ve
  etiket satırıyla kuruluyor (açık soru, pilot raporu §8).
- `cqi` birimi kompozisyon kökündeki `@container`'a dayanır.
