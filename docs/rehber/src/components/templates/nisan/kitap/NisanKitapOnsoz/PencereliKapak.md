# `nisan/kitap/NisanKitapOnsoz/PencereliKapak.tsx` — pencereli kapak

> **Tarih:** 2026-10-22 · dal `design/kitap`

---

## 1. Düzen

| Sıra | İçerik | Yazı |
|---|---|---|
| Üst | `ÖNSÖZ` | Yaldız, 11 px aralıklı büyük harf |
| Orta | Oval pencere: adlar (`KitapAdlar`), `&`, sarmaşık yaprağı | Şamua üstünde mürekkep; `&` ve yaprak kurdele |
| | Yaldız çizgi + "Söz Verdik, Nişanlanıyoruz" | Yaldız italik 18 px |
| Alt | Gün ("19 Şubat 2027") + alt yuva ("Sayfayı çevirin" / "Kapağı açın") | Yaldız 13 px aralıklı |

`BezKapak` ile aynı iskelet (`justify-between`, `kapakBelirir(hazir)`, `BezYuzey`), ama adlar bezde
değil pencerede. Simetrik, dikey eksende.

## 2. Pencere

| Özellik | Değer | Neden |
|---|---|---|
| Genişlik | `min(80cqi, 22rem)` | 360 px'te 288 px; genişte 352 px |
| Biçim | `border-radius: 50%`, `aspect-ratio: 5 / 6` | Oval; uzun adda içerik büyür, oval uzar (en-boy en az, en çok değil) |
| İç boşluk | Genişliğin %13'ü yanda, %17'si üst-altta | Ovalin köşeleri kesik: en üst ve en alt satır daralan kısma değmez |
| Adlar | `KitapAdlar enCok 46, akis 10` | 360 px'te 36 px; uzun adda 32 px tabanı |
| Kesik | Yalnızca `box-shadow` | Üstten içe gölge (kapağın kalınlığı sayfaya düşer), bezde ince koyu kesik çizgisi, altta mukavvanın açık kesiti. Filtre yok |

Pencerenin kenarında yaldız halka ya da çizgi **yok**: çerçeve masal kitabı eksenine özgü
(KITAP-KONSEPTI §5); pencere bir delik olarak okunmalı, tablo olarak değil (Sergi'nin çerçevesinden ayrım).

## 3. Kapı olarak

`KapakKapisi`'nın `yuz` yuvasına verilir; `adlarEtiketi="p"`, alt yuvada "Kapağı açın". Kapak dönerken
pencere de döner: penceredeki adlar kapağa çizilidir (gerçek bir delik, kapı açılmadan önce altta
sayfa olmadığı için bir şey göstermezdi). Altta önsöz sayfası belirir; kapak 90°'yi geçince görünür.

## 4. Sınırlar

- 1280 × 800'de pencere 352 px'te sabitlenir, kapak bir ekrana sığar (yatay taşma yok, ölçüldü).
- Pencere çok uzun bir adda (60+ karakter) ekranın büyük kısmını kaplar; içerik kesilmez, kapak uzar.
