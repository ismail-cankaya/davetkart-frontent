import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { getTemplatesForCategory } from '../../data';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useCreateWizardStore, useActiveCategory } from '../../stores/useCreateWizardStore';
import { useProgressiveList } from '../../hooks/useProgressiveList';
import { scrollToTarget } from '../../hooks/useLenis';
import { TemplateCover } from '../preview/TemplateCover';
import { duration, ease, gesture } from '../../utils/motion';

/**
 * İlk anda çizilen tema sayısı ve her adımda eklenen parti büyüklüğü.
 * 16 = masaüstünde 4, telefonda 8 tam satır; ızgara hiçbir zaman yarım
 * satırla başlamaz.
 */
const INITIAL_THEMES = 16;
const THEME_STEP = 16;

/**
 * Kartların parti içindeki giriş gecikmesi. Tavan olmasaydı 16'lık bir
 * partinin son kartı ~0.9 sn sonra belirir, kullanıcı hâlâ boş kutulara
 * bakarken kaydırmaya devam ederdi.
 */
const CARD_STAGGER = 0.05;
const MAX_CARD_DELAY = 0.45;

/**
 * Yeni partinin "geliyor" penceresi: kartların üzerinden parıltı geçtiği ve
 * ızgaranın altındaki göstergenin açık kaldığı süre.
 *
 * 🔴 Bu sahte bir bekleme DEĞİL, partinin kendi giriş animasyonunun süresi:
 * son kart `MAX_CARD_DELAY` kadar sonra belirmeye başlar, yani bu pencere
 * boyunca ızgaranın altı gerçekten dolmaya devam eder. Hiçbir içerik
 * geciktirilmez; parıltı, zaten belirmekte olan kartların ÜZERİNDEN geçer.
 *
 * 🔴 Asıl yükleme göstergesi kartların kendisidir, ızgaranın altındaki şerit
 * değil: yeni parti anında eklendiği için şerit bir anda ~1000 piksel aşağı
 * itilir ve kullanıcı ona bakarken değil, çoktan geçtikten sonra oynar.
 * Kapak görsellerinin gerçek ağ beklemesi de kartın kendi iskeletinde durur
 * (bkz. TemplateCover) — temalar paketin içinde gelir, "sonraki partiyi
 * getir" diye bir ağ turu yoktur.
 */
const BATCH_REVEAL_MS = 600;

/** Sentinel, görünür alana bu kadar kala tetiklenir (bkz. useProgressiveList). */
const TRIGGER_MARGIN = '160px 0px';

/**
 * Tema seçiminden sonraki süzülme (120 ms bekleme + Lenis'in 1.2 sn'lik
 * animasyonu) bitene kadar otomatik yükleme duraklatılır.
 */
const GLIDE_SETTLE_MS = 1600;

/**
 * Wizard step 2a — theme gallery. Picking a theme reveals the details form
 * below and glides down to it.
 *
 * 🔴 Kategori başına düzinelerce tema var ve bunlar bir zamanlar tek seferde
 * basılıyordu: 35 kart + 35 giriş animasyonu, üstelik sonuncusunun gecikmesi
 * 2.8 saniyeydi. Artık yalnızca ilk 16 kart çizilir, gerisi kaydırdıkça
 * 16'lık partiler hâlinde gelir (e-ticaret ızgaralarındaki gibi) — bağlantısı
 * zayıf olan ya da kaydırmayı sevmeyen kullanıcı için açık bir "daha fazla"
 * düğmesi de durur. Koleksiyon yüzlerce temaya çıktığında ilk boyamanın
 * maliyeti aynı kalır: her zaman 16 kart.
 */
