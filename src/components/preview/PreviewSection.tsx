import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DeviceSimulator } from './DeviceSimulator';
import { TemplateGrid } from './TemplateGrid';
import { ease } from '../../utils/motion';

export const PreviewSection = React.memo(function PreviewSection() {
  // Shared between the grid (scroll target on mobile) and the simulator (the device itself).
  const simulatorRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="animasyon-ve-onizleme" className="py-12 md:py-20 bg-cream relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Mobile-only section header */}
        <motion.div
          // `transform` dizesi: Motion bunu compositor'a devredebilir (bkz. TemplateGrid).
          initial={reduceMotion ? false : { opacity: 0, transform: 'translateY(20px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
          className="lg:hidden text-center mb-8"
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block">
            Canlı Önizleme
          </span>
          <h2 className="font-serif text-2xl font-bold text-ink mt-3 mb-2">
            Davetiyenizi <span className="italic text-brand font-medium">Görüntüleyin</span>
          </h2>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Aşağıdan bir kategori seçerek önizlemeyi canlı olarak güncelleyebilirsiniz.
          </p>
        </motion.div>

        {/* Columns re-balance when the simulator switches to the wide laptop frame. */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center lg:items-start justify-center">
          <TemplateGrid simulatorRef={simulatorRef} />

          {/* Tanıtım modu: taslak boşken örnek içerikle çizilir. */}
          <DeviceSimulator simulatorRef={simulatorRef} showcase />
        </div>
      </div>
    </section>
  );
});
