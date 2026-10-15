# `shared/paper/KagitZarf.tsx` — zarf kapısı

> **Tarih:** 2026-10-15 · dal `design/kagit` · Bağlantı: `InvitationComposition.renderEnvelope` (konsept §8)

---

## 1. Fikir

Zarfın arka yüzü: kapak üçgeni, cep (yan ve alt kanatlar), kapağın ucunda mühür. Adlar zarfın
**üstünde**, gerçek metin olarak (`Adlar`). Dokununca mühür kırılır, kapak açılır, içindeki kart
(kör kabartma baş harfler) yükselir, kapı solar.

## 2. Sözleşme

Ortak `Envelope` ile aynı props: `invitation`, `theme`, `flavor`, `onRevealStart`, `onOpened`.
Kompozisyon hangisini çizdiğini bilmek zorunda kalmaz. Ek olarak `harfler`, `kural`, `astar`.

## 3. Zamanlama

| s | Ne |
|---|---|
| 0.00–0.30 | Mühür ikiye ayrılıp söner |
| 0.12–0.54 | Kapak 180° döner (`rotateX`); 0.33'te kartın arkasına iner |
| 0.34–0.74 | Kart yükselir |
| 0.50 | `onRevealStart` → hero girişi başlar |
| 0.55–0.95 | Kapı solar → `onOpened` |

Ölçülen (headless Chrome, 360 × 780): dokunuştan kapının kalkmasına **956–969 ms**.

Açılan kapak yukarı kalktığında adların önüne geçiyordu; ad bloğu `z-10` ile önde tutuldu.

## 4. Erişilebilirlik

- Mühür bir `<button>`: 72 px, `aria-label="Davetiyeyi aç"`, klavyeyle Enter/Boşluk, `focus-visible` halkası.
- Kapının tamamına dokunmak da açar (ortak zarfla aynı).
- İpucu metni durağan: ortak zarftaki sonsuz nabız opaklığı %40'a indirip metni AA altına düşürüyordu
  ve "bir kez" kuralına aykırıydı.
- **Hareketi azalt:** dokunuş `onRevealStart` + `onOpened`'ı hemen çağırır (ölçülen 4–6 ms); hiçbir şey
  dönmez, kaymaz, solmaz.

## 5. Sınırlar

- Preset `renderEnvelope={(props) => <KagitZarf {...props} />}` ile bağlar; bağlamazsa ortak
  `Envelope` `KAGIT_TEMASI.envelope` renkleriyle çizilir.
- Zarf `showEnvelope` modülüdür (Gold). Tasarım onu bayraktan bağımsız göstermez.