export function ThemeStep() {
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const selectTemplate = useInvitationStore(s => s.selectTemplate);
  const themeChosen = useCreateWizardStore(s => s.themeChosen);
  const markThemeChosen = useCreateWizardStore(s => s.markThemeChosen);
  const activeCategory = useActiveCategory();

  // Only the templates belonging to the picked category (dugun → düğün temaları…).
  const categoryTemplates = getTemplatesForCategory(activeCategory?.id ?? null);

  // Kullanıcı düzenleme ekranından geri döndüğünde seçili tema listenin
  // derinlerinde olabilir; ilk parti onu kapsayacak kadar açılır.
  const selectedIndex = categoryTemplates.findIndex(preset => preset.id === activePresetId);

  // 🔴 Tema seçilince sayfa aşağıdaki forma süzülür ve bu yol, ızgaranın
  // altındaki sentinel'in tam üzerinden geçer. O sırada otomatik yükleme
  // tetiklenirse ızgara bir parti daha büyür, form aşağı kayar ve Lenis'in
  // çağrı anında ölçtüğü hedef şaşar: kullanıcı formun değil, tema ızgarasının
  // sonunda durur. Bu yüzden süzülme boyunca yalnızca otomatik yükleme
  // duraklatılır; düğme çalışmaya devam eder.
  const [autoLoad, setAutoLoad] = useState(true);
  const glideTimers = useRef<number[]>([]);

  useEffect(() => () => glideTimers.current.forEach(id => window.clearTimeout(id)), []);

  const {
    visible: visibleTemplates,
    hasMore,
    remaining,
    showMore,
    sentinelRef,
    batchStart
  } = useProgressiveList(categoryTemplates, {
    initial: INITIAL_THEMES,
    step: THEME_STEP,
    auto: autoLoad,
    ensureIndex: themeChosen ? selectedIndex : -1,
    // Dar pay: parti, kullanıcı ızgaranın sonuna yaklaşırken yüklenir; böylece
    // alttaki gösterge ekran dışında değil, tam bakılan yerde oynar.
    rootMargin: TRIGGER_MARGIN
  });

  // Gösterge, yeni partiyle AYNI karede açılır: efektle açılsaydı kullanıcı
  // bir kare boyunca kartların göstergesiz belirdiğini görürdü. İlk parti
  // (batchStart 0) bir yükleme değil, bölümün kendi girişidir.
  const [revealedBatch, setRevealedBatch] = useState(batchStart);
  const [batchRevealing, setBatchRevealing] = useState(false);
  if (revealedBatch !== batchStart) {
    setRevealedBatch(batchStart);
    setBatchRevealing(batchStart > 0);
  }

  useEffect(() => {
    if (!batchRevealing) return;
    const timer = window.setTimeout(() => setBatchRevealing(false), BATCH_REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [batchRevealing, revealedBatch]);

  const handleSelect = (id: string) => {
    selectTemplate(id);
    markThemeChosen();

    glideTimers.current.forEach(id => window.clearTimeout(id));
    setAutoLoad(false);
    glideTimers.current = [
      window.setTimeout(() => scrollToTarget('sihirbaz-form'), 120),
      window.setTimeout(() => setAutoLoad(true), GLIDE_SETTLE_MS)
    ];
  };

  return (
    <motion.section
      id="sihirbaz-tema"
      className="py-12 md:py-16 bg-cream scroll-mt-20"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: duration.fast, ease: ease.in } }}
      transition={{ duration: duration.panel, ease: ease.out }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block">
            Adım 2 / 3 — Tema &amp; Bilgiler
          </span>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-ink mt-4">
            Size en uygun <span className="italic text-brand font-medium">temayı</span> seçin
          </h2>
          <p className="text-muted text-sm mt-3 max-w-lg mx-auto">
            {activeCategory
              ? `${activeCategory.label} etkinliğinize özel ${categoryTemplates.length} tema hazır; `
              : 'Tüm temalar seçtiğiniz etkinliğe göre kişiselleştirilir; '}
            dilerseniz son adımda renkleri ve metinleri ince ayarlayabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {visibleTemplates.map((preset, idx) => {
            const isActive = themeChosen && activePresetId === preset.id;
            // Yalnızca yeni gelen parti sırayla belirir; daha önce çizilmiş
            // kartlar yerinde durur (gecikme 0'a iner, yeniden oynatılmaz).
            const delay = idx >= batchStart ? Math.min((idx - batchStart) * CARD_STAGGER, MAX_CARD_DELAY) : 0;
            // Kaydırarak gelen partinin kartları, belirirken üzerlerinden bir
            // parıltı geçerek yerleşir: kullanıcının baktığı yerde, tam
            // içeriğin indiği noktada duran yükleniyor işareti.
            const isArriving = batchRevealing && idx >= batchStart;
            return (
              <motion.button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(preset.id)}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: duration.panel, ease: ease.out, delay }}
                whileHover={{ y: -6, transition: gesture.hover }}
                whileTap={{ scale: 0.97, transition: gesture.press }}
                className={`group relative rounded-2xl overflow-hidden h-44 md:h-60 cursor-pointer text-left transition-shadow duration-300 ${
                  isActive
                    ? 'shadow-xl shadow-brand/25 ring-2 ring-brand ring-offset-2 ring-offset-cream'
                    : 'shadow-sm hover:shadow-2xl hover:shadow-ink/15'
                }`}
              >
                <TemplateCover
                  preset={preset}
                  alt={preset.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-luxe filter brightness-90 group-hover:brightness-95"
                />

                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute top-3 right-3 bg-brand text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10"
                    >
                      <Check size={10} /> Seçili
                    </motion.span>
                  )}
                </AnimatePresence>

                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-5">
                  {/* Alt başlık yeri baştan ayrılır; blok hover'da yalnızca
                      transform ile yukarı kayar (max-height layout'u yok). */}
                  <span className="block translate-y-[1.125rem] group-hover:translate-y-0 transition-transform duration-300 ease-luxe">
                    <span className={`block w-3 h-3 rounded-full ${preset.backgroundStyle} border border-white/40 mb-2 shadow-sm`} />
                    <span className="block font-serif text-base md:text-lg text-white font-bold leading-tight">
                      {preset.name.split(' (')[0]}
                    </span>
                    <span aria-hidden="true" className="block h-4 mt-0.5 text-[10px] leading-4 text-white/70 font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Bu temayla devam et
                    </span>
                  </span>
                </span>

                <AnimatePresence>
                  {isArriving && (
                    <motion.span
                      key="parilti"
                      aria-hidden="true"
                      initial={false}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: ease.out }}
                      className="absolute inset-0 animate-shimmer pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Izgaranın sonu: hem kaydırma tetikleyicisi hem de açık kontrol.
            Sentinel görünüre girdiğinde sonraki parti kendiliğinden yüklenir;
            düğme, otomatik yükleme çalışmadığında (IntersectionObserver yok,
            kısa ekran) yedektir. İki durum yer değiştirirken ızgaranın altı
            zıplamasın diye kap sabit yükseklikte durur. */}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="mt-8 md:mt-10 min-h-[84px] flex flex-col items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {batchRevealing ? (
                <motion.div
                  key="yukleniyor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-2.5"
                >
                  <Loader2 size={20} className="text-brand animate-spin" />
                  <span className="text-muted text-[11px]" role="status">
                    Yeni temalar yükleniyor…
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="daha-fazla"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.button
                    type="button"
                    onClick={showMore}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-2.5 bg-white text-brand border border-brand/20 hover:border-brand/50 px-7 py-3.5 rounded-full font-semibold text-xs shadow-sm hover:shadow-lg hover:shadow-ink/10 transition duration-200 ease-luxe cursor-pointer"
                  >
                    {/* 🔴 Düğmenin KENDİSİ dönmez: tıklama anında parti zaten
                        hazırdır, bekleyen bir ağ turu yoktur. Dönen gösterge
                        yalnızca partinin belirme penceresine aittir. */}
                    Daha fazla tema göster
                    <span className="text-muted font-medium">({remaining})</span>
                    <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                  </motion.button>
                  <span className="text-muted text-[11px]">
                    {visibleTemplates.length} / {categoryTemplates.length} tema gösteriliyor
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}
