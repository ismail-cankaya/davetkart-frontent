import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { getTemplatesForCategory } from '../../data';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useCreateWizardStore, useActiveCategory } from '../../stores/useCreateWizardStore';
import { scrollToTarget } from '../../hooks/useLenis';
import { TemplateCover } from '../preview/TemplateCover';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

/**
 * Wizard step 2a — theme gallery. Picking a theme reveals the details form
 * below and glides down to it.
 */
export function ThemeStep() {
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const selectTemplate = useInvitationStore(s => s.selectTemplate);
  const themeChosen = useCreateWizardStore(s => s.themeChosen);
  const markThemeChosen = useCreateWizardStore(s => s.markThemeChosen);
  const activeCategory = useActiveCategory();

  // Only the templates belonging to the picked category (dugun → düğün temaları…).
  const categoryTemplates = getTemplatesForCategory(activeCategory?.id ?? null);

  const handleSelect = (id: string) => {
    selectTemplate(id);
    markThemeChosen();
    window.setTimeout(() => scrollToTarget('sihirbaz-form'), 120);
  };

  return (
    <motion.section
      id="sihirbaz-tema"
      className="py-12 md:py-16 bg-cream scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.9, ease: EASE_LUXE }}
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
              ? `${activeCategory.label} etkinliğinize özel ${categoryTemplates.length} tema listeleniyor; `
              : 'Tüm temalar seçtiğiniz etkinliğe göre kişiselleştirilir; '}
            dilerseniz son adımda renkleri ve metinleri ince ayarlayabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {categoryTemplates.map((preset, idx) => {
            const isActive = themeChosen && activePresetId === preset.id;
            return (
              <motion.button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(preset.id)}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE_LUXE, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative rounded-2xl overflow-hidden h-44 md:h-60 cursor-pointer text-left transition-shadow duration-700 ${
                  isActive
                    ? 'shadow-xl shadow-brand/25 ring-2 ring-brand ring-offset-2 ring-offset-cream'
                    : 'shadow-sm hover:shadow-2xl hover:shadow-ink/15'
                }`}
              >
                <TemplateCover
                  preset={preset}
                  alt={preset.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1200ms] ease-out filter brightness-90 group-hover:brightness-95"
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
                  <span className={`w-3 h-3 rounded-full ${preset.backgroundStyle} border border-white/40 mb-2 shadow-sm`} />
                  <span className="font-serif text-base md:text-lg text-white font-bold leading-tight">
                    {preset.name.split(' (')[0]}
                  </span>
                  <span className="text-[10px] text-white/70 font-medium tracking-wide max-h-0 opacity-0 group-hover:max-h-6 group-hover:opacity-100 group-hover:mt-0.5 transition-all duration-500 overflow-hidden">
                    Bu temayla devam et
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
