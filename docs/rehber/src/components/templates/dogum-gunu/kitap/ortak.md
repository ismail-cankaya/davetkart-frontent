# `dogum-gunu/kitap/ortak.tsx` — doğum gününün kitap tabanı

> **Tarih:** 2026-10-23 · dal `design/kitap`

---

| Dışa açılan | İş |
|---|---|
| `DOGUM_GUNU_KITAP_FLAVOR` | `DOGUM_GUNU_FLAVOR` kopyası; yalnızca `giftNote` kitap diline çevrilir ("Bu yeni bölümün ilk sayfasında…"). Zarf etiketi "Doğum Günü Davetiyesi" ve italik "Yeni Yaşımı Birlikte Kutlayalım" kategoriden aynen kalır. Desen ve bölüm adları `useKitapFlavor`'dan |
| `YENI_BOLUM_ETIKETI` | `Yeni Bölüm · II`, `· III`… (yetişkin). Nişanın "Önsöz · II"si gibi: bölüm adsız ve numarasız, alt bölümler Roma rakamıyla |
| `MASAL_SAYFA_ETIKETI` | `İkinci Sayfa`, `Üçüncü Sayfa`… `Altıncı Sayfa` (çocuk). Sözcükle sayı çocuk kitabının sesi; hero birinci sayfadır, en çok altı. Büyük harf CSS ile (`lang="tr"` → `İKİNCİ`) |
| `SahipAdi` | *Sahibi & Ev sahibi* dizgisi (aşağıda) |

Sayılar açık bölümlerden gelir (`useKitapFlavor` → `cizilenBolumler`), kapalı modül numara atlatmaz;
veride olmayan sayı (yaş) değildir.

## `SahipAdi`

```
Gülşen İrem Karaağaçlı     ← KitapAdlar, tek ad (h1 ya da p)
EV SAHİBİ                  ← 10 px aralıklı büyük harf
Mehmet Çağrı Yıldırımoğlu  ← 15 px italik
```

Düğündeki eşit `A & B` dizgisi doğum gününde iki kutlanan gibi okunurdu. Kitabın adı sahibidir; ev
sahibi kitap künyesindeki gibi küçük satırdır. Üçüncü ad olursa ev sahibi satırına `&` ile eklenir
(`A & B & C` → sahibi A, ev sahibi "B & C"). Ad yoksa KitapAdlar'ın "Davetlisiniz"i; ev sahibi yoksa
satır yoktur.

**Sınır:** `names` şablona `displayNames` ile temizlenmiş gelir; yalnızca ikinci alan dolu (`& Mehmet`)
saklama biçimi şablona `Mehmet` olarak ulaşır ve sahibi gibi dizilir. Ayrımı şablon göremez (açık soru,
raporda).
