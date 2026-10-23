# `konsept/harita/Igne.tsx` — toplu iğne

> **Tarih:** 2026-10-17 · dal `design/harita` · Telif: [HARITA-KONSEPTI §9](../../../../../tasarim/HARITA-KONSEPTI.md)

---

Haritaya saplanmış gerçek bir toplu iğne: yuvarlak baş (`rotaAcik`, 1.75 px mürekkep kontur), küçük
düz beyaz parıltı, ince mürekkep iğne, haritaya düşen küçük gölge elipsi (mürekkep %22). Harita
sağlayıcılarının ters damla işaretçisi bilerek taklit edilmedi.

- Izgara 32 × 48. `IGNE_OLCU.uc` (16, 46) haritaya değen nokta; `IGNE_OLCU.bas` (16, 15) başın
  merkezi. Kapak iğneyi ucundan konumlar, mekân etiketini baş hizasına koyar.
- `olcek` prop'u: lejant satırında 0.5, zarf kapağında 0.75–0.9.
- Grafik kontrastı: kontur / su 7.19, / park 7.64, / arazi 11.73.
- Düşüş: y −16 → 0, ölçek 1.2 → 1, 0.35 s, kök alt orta ([hareket](hareket.md)).

## Doğum günü eki (2026-10-23) — `Carpi`

Hazine haritasının X'i (§4.3). 40 × 40, `CARPI_OLCU.merkez` 20: işaretin değdiği nokta. İki kalın rota çizgisi
(6 px), altında 11 px beyaz iz; gölge yok. `olcek` ile küçülür (zarf).
