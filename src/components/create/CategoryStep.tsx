import React from 'react';
import { motion } from 'motion/react';
import {
  Baby, Building2, Cake, Check, Gem, GraduationCap, Heart, LucideIcon, MoonStar, PartyPopper, Sparkles
} from 'lucide-react';
import { EVENT_CATEGORIES, getTemplatesForCategory } from '../../data';
import { useCreateWizardStore } from '../../stores/useCreateWizardStore';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { scrollToTarget } from '../../hooks/useLenis';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

/** Decorative silhouette per category — a UI concern, kept out of the data layer. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  dugun: Heart,
  kina: Sparkles,
  nisan: Gem,
  sunnet: MoonStar,
  'dogum-gunu': Cake,
  mezuniyet: GraduationCap,
  'baby-shower': Baby,
  parti: PartyPopper,
  kurumsal: Building2
};

/**
 * Wizard step 1 — "Ne için davetiye oluşturmak istiyorsunuz?"
 * Picking a category reveals the theme step below and glides down to it.
 */
export function CategoryStep() {
  const categoryId = useCreateWizardStore(s => s.categoryId);
  const selectCategory = useCreateWizardStore(s => s.selectCategory);
  const updateField = useInvitationStore(s => s.updateField);
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const selectTemplate = useInvitationStore(s => s.selectTemplate);

  const handleSelect = (id: string) => {
    const category = EVENT_CATEGORIES.find(c => c.id === id);
    selectCategory(id);
    // Seed the badge text so the preview speaks the event's language right away,
    // and record the category on the invitation so the modular templates can
    // pick the matching flavor (dugun/kina/nisan).
    updateField('categoryId', id);
    if (category) updateField('title', category.suggestedTitle);
    // If the previously previewed template doesn't belong to this category,
    // fall back to the category's first template so the preview stays coherent.
    const categoryTemplates = getTemplatesForCategory(id);
    if (!categoryTemplates.some(t => t.id === activePresetId) && categoryTemplates.length > 0) {
      selectTemplate(categoryTemplates[0].id);
    }
    // The theme step mounts on this state change; wait a frame before gliding.
    window.setTimeout(() => scrollToTarget('sihirbaz-tema'), 120);
  };

  return (
    <section className="pt-16 md:pt-24 pb-10 md:pb-16 bg-cream relative overflow-hidden">
      {/* Ambient washes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/3 w-[480px] h-[480px] bg-champagne/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block">
            Adım 1 / 3 — Etkinlik Türü
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink mt-5 leading-tight">
            Ne için davetiye <span className="italic text-brand font-medium">oluşturmak</span> istiyorsunuz?
          </h1>
          <p className="text-muted text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Etkinliğinizi seçin; size özel temaları ve akıllı davet formunu hemen hazırlayalım.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {EVENT_CATEGORIES.map((category, idx) => {
            const Icon = CATEGORY_ICONS[category.id] ?? Sparkles;
            const isActive = categoryId === category.id;
            return (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.15 + idx * 0.06 }}
                whileHover={{ scale: 1.035, y: -6 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative text-left rounded-3xl p-5 md:p-6 min-h-[150px] md:min-h-[176px] overflow-hidden cursor-pointer border transition-[box-shadow,border-color,background-color] duration-500 ${
                  isActive
                    ? 'bg-brand text-white border-brand shadow-xl shadow-brand/25'
                    : 'bg-white/80 backdrop-blur-sm text-ink border-brand/10 shadow-sm hover:shadow-2xl hover:shadow-ink/10 hover:border-gold/40'
                }`}
              >
                {/* Understated classic lattice behind the content */}
                <span className={`absolute inset-0 pattern-elegant pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-[0.08] invert' : 'opacity-[0.05]'}`} />
                {/* Oversized silhouette bleeding off the corner */}
                <Icon
                  className={`absolute -bottom-5 -right-4 w-24 h-24 md:w-28 md:h-28 -rotate-12 pointer-events-none transition-all duration-700 group-hover:rotate-[-6deg] group-hover:scale-110 ${
                    isActive ? 'text-white/15' : 'text-brand/[0.07]'
                  }`}
                  strokeWidth={1.2}
                />

                <span className="relative z-10 flex flex-col h-full">
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-500 ${
                      isActive ? 'bg-white/15 text-champagne' : 'bg-champagne/60 text-brand group-hover:bg-champagne'
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="font-serif text-lg md:text-xl font-bold leading-snug">{category.label}</span>
                  <span className={`text-[11px] mt-1.5 leading-relaxed ${isActive ? 'text-white/70' : 'text-muted'}`}>
                    {category.description}
                  </span>
                </span>

                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-champagne text-brand-deep flex items-center justify-center shadow-md z-10"
                  >
                    <Check size={13} strokeWidth={3} />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
