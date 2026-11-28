# `scripts/verify-text-slots.ts` — `npm run verify:text-slots`

Faz 24–25. `npm run check`'in parçası.

1. **Sözleşme ↔ varsayılanlar:** `text-slots.json` anahtarları `tr.json`'daki düzenlenebilir anahtarların ta kendisi;
   her varsayılan `maxLength`'e sığar, tek satırlıkta satır sonu yok, yer tutucu bir kez geçer; v2.0'da yalnızca `tr`.
2. **Kod ↔ varsayılanlar:** şablonların okuduğu her anahtar (`<InvText k>`, `t()`, `fixed()`) tanımlı.
3. **Kapsamlar:** koddaki her `textScopes`/`kapsam` adı `tr.json`'da var; sahipsiz kapsam yok.
4. **Güvenlik:** şablonlarda `dangerouslySetInnerHTML` yok; flavor'a metin alanı geri dönmedi.
5. **Tavan:** gömülü metin sayısı dosya başına `scripts/text-slots/baseline.json`'u aşmaz (Faz 26 sıfıra indirir).
6. **Backend kopyası:** kardeş depo yanındaysa `contracts/text-slots.json` birebir aynı.
7. **Editör mantığı:** yazma/silme (varsayılana eşit metin saklanmaz), doğrulama, kategori anahtarları, geri al sınırı,
   `hasCustomTexts`.
