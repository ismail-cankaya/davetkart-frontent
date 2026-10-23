# `konsept/kitap/useEkranBoyu.ts` — kaydırma kabının yüksekliği

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

Zarfsız "Birinci Bölüm"de hero iki sayfadır: bez kapak ve altından ilk sayfa. Kapak tam bir ekran
boyu olmalıdır, ama:

- Hero kabı `min-height: 100%` ile büyür; içindeki `%` yükseklik çözülmez.
- `vh` / `svh` pencereyi ölçer; editörün telefon çerçevesinde yanlış olur.
- Kompozisyon kökü yalnızca genişlik kabıdır (`@container`): `cqh` yok.

Kanca `HeroRenderProps.scrollContainer`'ı ölçer (`clientHeight`), `ResizeObserver` ile cihaz
değişince ya da telefon dönünce yeniden okur. `useLayoutEffect`: ölçüm ilk boyamadan önce oturur.
Ölçülmeden önce (sunucu çizimi) `null` döner; çağıran `100svh` yedeğini kullanır.
