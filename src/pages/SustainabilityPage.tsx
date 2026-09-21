import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Droplets, Leaf, Recycle, Sprout, TreePine, Truck, Wind } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { ease } from '../utils/motion';

const IMPACT_STATS = [
  { icon: <TreePine size={22} />, value: '310+', label: 'Kurtarılan Ağaç' },
  { icon: <Droplets size={22} />, value: '2.4M L', label: 'Tasarruf Edilen Su' },
  { icon: <Wind size={22} />, value: '18 ton', label: 'Önlenen CO₂ Salınımı' },
  { icon: <Recycle size={22} />, value: '1.2M+', label: 'Basılmayan Kağıt Davetiye' }
];

const PAPER_COSTS = [
  {
    icon: <TreePine size={20} />,
    title: 'Ağaç ve orman',
    desc: '500 adetlik ortalama bir düğün davetiyesi baskısı; zarfları, kartları ve fire baskılarıyla birlikte yaklaşık yarım ağacın kesilmesi demektir. Davetiyelerin büyük bölümü ise birkaç gün içinde çöpe gider.'
  },
  {
    icon: <Droplets size={20} />,
    title: 'Su tüketimi',
    desc: 'Bir A5 karton davetiyenin üretimi yaklaşık 10 litre su gerektirir. Kuşe kaplama ve varak yaldız gibi lüks dokunuşlar, kartın geri dönüştürülmesini de çoğu zaman imkânsız hâle getirir.'
  },
  {
    icon: <Truck size={20} />,
    title: 'Lojistik ve karbon',
    desc: 'Matbaadan eve, evden tek tek adreslere... Basılı davetiyenin yolculuğu boyunca oluşan karbon ayak izi, dijital bir davetiyenin barındırma maliyetinin yüzlerce katıdır.'
  }
];

const COMMITMENTS = [
  {
    icon: <Wind size={20} />,
    title: 'Yenilenebilir enerjiyle barındırma',
    desc: 'Davetiyeleriniz, yenilenebilir enerji sertifikalı veri merkezlerinde barındırılır. Sunucu altyapımızı her yıl enerji verimliliği kriterleriyle yeniden değerlendiriyoruz.'
  },
  {
    icon: <Sprout size={20} />,
    title: 'Her 100 davetiyeye bir fidan',
    desc: 'Platformda yayınlanan her 100 davetiye için, orman koruma dernekleriyle iş birliği içinde bir fidan bağışlıyoruz. Yani davetiyeniz kağıt tüketmemekle kalmıyor; ormanlara geri veriyor.'
  },
  {
    icon: <Recycle size={20} />,
    title: 'Verimli teknoloji, küçük ayak izi',
    desc: 'Hafif sayfa mimarimiz ve optimize edilmiş görsel işleme altyapımız sayesinde her davetiye görüntülemesi, ortalama bir web sayfasının çok altında enerji tüketir.'
  },
  {
    icon: <Leaf size={20} />,
    title: 'Şeffaf raporlama',
    desc: 'Etki rakamlarımızı sektör ortalamalarına dayalı hesaplama yöntemleriyle birlikte her yıl güncelliyor ve bu sayfada açıkça paylaşıyoruz.'
  }
];

export default function SustainabilityPage() {
  return (
    <div className="bg-cream">
      <PageHeader
        badge="Sürdürülebilirlik"
        icon={<Leaf size={13} />}
        title="Zarafet,"
        accent="Doğaya Saygıyla"
        description="En özel gününüzü kutlarken doğadan ödün vermeyin. Her dijital davetiye; kesilmeyen bir ağaç, harcanmayan litrelerce su ve çöpe gitmeyen yüzlerce kart demek."
      />

      {/* Etki istatistikleri */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {IMPACT_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: ease.out, delay: idx * 0.1 }}
              className="rounded-3xl bg-white border border-ink/[0.06] p-6 md:p-8 text-center shadow-sm hover:shadow-xl hover:shadow-brand/10 transition duration-300 ease-luxe hover:-translate-y-1"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-brand mb-1">{stat.value}</p>
              <p className="text-muted text-xs uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-muted text-xs mt-6"
        >
          DavetKart üzerinden yayınlanan davetiyelerin, sektör ortalaması baskı adetleri üzerinden hesaplanan kümülatif etkisi.
        </motion.p>
      </section>

      {/* Basılı davetiyenin maliyeti */}
      <section className="relative bg-brand-deep text-white overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-800/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24 relative z-10">
          <motion.div
            className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: ease.out }}
          >
            <span className="inline-flex items-center gap-1.5 bg-gold/15 text-gold border border-gold/25 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase mb-4">
              <TreePine size={13} />
              Görünmeyen Fatura
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight mb-4">
              Basılı davetiyenin <span className="italic text-champagne font-medium">doğaya maliyeti</span>
            </h2>
            <p className="text-emerald-100/60 text-sm md:text-base leading-relaxed">
              Bir davetiye yalnızca kart değildir: kağıt hamuru, baskı kimyasalları, zarf, yaldız ve
              kapı kapı dağıtım... Geleneğin perde arkasındaki tabloya birlikte bakalım.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAPER_COSTS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: ease.out, delay: idx * 0.12 }}
                className="rounded-3xl bg-white/[0.05] border border-white/10 p-7 backdrop-blur-sm hover:bg-white/[0.08] transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold border border-gold/25 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold mb-2.5">{item.title}</h3>
                <p className="text-emerald-100/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Taahhütlerimiz */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Taahhütlerimiz
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-ink">
            Sözde değil, <span className="italic text-brand font-medium">sistemde</span> yeşil
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMMITMENTS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease.out, delay: idx * 0.1 }}
              className="group flex gap-5 rounded-3xl bg-white border border-ink/[0.06] p-7 md:p-8 shadow-sm hover:shadow-2xl hover:shadow-brand/10 hover:border-brand/15 transition duration-300 ease-luxe hover:-translate-y-1.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-champagne transition duration-300 ease-luxe">
                {item.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: ease.out }}
          className="max-w-3xl mx-auto px-4 text-center space-y-5"
        >
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-ink">
            Kutlamanız <span className="italic text-brand font-medium">iz bıraksın</span> — doğada değil, kalplerde
          </h2>
          <Link
            to="/create"
            className="group relative overflow-hidden inline-flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-semibold text-sm md:text-base hover:bg-brand-soft transition duration-200 ease-luxe shadow-lg shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-1"
          >
            <span className="absolute inset-0 animate-shimmer pointer-events-none" />
            <Leaf size={17} />
            Çevre Dostu Davetiyenizi Oluşturun
            <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
