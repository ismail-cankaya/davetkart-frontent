# `e2e/` — üç yolculuk

> **Faz:** 19.22 — `TST-04` · **Karar:** K224 · **Komut:** `npm run e2e`

| Dosya | Yolculuk | Kanıtladığı |
|---|---|---|
| `publish-with-gift-code.spec.ts` | kayıt → sihirbaz → editör → *Tasarımını Yayınla* (402) → plan duvarı → `/odeme` → hediye kodu → *Ücretsiz etkinleştir* → `/odeme/basarili` → *Davetiyeniz yayında* → misafir sayfasında adlar | Kayıt, davetiye, sipariş (`orderId`), yayın sözleşmeleri uçtan uca |
| `guest-rsvp.spec.ts` | oturumsuz misafir `/invite/:id` → *Ad Soyad* → *Katılımımı Bildir* (201) → sahibin `/dashboard`'unda ad | Genel LCV ucu ↔ panel |
| `paywall-after-publish.spec.ts` | panel → *Düzenle* → *Fotoğraf Galerisi* (Elit) → PUT 402 → *Mevcut planınız bu davetiyeye yetmiyor*, anahtar geri kapanır | K-1: yayındaki davetiyeye üst plan modülü sızmaz |

## Desen

- **Adımlar `support/flows.ts`'te**, her adım tek fonksiyon (`register`, `createInvitation`,
  `publishWithGiftCode`, `openGuestPage`). Ürün değişince (SEC-09 doğrulama, FE-50 sihirbaz) tek yer değişir.
- **Seçiciler** rol / etiket / yer tutucu: kullanıcının ve ekran okuyucunun gördüğü. Kimlik (`#id`) yok.
- **Durum:** ilk yolculuk sahibin tarayıcı deposunu (`e2e/.state/owner.json`) ve davetiye kimliğini
  (`published.json`) yazar; diğer ikisi ona bağımlı proje olarak koşar (tek kayıt, daha az hız sınırı).
- Ağ beklemeleri tıklamayla **aynı anda** başlar (`Promise.all`); otomatik kaydetme gibi tıklamadan
  önce de olabilecek istekler için bekleyiş formu doldurmadan önce başlatılır (`createInvitation`).

## Sık hata

- Plan duvarında `role="dialog"` yok; başlık (`h2`) ile bulunur.
- İlk yolculuk düşerse diğer ikisi "did not run" olur: önce ilkini onar.

## Mutant (23 Kasım 2026)

Backend `OrderResource`'ta `'orderId'` → `'id'`: `npm run check` yeşil, `npm run e2e` kırmızı (ilk yolculuk
`/odeme/basarili`'ye geçemez, diğer ikisi koşmaz). Backend testleri de yakalar (`OrderTest`, `PaywallTest`):
e2e'nin asıl kazancı backend testlerinin sabitlemediği sözleşmelerde. Çıktı: docs `phases/faz-19/kayit/19-22-TST-04.md`.

## Kararlılık

Tıklamadan önce görünür olması gereken adımlar `isVisible()` ile değil `waitFor`/`click` ile beklenir
(`isVisible` beklemez). Misafir formu zarf açıldıktan sonra bir kez yeniden çizilebilir; ad `toPass` ile doldurulur.
