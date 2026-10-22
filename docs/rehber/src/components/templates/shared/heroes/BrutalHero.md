# `shared/heroes/BrutalHero.tsx` — punto en uzun kelimeye göre

> **Kullananlar:** 9 kategorinin `*Brutal` şablonu
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## 1. Sorun

Boş isimde yedek metin "DAVETLİSİNİZ"dir (12 harf). Punto `clamp(2.1rem, 13cqw, 4rem)`
yalnızca genişliğe bakıyordu; 360 px'te de 1280 px'te de kelime kutuya sığmıyor ve
`break-words` onu ortadan bölüyordu: **"DAVETLİSİNİ / Z"**. Dokunulmamış kategorilerde de
vardı (eski hata).

## 2. Çözüm

```ts
const longest = Math.max(...words.map((w) => w.length));
const fitSize = `calc(min(80cqw, 25rem) / ${(0.66 * longest).toFixed(2)})`;
fontSize: `clamp(1.5rem, min(13cqw, ${fitSize}), 4rem)`
```

| Parça | Anlamı |
|---|---|
| `min(80cqw, 25rem)` | Kutunun yaklaşık iç genişliği (dar ekranda kap, genişte `max-w-md`) |
| `0.66 × harf sayısı` | Büyük harfli siyah groteskte güvenli kelime genişliği (em) |
| alt sınır `1.5rem` | Çok uzun kelimede bile okunur kalır; sığmazsa `break-words` son çare |

Kısa isimlerde `13cqw` yine küçük olan değerdir: görünüm değişmez.

## 3. Doğrulama

Kına Brutal, boş isim: 360 ve 1280 px'te "DAVETLİSİNİZ" tek satır. Dolu isim
("SOPHİA & ELİAS") eskisiyle aynı boyutta.

## Kullanıcı metninin harfi (2026-10-22 · dal `design/konsept-ortak`, N3)

Başlık çipinden `uppercase` kaldırıldı; bilgi satırında yalnız "Mekan" değeri `normal-case`
(kullanıcı metni). Adlar büyük harfli gösterim başlığı olarak kaldı (karar bekliyor). Tablo: `../Summary.md` §3.
