# `konsept/harita/izPlani.ts` — iz kapağının rotası

> **Tarih:** 2026-10-23 · dal `design/harita` · Kullanan: [IzKapak](IzKapak.md)

---

Saf hesap: ölçülen kartuş kutusu ve çapalardan (`bas`, `durak`, `hedef`) rotanın ara noktalarını kurar.
Hedef yoksa `null` (rota çizilmez).

| Düzen | Kadraj | Rota |
|---|---|---|
| `hazine` | dar | Kartuşun alt kenarının ortasından (20 px gizli, [`cikis`](rotaPlani.md)) rozetlere, sonra X'e |
| `hazine` | geniş | Kartuşun sol kenarından (yüksekliğin %32'si) zikzak sütununa |
| `hat` | dar | Başlangıç halkası (kartuşun 26 px solu, üstünden 28 px) → rozetler → iğne ucu: dümdüz, `gizli` 0 |
| `hat` | geniş | Kartuşun sağ kenarından çıkar, ortada 34 px sarkar, halkanın 30 px solundan hatta katılır |

**Kıvrım (hazine):** iki çapa 150 px'ten uzaksa ortalarına parçaya **dik** bir nokta girer; genlik parçanın
%22'si, en çok 90 px, yönü her seferinde değişir, x kadraja kıstırılır (24 px). İlk sürümde kıvrım hep
yataydı; genişte yatay parçalarda rota kendi üstüne döngü yapıyordu.

Dönen `halka`: hat düzeninde başlangıç halkasının yeri (dar: ilk nokta; geniş: kolun hatta katıldığı nokta).
