import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { PenLine, ArrowRight } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { PreviewSection } from '../components/preview/PreviewSection';
import { DeferredSection } from '../components/ui/DeferredSection';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

const Features = React.lazy(() => import('../components/home/Features').then(m => ({ default: m.Features })));
const LiveRsvpPanel = React.lazy(() => import('../components/rsvp/LiveRsvpPanel').then(m => ({ default: m.LiveRsvpPanel })));
const Testimonials = React.lazy(() => import('../components/home/Testimonials').then(m => ({ default: m.Testimonials })));

/**
 * Showcase CTA right under the template/preview area: browsing is free-form
 * on the landing page, detailed editing lives in the /create studio.
 */
function CreateCtaBanner() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="pb-16 md:pb-24 bg-cream">
      <motion.div
        // `transform` dizesi: Motion bunu compositor'a devredebilir (bkz. TemplateGrid).
        initial={reduceMotion ? false : { opacity: 0, transform: 'translateY(25px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className="max-w-3xl mx-auto px-4 text-center space-y-5"
      >
        <p className="text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Beğendiğiniz şablonu seçtiniz mi? Tasarım stüdyosunda isimleri, tarihi ve davet
          mesajınızı ekleyerek davetiyenizi dakikalar içinde kişiselleştirin.
        </p>
        <Link
          to="/create"
          className="group relative overflow-hidden inline-flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-semibold text-sm md:text-base hover:bg-brand-soft transition-all duration-500 shadow-lg shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-1"
        >
          <span className="absolute inset-0 animate-shimmer pointer-events-none" />
          <PenLine size={17} />
          Kendi Davetiyeni Oluştur
          <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </Link>
        <p className="text-muted text-[11px]">Giriş gerekmez · İlk davetiye %60 indirimli</p>
      </motion.div>
    </section>
  );
}

/**
 * Landing page: hero, the template showcase with the live phone preview
 * (shared PreviewSection — the same component the /create studio uses),
 * feature highlights and social proof. No editing tools here.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PreviewSection />
      <CreateCtaBanner />
      <React.Suspense
        fallback={
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {/* 🔴 Features bilerek ERTELENMEZ. Hero snap'i önizleme bölümüne indiğinde
            Features görünür alana çok yakındır; ertelenseydi ilk çizimi (tek
            karede stil + layout) tam ilk kaydırmanın ortasına düşerdi. 4× CPU
            yavaşlatmasıyla ölçüldü: ertelendiğinde en uzun görev ~590 ms,
            ertelenmediğinde ~85 ms. */}
        <Features />
        {/* Daha aşağıdaki bölümler kullanıcı yaklaşana kadar çizilmez.
            Tahmini yükseklikler 390 / 768 / 1440 px genişlikte ölçüldü. */}
        {/* Vitrin: canlı katılım takibi — ziyaretçi önizlemedeki RSVP formuyla deneyebilir */}
        <DeferredSection estimateClassName="[--defer-height:970px]">
          <LiveRsvpPanel />
        </DeferredSection>
        <DeferredSection estimateClassName="[--defer-height:1160px] md:[--defer-height:825px] lg:[--defer-height:720px]">
          <Testimonials />
        </DeferredSection>
      </React.Suspense>
    </>
  );
}
