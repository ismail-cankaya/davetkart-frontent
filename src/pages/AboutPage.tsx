import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Gem, HeartHandshake, Leaf, PenLine, Sparkles, WandSparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { ease } from '../utils/motion';

const STATS = [
  { value: '25.000+', label: 'Oluşturulan Davetiye' },
  { value: '1.4M+', label: 'Davetiye Görüntülenme' },
  { value: '40+', label: 'Özgün Şablon' },
  { value: '%100', label: 'Çevre Dostu' }
];

const VALUES = [
  {
    icon: <Gem size={22} />,
    title: 'Zarafet',
    desc: 'Her şablon; tipografisinden renk paletine, animasyonlarından kağıt dokusuna kadar bir davetiye ustası titizliğiyle tasarlanır. "İdare eder" bizim sözlüğümüzde yoktur.'
  },
  {
    icon: <Leaf size={22} />,
    title: 'Sürdürülebilirlik',
    desc: 'Basılan her davetiyenin doğaya bir maliyeti var. Dijital davetiyelerle kağıt israfını sıfırlıyor, özel anları doğaya saygıyla kutluyoruz.'
  },
  {
    icon: <WandSparkles size={22} />,
    title: 'Teknoloji',
    desc: 'Yapay zeka destekli tema tasarımcısından canlı katılım takibine — en yeni teknolojiyi, en klasik zarafetin hizmetine sunuyoruz.'
  },
  {
    icon: <HeartHandshake size={22} />,
    title: 'Güven',
    desc: 'Bize hayatınızın en özel gününü emanet ediyorsunuz. Verilerinizin güvenliği ve davetiyenizin kusursuz yayını, işimizin en ciddiye aldığımız kısmıdır.'
  }
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <PageHeader
        badge="Hikayemiz"
        icon={<Sparkles size={13} />}
        title="Özel Anların"
        accent="Dijital"
        tail="Zanaatkârları"
        description="DavetKart; davetiye geleneğinin inceliğini, dijital çağın olanaklarıyla buluşturmak için kuruldu. Kağıdın dokusunu değil, o dokunun uyandırdığı hissi taşıyoruz."
      />

      {/* Hikaye */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: ease.out }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="font-serif text-sm font-bold text-gold">Neden varız?</span>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-ink leading-tight">
              Bir davetiye, etkinliğinizin <span className="italic text-brand font-medium">ilk cümlesidir</span>
            </h2>
            <div className="space-y-4 text-muted text-sm md:text-base leading-relaxed">
              <p>
                Her şey basit bir gözlemle başladı: insanlar hayatlarının en özel günü için haftalarını
                matbaa koşuşturmasına, adres toplamaya ve elden dağıtıma harcıyor; davetiyelerin çoğu
                ise birkaç saniyelik bir bakışın ardından çekmecelerde unutuluyordu.
              </p>
              <p>
                Biz davetiyenin bir kağıt parçası değil, bir deneyim olduğuna inandık. Müzikle açılan,
                hikayenizi anlatan, konumunu tarif eden, davetlilerinizin yanıtını saniyesinde ileten
                bir deneyim. DavetKart&apos;ı; tasarımcıların estetik hassasiyetiyle mühendislerin
                kusursuzluk takıntısını aynı çatıda buluşturarak inşa ettik.
              </p>
              <p>
                Bugün binlerce çift, aile ve kurum; düğünlerini, nişanlarını ve en özel kutlamalarını
                DavetKart ile duyuruyor. Ve biz hâlâ ilk günkü heyecanla, her yeni şablonu bir
                zanaatkâr sabrıyla işliyoruz.
              </p>
            </div>
          </motion.div>

          {/* Görsel kompozisyon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: ease.out }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-gold/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-dashed border-brand/20"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-36 h-44 md:w-44 md:h-56 rounded-2xl bg-gradient-to-br from-brand to-brand-soft border border-gold/30 shadow-2xl shadow-brand/30 flex flex-col items-center justify-center gap-3 text-champagne"
              >
                <Sparkles size={28} />
                <span className="font-serif italic text-lg">Davetlisiniz</span>
                <span className="h-px w-12 bg-gold/50" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-champagne/70">DavetKart</span>
              </motion.div>
              <motion.span
                animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 right-10 text-gold"
              >
                <Sparkles size={20} />
              </motion.span>
              <motion.span
                animate={{ y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-10 left-8 text-brand/50"
              >
                <Sparkles size={16} />
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="relative bg-brand-deep text-white overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-800/25 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-14 md:py-20 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: ease.out, delay: idx * 0.1 }}
              className="text-center space-y-1.5"
            >
              <p className="font-serif text-3xl md:text-4xl font-bold text-champagne">{stat.value}</p>
              <p className="text-emerald-100/60 text-xs tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Değerler */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Değerlerimiz
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-ink">
            Bizi biz yapan <span className="italic text-brand font-medium">dört ilke</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease.out, delay: idx * 0.1 }}
              className="group rounded-3xl bg-white border border-ink/[0.06] p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-brand/10 hover:border-brand/15 transition duration-300 ease-luxe hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-champagne group-hover:scale-105 transition duration-300 ease-luxe">
                {value.icon}
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-ink mb-3">{value.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{value.desc}</p>
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
            Hikayenizin <span className="italic text-brand font-medium">ilk cümlesini</span> birlikte yazalım
          </h2>
          <Link
            to="/create"
            className="group relative overflow-hidden inline-flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-semibold text-sm md:text-base hover:bg-brand-soft transition duration-200 ease-luxe shadow-lg shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-1"
          >
            <span className="absolute inset-0 animate-shimmer pointer-events-none" />
            <PenLine size={17} />
            Davetiyenizi Oluşturun
            <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
