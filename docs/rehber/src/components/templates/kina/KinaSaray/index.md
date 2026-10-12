# `src/components/templates/kina/KinaSaray/index.tsx` — Kına Odası

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-saray'`), `src/data.ts` (`kina-saray` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Sivri kemerlerin ardında mum ışığı; metin kemer biçimli bir pencerenin içinde. İki ışık sızıntısı farklı hızda geçer: odadaki bütün mumlar.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `panel="kemer"`, adlar alt alta, mum sayacı.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (altın vurgu `#e3bd72`) | `KINA_SARAY` (al düğme `#c0362a`, sırma-turuncu vurgu) |
| Hero | `Summary` | KinaHero, kemer pencere paneli |
| Atmosfer | altın ışık | `Halo`, sivri `Arches`, iki `LightLeak`, `embers` |

Vurgu rengi: `#e3bd72` → `#f5b26b`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.95 | buttonPrimary |
| Hero | 9.60 | gövde / `#290b07` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `Halo`, `LightLeak` | `[data-atmosphere]` |
| Kor parçacıkları | `ParticleField` durağan kare |

## 5. Görsel öz-kontrol

Kemer silueti 360 px'te tek başına tanınıyor. 1280×800'de mum sayacı ilk ekranın altına taşıyor (kaydırınca görünür; örtüşme yok).
