# `src/hooks/useInvitationAutoSave`


## 🆕 Faz 19 (19.26 · K192, FE-50) — ilk taslak ne zaman açılır

Kayıt yokken (`recordId === null`) otomatik kaydetme yalnızca **gerçek içerikte** tetiklenir: isimler, tarih ya da mekân
(`utils/draftContent.ts` → `shouldAutoSave`). Kategori ve tema seçimi `editRevision`'ı yine artırır ama tek başına
`POST /invitations` üretmez. Eskiden her göz atma panele adsız bir "Düğün" taslağı bırakıyordu. Kayıt açıldıktan sonra
her düzenleme (tema dahil) kaydedilir. "Davetiyeni Oluştur" açık bir istek: `DetailsFormStep` içerik boş olsa da
`saveInvitation()` çağırır. Test: `verify:state` → `autosaveWaitsForRealContent`. Mutant: kapı her zaman `true` → kırmızı.

## 🆕 Faz 19 ortak düzeltme (A-H2) — sunucu reddettiyse otomatik kaydetme durur

`shouldAutoSave` artık `saveState === 'rejected'` iken `false` döner. `rejected`, sunucunun içeriği reddettiği
durumdur (bugün yalnızca `403 DRAFT_LIMIT_REACHED`, bkz. `stores/useInvitationStore.md` A-H2). Aynı POST aynı 403'ü
üretir; kapı açık kalsaydı her düzenleme 1,5 sn sonra yeni bir 403 atardı. Açık eylemler (yayınla, "Davetiyeni
Oluştur") kapıdan geçmez, `saveInvitation()`'ı doğrudan çağırır: kullanıcı panelden taslak sildiyse başarılı kayıt
reddi kaldırır ve otomatik kaydetme geri gelir. Test: `verify:state` → `draftLimitStopsAutosave`.
