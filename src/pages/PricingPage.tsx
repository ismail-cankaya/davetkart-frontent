import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BadgePercent, Check, ChevronDown, Crown, Gem, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { ease } from '../utils/motion';

interface Plan {
  name: string;
  tagline: string;
  price: number;
  firstInvitationPrice: number;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Zarif',
    tagline: 'Sade ve şık bir başlangıç',
    price: 349,
    firstInvitationPrice: 139,
    icon: <Sparkles size={20} />,
    features: [
      'Klasik şablon koleksiyonu',
      '100 davetliye kadar LCV takibi',
      'Konum ve takvim entegrasyonu',
      '6 fotoğrafa kadar galeri',
      '3 ay yayın süresi',
      'E-posta desteği'
    ]
  },
  {
    name: 'Prestij',
    tagline: 'En çok tercih edilen deneyim',
    price: 549,
    firstInvitationPrice: 219,
    icon: <Gem size={20} />,
    highlighted: true,
    features: [
      'Tüm premium şablonlar',
      'Sınırsız davetli ve LCV takibi',
      'Fon müziği ve zarf açılış animasyonu',
      'Sınırsız fotoğraf galerisi',
      'Etkinlik akışı (zaman çizelgesi)',
      '12 ay yayın süresi',
      'Öncelikli destek'
    ]
  },
  {
    name: 'İhtişam',
    tagline: 'Tamamen size özel tasarım',
    price: 949,
    firstInvitationPrice: 379,
    icon: <Crown size={20} />,
    features: [
      'Prestij paketindeki her şey',
      'Yapay zeka ile size özel tema tasarımı',
      'Tasarım ekibinden birebir revizyon desteği',
      'Çok dilli davetiye (10 dil)',
      'Hediye kaydı (takı/altın listesi) modülü',
      '24 ay yayın süresi',
      'Özel müşteri temsilcisi'
    ]
  }
];

const FAQS = [
  {
    q: 'Ödeme tek seferlik mi, abonelik mi?',
    a: 'Tüm paketler tek seferlik ödemedir; abonelik veya gizli yenileme ücreti yoktur. Bir kez ödersiniz, davetiyeniz paketinizin yayın süresi boyunca yayında kalır.'
  },
  {
    q: 'İlk davetiye indirimi nasıl çalışır?',
    a: 'Yeni üyelerimizin ilk davetiyesinde tüm paketlerde %60 indirim uygulanır. İndirim, ödeme adımında otomatik olarak yansıtılır; kupon kodu gerekmez.'
  },
  {
    q: 'Ödeme yapmadan davetiyemi tasarlayabilir miyim?',
    a: 'Evet. Tasarım stüdyosunda davetiyenizi ücretsiz oluşturabilir, canlı önizlemede her ayrıntısını inceleyebilirsiniz. Ödeme yalnızca davetiyenizi yayınlayıp paylaşmak istediğinizde gereklidir.'
  },
  {
    q: 'Yayın süresi bittiğinde ne olur?',
    a: 'Yayın süresi sonunda davetiyeniz erişime kapanır; ancak tasarımınız ve LCV kayıtlarınız hesabınızda saklanır. Dilerseniz küçük bir ücretle yayın sürenizi uzatabilirsiniz.'
  },
  {
    q: 'İade alabilir miyim?',
    a: 'Davetiyeniz henüz yayınlanmamışsa 14 gün içinde koşulsuz iade talep edebilirsiniz. Ayrıntılar için Kullanım Şartları sayfamızın "Cayma Hakkı ve İade Koşulları" bölümüne göz atabilirsiniz.'
  }
];

