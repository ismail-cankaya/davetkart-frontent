# `src/components/templates/dugun/parts/Hale.tsx` — Dıştan kısılan hale

> **Kullananlar:** koyu düğün şablonları (Modern, Onyx, Aurora, Krom, Noir, Vitray, Plak, Pano, Yıldız Haritası, Film)
> **Denetim:** kontrast betiği (hale tepe anı hesaba katılır)

---

## 1. Sorun

Ortak `Halo` (`shared/effects/atmosphere.tsx`) opaklığını öğenin satır içi stiline
yazar, ama aynı öğe `halo-breathe` animasyonuyla opaklığı 0.4–0.75 arasında canlandırır.
CSS animasyonu satır içi stili ezer. Hangi `opacity` verilirse verilsin hale merkezde
0.85 × 0.75 ≈ **%64** yoğunlukta parlar.

Koyu temada açık renk bir hale açık renk metnin arkasını aydınlatır. Örnek: Noir
zemininde inci hale %64'te → zemin `#8f8a96` civarına çıkar, gövde metni ~1.1:1 kalırdı.

## 2. Çözüm (kategori içinde)

`Hale`, `Halo`'yu `opacity / 0.75` opaklıklı bir kaba koyar. Nefes animasyonu yine
çalışır; tepe değeri istenen `opacity` olur (merkezde `0.85 × opacity`).

| | Hale tepe yoğunluğu (merkez) |
|---|---|
| `Halo opacity={0.2}` | ~%64 |
| `Hale opacity={0.2}` | %17 |

"Hareketi azalt" açıkken animasyon durur; satır içi 0.75 ile kap çarpılır, sonuç yine
`0.85 × opacity`.

## 3. Ortak düzeltme önerisi

Kalıcı çözüm `Halo`'nun kendisinde: opaklığı (GodRays gibi) dıştaki kaba taşımak.
Uygulanmazsa diğer kategorilerin koyu şablonlarındaki haleler de ~%64'te kalır.
Öneri raporda.
