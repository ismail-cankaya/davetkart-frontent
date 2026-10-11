# `shared/Details.tsx` — harita başlığı ve üst etiket

> **Kullananlar:** `InvitationComposition`
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

| Ne | Önce | Sonra |
|---|---|---|
| Harita başlığı zemini | `slate-900` / `stone-100` sabit | `theme.mapHeader ?? (eski)` |
| Üst etiket | "Ne Zaman & Nerede" sabit | `flavor.eyebrows?.details ?? "Ne Zaman & Nerede"` |

Gerekçe: soğuk açık temalarda (sünnet) sıcak `stone-100` başlık yamalı duruyordu.
Alanlar: `palette.md`, `flavor.md`.
