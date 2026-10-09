# `src/components/templates/sunnet/parts/SehzadeHero.tsx` — Şehzade hero'su

> **Kullananlar:** `SunnetKlasik`, `SunnetModern`, `SunnetYildiz`, `SunnetLunapark`, `SunnetAurora`, `SunnetKrom`
> **Denetim:** sünnet duman testi (a/b/c/d), kontrast betiği (hero çiftleri), statik önizleme (360/768/1280)

---

## 1. Neden yeni bir hero

Bu altı şablon ortak `Summary`'yi kullanıyordu: dokuz kategoride aynı
"Magic UI" düzeni, yalnızca renk farkı. Sünnetin iki ayırt edici bilgisi
— şehzadenin adı ve ailesi — o düzende eşit boyda yan yana diziliyordu.

Bir ortak hero'yu kopyalamak yasak; bu, kıyafetten okunan yeni bir düzen:

```
   sorguç           ← yukarıdan yaylanarak oturur
 ◄ KUŞAK: başlık ►  ← ortadan açılır
   Emir Kerem       ← Playfair italik, iri; maskeden yaylı yükselir
 — YILMAZ AİLESİ —  ← küçük büyük harf, vurgu rengi
   mesaj
   ───
   CUMARTESİ
   6 Şubat 2027
   19:00
   ⌖ mekân
 ⌒ ⌒ ⌒ ⌒            ← kandil pencereli sayaç
```

## 2. Summary ile sözleşme eşliği

| Alan | Boşsa |
|---|---|
| `names` | "Davetlisiniz" |
| `title` | Kuşak hiç çizilmez |
| `subtitle` | Paragraf çizilmez |
| tarih / mekân | Künye yalnızca dolu olanla; ikisi de boşsa hiç |
| `showTimer` | false ya da geçersiz tarih → sayaç yok |

## 3. Parametreler

| Prop | Ne zaman |
|---|---|
| `sash` | Her zaman — kuşak renkleri |
| `ornament` | Sorguç vurgu renginden farklı olacaksa (Klasik: sax, Modern: turkuaz) |
| `halo` | Zemin hareketli/parlaksa (Yıldız videosu, Lunapark, Aurora, Krom): metnin arkasına radyal hale + başlıklara gölge |
| `canopy` | Arka planda saçak asılıysa: blok `pt-28` ile altından başlar |

🔴 `bg-clip-text` başlıkta (Krom) metin gölgesi verilmez: gölge degradenin
**üstüne** boyanıp adı karartıyordu (statik önizlemede görüldü). Radyal hale kalır.

## 4. Hareket

| Öğe | Hareket | Hareketi azalt |
|---|---|---|
| Sorguç | y −28 + rotate −10 → 0 (yay) | MotionConfig atlar |
| Kuşak | scaleX 0 → 1 | MotionConfig atlar |
| Ad | maske içinde y 115% → 0 (yay) | MotionConfig atlar |
| Diğerleri | opaklık + y 10–12 px | y atlanır, opaklık kalır |
| Kaydırma ipucu | `animate-bob-down-6` | index.css durdurur |
