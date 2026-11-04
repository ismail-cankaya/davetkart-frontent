# `shared/yedi/` — Yedi Davetiye hero parçaları

> **Faz 15** · Ana rehber: [yedi-davetiye.md](../../yedi-davetiye.md)

| Dışa aktarım | Ne |
|---|---|
| `useHeroData(invitation)` | En çok iki kişi (`splitPeople`), başlık, alt metin, mekân, tarih parçaları (`eventDateParts`); girilmemiş alan `''`. |
| `NO_NAMES` | Ad yokken büyük satır: "Davetlisiniz" (konsept şablonlarıyla aynı söz). |
| `HeroCountdown` | `showTimer` kapalıysa ya da tarih geçersizse **hiç** çizilmez. Çerçeve (zemin, gölge) `className` ile sayaca verilmeli, sarmalayıcıya değil — yoksa tarih yokken boş bir kutu kalır (15.7). |
