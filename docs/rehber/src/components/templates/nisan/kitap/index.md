# `nisan/kitap/index.ts` — nişanın kitap preset'leri

> **Tarih:** 2026-10-22 · dal `design/kitap` · Konsept: [KITAP-KONSEPTI §7](../../../../../tasarim/KITAP-KONSEPTI.md)

---

Nişan hikâyenin **önsözü**dür: birinci bölüm düğündür, burada henüz bölüm yoktur. Konsept barrel'ı;
birleştirmede kategori barrel'ına (`nisan/index.ts`) tek satır eklenir: `export * from './kitap';`

| Preset | Eksen | İlk ekran (360 px) | Kılavuz |
|---|---|---|---|
| `NisanKitapOnsoz` (`nisan-kitap-onsoz`) | Bez cilt — pencereli kapak | Koyu mürdüm bez, ortada oval pencereden şamua üstünde adlar | [index](NisanKitapOnsoz/index.md) |
| `NisanKitapKurdele` (`nisan-kitap-kurdele`) | İç kapak — kesik kurdele | Açık şamua, sayfayı tam ortadan bölen kesik kurdele, `&` kesikte | [index](NisanKitapKurdele/index.md) |

İki preset 360 px'te de farklı yerleşimdedir (KONSEPT-ORTAK §7): biri koyu kapak + açık pencere,
öbürü açık sayfa + yatay kurdele ekseni. Zarflı ilk ekranlar da ayrıdır (pencereli kapak / düz bez
kapak). Görüntü: kontak sayfası raporda.

Ortak taban: [`ortak.ts`](ortak.md). Kit: [`konsept/kitap`](../../konsept/kitap/index.md).

Önizleme (kayıt dosyasına dokunmadan): `/onizleme.html?preset=nisan-kitap-onsoz&senaryo=dolu[&zarf=1]`.

## Kâğıt nişan pilotundan ayrım

| Kâğıt (`NisanGulKurusu`, `NisanSozMektubu`, `NisanSozSenedi`) | Kitap nişanı |
|---|---|
| Masada duran kart, tırtıklı kenar, kâğıt dokusu | Kart yok: ciltli kitabın kapağı ve sayfası; tek doku bezde |
| El yazısı adlar | Caslon Display; el yazısı yok |
| Mum mühür, mürekkep damgası, kabartma halkalar, imza çizgileri | Mühür, damga, kabartma, imza yok; süs pencerenin kesiği ve ayraç kurdelesi |
| Suluboya leke, kurutulmuş gül | Bitki ve leke yok; sarmaşık yaprağı (fleuron) dizgi süsü |
| `gul` / `fildisi` / `pamuk` kâğıtlar | `samua` sayfa, `murdum` bez |
