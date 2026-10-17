# `konsept/sergi/SergiKapi.tsx` — zarf kapısı: "Işığı yakın"

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

## 1. Fikir

Konseptin hareket dili "ışık yanar, eser asılır" (§6). Zarf modülü açıkken misafir salona ışığı kapalıyken
girer: koyu duvar (`--sg-karanlik`), karanlıkta seçilen bir çerçeve silueti, sol altta zarf etiketi
(`flavor.envelopeLabel`), adlar ve ışık anahtarı düğmesi. Dokunuşla karanlık çekilir; altında kapak
kendi girişini (spot yanar, eser asılır) oynar. Mühür, kurdele, kâğıt zarf yok.

Ortak `Envelope` ile aynı sözleşme (`EnvelopeRenderProps`); kompozisyon onu yalnızca `showEnvelope`
açıkken çağırır.

## 2. Zamanlama (ölçüldü, headless Chrome, 360 px)

| An | Plan | Ölçülen |
|---|---|---|
| Yazı ve düğme söner | 0–0.15 s | — |
| `onRevealStart` (kapak bağlanır) | 0.10 s | 138–147 ms |
| Karanlık solar → `onOpened` | 0.10–0.60 s | 630–656 ms |
| "Hareketi azalt" | anında | 30 / 38 ms |

## 3. Erişilebilirlik

- `role="dialog"`, `aria-modal`, etiketi zarf etiketi. Düğme 48 px yüksek, `aria-label` "Işığı yakın,
  davetiyeyi açın", odak halkası 2 px duvar rengi.
- Klavye: ilk Tab düğmeye gelir, Enter açar. Kapı açıkken Tab düğmede tutulur — arkadaki bölümler
  görünmezken odak oraya kaçmasın (ölçüm: tuzak olmadan ikinci Tab "Yol Tarifi Al"a gidiyordu).
  Kalıcı tuzak değildir: Enter/Space/dokunuş kapıyı kaldırır.
- Kontrast: duvar / karanlık 14.85, etiket 6.67 (çizilmiş ekranda ölçülen en düşük 6.67), düğme kenarı 3.71.

## 4. Prop

| Prop | Varsayılan | Ne |
|---|---|---|
| `siluet` | `true` | Karanlıktaki çerçeve silueti; çerçevesiz düzenlerde (`Duvar Yazısı`) kapatılır |

## 5. Sınırlar

- Siluetin konumu sabit (sağ üst); preset'in gerçek çerçeve konumuyla birebir eşleşmez.
