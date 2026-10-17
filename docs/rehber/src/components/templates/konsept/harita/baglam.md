# `konsept/harita/baglam.ts` — kapak ↔ sahne bağı

> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Sorun

Bölümlerin başlıkları (ortak `Timeline`, `Details`… üst etiketi ve `h2`) kart içinde değil, doğrudan
arka plandaki haritanın üstündedir. Haritanın en koyu yerinde (su) `rota` rengi üst etiket 3.56'ya
düşer. Perde yalnızca kapak çıktıkça opaklıkla inseydi, kaydırmanın ortasında başlıklar yarım
perdeli haritanın üstünde kalırdı.

## 2. Çözüm

Perde, kapağın **alt kenarından** başlar ve onunla birlikte kayar. Kenarın ekrandaki yerini kapak bilir
(kendi yüksekliği + kaydırma); sahne bilmez. İkisi kompozisyonda kardeştir (`renderHero`,
`renderBackdrop`), prop geçemez; değer `HaritaKok`'un bağlamındaki bir MotionValue'dur.

- Yazan: `HaritaKapak` — her kaydırmada `kapakAlti = kapakAltKenari − scrollY`.
- Okuyan: `HaritaSahnesi` — perdenin `translateY`'si.
- Kapak yokken (zarf kapalı, kapak henüz çizilmedi) değer `PERDE_DISARIDA` (100000 px): perde
  ekran dışındadır, harita tam görünür.

MotionValue'ya yazmak React yeniden çizimi tetiklemez; kaydırma kompozitörde kalır.
