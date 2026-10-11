# `src/index.css` — `halo-breathe` göreli oldu

> **Kullananlar:** yalnızca `shared/effects/atmosphere.tsx` → `Halo`
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## Değişiklik

| | Önce | Sonra |
|---|---|---|
| `0%, 100%` | `opacity: 0.4; scale(1)` | `opacity: 0.55; scale(1)` |
| `50%` | `opacity: 0.75; scale(1.08)` | `opacity: 1; scale(1.08)` |

Önce bu değerler hale'nin **mutlak** parlaklığıydı ve şablonun verdiği `opacity`'yi
eziyordu. Şimdi animasyon iç katmanda çalışır; mutlak parlaklık dış kaptaki `opacity`'dir.
Ayrıntı: `components/templates/shared/effects/atmosphere.md`.

`[data-atmosphere]` için "hareketi azalt" kuralı (`animation: none`) aynen geçerli: hale
o durumda tepe parlaklığında durağan kalır.
