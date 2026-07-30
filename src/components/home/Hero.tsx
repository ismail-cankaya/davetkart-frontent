import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, animate, useInView } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: 10, suffix: 'K+', labelKey: 'hero.stats.invitations' },
  { value: 70, suffix: 'B+', labelKey: 'hero.stats.views' },
  { value: 500, suffix: '+', labelKey: 'hero.stats.templates' },
  { value: 100, prefix: '%', suffix: '', labelKey: 'hero.stats.eco' }
];

function StatCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    // Count by writing textContent straight to the DOM node: piping the
    // 60fps ticks through setState re-rendered the component on every
    // frame and blocked the main thread during the hero's entrance.
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_LUXE,
      onUpdate: v => { node.textContent = `${prefix}${Math.round(v)}${suffix}`; }
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix]);

  return (
    <p ref={ref} className="font-serif text-3xl md:text-4xl font-bold text-brand tabular-nums">
      {prefix}0{suffix}
    </p>
  );
}

export const Hero = React.memo(function Hero() {
  const { t } = useTranslation();

  // Headline arrives as lead/accent/tail phrases per language, then gets
  // split into words so the staggered blur-rise reveal survives translation.
  const headline = useMemo(() => {
    const toWords = (key: string, accent: boolean) =>
      t(key).split(' ').filter(Boolean).map(text => ({ text, accent }));
    return [
      ...toWords('hero.headline.lead', false),
      ...toWords('hero.headline.accent', true),
      ...toWords('hero.headline.tail', false)
    ];
  }, [t]);

  return (
    <section className="relative min-h-[100dvh] -mt-[72px] pt-32 pb-20 overflow-hidden bg-cream flex flex-col justify-center bg-grain">

      {/* Arkaplan videosu. z-0 bilinçli: negatif z-index kullanılsaydı katman
          section'ın kendi arkaplanının ARKASINA düşer ve hiç görünmezdi.
          Poster kapsayıcının background'ında (index.css), video ise videonun
          ilk karesiyle aynı görsel — bu yüzden poster→video geçişinde
          "pop" olmuyor ve fade-in hilesine gerek kalmıyor. */}
      <div className="hero-media absolute inset-0 z-0" aria-hidden="true">
        <video
          className="hero-video w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-bg-poster.jpg"
        >
          {/* WebM önce: destekleyen tarayıcı 206 KB indirir, MP4'e (2.3 MB)
              yalnızca Safari düşer. Tarayıcı ilk eşleşen kaynağı seçer. */}
          <source src="/videos/hero-bg.webm" type="video/webm" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-veil absolute inset-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 flex flex-col items-center text-center w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE }}
          className="relative bg-champagne text-brand-deep px-4 py-1.5 rounded-full font-semibold text-xs tracking-wide mb-8 inline-flex items-center gap-1.5 shadow-sm border border-brand-deep/10 overflow-hidden"
        >
          <div className="absolute inset-0 animate-shimmer" />
          <Sparkles size={14} className="text-gold animate-pulse relative z-10" />
          <span className="relative z-10">{t('hero.badge')}</span>
        </motion.div>

        {/* Headline — staggered word reveal */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ink max-w-4xl mx-auto leading-[1.12] md:leading-[1.1] mb-6 font-bold tracking-tight">
          {headline.map((word, idx) => (
            <span key={`${word.text}-${idx}`} className="inline-block overflow-hidden align-bottom pb-1">
              <motion.span
                initial={{ opacity: 0, y: '70%', filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: EASE_LUXE, delay: 0.15 + idx * 0.09 }}
                className={`inline-block me-[0.28em] ${word.accent ? 'text-brand italic font-medium' : ''}`}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.55 }}
          className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
        >
          <Link
            to="/create"
            className="group relative overflow-hidden bg-brand text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-brand-soft transition-all duration-500 shadow-lg shadow-brand/20 flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/30"
          >
            <span className="absolute inset-0 animate-shimmer pointer-events-none" />
            {t('hero.ctaPrimary')}
            <ArrowRight size={16} className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/create"
            className="bg-white/70 backdrop-blur-sm text-brand border border-brand/15 px-8 py-4 rounded-full font-semibold text-sm hover:bg-white hover:border-brand/30 transition-all duration-500 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
          >
            {t('hero.ctaSecondary')}
          </Link>
        </motion.div>

        {/* Hero Stats with count-up */}
        <motion.div
          id="hero-stats"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: EASE_LUXE }}
          className="mt-20 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-ink/10 pt-12 text-center"
        >
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.labelKey}
              className="p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95 + idx * 0.1, ease: EASE_LUXE }}
            >
              <StatCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="text-xs text-muted uppercase tracking-wider font-semibold mt-2">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Aurora blob'lar kaldırıldı: video zaten aynı işi (yavaş sürüklenen
          yumuşak renk kütleleri) kendi içinde yapıyor. İkisi üst üste
          binince görüntü çamurlaşıyor, ayrıca üç adet blur-3xl yüzeyin
          sürekli kompozisyonu video kod çözme ile aynı anda çalışıyordu.
          Geri istenirse: bu bloğun eski hâli git geçmişinde duruyor. */}

      {/* Scroll indicator */}
      <motion.a
        href="#animasyon-ve-onizleme"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 cursor-pointer group"
      >
        <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold group-hover:text-brand transition-colors">{t('hero.explore')}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-brand/20 flex items-start justify-center pt-1.5 group-hover:border-brand/40 transition-colors"
        >
          <div className="w-1 h-2 bg-brand/40 rounded-full group-hover:bg-brand/60 transition-colors" />
        </motion.div>
      </motion.a>
    </section>
  );
});
