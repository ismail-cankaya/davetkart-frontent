import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, LayoutGrid, PenLine, WandSparkles } from 'lucide-react';
import { FEATURED_TEMPLATES, TEMPLATE_PRESETS, getCategoryLabel } from '../../data';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useUIStore } from '../../stores/useUIStore';
import { TemplateCover } from './TemplateCover';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

interface TemplateGridProps {
  simulatorRef: React.RefObject<HTMLDivElement>;
}

export function TemplateGrid({ simulatorRef }: TemplateGridProps) {
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const categoryId = useInvitationStore(s => s.invitation.categoryId);
  const selectTemplate = useInvitationStore(s => s.selectTemplate);
  const updateField = useInvitationStore(s => s.updateField);
  const isMobile = useUIStore(s => s.isMobile);
  const previewDevice = useUIStore(s => s.previewDevice);
  const navigate = useNavigate();

  // Showcase slots — the 5 most popular designs, each pinned to one category.
  const featured = FEATURED_TEMPLATES.flatMap((slot) => {
    const preset = TEMPLATE_PRESETS.find((p) => p.id === slot.presetId);
    return preset ? [{ ...slot, preset }] : [];
  });

  const handleSelect = (presetId: string, slotCategoryId: string) => {
    // Keep the category in sync so the preview renders the matching flavor.
    updateField('categoryId', slotCategoryId);
    selectTemplate(presetId);
    // On mobile the simulator sits below the grid — bring it into view.
    if (isMobile) simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <motion.div
      className={`w-full flex flex-col justify-center space-y-4 lg:space-y-6 pt-4 transition-[width] duration-700 ${
        previewDevice === 'laptop' ? 'lg:w-2/5' : 'lg:w-1/2'
      }`}
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 1, ease: EASE_LUXE }}
    >
      <div className="mb-4 text-center lg:text-left hidden lg:block">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_LUXE }}
          className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block"
        >
          En Popüler Tasarımlar
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.1 }}
          className="font-serif text-3xl md:text-4xl font-bold text-ink mt-4 mb-3"
        >
          Her Etkinliğe Özel <br className="hidden lg:block" />
          <span className="italic text-brand font-medium font-serif">Koleksiyonlar</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.2 }}
          className="text-muted text-sm md:text-base max-w-md mx-auto lg:mx-0"
        >
          En sevilen tasarımlarımızı seçin ve sağdaki canlı cihaz önizlemesinden anında görüntüleyin.
        </motion.p>
      </div>

      {/* Featured showcase — 5 popular designs + "view all" CTA in slot 6 */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 scroll-mt-24" id="koleksiyonlar">
        {featured.map(({ preset, categoryId: slotCategoryId }, idx) => {
          const isActive = activePresetId === preset.id && categoryId === slotCategoryId;
          return (
            <motion.div
              key={`${slotCategoryId}-${preset.id}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.7, ease: EASE_LUXE, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(preset.id, slotCategoryId)}
              className={`group relative rounded-2xl overflow-hidden h-36 lg:h-48 cursor-pointer transition-shadow duration-700 ${isActive
                  ? 'shadow-xl shadow-brand/20 ring-2 ring-brand ring-offset-2 ring-offset-cream'
                  : 'shadow-sm hover:shadow-2xl hover:shadow-ink/15'
                }`}
            >
              <TemplateCover
                preset={preset}
                alt={`${getCategoryLabel(slotCategoryId)} — ${preset.name}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1200ms] ease-out filter brightness-90 md:brightness-[0.82] group-hover:brightness-95"
              />

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute top-3 right-3 bg-brand text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10"
                  >
                    <Check size={10} /> Seçili
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category first (loud), design name second (soft & elegant) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className={`w-3 h-3 rounded-full ${preset.backgroundStyle} border border-white/40 mb-2 shadow-sm`} />
                <h3 className="text-white font-bold text-sm lg:text-base tracking-[0.18em] uppercase leading-tight translate-y-0 group-hover:-translate-y-0.5 transition-transform duration-500">
                  {getCategoryLabel(slotCategoryId)}
                </h3>
                <p className="font-serif italic text-[11px] lg:text-xs text-white/85 font-medium mt-0.5">
                  {preset.name.split(' (')[0]}
                </p>
                <p className="text-[10px] text-white/70 font-medium tracking-wide max-h-0 opacity-0 group-hover:max-h-6 group-hover:opacity-100 group-hover:mt-0.5 transition-all duration-500 overflow-hidden">
                  Önizlemek için tıklayın
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Slot 6 — gateway to the full design studio */}
        <motion.button
          type="button"
          onClick={() => navigate('/create')}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: featured.length * 0.08 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.97 }}
          className="group relative rounded-2xl overflow-hidden h-36 lg:h-48 cursor-pointer bg-gradient-to-br from-brand via-brand-deep to-emerald-950 text-left shadow-sm hover:shadow-2xl hover:shadow-brand/30 transition-shadow duration-700"
        >
          {/* Understated lattice + glow to keep the CTA premium, not empty */}
          <span className="absolute inset-0 pattern-elegant opacity-[0.08] invert pointer-events-none" />
          <span className="absolute -top-10 -right-10 w-36 h-36 bg-gold/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <span className="relative z-10 h-full flex flex-col justify-between p-5">
            <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-champagne flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
              <LayoutGrid size={17} />
            </span>
            <span>
              <span className="block text-white font-bold text-sm lg:text-base tracking-[0.18em] uppercase leading-tight">
                Tüm Tasarımları
              </span>
              <span className="font-serif italic text-[11px] lg:text-xs text-white/85 font-medium mt-0.5 flex items-center gap-1.5">
                Görüntüle
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </span>
          </span>
        </motion.button>

        {/* Coming soon: AI-designed themes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.35 }}
          className="col-span-2 group relative rounded-2xl border-2 border-dashed border-brand/15 bg-white/60 hover:border-gold/50 hover:bg-white transition-all duration-500 p-5 flex items-center gap-4 cursor-default"
        >
          <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-champagne to-gold/30 text-brand flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <WandSparkles size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-serif text-sm font-bold text-ink flex items-center gap-2">
              Yapay Zeka ile Size Özel Tasarımlar
              <span className="text-[9px] font-sans font-semibold uppercase tracking-wider bg-gold/15 text-brand-deep px-2 py-0.5 rounded-full border border-gold/25">Yeni</span>
            </h3>
            <p className="text-[11px] text-muted mt-1 leading-relaxed">
              Hayalinizdeki temayı birkaç cümleyle anlatın; yapay zeka tamamen size özel bir tasarım oluştursun. Yapay Zeka DavetKart'ta.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Info Box - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.5 }}
        className="bg-champagne/30 p-4 rounded-2xl border border-champagne hidden lg:flex items-start gap-4 mt-4 hover:bg-champagne/50 transition-colors duration-500"
      >
        <div className="p-2 rounded-xl bg-white text-brand shadow-sm mt-0.5">
          <PenLine size={16} />
        </div>
        <div>
          <h4 className="font-semibold text-xs text-brand-deep uppercase tracking-wider">Metinleri Düzenleyin</h4>
          <p className="text-xs text-muted mt-1">
            <strong>"Davetiye Tasarımcısı"</strong> bölümünden davetiye içeriklerini dilediğiniz gibi güncelleyebilirsiniz.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
