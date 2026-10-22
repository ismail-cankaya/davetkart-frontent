# `shared/Gallery.tsx` — galeri

> **Kullananlar:** `InvitationComposition`
> **Tarih:** 2026-10-11 · dal `design/ortak` · Güncelleme: 2026-10-22 · dal `design/konsept-ortak` (K10)

---

## 1. Üst etiket (2026-10-11)

Başlığın üstündeki küçük etiket `flavor.eyebrows?.gallery ?? "Özel Anlarımız"`. Kategori vermezse
metin aynıdır. Alanların tamamı ve gerekçesi: `flavor.md`. Başlık bloğu artık ortak
[`SectionHeading`](SectionHeading.md)'tir; kart girişi temadan yalnızca süreyi alır (kart kaymaz,
ölçeklenir).

## 2. Sayaç kontrastı (K10)

"1 / 3" sayacı fotoğrafın üstünde, yalnızca alttaki karartma degradesine (`from-black/45`) güvenen
`text-white/85` idi; açık fotoğrafta AA'nın altına düşüyordu. Artık düz koyu bir çipin içinde:
`rounded-full bg-black/70 px-2 py-0.5 text-white`.

| | En kötü kontrast (360 px, en açık örnek fotoğraf) |
|---|---|
| Önce | **2.49** (1280 px'te 4.37) |
| Sonra | **6.45** (1280 px'te 5.29; en kötü pikseller çipin yuvarlak köşesindeki fotoğraftır, yazının arkası değil) |

Hesap (fotoğraftan bağımsız alt sınır): bembeyaz fotoğrafta `black/70` çipin zemini `#4D4D4D`'dir,
beyaz yazıyla **8.4**.

## 3. Dokunma hedefleri ≥ 44 px (K10)

| Hedef | Görünen | Tıklama alanı önce → sonra | Nasıl |
|---|---|---|---|
| Önceki / sonraki ok | 36 px daire (aynı) | 36 → 44 × 44 | Düğme 44 px şeffaf kap, daire içteki `span`; kap `left-2`/`right-2` olduğu için daire yerinde kalır. Üzerine gelme `group-hover` ile |
| Nokta | 6 px (etkin 24 px) — aynı | 6 → 44 × 44 (bitişik iki noktanın sınırında tarama 43.5 buluyor) | Her nokta 44 × 44 düğme, görünen nokta içteki `span` |

Noktalar arası adım 44 px'e çıktı (önce 8 px boşluk): bilinçli görünüm farkı, tıklama alanları
çakışmasın diye. Dikey yer ve bölüm yüksekliği aynı: üst boşluk `mt-5` → `mt-px`, alttaki fazlalık
`-mb-[19px]` ile geri alındı (önce/sonra görüntülerinde nokta satırının altı kaymıyor).
