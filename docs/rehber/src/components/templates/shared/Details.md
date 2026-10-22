# `shared/Details.tsx` — tarih, mekân, yol tarifi

> **Kullananlar:** `InvitationComposition`
> **Tarih:** 2026-10-11 · dal `design/ortak` · Güncelleme: 2026-10-22 · dal `design/konsept-ortak` (K10)

---

## 1. Harita başlığı ve üst etiket (2026-10-11)

| Ne | Önce | Sonra |
|---|---|---|
| Harita başlığı zemini | `slate-900` / `stone-100` sabit | `theme.mapHeader ?? (eski)` |
| Üst etiket | "Ne Zaman & Nerede" sabit | `flavor.eyebrows?.details ?? "Ne Zaman & Nerede"` |

Gerekçe: soğuk açık temalarda (sünnet) sıcak `stone-100` başlık yamalı duruyordu.
Alanlar: `palette.md`, `flavor.md`. Başlık bloğu artık ortak [`SectionHeading`](SectionHeading.md)'tir.

## 2. Harita başlığını kapatma — `theme.hideMapHeader` (K10)

`true` verilince kartın üstündeki soyut harita şeridi (yollar + yaylanan pin) hiç çizilmez; kart
doğrudan Tarih / Mekân satırlarıyla başlar.

| Konsept | Neden |
|---|---|
| Hikâye Kitabı | Rehberin "harita yok" kuralı |
| Günün Haritası | Davetiye zaten resimli bir harita; ikinci, soyut bir harita çelişiyordu |

Vermeyen şablonda başlık aynen çizilir.

## 3. "Yol Tarifi Al" dokunma hedefi (K10)

Görünen düğme aynı (40 px); `relative before:absolute before:inset-x-0 before:-inset-y-1` sözde
öğesi tıklama alanını büyütür (kenarlığın içinden ölçülür; 2 px kenarlıklı temada da 44). Ölçülen (elementFromPoint taraması): 40 → 48.
