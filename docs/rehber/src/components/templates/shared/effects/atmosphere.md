# `src/components/templates/shared/effects/atmosphere.tsx` — `Halo` düzeltmesi

> **Kullananlar:** 92 `<Halo>` çağrısı, 9 kategori (en çok kına, doğum günü, sünnet)
> **Denetim:** `npm run check` (`verify:render` şablonları Node'da çizer) · ekran görüntüsü: `_preview` önizleme sayfası
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## 1. Sorun: animasyon iki satır içi stili eziyordu

`Halo` tek bir öğeydi. Aynı öğede hem satır içi stil hem `halo-breathe` animasyonu vardı:

| Satır içi stil | Animasyonun yazdığı | Sonuç |
|---|---|---|
| `opacity: 0.14` (şablonun istediği) | `opacity: 0.4 → 0.75` | Hale istenenin ~3 katı parlak |
| `transform: translate(-50%, -50%)` | `transform: scale(1 → 1.08)` | Ortalama kaybolur, hale yarım boy sağ-alta kayar |

CSS animasyonu satır içi stilden **güçlüdür**. Şablonlar `opacity`'yi 0.12–0.26 arasında
verirken hepsi aynı parlaklıkta yanıyordu.

"Hareketi azalt" açıkken animasyon durduğu için hale birden istenen yere ve parlaklığa
dönüyordu: aynı şablon iki kullanıcıya farklı görünüyordu.

## 2. Çözüm: iki katman

```
dış div  → left/top/width + translate(-50%,-50%) + opacity   (animasyon yok)
  iç div → radial-gradient + halo-breathe                    (data-atmosphere)
```

`halo-breathe` artık **göreli** çalışır: opaklık `0.55 → 1`, ölçek `1 → 1.08`
(bkz. `src/index.md`). Tepe parlaklığı her zaman `opacity` prop'udur; nefes onun
%55'ine kadar iner.

## 3. Görsel etki

Kına (bu turda tasarımı değişmeyen kategori) üzerinde önce/sonra karşılaştırıldı:
fark hafif. Hale çoğu şablonda video/atmosfer katmanlarının altında kalıyor.

## 4. Düğünün geçici çözümü

`dugun/parts/Hale.tsx` opaklığı dış kapta `opacity / 0.75` ile uygulayıp `Halo`'ya 0.75
veriyordu. Yeni hâlde de tepe değeri doğru çıkar (`opacity/0.75 × 0.75`); sarmalayıcı
artık gereksizdir ve düğün ajanı kaldırabilir.
