import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, ChevronRight, Mail, ScrollText } from 'lucide-react';
import { ease } from '../../utils/motion';

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Altın çerçeveli vurgu kutusunda gösterilen önemli not. */
  note?: string;
}

export interface LegalRelatedLink {
  to: string;
  label: string;
  description: string;
}

interface LegalPageLayoutProps {
  badge: string;
  title: string;
  accent: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
  related: LegalRelatedLink[];
}

/** İçindekiler menüsünde o an okunan bölümü vurgulayan scroll-spy. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Viewport'un üst çeyreğine giren bölüm "okunuyor" kabul edilir.
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * Yasal sayfaların (kullanım şartları, gizlilik, çerez politikası) ortak
 * iskeleti: koyu zemin üzerinde başlık bandı, masaüstünde yapışkan
 * içindekiler menüsü ve numaralandırılmış bölümler. İçerik tamamen
 * veri odaklıdır — sayfalar yalnızca bölüm listesini tanımlar.
 */
export function LegalPageLayout({ badge, title, accent, intro, lastUpdated, sections, related }: LegalPageLayoutProps) {
  const sectionIds = useMemo(() => sections.map(s => s.id), [sections]);
  const activeId = useActiveSection(sectionIds);

  return (
    <div className="bg-cream">
      {/* Başlık bandı */}
      <section className="relative bg-brand-deep text-white overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-800/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out }}
            className="max-w-3xl space-y-5"
          >
            <nav className="flex items-center gap-1.5 text-xs text-emerald-100/50" aria-label="breadcrumb">
              <Link to="/" className="hover:text-champagne transition-colors">Anasayfa</Link>
              <ChevronRight size={12} />
              <span className="text-emerald-100/80">{title} {accent}</span>
            </nav>

            <span className="inline-flex items-center gap-1.5 bg-gold/15 text-gold border border-gold/25 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase">
              <ScrollText size={13} />
              {badge}
            </span>

            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              {title} <span className="italic text-champagne font-medium">{accent}</span>
            </h1>

            <p className="text-emerald-100/60 text-sm md:text-base leading-relaxed">{intro}</p>

            <span className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 text-emerald-50/80 px-3.5 py-2 rounded-full text-xs font-medium">
              <CalendarDays size={13} className="text-gold" />
              Son güncelleme: {lastUpdated}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Gövde: içindekiler + bölümler */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 space-y-4">
            <h2 className="text-xs uppercase font-bold text-brand tracking-[0.15em]">İçindekiler</h2>
            <nav className="space-y-1 border-s border-ink/10">
              {sections.map((section, idx) => {
                const isActive = activeId === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`relative flex items-baseline gap-2.5 ps-4 py-1.5 text-xs leading-snug transition-all duration-300 ${
                      isActive ? 'text-brand font-semibold' : 'text-muted hover:text-brand'
                    }`}
                  >
                    <span
                      className={`absolute start-0 top-0 h-full w-px bg-gold transition-transform duration-300 origin-top ${
                        isActive ? 'scale-y-100' : 'scale-y-0'
                      }`}
                    />
                    <span className="font-serif text-[10px] font-bold text-gold shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {section.title}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        <article className="lg:col-span-9 space-y-12 md:space-y-14">
          {sections.map((section, idx) => (
            <motion.section
              key={section.id}
              id={section.id}
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: ease.out }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-sm font-bold text-gold">{String(idx + 1).padStart(2, '0')}</span>
                <span className="h-px w-8 bg-gold/40" />
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-ink mb-4">{section.title}</h2>

              <div className="space-y-4">
                {section.paragraphs?.map(paragraph => (
                  <p key={paragraph.slice(0, 40)} className="text-muted text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="space-y-2.5">
                    {section.bullets.map(bullet => (
                      <li key={bullet.slice(0, 40)} className="flex items-start gap-3 text-muted text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <div className="bg-champagne/25 border-s-2 border-gold rounded-e-2xl px-5 py-4 text-ink/80 text-sm leading-relaxed">
                    {section.note}
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </article>
      </div>

      {/* İlgili politikalar + iletişim */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-24 space-y-10">
        <div className="h-px bg-ink/10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {related.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="group rounded-3xl bg-white border border-ink/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-brand/10 hover:border-brand/15 transition-all duration-500 hover:-translate-y-1"
            >
              <h3 className="font-serif text-lg font-bold text-ink mb-1.5 flex items-center justify-between gap-2">
                {link.label}
                <ArrowRight size={16} className="text-gold group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
              </h3>
              <p className="text-muted text-xs leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-[2rem] bg-brand-deep text-white border border-gold/15 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-700/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-1.5 text-center md:text-start">
            <h3 className="font-serif text-xl md:text-2xl font-bold">Sorularınız mı var?</h3>
            <p className="text-emerald-100/60 text-sm">
              Bu metinle ilgili her türlü soru ve başvurunuz için bize ulaşabilirsiniz.
            </p>
          </div>
          <Link
            to="/contact"
            className="relative z-10 inline-flex items-center gap-2.5 bg-champagne text-brand-deep px-7 py-3.5 rounded-full font-bold text-sm hover:bg-gold transition-all duration-300 hover:-translate-y-0.5 shrink-0"
          >
            <Mail size={15} />
            İletişime Geçin
          </Link>
        </div>
      </div>
    </div>
  );
}
