# `konsept/kitap/useSikiBlok.ts` — sola yaslı bloğu ortalamak

> **Tarih:** 2026-10-20 · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §3.2, §4.1, §11](../../../../../tasarim/KITAP-KONSEPTI.md)

---

## 1. Sorun

Kitap sayfaları ortalıdır (simetri), alt metin ise sola yaslıdır (`text-wrap: pretty`; iki yana
yaslama kelime aralarını açtı). CSS kaydırılmış metni en uzun satırına göre sarmaz: `w-fit` kutusu
satırlar kırılınca `max-width`'te kalır, sağda boşluk birikir ve blok ortalı başlıkların altında
sola kayar. Örnek: `BolumAcilisi`, 1280 px, iki satırlık alt metin — metin 420–771 px, sayfa ortası
640, blok 45 px sola kayık.

## 2. Çözüm

`useSikiBlok(ref, metin)`: çizimden önce (`useLayoutEffect`) paragrafın satır kutularını
(`Range.getClientRects`) okur, en sağdaki satırın genişliğini paragrafa `width` olarak yazar. Kutu
ortalı kapta olduğu için blok gerçekten ortaya oturur; satır kırılımları değişmez (her satır yeni
genişliğe zaten sığıyor).

| Ne zaman yeniden ölçer | Neden |
|---|---|
| `metin` değişince | Editörde yazılırken |
| Kabın **genişliği** değişince (`ResizeObserver`) | Cihaz değişimi, telefon dönmesi. Yükseklik izlenmez: ölçüm yüksekliği değiştirebilir, döngü kurardı |
| Bir font yüklenince (`document.fonts` `loadingdone`) | `display=swap`: Caslon gelince satır uzunlukları değişir |

Giriş hareketi ölçek taşıyabilir (`kapakBelirir`: 0.98 → 1); ekran ölçümü `offsetWidth` oranıyla
CSS pikseline çevrilir — yoksa kutu %2 dar kalır ve en uzun satır kırılırdı.

Sunucu çiziminde ve ölçümden önce kutu `w-fit` + `max-width` ile kalır (eski görünüm).

## 3. Kullananlar

`BolumAcilisi` (alt metin, başharfli) ve `IcKapak` (italik alt metin).
