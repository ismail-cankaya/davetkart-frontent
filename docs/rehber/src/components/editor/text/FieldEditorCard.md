# `src/components/editor/text/FieldEditorCard.tsx`

Faz 27.2 (K321). Önizlemede tıklanan kullanıcı alanının yerinde düzenleyicisi; `InlineTextEditor` ile aynı kabuk
(masaüstünde metnin yanında, mobilde alttan panel; konum `popoverPosition.ts`).

| Alan | Giriş | Sınır (backend `InvitationRequest`) |
|---|---|---|
| İsimler | tek satır, ipucu "Ayşe & Ali" | 120 |
| Başlık | tek satır | 120 |
| Alt başlık | çok satır (Ctrl+Enter kaydeder) | 255 |
| Mekân | tek satır | 180 |
| Tarih | `DateTimeInput` (duvar saati) | — |

- "Kaydet" `useEditorStore.saveField` ile yazar: geri alınabilir (geçmiş artık kullanıcı alanlarını da tutar).
- Paket notu yok: kendi içerik her pakette serbest (K305).
- Boş bırakılabilir (şablonun yedek metni görünür); şablon metinlerinden farkı bu (K314).
