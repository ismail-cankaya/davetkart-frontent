# `src/components/templates/sunnet/parts/KusakHero.tsx` — Kuşak hero'su

> **Kullananlar:** `SunnetMasallah`
> **Denetim:** sünnet duman testi, kontrast betiği (nakış ≥ 3:1), statik önizleme 360/1280

---

## 1. Ne

Kompozisyonun omurgası kadrajı boydan boya kesen, −3° eğik kırmızı saten
kuşaktır; üstünde sırmayla işlenmiş **"Maşallah"** ve iki yanında sekiz
köşeli yıldız. Şehzadenin adı kuşağın **üstünde** (kuşağı takan o), aile
adı **altında**.

`SehzadeHero`'da kuşak küçük bir etiket; burada sahnenin kendisi. Aynı
aygıtın iki ölçeği — iki ayrı düzen.

## 2. Teknik notlar

- Eğim dış sarmalayıcıda (`-rotate-3`, Tailwind v4'te `rotate` özelliği),
  açılış içteki `motion.div`'de (`scaleX`, soldan). İkisi aynı elemanda
  olsaydı Motion'ın `transform`'u eğimi ezebilirdi.
- Kuşak `-left-[8%] -right-[8%]` taşar; eğik uçlar kadraj dışında biter.
- Nakış süstür: kuşağın tamamı `aria-hidden`. Ekran okuyucu "Maşallah"
  duymaz; ad, aile, tarih okunur.

## 3. Kontrast

Nakış `#f7d27a`, ≥ 32 px italik → büyük metin eşiği 3:1. Kuşak degradesinin
dört durağında en düşük 3.95:1 (`#c3263c`).

## 4. Hareket

Kuşak 0.75 s'de soldan açılır (1.15 s), nakış 1.5 s'de belirir, saten
parıltı 7 s'de bir geçer. Hareketi azalt: açılış atlanır, parıltı durur
(`sunnet-sheen`), opaklık geçişleri kalır.
