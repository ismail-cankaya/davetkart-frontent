# `src/components/studio/StudioSidebar.tsx`

Faz 28 (K319). Sol menü: ikon rayı (`role=tablist`) + seçili sekmenin paneli. Telefonda `StudioMobileBar`: aynı sekmeler
altta, içerik alttan panelde.

| Sekme | İçerik |
|---|---|
| Bilgiler | `StudioInfoFields`: isimler (`CoupleNameFields`), üst başlık, tarih, mekân, davet mesajı; `useInvitationDraft` |
| Bölümler | `AddModuleButton` + `ModuleList` (Faz 25): aç/kapa, ayar |
| Metinler | `TextsPanel` (Faz 25): bütün şablon metinleri, değişenler, toplu sıfırlama |
| Tema | `StudioThemeFields`: kategorinin ilk 6 tasarımı (seçili hep başta), bütün koleksiyon `ThemePickerModal`, onaylı sıfırlama |
| Kontrol | `StudioChecklist`: `utils/readiness.ts` maddeleri + taşan metin sayısı; rozet eksik sayısı |
