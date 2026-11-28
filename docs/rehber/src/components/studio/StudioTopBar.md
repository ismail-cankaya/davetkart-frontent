# `src/components/studio/StudioTopBar.tsx`

Faz 28. Geri (oturumluysa panel, değilse ana sayfa), davetiyenin adı, kayıt durumu (bulut / yerel taslak / taslak
katmanı rozeti), "Hazır n/m" ve taşma çipi (Kontrol sekmesini açar), geri al/yinele (`useEditorStore` geçmişi), Misafir
gözüyle, Vazgeç (yalnızca yayında ve taslak varken), Yayınla / Değişiklikleri yayınla.

## Yayınlarken odak (Faz 29.5)

Yayınla düğmesi istek sürerken `disabled` olmaz, `aria-busy` olur: `disabled` düğme odağı bırakıyordu ve paywall
kapanınca odak geri dönecek yer kalmıyordu (B-H3, e2e `paywall-after-publish`). Çift tıklamayı `usePublishFlow`'un
`busy` bayrağı engeller. Taslağı olmayan yayındaki davetiyede düğme yine `disabled`.
