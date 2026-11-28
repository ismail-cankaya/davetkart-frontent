# `src/stores/useEditorStore.ts`

Faz 25 (K306–K311). Tasarım stüdyosunun oturum durumu: açık yerinde düzenleme (`active`), açık bölüm ayarı
(`section`), şablonun bildirdiği metin kapsamı (`scope`), bu tasarımda çizilen anahtarlar (`seenKeys`) ve geri al /
yinele geçmişi (`history`).

Davetiyenin kendisi `useInvitationStore`'da kalır (tek doğruluk kaynağı; otomatik kayıt orada). Editör eylemleri
(`saveText`, `resetText`, `resetTexts`, `setModule`) o store'un `updateField`'ini çağırır; her eylem önce bir anlık
görüntü (`textOverrides` + altı bölüm bayrağı) geçmişe yazar. Değişiklik yoksa geçmişe bir şey yazılmaz.

- **Geri al / yinele (K311):** oturum içi, en çok 50 adım; sayfa yenilenince ya da başka davetiye açılınca silinir
  (`resetSession`, `documentVersion` değişince `useTextEditorBridge` çağırır).
- **Varsayılan metin:** `scope` (şablonun `InvitationTextScope`'u bildirir) ile `defaultText`'ten çözülür.
- **`seenKeys`:** `InvText` ve `useInvText` editörde anahtarı bildirir; yazımlar bir karede toplanır (çizim sırasında
  set çağrısı yok). Panel "bu tasarımda görünmüyor" der (K309).
