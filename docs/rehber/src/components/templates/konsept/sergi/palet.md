# `konsept/sergi/palet.ts` — duvar, yazı, eser renkleri

> **Tarih:** 2026-10-17 (N1: 2026-10-23) · dal `design/sergi` · Kaynak: [SERGI-KONSEPTI §2](../../../../../tasarim/SERGI-KONSEPTI.md)

---

## 1. Ne yapar

`DUVAR` her preset'te aynı olan renkleri, `ESER_RENKLERI` preset başına seçilen **tek** eser rengini
tutar. `sergiDegiskenleri(eser)` ikisini `--sg-*` CSS değişkenlerine çevirir; `SergiKok` bunları kökün
`style`'ına yazar. Tema dizgileri yalnızca değişken okuduğu için Tailwind sınıfları sabit kalır.

## 2. Değişkenler

| Değişken | Değer | Rol |
|---|---|---|
| `--sg-duvar` | `#F7F7F5` | Sayfa zemini |
| `--sg-duvar-koyu` | `#EDEDEA` | Harita başlığı (duvarın gölgede kalan yüzü) |
| `--sg-murekkep` | `#1C1C1C` | Başlık, adlar, etiketin ilk satırı |
| `--sg-etiket` | `#5E5E5E` | Gövde, etiket satırları |
| `--sg-cerceve` | `#FFFFFF` | Paspartu, kart |
| `--sg-kenar` | `#D6D6D2` | Çerçeve kenarı, kıl çizgi |
| `--sg-kenar-guclu` | `#8A8A86` | Form alanı sınırı |
| `--sg-karanlik` / `--sg-karanlik-etiket` | `#222221` / `#A8A8A3` | Zarf kapısı (ışığı kapalı duvar) |
| `--sg-hata` | `#9F1239` | LCV hata metni ve hatalı alan kenarı (`tema.ts` → `status`); eser rengi değil, durum rengi |
| `--sg-eser` / `--sg-eser-hover` / `--sg-eser-ustu` | Eser rengi, üzerine gelince, üstündeki yazı | Düğme, eser yüzeyi |
| `--sg-vurgu` | Eser rengi; duvarda yazı olamıyorsa mürekkep | Üst etiket, `&`, ikon |
| `--sg-vurgu-zemin` | Aynı kural | Küçük dolgular (seçili durum, harita iğnesi) — üstüne `stone-50` yazılır |
| `--sg-spot` | `rgba(255,252,244,.95)` | Spot merkezi |
| `--sg-cerceve-golge`, `--sg-kart-golge` | Tek yumuşak gölge | Çerçeve, kart |

## 3. Kontrast (formülle hesaplandı; çizilmiş ekran ölçümü pilot raporunda)

| Çift | Oran |
|---|---|
| mürekkep / duvar | 15.89 |
| etiket / duvar · etiket / beyaz · etiket / duvar-koyu | 6.05 · 6.48 · 5.53 |
| kobalt / duvar · beyaz / kobalt · beyaz / kobalt-hover `#223E83` | 7.49 · 8.04 · 10.07 |
| fuşya / duvar · beyaz / fuşya · beyaz / fuşya-hover `#892551` | 6.12 · 6.57 · 8.58 |
| mürekkep / safran · mürekkep / safran-hover `#E6B54D` | 7.77 · 8.99 |
| beyaz / gece · beyaz / gece-hover `#373737` | 17.04 · 11.90 |
| hata / duvar · hata / beyaz · mürekkep / duvar-koyu (başarı) | 7.47 · 8.02 · 14.53 |
| `stone-50` / kobalt (seçili LCV durumu) | 7.70 |
| kenar-güçlü / beyaz · / duvar (WCAG 1.4.11) | 3.47 · 3.23 |
| duvar / karanlık · karanlık-etiket / karanlık · kapı düğme kenarı (beyaz %40) / karanlık | 14.85 · 6.67 · 3.71 |

Safran duvarda yazı olamaz (2.04): `yazi: false` olduğu için vurgu ve küçük dolgular mürekkebe döner.

## 4. Sınırlar

- Hover tonları formülle türetildi (kobalt/fuşya %18 siyah, safran %18 beyaz); rehberin tablosunda yoktu.
- `--sg-duvar-koyu`, `--sg-kenar-guclu`, `--sg-karanlik*` rehbere öneri olarak yazıldı (pilot raporu §7).
