# `shared/heroes/PaperHero.tsx` — `paper` rengi · uzun kelime

> **Kullananlar:** 9 kategorinin `*Kagit` şablonu
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## 1. `paper` prop'u

Kartın kendisi (`DeckleEdge`) sabit renkteydi: koyu temada `#16130f`, açıkta sıcak fildişi
`#fdfaf3`. Düğünün inci-lila zemininde fildişi kart iki tonu çatıştırıyordu.

`paper?: string` verilirse kart o renktedir; verilmezse eski varsayılan geçerli.

## 2. Başlık taşması

İsim başlığına `[overflow-wrap:anywhere]` eklendi: uzun tek kelime 360 px'te kartın
dışına taşmaz (gerekçe `NoirHero.md`'de).
