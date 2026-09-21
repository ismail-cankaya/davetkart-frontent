import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Laptop, Send, ArrowRight, WandSparkles, Palette, Zap, Layers } from 'lucide-react';
import { ease } from '../../utils/motion';

const STEPS = [
  {
    step: '01',
    title: 'Şablon Seçin',
    desc: 'Düğün, nişan, baby shower, doğum günü veya kurumsal etkinlik — hayalinizdeki konsepte uygun premium şablonu seçin.',
    icon: <Sparkles size={22} />
  },
  {
    step: '02',
    title: 'Kişiselleştirin',
    desc: 'İsimleri, tarihi, mekanı ve özel mesajınızı girin. Canlı önizlemede her değişikliği anında görün.',
    icon: <Laptop size={22} />
  },
  {
    step: '03',
    title: 'Paylaşın & Takip Edin',
    desc: 'WhatsApp, SMS veya e-posta ile gönderin. Canlı katılım panelinden katılım durumlarını anlık takip edin.',
    icon: <Send size={22} />
  }
];

export const Features = React.memo(function Features() {
  return (
    <section id="neden-dijital" className="py-20 md:py-32 bg-cream relative overflow-hidden scroll-mt-20">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-champagne/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Basit 3 Adım
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-ink mb-4">
            Nasıl <span className="italic text-brand font-medium">Çalışır?</span>
          </h2>
          <p className="text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Dijital davetiyenizi dakikalar içinde oluşturun ve sevdiklerinizle anında paylaşın.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              className="relative group rounded-3xl bg-white border border-ink/[0.06] p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-brand/10 hover:border-brand/15 transition duration-300 ease-luxe hover:-translate-y-2 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease.out, delay: idx * 0.15 }}
            >
              {/* Ghost step numeral */}
              <span className="absolute -top-6 right-2 font-serif text-[7rem] leading-none font-bold text-brand/[0.05] group-hover:text-gold/15 transition-colors duration-200 select-none pointer-events-none">
                {item.step}
              </span>

              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-champagne group-hover:scale-105 transition duration-300 ease-luxe">
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-serif text-sm font-bold text-gold">{item.step}</span>
                <span className="h-px w-8 bg-gold/40" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-ink mb-3">
                {item.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Connector line (between cards on desktop) */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 lg:-right-5 w-6 lg:w-10 h-px bg-gradient-to-r from-brand/25 to-transparent z-20" />
              )}
            </motion.div>
          ))}
        </div>

        {/* AI Theme Designer Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: ease.out }}
          className="relative mt-16 md:mt-24 rounded-[2rem] overflow-hidden bg-brand-deep text-white border border-gold/15 shadow-2xl shadow-brand/25"
        >
          {/* Ambient glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-700/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 md:p-14">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 bg-gold/15 text-gold border border-gold/25 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase">
                <Sparkles size={13} /> İlk Sürümde Sizlerle
              </span>
              <h3 className="font-serif text-2xl md:text-4xl font-bold leading-tight">
                Yapay Zeka ile <span className="italic text-champagne font-medium">Size Özel</span> Tema Tasarımları
              </h3>
              <p className="text-emerald-100/70 text-sm md:text-base leading-relaxed max-w-xl">
                Hayalinizdeki davetiyeyi birkaç cümleyle anlatın; yapay zeka renk paletinden tipografiye,
                süslemelerden animasyonlara kadar tamamen size özel bir tema tasarlasın. Koleksiyonumuz
                her geçen gün yeni tasarımlarla büyüyor — yapay zeka destekli tasarımcıyla seçenekler sınırsız.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  { icon: <Palette size={13} />, label: 'Kişiye özel renk paleti' },
                  { icon: <Zap size={13} />, label: 'Saniyeler içinde önizleme' },
                  { icon: <Layers size={13} />, label: 'Sürekli büyüyen koleksiyon' }
                ].map(chip => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/10 text-emerald-50/90 px-3.5 py-2 rounded-full text-xs font-medium backdrop-blur-sm"
                  >
                    <span className="text-gold">{chip.icon}</span>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-52 h-52 md:w-64 md:h-64">
                {/* Döngü bütçesi: illüstrasyonda tek döngü — yavaş dönen dış halka
                    (CSS, compositor'da). Merkez karo backdrop-blur taşıdığı için
                    ölçeklenmez; nefes alsaydı her karede yeniden bulanıklaşırdı. */}
                <div className="animate-spin-40s absolute inset-0 rounded-full border border-dashed border-gold/25" />
                <div className="absolute inset-6 rounded-full border border-dashed border-champagne/20" />
                <div className="absolute inset-0 m-auto w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-gold/25 to-emerald-700/30 border border-gold/30 backdrop-blur-sm flex items-center justify-center text-champagne shadow-xl shadow-black/20">
                  <WandSparkles size={40} />
                </div>
                <span className="absolute top-3 right-8 text-gold">
                  <Sparkles size={18} />
                </span>
                <span className="absolute bottom-6 left-6 text-champagne">
                  <Sparkles size={14} />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.4 }}
        >
          <Link
            to="/create"
            className="group relative overflow-hidden inline-flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-semibold text-sm hover:bg-brand-soft transition duration-200 ease-luxe shadow-lg shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-1"
          >
            <span className="absolute inset-0 animate-shimmer pointer-events-none" />
            Hemen Başlayın
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          <p className="text-muted text-xs mt-4">Kredi kartı gerektirmez · İlk davetiye %60 indirimli</p>
        </motion.div>
      </div>
    </section>
  );
});
