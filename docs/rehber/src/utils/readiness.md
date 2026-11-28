# `src/utils/readiness.ts`

Faz 28 (K325). Yayına hazır mı: isimler, tarih seçildi, tarih ileride (gün bazında, duvar saati), mekân, LCV açıksa son
gün. Uyarıdır; yayını engellemez. Maddenin `target`'ı Kontrol sekmesinde "Düzelt"in açacağı yeri söyler (alan → Bilgiler,
LCV → bölüm ayarı). Taşan metin sayısı ayrı (`DeviceCanvas onOverflowChange`): taşmayı gizleyen (`overflow: hidden/clip`,
`text-overflow: ellipsis`, satır sınırı) ve içeriği kutusundan büyük öğe kırmızı çerçeveyle işaretlenir.
