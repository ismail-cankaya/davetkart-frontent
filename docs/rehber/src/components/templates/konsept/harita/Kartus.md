# `konsept/harita/Kartus.tsx` — kartuş (başlık bloğu)

> **Tarih:** 2026-10-17 · dal `design/harita`

---

Beyaz dikdörtgen, 1.5 px mürekkep kontur, kaymış düz gölge (`4px 4px 0 mürekkep`) — konseptte gölge
yalnızca burada.

| Satır | Kaynak | Yazı |
|---|---|---|
| Üst etiket | `title` (yazıldığı gibi) | Barlow Condensed 600, 12/13 px, `tracking .18em`, rota |
| Adlar (`h1`) | `kisiler(names)`, her kişi ayrı satır; ad yoksa "Davetlisiniz" | Newsreader italik 500 |
| Küçük rota | süs (`aria-hidden`) | 9 nokta, `rotaAcik` |
| Alt metin | `subtitle` | Barlow Semi Condensed 15/16 px, gri |
| Tarih | "14 Şubat 2027 · Pazar" | Barlow Condensed 600, büyük harf (üretilen metin, kullanıcı metni değil) |

Ad boyu toplam uzunluğa göre: ≤ 16 karakter 40 / 54 px, ≤ 30 karakter 34 / 50 px, üstü 30 / 40 px
(dar / `@3xl`). En küçük ad 30 px (rehber: ≥ 26 px).

`&` ikinci satırın başında, %72 boyda, rota renginde; önünde ve arkasında gerçek boşluk var (ekran
okuyucu "İrem & Mehmet" okur, "İrem&Mehmet" değil).

**Tuzak:** `cn()` (twMerge) yazı boyu sınıfını `leading-*`'tan sonra görürse `leading`'i siler. Satır
yüksekliği bu yüzden boy sınıflarından **sonra** verilir.

## Doğum günü eki (2026-10-23)

| Prop | Varsayılan | Ne |
|---|---|---|
| `hizala` | `'sol'` | `'orta'`: metin, rota süsü ve alt başlık ortalı (hazine başlık bandı) |
| `vurgu` | `'esit'` | `'ilk'`: ilk ad tam boy, sonrakiler 0.6 em ikinci satır; boy yalnızca ilk addan hesaplanır. Doğum gününde *Sahibi & Ev sahibi*; ikinci ad etiketlenmez |
