# `src/components/quick/QuickPreview.tsx`

Faz 29.1 (K318, K324). Paneldeki "Önizleme": `/dashboard/preview/:id`, panelin üstünde tam ekran katman (rota `/dashboard/*`;
ayrı rota nesnesi ilk yükleme paketini büyütürdü, K237).

- Solda temel bilgiler (isimler, üst başlık, tarih, mekân, davet mesajı), sağda telefon önizlemesi (`DeviceCanvas`,
  editörsüz, zarf kapalı). Telefonda önizleme tam ekran, form "Bilgileri düzenle" ile alttan panelde.
- Kendi yerel durumu: editör store'larına dokunmaz, otomatik kaydetme yok. "Kaydet" (yayındaysa "Kaydet ve yayınla")
  `services/quickEdit.ts` ile **yalnızca değişen alanları** `PUT /invitations/{id}` gönderir: tam gövde, stüdyonun
  yayınlanmamış taslağındaki bütün alanları düşürürdü (K324). Paket istemez (K305).
- Yayındaysa "misafirlere hemen yansır", taslak varsa "buradaki alanlar onların yerine geçer" notu.
- Kaydedilmemiş değişiklikle kapatmada onay; Esc kapatır (onay penceresi açıkken değil).
- Ölçüm (yerel backend): yayındaki davetiyede mekân değişikliği `{"invitation":{"venue":"Moda Sahili"}}` gönderdi, 200,
  misafir ucu yeni mekânı gösterdi.
