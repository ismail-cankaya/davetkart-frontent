# `konsept/sergi/Adlar.tsx` — duvar yazısının adları

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

`kisiler()` çıktısını satır satır çizer: her kişi kendi bloğunda, ikincisi `& ` ile başlar.

| Prop | Ne |
|---|---|
| `kisiler` | Ad listesi; boşsa çağıran yedek verir (pilotta `['Davetlisiniz']`) |
| `girinti` | İkinci ve sonraki satırlar `0.6em` içeriden: asimetrik duvar yazısı |
| `ampersandClassName` | `&` işaretinin rengi (Beyaz Küp'te vurgu, Duvar Yazısı'nda etiket grisi) |

Boy, satır aralığı ve font çağıranın `h1`'indedir. Satırlar `text-wrap: balance` ile dengelenir; uzun ad
kesilmez, kırılır. Blok sonundaki görünmez boşluk metinde kalır: ekran okuyucu "A & B" okur.

## Sınırlar

- Tek kişilik ad (yalnızca gelin ya da damat) tek satırdır; `& Ali` saklama biçimi `displayNames` ile
  önceden temizlenir (`TemplateRenderer`).
