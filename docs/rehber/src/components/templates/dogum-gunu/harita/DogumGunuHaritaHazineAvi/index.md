# `dogum-gunu/harita/DogumGunuHaritaHazineAvi` — "Hazine Avı"

> **ID:** `dogum-gunu-harita-hazine-avi` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** hazine haritası
> **Tarih:** 2026-10-23 · dal `design/harita`

---

## 1. Fikir

Çocuk partisi bir hazine avıdır: davet, hazineye giden yolu gösteren adanın haritası. Program adımları
yol üstündeki **ipuçlarıdır** (sağlı sollu küçük kutular); kesik çizgili rota kartuştan çıkıp kutudan kutuya
zikzakla iner ve **X**'te biter. X'in yanında varış kartı: *Hazine burada* + mekân, geri sayım, yol tarifi.

| | |
|---|---|
| Arazi | [`HazineAdasi`](../../../konsept/harita/araziler/HazineAdasi.md) — sıcak arazi (kum) + su + park + rota |
| Kapak | [`IzKapak`](../../../konsept/harita/IzKapak.md) `duzen="hazine"`, `rota="kroki"`, `sus="pusula"`, `hedefEtiketi="Hazine burada"`, `vurgu="ilk"`, çocuk sözlüğü |
| Zarf | [`HaritaZarf`](../../../konsept/harita/HaritaZarf.md), ada penceresi, işaret `Carpi` (iğne değil X) |
| Tema | [`HARITA_TEMASI_SICAK`](../../../konsept/harita/tema.md) — sayfa `#F1E6C8`; sahne `zemin` aynı, **perde %86** (§4) |
| Flavor | [`DOGUM_GUNU_HARITA_FLAVOR`](../flavor.md) kopyası, program üst etiketi *Hazineye giden yol* |

**Sözlük** (genel sözlükten önce): *karşılama, balon, hoş geldin* → balon (çocukta kadeh olmaz);
*pasta, mum* → pasta. Genel sözlükten: *oyun* → zar, *hediye* → hediye.

**Veri:** `names` doğum gününde *Sahibi & Ev sahibi*; kartuşta sahibi tam boy, ev sahibi küçük ikinci satır
(`vurgu="ilk"`); "ev sahibi" diye etiketlenmez (ikiz doğum günü de olabilir). Yaş ve mekânın gerçek konumu
gösterilmez; X temsilîdir.

## 2. Düzen

- **360 px:** kartuş üstte ortalı (metin ortalı, ≤ 24 rem); altında en çok 4 ipucu kutusu sırayla sağa ve
  sola yaslanır, rozetler içe bakar. Rota kartuşun alt kenarının ortasından çıkar, rozetlerden geçer;
  arası 150 px'i aşan parçaya dik bir kıvrım girer. Altta X + varış kartı ortada (X her kadrajda karada).
  En altta pusula gülü ve *Temsilî harita* notu.
- **1280 px:** kartuş sağ üstte (26 rem); solda 36 rem'lik zikzak sütunu (ipuçları, X ve kart); rota
  kartuşun sol kenarından çıkar. Pusula sol üstte, not sağ altta.
- Program kapalı: ipucu yok; rota kartuştan X'e kıvrımlarla iner (aralık ≥ 150 px), kartta tarih satırı.

**360 × 780 ölçümleri** (y px):

| Senaryo | Kartuş | İpuçları | X | Yol tarifi | Not | Kapak |
|---|---|---|---|---|---|---|
| dolu | 20–240 | 268–555 | 611 | 699–743 ✓ | 805 ✗ | 840 |
| uzun | 20–337 | 365–651 | 707 | 839 ✗ (kaydırınca) | 945 ✗ | 980 |
| kapalı | 20–240 | — | 570 | 639–683 ✓ | 745 ✓ | 780 |
| boş | 20–206 | — | 680 | — | 745 ✓ | 780 |

## 3. Ayrışma

| Karşı | Fark |
|---|---|
| Kutlama Hattı (aynı kategori) | Ada × çarşı; kartuş ortalı üstte × omurganın ilk istasyonu; zikzak kesik çizgi × düz hat; X × iğne |
| Düğün Kıyı Kenti, Nişan Kavuşak | Onlarda kartuş üstte + rota boş haritada + lejant kutusu altta; burada lejant yok, duraklar haritada |
| Düğün Kır Yolu, Nişan Kroki | Lejant üstte / tek blok altta; burada blok yok, varış kartı X'in yanında |
| Mezuniyet Pusula | Antika, altın × düz renk, kum ve deniz |
| Doğum günü Yıldız Haritası, Blueprint | Gece, ölçü × gündüz ada, kesik çizgi |

## 4. Doğrulama

- Ekran görüntüleri: `node_modules/.cache/onizleme/dogum-gunu-harita-hazine-avi/` (dolu, uzun, boş, kapalı ×
  360/768/1280 tüm ekranlar; zarf ve `--ac`; hareket azaltılmış; her modül tek tek kapalı; ikinci ad, boş
  tarih, boş mekân + harita yok, iki uzun ad).
- Giriş (sıcak önbellek): 878 ms (360), 870 ms (1280); zarftan 908 ms; hareket azaltılmış 16 ms. Soğuk
  önbellekte fontlar geç geldiğinden rota katmanı 1.6 s'de animasyonsuz belirir (Nişan kararı).
- Kontrast (çizilmiş ekran, metin saydam yapılıp zeminin en kötü pikseli): perde %80'de bölüm üst etiketi
  4.44 ve alt bilgi 4.43 ölçüldü → perde %86: en kötü **4.72** (360, *Ne Zaman & Nerede*, 10 px rota),
  4.85 (768), 5.08 (1280); alt bilgi 4.76. Kapaktaki bütün metin beyaz kutularda ≥ 6.69.
- Klavye: ilk Tab "Yol tarifi" (238 × 44, 2 px mürekkep çerçeve); zarfta "Haritayı açın" (147 × 44).
- DOM: arazi SVG 22.8 KB / 20 öğe; rota katmanı 6.7 KB / 49 öğe. Kaynak 2.2 KB; raster görsel yok (0 KB).
