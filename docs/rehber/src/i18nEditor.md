# `src/i18nEditor.ts`

Faz 25. Tasarım stüdyosunun arayüz metinleri `src/locales/{tr,en}/editor.json`'da; bu modül içe aktarılınca
`translation` ad alanına `textEditor` anahtarı altında eklenir. Editör modülleri (stüdyo, panel, paywall'ın sıfırlama
yolu, `usePublishFlow`) içe aktarır; ana paket ve misafir sayfası aktarmaz (ilk yükleme bütçesi 720 kB, K237).

`EditableTextMark` ve `SectionChip` şablon parçasındadır ve `textEditor.*` okur ama bu modülü içe AKTARMAZ: yalnızca
editörde çizilirler ve editör onu zaten yüklemiştir.
