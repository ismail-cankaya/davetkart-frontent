# `src/components/templates/sunnet/parts/KandilCountdown.tsx` — Kandil pencereli sayaç

> **Kullananlar:** `SehzadeHero`, `KusakHero`
> **Denetim:** sünnet duman testi (b: `showTimer: false`; a/d: geçerli tarih)

---

## 1. Ne

Geri sayımın dört karosu kemerli pencere (kandil camı) biçimindedir: üst
kenar `rounded-t-[999px]`. Yarıçap karonun yarı genişliğinde sınırlanır;
karo daraldıkça kemer de daralır, 360 px'te dört karo tek satırda kalır
(312 px içinde ~72 px karo).

İçteki ikinci kemer pencerenin pervazıdır (`theme.border`, %70); tepedeki
nokta kandil kancası (`theme.accentBg`).

## 2. Kurallar

- Zaman `shared/useCountdown`'dan okunur (duvar saati + `timezone`).
- Tarih geçersizse (`valid: false`) hiç çizilmez — kapsayıcıda boş kutu kalmaz.
- Karo zemini ve yazılar tema token'larıdır; Krom'da sayılar da metalik degrade.
