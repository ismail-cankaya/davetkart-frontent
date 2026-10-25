import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BadgePercent, Check, ChevronDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/ui/PageHeader';
import { PlanPriceTag } from '../components/payment/PlanPriceTag';
import { PLAN_ICONS } from '../components/payment/planVisuals';
import { SUBSCRIPTION_PLANS } from '../data';
import { usePricing } from '../hooks/usePricing';
import { planPriceOf } from '../stores/usePricingStore';
import { paymentMethodsMode } from '../utils/paymentMethods';
import { SubscriptionTier } from '../types';
import { ease } from '../utils/motion';

/**
 * Fiyatlandırma sayfası (`/pricing`).
 *
 * 🔴 Faz 13 (backend K128): paketler `data.ts` → `SUBSCRIPTION_PLANS`
 * (paywall ve ödeme sayfasıyla AYNI üç paket), fiyatlar backend'in fiyat
 * kataloğundan. Eskiden burada yalnızca bu sayfada yaşayan üç uydurma paket
 * (Zarif / Prestij / İhtişam, 349–949 ₺) ve sabit "%60" yazısı vardı; hiçbiri
 * backend'in sattığı şey değildi.
 *
 * Misafir liste fiyatını (ve çalışan kampanyayı) görür; giriş yapmış yeni
 * üye kendi fiyatını (ilk yayın indirimi uygulanmış) görür.
 * Ayrıntılı açıklama: docs/rehber/src/pages/PricingPage.md
 */

/** Öne çıkan paket (koyu kart). */
const HIGHLIGHTED: SubscriptionTier = 'gold';

interface Faq {
  q: string;
  a: string;
}

const STATIC_FAQS: Faq[] = [
  {
    q: 'Ödeme tek seferlik mi, abonelik mi?',
    a: 'Tüm paketler tek seferlik ödemedir; abonelik veya gizli yenileme ücreti yoktur. Bir kez ödersiniz, davetiyeniz paketinizin yayın süresi boyunca yayında kalır.'
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

function FaqItem({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
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
  const { t } = useTranslation();
  const { catalog, status, reload } = usePricing();
  const firstPublishPercent = catalog?.firstPublishPercent ?? 0;

  // İlk yayın sorusu yalnızca indirim açıkken ve yüzdesi backend'den gelmişken sorulur.
  const faqs = useMemo<Faq[]>(() => {
    if (firstPublishPercent <= 0) return STATIC_FAQS;
    const [first, ...rest] = STATIC_FAQS;
    return [
      first,
      {
        q: t('pricing.faqFirstPublish.q'),
        a: t('pricing.faqFirstPublish.a', { percent: firstPublishPercent }),
      },
      ...rest,
    ];
  }, [firstPublishPercent, t]);

  return (
    <div className="bg-cream">
      <PageHeader
        badge="Fiyatlandırma"
        icon={<BadgePercent size={13} />}
        title="Şeffaf Fiyat,"
        accent="Abonelik Yok"
        description="Davetiyenizi ücretsiz tasarlayın, yalnızca yayınlarken ödeyin. Tek seferlik ödeme — gizli ücret ve otomatik yenileme yok."
      />

      {/* İlk davetiye indirimi bandı — yüzde backend'den; kapalıysa band yok. */}
      <div className="max-w-3xl mx-auto px-4 mb-12 md:mb-16 min-h-[3rem]">
        {firstPublishPercent > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out }}
            className="flex items-center justify-center gap-2.5 bg-gold/10 border border-gold/25 text-brand rounded-full px-5 py-3 text-xs md:text-sm font-semibold text-center"
          >
            <BadgePercent size={16} className="text-gold shrink-0" />
            {t('pricing.firstPublishBanner', { percent: firstPublishPercent })}
          </motion.div>
        )}
      </div>

      {/* Paketler */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan, idx) => {
            const highlighted = plan.id === HIGHLIGHTED;
            const Icon = PLAN_ICONS[plan.id];
            const price = planPriceOf(catalog, plan.id);
            // Kişisel katalogda ilk yayın zaten fiyata uygulanmışsa ipucu tekrar edilmez.
            const showFirstPublishHint = firstPublishPercent > 0 && price?.promotion?.kind !== 'first_publish';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: ease.out, delay: idx * 0.12 }}
                className={`relative flex flex-col rounded-[2rem] p-8 md:p-9 transition duration-300 ease-luxe hover:-translate-y-2 ${
                  highlighted
                    ? 'bg-brand-deep text-white border border-gold/25 shadow-2xl shadow-brand/30 md:-my-3'
                    : 'bg-white text-ink border border-ink/[0.06] shadow-sm hover:shadow-2xl hover:shadow-brand/10'
                }`}
              >
                {highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-brand-deep text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-1.5 rounded-full shadow-lg shadow-gold/30 whitespace-nowrap">
                    En Popüler
                  </span>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                      highlighted ? 'bg-gold/15 text-gold border-gold/25' : 'bg-brand/[0.06] text-brand border-brand/10'
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <h2 className="font-serif text-xl font-bold">{plan.name}</h2>
                    <p className={`text-xs ${highlighted ? 'text-emerald-100/60' : 'text-muted'}`}>{plan.tagline}</p>
                  </div>
                </div>

                <div className="mb-6 space-y-2 min-h-[6rem]">
                  <PlanPriceTag
                    price={price}
                    status={status}
                    suffix={t('pricing.oneTime')}
                    inverted={highlighted}
                    size="lg"
                    onRetry={reload}
                  />
                  {showFirstPublishHint && (
                    <p className={`text-xs font-semibold ${highlighted ? 'text-gold' : 'text-brand'}`}>
                      {t('pricing.firstPublishHint', { percent: firstPublishPercent })}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2.5 text-sm">
                      {feature.included ? (
                        <Check size={15} className={`mt-0.5 shrink-0 ${highlighted ? 'text-gold' : 'text-brand'}`} />
                      ) : (
                        <Minus size={15} className={`mt-0.5 shrink-0 ${highlighted ? 'text-white/25' : 'text-stone-300'}`} />
                      )}
                      <span
                        className={
                          feature.included
                            ? highlighted
                              ? 'text-emerald-50/85'
                              : 'text-muted'
                            : highlighted
                              ? 'text-white/35 line-through'
                              : 'text-stone-400 line-through decoration-stone-300'
                        }
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/create"
                  className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition duration-200 ease-luxe hover:-translate-y-0.5 ${
                    highlighted
                      ? 'bg-champagne text-brand-deep hover:bg-gold shadow-lg shadow-black/20'
                      : 'bg-brand text-white hover:bg-brand-soft shadow-md shadow-brand/15 hover:shadow-lg hover:shadow-brand/25'
                  }`}
                >
                  {highlighted && <span className="absolute inset-0 animate-shimmer pointer-events-none" />}
                  Tasarlamaya Başla
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-muted text-xs mt-10"
        >
          Fiyatlara KDV dahildir
          {catalog && <> · {t(`pricing.methods.${paymentMethodsMode(catalog.paymentMethods)}`)}</>} · Tasarım ve
          önizleme her pakette ücretsiz
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
          {faqs.map((faq, idx) => (
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
