# `konsept/kitap/SayfayiCevirin.tsx` — kaydırma ipucu

> **Tarih:** 2026-10-22 · dal `design/kitap`

---

Zarfsız bez cilt preset'lerinde hero iki sayfadır: kapak ve altından ilk sayfa. Kapağın en altında
yaldız "Sayfayı çevirin" ve ince bir aşağı ok, kapağın altında devam olduğunu söyler.

- 11 px aralıklı büyük harf, yaldız (bez üstünde en kötü 5.35 şişe / 6.05 mürdüm, ölçüldü).
- Ok süstür (`aria-hidden`); kıpırdamaz (hareket dili "bir kez oynar").
- Düğme değildir: kaydırma zaten çalışır; dokunma hedefi gerekmez.

Önce `DugunKitapBirinciBolum`'un içindeydi; nişanın `NisanKitapOnsoz`'u da kullanınca kite taşındı
(çizim aynı).
