import React from 'react';
import { motion } from 'motion/react';
import { ease } from '../../utils/motion';

const REVIEWS = [
  {
    name: 'Elif & Burak',
    event: 'Düğün Davetiyesi',
    quote: 'Davetiyemiz o kadar güzel oldu ki, birçok misafirimiz "bu gerçekten dijital mi?" diye sordu. Harika bir deneyimdi!',
    stars: 5,
    avatar: 'EB'
  },
  {
    name: 'Ayşe Kılıç',
    event: 'Baby Shower',
    quote: 'Katılım takip sistemi hayat kurtarıcı. Kim geliyor, ne yemek istiyor, hepsini tek panelden takip ettim. Çok pratik!',
    stars: 5,
    avatar: 'AK'
  },
  {
    name: 'Serkan & Merve',
    event: 'Nişan Töreni',
    quote: 'Sürdürülebilir, şık ve modern. Kağıt davetiye yerine dijital tercih ettiğimiz için çok mutluyuz. Şiddetle tavsiye ederiz.',
    stars: 5,
    avatar: 'SM'
  }
];

export const Testimonials = React.memo(function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-emerald-950 to-brand-deep text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold/[0.07] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <span className="text-champagne font-semibold text-xs tracking-[0.15em] uppercase bg-champagne/10 px-3.5 py-1.5 rounded-full inline-block mb-4 border border-champagne/20">
            Müşteri Deneyimleri
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            Binlerce Çiftin <span className="italic text-champagne font-medium">Tercihi</span>
          </h2>
          <p className="text-emerald-100/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Özel günlerini dijital zarafetle taçlandıran kullanıcılarımızın deneyimlerini keşfedin.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.name}
              className="relative bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-500 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease.out, delay: idx * 0.12 }}
            >
              {/* Decorative gold quote mark */}
              <span className="absolute top-5 right-7 font-serif text-6xl leading-none text-gold/15 group-hover:text-gold/30 transition-colors duration-500 select-none pointer-events-none">
                &rdquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.stars }).map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.12 + 0.3 + i * 0.06, ease: ease.out }}
                    className="w-4 h-4 text-gold fill-gold"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-emerald-50/85 text-sm leading-relaxed mb-6 italic">
                &ldquo;{review.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne to-gold flex items-center justify-center text-brand-deep font-bold text-xs shadow-md">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-emerald-100/50 text-xs">{review.event}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
