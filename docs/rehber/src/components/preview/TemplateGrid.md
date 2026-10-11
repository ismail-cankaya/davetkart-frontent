# `src/components/preview/TemplateGrid.tsx` — vitrin kartı kategorinin görünümüyle

> **Kullananlar:** `PreviewSection` (ana sayfa)
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

Vitrin slotları (`FEATURED_TEMPLATES`) bir preset'i bir kategoriye sabitler
(ör. `manzara` → kına). Kart önce `TEMPLATE_PRESETS.find(...)` ile çıplak preset'ten
okunuyordu; ortak preset'in kına'daki görünümü (`categoryOverrides`) atlanırdı.

Artık `getPresetForCategory(slot.presetId, slot.categoryId)` kullanılır. Mekanizma:
`src/data.md` §10.
