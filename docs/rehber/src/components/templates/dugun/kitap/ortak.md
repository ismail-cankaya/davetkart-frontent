# `dugun/kitap/ortak.ts` — `DUGUN_KITAP_FLAVOR`

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

`DUGUN_FLAVOR`'ın kopyası; tek değişiklik hediye notunun kitap dili:

> Bu hikâyede yanımızda olmanız en güzel armağan; yine de takdirinizi iletmek isterseniz hesap
> bilgilerimiz aşağıdadır.

Kategoriden aynen kalanlar: zarf etiketi "Düğün Davetiyesi" (İç Kapak'ın kapak etiketi ve sayfa başı),
italik satır "Evleniyoruz" (kapaktaki italik satır). Bölüm başlıkları, numaralı etiketler ve desenin
kapatılması kitten gelir (`useKitapFlavor`, bkz. [bolumBasliklari](../../konsept/kitap/bolumBasliklari.md)).

Düğün kimliğinin motifleri (kurdele düğümü, puantiyeli tül — [KIMLIK](../KIMLIK.md)) kitap
preset'lerinde kullanılmaz: kitap konseptinin süsü tipografidir. `flavor.Ornament` ortak `Envelope`
ve `Summary`'de çizilir; kitap preset'leri ikisini de kendi parçalarıyla değiştirdiği için görünmez.
