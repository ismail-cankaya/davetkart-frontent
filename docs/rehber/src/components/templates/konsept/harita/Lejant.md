# `konsept/harita/Lejant.tsx` — lejant, yol tarifi, dipnot

> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. `Lejant`

Satırlar [`lejantKur`](veri.md)'dan gelir. Başlık "LEJANT"; sağında süs noktaları ya da (sığmayan
adım varsa) "+1 durak programda".

| Satır | Sol sütun (26 px) | Metin |
|---|---|---|
| Durak | Rozet: beyaz daire, rota kontur, [simge](simgeler.md) ya da sıra no | saat (tabular) + başlık |
| Tarih (program yoksa) | takvim simgesi | "Pazar, 14 Şubat 2027 · 19:00" |
| Mekân | küçük [iğne](Igne.md) | `venue`, satır kırılır |

Altında **Varışa** — geri sayım haritanın diliyle: "119 gün 20 saat 29 dakika". Saniye yok (her
saniye değişen rakam "bir kez oynar" dilini bozar). `showTimer` kapalı ya da tarih yoksa çizilmez.
Kendi bileşenidir: sayaç saniyede bir yenilense de kapak yeniden çizilmez.

Hiç satır yoksa kutu çizilmez; `mapUrl` varsa yalnızca düğme kalır.

## 2. `YolTarifi`

`<a target="_blank" rel="noopener noreferrer">`, en az 44 px yükseklik (ölçüldü: 248 × 44 px, 360
genişlikte), rota zemin / beyaz yazı 6.69, klavye odağında mürekkep çerçeve. Ekran okuyucuya
" (yeni sekmede açılır)" eklenir.

## 3. `Dipnot`

Lejantın altındaki not: **TEMSİLÎ HARİTA** (zorunlu, rehber §4.1) ve isteğe bağlı ölçek çubuğu +
"1 cm = bir ömür". Beyaz zemin, gri yazı 7.00.

## Doğum günü eki (2026-10-23)

`Rozet` ve `Varisa` dışa açıldı: [`IzKapak`](IzKapak.md)'ın durak kutuları ve varış kartı lejantla aynı
parçaları kullanır.
