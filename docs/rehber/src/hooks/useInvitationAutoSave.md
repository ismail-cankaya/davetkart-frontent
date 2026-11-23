# `src/hooks/useInvitationAutoSave`


## 🆕 Faz 19 (19.26 · K192, FE-50) — ilk taslak ne zaman açılır

Kayıt yokken (`recordId === null`) otomatik kaydetme yalnızca **gerçek içerikte** tetiklenir: isimler, tarih ya da mekân
(`utils/draftContent.ts` → `shouldAutoSave`). Kategori ve tema seçimi `editRevision`'ı yine artırır ama tek başına
`POST /invitations` üretmez. Eskiden her göz atma panele adsız bir "Düğün" taslağı bırakıyordu. Kayıt açıldıktan sonra
her düzenleme (tema dahil) kaydedilir. "Davetiyeni Oluştur" açık bir istek: `DetailsFormStep` içerik boş olsa da
`saveInvitation()` çağırır. Test: `verify:state` → `autosaveWaitsForRealContent`. Mutant: kapı her zaman `true` → kırmızı.
