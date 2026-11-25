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

## B-D10 (26 Kasım 2026): editörden hemen çıkınca son düzenleme kayboluyordu

**Belirti:** bir alana yazıp hemen (taslak penceresi ~400 ms dolmadan) editörden çıkınca — başka sayfaya geçiş ya da
çökme (FE-02: hata sınırı rotayı söker) — son düzenleme backend'e hiç gitmiyordu. e2e `editor-flush.spec.ts` yakaladı.

**Neden:** React söküm temizliklerini **üstten aşağı** çalıştırır. `CreatePage`'deki bu kancanın temizliği (abonelikten
çık + `flush`) önce koşuyordu; formdaki `useInvitationDraft` temizliği bekleyen yazımı store'a SONRA yazıyordu. O anda
dinleyen abonelik kalmadığı için kaydetme tetiklenmiyordu.

**Çözüm:** temizlik aboneliği kapatmayı ve `flush`'ı `queueMicrotask` ile bir mikro görev sonraya bırakır. Aynı söküm
geçişindeki çocuk temizlikleri o mikro görevden önce biter; yazım aboneliğe ulaşır, `debouncedSave()` kurulur ve
mikro görevdeki `flush` onu hemen gönderir. `use-debounce` söküldükten sonra yeni zamanlayıcıyı çalıştırmaz ama
`flush()` bekleyen çağrıyı yine yapar; bu yüzden kayıt kaçmaz.

**Sınama:** `npm run e2e` → `editörden hemen çıkınca son düzenleme kaydedilir` (yazdıktan hemen sonra panele geçiş,
PUT'un gövdesinde yeni mekân, 200).
