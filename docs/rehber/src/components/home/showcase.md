# `src/components/home/showcase/` · `src/components/ui/PhoneFrame.tsx`

> **Faz:** 23 (v1.4) · **Plan:** davetkart-docs `phases/faz-23/FAZ-23-PLAN.md` (yön A, "Üçlü Sahne") · **Karar:** henüz yok

## Neden

Ana sayfada hero'dan sonra doğrudan şablon kartları ve kapalı zarfla açılan simülatör geliyordu; ziyaretçi bir davetiyenin
**içini** görmek için tıklamak zorundaydı. Vitrin sahnesi hero ile önizleme arasına girer: ortada ana davetiye, kaydırdıkça
yanlarda iki telefon açılır ve ekranlardaki davetiyeler telefonun içinde kayar. Hiçbir şeye tıklamadan üç açılmış davetiye
görünür.

## Dosyalar

| Dosya | İş |
|---|---|
| `ShowcaseSection.tsx` | Kap: sahne yüksekliği (kaydırma yolu), `useScroll`, mod ve yön değişince sahneyi yeniden bağlar (`key`) |
| `ShowcasePhone.tsx` | Tek telefon: `PhoneFrame` + ekran içinde kayan görsel; bir `<button>` |
| `showcasePose.ts` | Saf koreografi: ilerleme (0–1) → `transform`/`opacity` dizeleri |
| `useShowcaseMotion.ts` | İlerlemeyi `MotionValue`'lara çevirir; React her karede yeniden çizmez |
| `showcaseLayout.ts` | Cihaz modu (`useShowcaseMode`), sahne yükseklik sınıfı, bölüm kimliği; `HomePage`, `Hero`, `useLenis` statik içe aktarır (küçük, React dışında bağımlılık yok) |
| `showcaseSlides.ts` | Hangi şablon hangi telefonda; görsel ölçüsü ve yolu |
| `useShowcaseSelect.ts` | Telefona basınca: kategori + şablon seçilir (TemplateGrid ile aynı sıra), önizlemeye kayılır |
| `ui/PhoneFrame.tsx` | Oranlı telefon çerçevesi; ekran `container-type: size` (`cqh` birimleri için) |

## 1. Cihaz modları

| Mod | Koşul | Sahne yüksekliği | Davranış |
|---|---|---|---|
| `phone` | < 640 px | `170svh` | Sabitlenir; yan telefonlar ekran kenarından taşar (açılma 0,74 × genişlik, 10°) |
| `tablet` | 640–1023 px | `200svh` | Sabitlenir; üçü de görünür (0,98 ×, 14°) |
| `desktop` | ≥ 1024 px | `220svh` | Sabitlenir; tam koreografi (1,1 ×, 16°) |
| `static` | hareketi azalt **ya da** yükseklik < 560 px (yatay telefon) | `auto` | Sabitleme yok; telefonlar açık, metin ve bağlantı görünür, ekran içi kaydırma yok |

Telefon genişliği `--w: min(300px, 62vw, (100svh − 330px) × 9/19)`: telefon, başlık + alt metin + bağlantıyla birlikte tek
ekrana sığar. Yükseklik sınıfı (`SHOWCASE_HEIGHT_CLASS`) yer tutucuda da kullanılır: tembel parça inince CLS olmaz.

## 2. Hero snap ve bağlantılar

- `useLenis` snap hedefi artık `vitrin-sahnesi` (eskiden `animasyon-ve-onizleme`). Hero'nun "Keşfet" bağlantısı da oraya gider.
- Bölümde `-scroll-mt-[76px]`: Lenis `HEADER_OFFSET` (−76) ile `scroll-margin-top`'u toplar; negatif pay ikisini sıfırlar ve
  snap tam sahnenin başına (sabitlemenin başladığı yere) iner.
- Sahnenin sonundaki "Tüm tasarımları keşfet" ve telefona basmak önizleme bölümüne (`animasyon-ve-onizleme`) kayar.

## 3. Koreografi (`showcasePose`)

| İlerleme | Ne olur |
|---|---|
| 0–0,5 | Orta telefon %4 aşağıdan yerine oturur |
| 0,12–0,6 | Yan telefonlar arkadan açılır, içe eğilir, %84'e küçülür, biraz aşağıda durur |
| 0,25–1 | Ekran içi kaydırma: görsel en fazla ekran yüksekliğinin %120'si kadar kayar (`cqh`); yanlar biraz geriden |
| 0,62–0,86 | Başlık yukarı çekilip söner |
| 0,8–0,96 | "Tüm tasarımları keşfet" belirir; görünmezken `visibility: hidden` (odak almaz) |

Yalnızca `transform` ve `opacity` yazılır. `rtl` (Arapça): `start` telefonu sağa açılır.

## 4. Görseller

`public/showcase/<preset>.webp`: 540 × 3506, şablonun ilk üç ekranı (390 × 844). Üretim: [`scripts/showcase.md`](../../../scripts/showcase.md).
Orta telefon `loading="eager"`, yanlar `lazy`. Şablon değişirse görsel elle yeniden üretilir (otomatik kapı yok).

## 5. Testler

- `e2e/home-showcase.spec.ts` (Playwright projesi `home`, backend gerekmez): üç genişlikte açılma ve bağlantı, yatay taşma 0,
  hareketi azaltta sabitlenmeme, telefona basınca simülatörün Nişan şablonuna geçmesi.
- 27 Kasım 2026: 5/5 geçti (geliştirme sunucusuna karşı, geçici yapılandırmayla); axe (WCAG 2.1 AA + best-practice) bölümde 0 ihlal.

## Sık hata

- `cqh` desteklemeyen eski tarayıcıda ekran içi kaydırma olmaz; sahnenin geri kalanı çalışır.
- `useTransform` dönüştürücüleri ilk bağlanmadaki `mode`/`rtl`'yi tutar; bu yüzden `ShowcaseStage` `key` ile yeniden bağlanır.
