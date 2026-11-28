# Tasarım stüdyosu metin editörü (`src/components/editor/`)

Faz 25 (v2.0). Plan: docs deposu `phases/faz-25/`.

| Bileşen | Ne |
|---|---|
| `text/InlineTextEditor.tsx` | Yerinde düzenleyici: masaüstünde metnin yanında pencere, mobilde alttan panel. Karakter sayacı, sınır/boş/yer tutucu uyarısı, Kaydet (Enter; çok satırlıda Ctrl+Enter), Vazgeç (Esc), "Varsayılan" (onaylı, K308), "Öner" (asistan, K310) |
| `text/TextsPanel.tsx` | "Metinler" paneli: açık bölümlerin bütün metinleri; değişti / bu tasarımda görünmüyor işaretleri; geri al / yinele; "tüm metinleri sıfırla" (onaylı) |
| `sections/EditableSection.tsx` + `SectionChip.tsx` | Önizlemede bölüme tıklayınca ayarları (K307). Çip ayrı parça |
| `sections/ModuleControls.tsx` | ➕ "Bölüm ekle" menüsü ve "Bölümler" listesi; paket rozeti sözleşmeden (`moduleTiers`) |
| `sections/SectionSettingsDrawer.tsx` | Bölüm ayarları çekmecesi; sihirbazın form parçalarını (`create/ModuleFields.tsx`, `TimelineEditor`, `GalleryUploader`) kullanır; "Gizle" veriyi silmez |

Kaydetme her tuşta değil, **Kaydet** ile: yayındaki davetiyede değişiklik misafire anında yansır (S2), yarım yazılmış
metin görünmesin.

Elit (K305): taslakta herkes değiştirir; yayında 402 gelirse paywall'da ikinci yol "özel metinleri sıfırla ve
mevcut paketle yayınla" (`PaywallModal`, `usePublishFlow`, K312). Kendi içerik (isimler, tarih, mekân) her pakette.

Kategori değişince kategoriye özel değiştirilmiş metinler için sorulur (koru / varsayılana dön, K309; `CategoryStep`).

Çeviriler `src/locales/{tr,en}/editor.json`'da (`src/i18nEditor.ts` ekler); ana pakete girmez.

e2e: `e2e/text-editor.spec.ts` (proje `editor`, backend gerekmez).
