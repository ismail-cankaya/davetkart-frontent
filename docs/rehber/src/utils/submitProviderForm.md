# `src/utils/submitProviderForm.ts`

> **Faz:** 12 — adım 12.11 · **Sınayan:** `npm run verify:payment` → *Sağlayıcı formu (Faz 12)*

## 1. Neden bir form?

Shopier'in ödeme sayfası bir adrese **gidilerek** açılmıyor; imzalı alanlar taşıyan
bir form **POST edilerek** açılıyor. `window.location` yalnızca GET yapabilir. POST
için tarayıcının bildiği tek yol bir `<form>` göndermek.

```
backend checkout yanıtı ─▶ { type: 'form', url, fields: { API_key, signature, … } }
                               │
                               ▼
               <form method="post" action="https://www.shopier.com/…">  (görünmez)
                 <input type="hidden" name="signature" value="…">
                 …
               </form>.submit()   ─▶ sayfa Shopier'e geçer
```

## 2. 🔴 XSS: neden `innerHTML` değil?

Cazip ama tehlikeli yol:

```ts
// ❌ Alıcı adı "><script>…</script> ise bu satır betik çalıştırır
container.innerHTML = `<form …><input name="buyer_name" value="${fields.buyer_name}"></form>`;
```

Alanların bir kısmı **kullanıcının yazdığı metin** (`buyer_name`, `buyer_surname`).
Metni HTML'in içine birleştirmek, onu kod olarak yorumlatmak demek. Doğru yol DOM
API'si:

```ts
const input = doc.createElement('input');
input.value = value;      // ✅ tarayıcı bunu METİN olarak tutar, asla HTML olarak ayrıştırmaz
```

`verify:payment` bunu sınıyor: `"><script>alert(1)</script>` değeri olduğu gibi bir alan
değeri olarak kalıyor.

## 3. Hedef adres bekçisi: `isSafeFormTarget`

Form yalnızca `https:` adresine gider (geliştirmede `http://localhost` istisnası).
`javascript:alert(1)` ya da göreli bir adres (`/odeme`) reddedilir ve hiçbir şey
gönderilmez. Adres backend'den geliyor, yani bugün güvenilir; ama bir gün yanıt
değiştirilirse (ortadaki adam, hatalı bir proxy) kullanıcının imzalı formu yanlış
yere gitmesin. Ucuz bir kontrol, pahalı bir hatayı önler (derinlemesine savunma).

## 4. Neden `doc` parametresi?

`submitProviderForm(action, doc = document)`. Test ortamında (Node) `document` yok.
Belgeyi parametre yapmak, gerçek DOM olmadan kayıt tutan sahte bir belgeyle sınamayı
mümkün kılıyor. Bağımlılığı içeriden almak yerine dışarıdan vermek (dependency
injection): backend'deki `PaymentGateway` fikrinin en küçük hâli.

## 5. Kart bilgisi nerede?

Hiçbir yerde. Bu formda kart alanı yok; kart Shopier'in sayfasında yazılıyor.
PCI DSS açısından frontend'imiz kart verisine **hiç dokunmuyor**.
