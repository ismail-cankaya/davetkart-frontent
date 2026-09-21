import React from 'react';
import { motion } from 'motion/react';
import { ease } from '../../utils/motion';

interface PageHeaderProps {
  badge: string;
  title: string;
  /** Serif italik vurgulanan başlık parçası. */
  accent: string;
  /** Vurgudan sonra gelen isteğe bağlı başlık kuyruğu. */
  tail?: string;
  description: string;
  icon?: React.ReactNode;
}

/**
 * Kurumsal sayfaların (hakkımızda, fiyatlandırma, sürdürülebilirlik,
 * iletişim) açık zeminli ortak başlık bölümü — ana sayfa bölüm
 * başlıklarıyla aynı görsel dili taşır.
 */
export function PageHeader({ badge, title, accent, tail, description, icon }: PageHeaderProps) {
  return (
    <section className="relative pt-16 md:pt-24 pb-12 md:pb-16 bg-cream overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-96 h-96 bg-champagne/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: ease.out }}
        className="max-w-3xl mx-auto px-4 text-center space-y-5 relative z-10"
      >
        <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full">
          {icon}
          {badge}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink leading-tight">
          {title} <span className="italic text-brand font-medium">{accent}</span>
          {tail ? <> {tail}</> : null}
        </h1>
        <p className="text-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">{description}</p>
      </motion.div>
    </section>
  );
}
