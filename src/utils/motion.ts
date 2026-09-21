import type { Transition, Variants } from 'motion/react';

/**
 * Motion token'ları — uygulamadaki tüm hareketin tek kaynağı.
 *
 * Kural: süreyi bileşen değil BAĞLAM seçer, eğriyi hareketin ROLÜ seçer.
 * Aynı modal bir sayfada 0.45 s, diğerinde 0.55 s sürmesin; hepsi `panel`.
 * CSS tarafındaki karşılıkları index.css `@theme` bloğunda: `ease-luxe`,
 * `ease-luxe-in`.
 */

/** Eğriler: isim, hareketin rolünü söyler. */
export const ease = {
  /** Girişler: hızlı başla, uzun bir kuyrukla otur. Markanın imza eğrisi. */
  out: [0.22, 1, 0.36, 1],
  /**
   * Çıkışlar: yavaş başla, hızlanarak uzaklaş. Ease-out bir çıkış ekranda
   * oyalanır — kullanıcı "kapat"a bastıktan sonra arayüz hâlâ meşgul görünür.
   */
  in: [0.55, 0, 1, 0.45],
  /** Ekranda kalan bir öğenin yer değiştirmesi (ne giriyor ne çıkıyor). */
  inOut: [0.65, 0, 0.35, 1]
} as const;

/**
 * Süre ölçeği (saniye).
 *
 *  - press: whileTap / basma
 *  - fast:  hover, toggle, ikon değişimi ve TÜM çıkışlar
 *  - base:  dropdown, toast, tooltip, liste öğesi
 *  - panel: modal, sheet, sihirbaz adımı, ürün arayüzü bölüm girişi
 *  - stage: pazarlama hero'su ve davetiye sahnesi — yalnızca bir kez izlenen anlar
 */
export const duration = {
  press: 0.1,
  fast: 0.18,
  base: 0.28,
  panel: 0.4,
  stage: 0.8
} as const;

/** Yaylar: kullanıcının doğrudan sürdüğü göstergeler ve kartlar için. */
export const spring = {
  /** Anahtar, sekme ve cihaz seçici göstergeleri. */
  snappy: { type: 'spring', stiffness: 500, damping: 34 },
  /** Kartlar, paneller, "pop" eden rozetler. */
  soft: { type: 'spring', stiffness: 260, damping: 28 }
} as const satisfies Record<string, Transition>;

/**
 * Modal / diyalog kartı. Giriş ve çıkış ayrı ayarlanır: çıkış girişin
 * yaklaşık %60'ı kadar sürer ve ease-in ile hızlanarak uzaklaşır.
 */
export const modalVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: duration.panel, ease: ease.out } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: duration.fast, ease: ease.in } }
};

/** Modal arka plan karartması. */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.in } }
};
