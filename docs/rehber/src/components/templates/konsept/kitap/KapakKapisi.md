# `konsept/kitap/KapakKapisi.tsx` — kapak kapısı (`renderEnvelope`)

> **Tarih:** 2026-10-17 · güncelleme 2026-10-20 (eğri `ease.inOut`, §11) · dal `design/kitap` ·
> Kaynak: [KITAP-KONSEPTI §4.1, §6, §11](../../../../../tasarim/KITAP-KONSEPTI.md)

---

## 1. Fikir

Zarf modülü açıkken giriş kapısı kitabın kapağıdır: tam ekran `BezKapak`. Dokununca kapak sol
menteşeden izleyiciye doğru açılır (`rotateY` 0 → −160°) ve altından ilk sayfa (hero) görünür.
Zarf modülü kapalıysa kompozisyon bu bileşeni hiç çağırmaz.

Ortak `Envelope` ile aynı sözleşme (`EnvelopeRenderProps`) + `bez`, `etiket`, `altSatir`.

## 2. Zamanlama

| An | Olay |
|---|---|
| 0 ms | `onRevealStart` — hero kapağın altında mount olur, girişine başlar |
| 0–800 ms | Kapak açılır (`ease.inOut`, `utils/motion.ts`); kapağın sayfaya düşürdüğü gölge (siyah %25) aynı eğriyle söner |
| 800 ms | `onOpened` — kapı kalkar |

**Ölçüldü** (2026-10-20, headless Chrome; her karede kapağın `rotateY` açısı ve ekranda kalan
genişliği, `MutationObserver` ile kapının DOM'dan kalkması):

| | `ease.out` (önce) | `ease.inOut` (şimdi) |
|---|---|---|
| Kapak 90°'yi geçer | ~130 ms | 427–433 ms |
| Kapağın ekranda kalan genişliği ≥ %60 | ~75 ms'ye kadar | ~365 ms'ye kadar |
| Dokunuş → kapı kalkar | 855 ms | 360 px 830–832 ms, 1280 px 835–845 ms |
| "Hareketi azalt" | 37–38 ms | 75 ms (dönmez, kapı anında kalkar) |

Kapak artık açılışın ilk yarısı boyunca görünür: önce yavaşça kalkar, 90°'yi süre ortasında geçer,
sonra yan kâğıdı yavaşça iner.

- Kap saydamdır; yalnızca kapak opaktır. Kapak dönerken altındaki sayfa görünür.
- Perspektif `max(1400px, 250cqi)`: kapak izleyiciye döndüğü için perspektif kap genişliğine bağlı;
  geniş ekranda kapak 90° civarında aşırı büyümez.
- İç yüz `YAN_KAGIDI` (`backface-visibility: hidden` + `rotateY(180deg)`).
- `onOpened` bir kez çağrılır (`bitti` ref'i): animasyon sonu ve azaltılmış yol çakışmaz.

## 3. Erişim

- Kapağın her yeri dokunmaya açılır; ayrıca gerçek bir `<button>` "Kapağı açın" (44 px yüksek,
  yaldız odak halkası). İlk Tab bu düğmeye gelir, Enter kapıyı kaldırır (denendi, 360 px).
- Kapıdaki adlar `p`'dir; açılınca hero'nun `h1`'i gelir.

## 4. Sınırlar

- Kapak yüzü ölçekli bir giriş taşımaz; kapı açılırken hero altta 0.5 s'de belirir, kapak 90°'yi
  geçene kadar (~430 ms) çoğu kapağın arkasında kalır.
