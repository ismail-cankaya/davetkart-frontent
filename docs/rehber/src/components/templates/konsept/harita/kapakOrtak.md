# `konsept/harita/kapakOrtak.ts` — harita kapaklarının ortak zamanlaması

> **Tarih:** 2026-10-23 · dal `design/harita` · Kullananlar: [HaritaKapak](HaritaKapak.md), [IzKapak](IzKapak.md)

---

İkinci kapak gelince `HaritaKapak`'ın içindeki üç etki buraya taşındı; davranış aynı (düğün ve nişan
preset'leri değişmedi).

| Dışa açılan | Ne |
|---|---|
| `useOlcumEtkisi` | Tarayıcıda `useLayoutEffect`, sunucuda `useEffect` |
| `simdi()` | `performance.now()` (sunucuda 0) |
| `useGirisPenceresi()` | `HARITA_SURE.ust` (1.0 s) dolunca `true`: sonra doğan öğe oynamaz |
| `useKatmanFontu()` | `{ hazir, kayma }` — fontlar gelince ya da `fontBekleme` (6 s) dolunca hazır; `kayma` kapaktan kaç saniye sonra |
| `useKapakAltiBildirimi(kokRef, scrollContainer, boy)` | Kapağın alt kenarının ekrandaki yerini [bağlama](baglam.md) yazar; perde oradan başlar |