function FaqItem({ faq, isOpen, onToggle }: { faq: (typeof FAQS)[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-ink/[0.06] shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className={`font-serif text-sm md:text-base font-bold transition-colors duration-300 ${isOpen ? 'text-brand' : 'text-ink group-hover:text-brand'}`}>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: ease.out }}
          className="text-gold shrink-0"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: ease.out }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted text-sm leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-cream">
      <PageHeader
        badge="Fiyatlandırma"
        icon={<BadgePercent size={13} />}
        title="Şeffaf Fiyat,"
        accent="Abonelik Yok"
        description="Davetiyenizi ücretsiz tasarlayın, yalnızca yayınlarken ödeyin. Tek seferlik ödeme — gizli ücret ve otomatik yenileme yok."
      />

      {/* İlk davetiye indirimi bandı */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 mb-12 md:mb-16"
      >
        <div className="flex items-center justify-center gap-2.5 bg-gold/10 border border-gold/25 text-brand rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-center">
          <BadgePercent size={16} className="text-gold shrink-0" />
          Yeni üyelere özel: ilk davetiyenizde tüm paketlerde %60 indirim — ödeme adımında otomatik uygulanır.
        </div>
      </motion.div>

      {/* Paketler */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease.out, delay: idx * 0.12 }}
              className={`relative flex flex-col rounded-[2rem] p-8 md:p-9 transition-all duration-700 hover:-translate-y-2 ${
                plan.highlighted
                  ? 'bg-brand-deep text-white border border-gold/25 shadow-2xl shadow-brand/30 md:-my-3'
                  : 'bg-white text-ink border border-ink/[0.06] shadow-sm hover:shadow-2xl hover:shadow-brand/10'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-brand-deep text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-1.5 rounded-full shadow-lg shadow-gold/30 whitespace-nowrap">
                  En Popüler
                </span>
              )}

              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                    plan.highlighted
                      ? 'bg-gold/15 text-gold border-gold/25'
                      : 'bg-brand/[0.06] text-brand border-brand/10'
                  }`}
                >
                  {plan.icon}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold">{plan.name}</h2>
                  <p className={`text-xs ${plan.highlighted ? 'text-emerald-100/60' : 'text-muted'}`}>{plan.tagline}</p>
                </div>
              </div>

              <div className="mb-6 space-y-1.5">
                <p className="flex items-baseline gap-1.5">
                  <span className="font-serif text-4xl font-bold">₺{plan.price}</span>
                  <span className={`text-xs ${plan.highlighted ? 'text-emerald-100/60' : 'text-muted'}`}>/ davetiye</span>
                </p>
                <p className={`text-xs font-semibold ${plan.highlighted ? 'text-gold' : 'text-brand'}`}>
                  İlk davetiyenizde ₺{plan.firstInvitationPrice}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-gold' : 'text-brand'}`} />
                    <span className={plan.highlighted ? 'text-emerald-50/85' : 'text-muted'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/create"
                className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-500 hover:-translate-y-0.5 ${
                  plan.highlighted
                    ? 'bg-champagne text-brand-deep hover:bg-gold shadow-lg shadow-black/20'
                    : 'bg-brand text-white hover:bg-brand-soft shadow-md shadow-brand/15 hover:shadow-lg hover:shadow-brand/25'
                }`}
              >
                {plan.highlighted && <span className="absolute inset-0 animate-shimmer pointer-events-none" />}
                Tasarlamaya Başla
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-muted text-xs mt-10"
        >
          Fiyatlara KDV dahildir · Kredi kartı, banka kartı ve havale ile ödeme · Tasarım ve önizleme her pakette ücretsiz
        </motion.p>
      </section>

      {/* SSS */}
      <section className="max-w-3xl mx-auto px-4 pb-16 md:pb-24">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-ink mb-3">
            Sıkça Sorulan <span className="italic text-brand font-medium">Sorular</span>
          </h2>
          <p className="text-muted text-sm">
            Aradığınız yanıt burada yoksa{' '}
            <Link to="/contact" className="text-brand font-semibold underline decoration-gold/50 underline-offset-4 hover:decoration-gold transition-colors">
              bize yazın
            </Link>
            .
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: ease.out, delay: idx * 0.07 }}
            >
              <FaqItem faq={faq} isOpen={openFaq === idx} onToggle={() => setOpenFaq(openFaq === idx ? null : idx)} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
