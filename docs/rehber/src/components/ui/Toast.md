# `src/components/ui/Toast.tsx`

## Ekran okuyucu (FE-54, Faz 19.27, K229)

İki canlı bölge **her zaman** DOM'da (içerik gelmeden önce var olmayan bölgeyi ekran okuyucu duyurmaz):

| Bölge | Öznitelik | İçerik |
|---|---|---|
| `data-toast-region="polite"` | `role="status" aria-live="polite"` | `success`, `info` |
| `data-toast-region="assertive"` | `role="alert" aria-live="assertive"` | `error` (sözü keser) |

Denetim: `verify:render` → *Bildirim bölgeleri*. Mutant (öznitelik silindi) → ✗.

## Aynı bildirim yığılmaz (Faz 20, `FE-57`)

`withToast(liste, yeni)`: aynı **metin ve ton** ekrandaysa eskisi çıkar, yenisi sona eklenir ve 4,2 sn'lik süre baştan
başlar. Üç kez yanlış parola eskiden üç kartı üst üste açıp giriş kartının altındaki "Kayıt olun" satırını örtüyordu
(`AUD-2026-11-12` `FE-57` B). Farklı metin ya da farklı ton (ör. aynı cümle `info` ve `error`) ayrı kalır. Ekran okuyucu
tekrarı yine duyurur: yeni kart canlı bölgeye yeniden girer.

Denetim: `verify:render` → *Bildirim bölgeleri* son satır. Mutant (`[...list, item]`) → ✗.
