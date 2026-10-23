# `dugun/sergi/` — düğünün "Sergi Açılışı" preset'leri

> **Konsept:** [SERGI-KONSEPTI](../../../../../tasarim/SERGI-KONSEPTI.md) · **Kit:** [konsept/sergi](../../konsept/sergi/index.md)
> **Tarih:** 2026-10-17 · dal `design/sergi` · pilot kategori

---

## 1. Kategori yorumu

"Müzede düğün": tek eser, sade etiket, şaka yok (§7). Düğün kimliğinin (KIMLIK.md) beyazın tonları ve
sessiz zarafet duygusu korunur; tül, kurdele, şakayık ve inci düğünün kendi preset'lerinde kalır.

| Kimlik | Bileşen | Eksen (§4.3) | Eser rengi | Fikir |
|---|---|---|---|---|
| `dugun-sergi-beyaz-kup` | `DugunSergiBeyazKup` | **Tek eser** | kobalt | Çiftin adı sergi adı; yanında "Eşik" ve müze etiketi. Şakasız |
| `dugun-sergi-duvar-yazisi` | `DugunSergiDuvarYazisi` | **Duvar yazısı** | gece | Çerçevesiz; adlar vinil harf, altında tek satır etiket, "Kalıcı koleksiyon" |

## 2. Dosyalar

| Dosya | Ne | Kılavuz |
|---|---|---|
| `index.ts` | Barrel; kategori barrel'ına `export * from './sergi';` ile bağlanır | bu dosya |
| `ortak.ts` | İki preset'in ortak metinleri (hediye başlığı ve notu) | [ortak](ortak.md) |
| `DugunSergiBeyazKup/index.tsx` | Beyaz Küp | [DugunSergiBeyazKup](DugunSergiBeyazKup/index.md) |
| `DugunSergiDuvarYazisi/index.tsx` | Duvar Yazısı | [DugunSergiDuvarYazisi](DugunSergiDuvarYazisi/index.md) |

## 3. Kayıt (birleştirmede orkestratör ekler)

`TemplateRenderer` ve `data.ts` satırları pilot raporunda önerildi; bu dalda commit'lenmedi.
Önizleme düzeneği preset'leri barrel'dan doğrudan yükler (`onizleme.html?preset=dugun-sergi-…`).
