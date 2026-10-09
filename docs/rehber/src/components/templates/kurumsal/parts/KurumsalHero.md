# `kurumsal/parts/KurumsalHero.tsx` — Künye hero'su

> **Kullananlar:** `KurumsalNetwork`, `KurumsalCam` (`align="start"`),
> `KurumsalZirve`, `KurumsalAurora` (`align="center"`)
> **Denetim:** duman testi (4 senaryo) + yoklama: başlık metni, kurum rayı,
> künye satırları, uzun ve tek ad kademeleri

---

## 1. Neden ayrı bir hero?

Bu dört şablon varsayılan `Summary`'yi kullanıyordu. `Summary` isim alanını bir
çiftin adı gibi basar: kelime kelime belirir, `&` italik vurgu olur. Kurumsal
sihirbaz ise aynı alanı **"Kurum / Marka" & "Etkinlik Adı"** olarak toplar
(`data.ts` → `nameLabels`). Ekranda "Nova Teknoloji & Gelecek Zirvesi 2026"
romantik bir ikili gibi duruyordu. Bu bir düzen sorunudur, renkle çözülemez.

## 2. Ad ayrımı

`splitNames(invitation.names)` (`utils/names`) adı ayraçtan ikiye böler.
`TemplateRenderer` adı önceden `displayNames` ile temizlemiştir.

| `names` | Üst ray | Başlık |
|---|---|---|
| `Nova Teknoloji & Gelecek Zirvesi 2026` | `NOVA TEKNOLOJİ` · `Etkinlik Daveti` | `Gelecek Zirvesi 2026` |
| `Yıllık Gala` (tek alan) | `Etkinlik Daveti` | `Yıllık Gala` |
| boş | `Etkinlik Daveti` | `Davetlisiniz` |

Kurum adı `&` içeriyorsa (ör. "Kaya & Ortakları & Yıl Sonu Galası") ilk ayraçtan
bölünür. Bu, saklama biçiminin kendisinden gelir; sihirbaz da aynı şekilde
böler.

## 3. Bilgi düzeni

| Öğe | Kaynak | Boşsa |
|---|---|---|
| Üst ray | Ornament + kurum ya da `flavor.envelopeLabel` | Etiket gösterilir |
| Göz başlığı | `invitation.title` | `flavor.tagline` ("Birlikte Daha İleriye") |
| Başlık | etkinlik adı | "Davetlisiniz" |
| Alt metin | `invitation.subtitle` (sola yaslıda kobalt çubukla) | Çizilmez |
| Künye: Tarih / Saat / Mekân | `formatDateStr` çıktısı gün ve saate bölünür; `venue` | Girilmeyen satır çizilmez; hiçbiri yoksa blok yok |
| Kalan Süre | `useCountdown(date, timezone)` | `showTimer` kapalıysa ya da tarih geçersizse çizilmez |
| Yıl filigranı | tarihten okunan yıl (yalnızca sola yaslı düzen) | Çizilmez |

🔴 Tarih `new Date(invitation.date)` ile **ayrıştırılmaz**. `formatDateStr`
(`templates/utils.ts`) çıktısı `"14 Kasım 2026 19:00"` metin olarak bölünür.
Saat ayrışmazsa metnin tamamı "Tarih" satırına gider. Geri sayım saat dilimini
`useCountdown` içinden alır.

## 4. Uzun ada dayanıklılık

Başlık ölçüsü karakter sayısına göre seçilir. `cqw`, kökün `@container`
genişliğidir; telefon simülatöründe de doğru ölçeklenir.

| Karakter | Sınıf | 360 px'te |
|---|---|---|
| ≤ 14 | `text-[clamp(2.6rem,13cqw,5.5rem)]` | ~47 px |
| ≤ 26 | `text-[clamp(2.15rem,9.5cqw,4.25rem)]` | ~34 px |
| ≤ 42 | `text-[clamp(1.8rem,7.4cqw,3.25rem)]` | ~29 px |
| > 42 | `text-[clamp(1.5rem,5.8cqw,2.6rem)]` | 24 px |

Ek güvenceler: `break-words` (tek uzun kelime taşmaz), `text-balance` (satırlar
dengeli kırılır), kurum rayı `truncate` yerine kırılarak sarar (bilgi
kaybolmaz). Duman testinin (d) senaryosu 48 karakterlik kurum ve 61 karakterlik
etkinlik adıyla çizer.

## 5. Hareket

| Öğe | Hareket | Hareketi azalt |
|---|---|---|
| Ray çizgisi, künye çizgileri | `scaleX` 0 → 1 | `MotionConfig` (transform) |
| Başlık | maske içinde `y: 110% → 0` | `MotionConfig` |
| Göz başlığı, alt metin, künye | opaklık + kısa ofset | Ofset susar, solma kalır |
| Kaydırma işareti | 1.6 s sonsuz döngü | `useReducedMotion()` → durağan |

Eğri `KURUMSAL_EASE`; süreler 0.6–0.95 s.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Dört sayaç sütunu `pl-3` ile sıkışık; gün değeri 3 hane olduğunda (≥ 100) rakamlar `clamp(1.45rem,…)` alt sınırında |
| 768 px | ≤ 14 karakterli başlık 88 px tavanda iki satıra inebilir; yıl filigranı başlığın arkasına biner (konturlu, %10) |
| 1280 px | Sola yaslı düzende içerik `max-w-3xl` ile ortalanır; sahne ağırlığı sağda kalır |
