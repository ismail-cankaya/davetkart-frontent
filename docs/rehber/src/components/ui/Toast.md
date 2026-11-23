# `src/components/ui/Toast.tsx`

## Ekran okuyucu (FE-54, Faz 19.27, K229)

İki canlı bölge **her zaman** DOM'da (içerik gelmeden önce var olmayan bölgeyi ekran okuyucu duyurmaz):

| Bölge | Öznitelik | İçerik |
|---|---|---|
| `data-toast-region="polite"` | `role="status" aria-live="polite"` | `success`, `info` |
| `data-toast-region="assertive"` | `role="alert" aria-live="assertive"` | `error` (sözü keser) |

Denetim: `verify:render` → *Bildirim bölgeleri*. Mutant (öznitelik silindi) → ✗.
