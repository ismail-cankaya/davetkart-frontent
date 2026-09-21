import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Maximize2, Minimize2, Minus, Sparkles, X } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { AuthRedirectState } from '../../types';
import { ease } from '../../utils/motion';

interface AssistantLoginCtaProps {
  isFullscreen: boolean;
  onMinimize: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

const HIGHLIGHTS = [
  'Davetiyenize uygun şablonu birlikte seçelim',
  'Metinlerinizi ve program akışınızı düzenleyelim',
  'Katılım takibini nasıl kuracağınızı anlatalım',
];

/**
 * Asistan penceresinin giriş yapmamış ziyaretçiye gösterilen yüzü.
 *
 * 🔴 Widget **gizlenmiyor**, sohbet kapatılıyor. Widget'ın varlığı bir
 * özellik vaadidir; sessizce kaybolması kullanıcıya hiçbir şey anlatmaz ve
 * özelliğin var olduğunu bile öğrenemez. Buradaki ekran vaadi koruyup
 * karşılığında tek bir şey ister: giriş.
 *
 * Neden bu duvar var: asistan sistemin **para harcayan tek ucudur** ve bir
 * maliyet kontrolü ancak harcamanın bir kimliğe yazılabildiği yerde
 * kurulabilir. Anonim çağrıda tek anahtar IP'dir; IP hem fazla geniştir
 * (CGNAT arkasındaki on binlerce abone tek kotayı paylaşır) hem fazla
 * dardır (saldırgan için IP döndürmek saatlik birkaç kuruş). Backend bu
 * yüzden ucu auth'a aldı ve çelişkinin bedelini buraya yazdı.
 */
export function AssistantLoginCta({
  isFullscreen,
  onMinimize,
  onToggleFullscreen,
  onClose,
}: AssistantLoginCtaProps) {
  const location = useLocation();

  const headerButton =
    'w-8 h-8 rounded-full flex items-center justify-center text-champagne/80 hover:text-white hover:bg-white/10 transition-colors duration-300 cursor-pointer';

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Başlık çubuğu sohbetinkiyle aynı: pencere aynı pencere. */}
      <div className="relative shrink-0 bg-gradient-to-r from-brand-deep via-brand to-brand-soft text-white px-4 py-3.5 flex items-center gap-3 overflow-hidden">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-gold/30 text-champagne shrink-0">
          <BrandMark size={20} />
        </div>
        <div className="relative flex-grow min-w-0">
          <p className="font-serif font-bold text-sm leading-tight">DavetKart Asistanı</p>
          <p className="text-[10px] text-champagne/70 tracking-wide">Sohbet için giriş yapın</p>
        </div>
        <div className="relative flex items-center gap-0.5 shrink-0">
          <button onClick={onToggleFullscreen} className={headerButton} aria-label={isFullscreen ? 'Küçült' : 'Tam ekran'}>
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button onClick={onMinimize} className={headerButton} aria-label="Simge durumuna küçült">
            <Minus size={16} />
          </button>
          <button onClick={onClose} className={headerButton} aria-label="Kapat">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-6 py-8 flex flex-col justify-center bg-[radial-gradient(ellipse_at_top,rgba(4,56,43,0.05),transparent_60%)]" data-lenis-prevent>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.out }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-[10px] tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={11} />
            Kişiye Özel Yardım
          </span>

          <h3 className="font-serif text-lg font-bold text-ink leading-snug">
            Asistan sizi <span className="italic text-brand font-medium">tanıdığında</span> daha iyi yardımcı olur
          </h3>

          <p className="text-xs text-muted mt-3 leading-relaxed">
            Sohbet, hesabınıza bağlı olarak çalışır. Ücretsiz hesabınızı oluşturun ya da giriş
            yapın; kaldığınız yerden devam edin.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-6 space-y-2.5"
        >
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-xs text-ink/80 bg-white border border-ink/[0.06] rounded-xl px-3.5 py-2.5 shadow-sm">
              <BrandMark size={13} className="text-brand shrink-0 mt-px" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="shrink-0 border-t border-ink/[0.06] bg-white/80 backdrop-blur-sm p-3 space-y-2">
        {/* Giriş sonrası kullanıcı bulunduğu sayfaya döner; sohbet için
            başladığı yolu kaybetmemeli. */}
        <Link
          to="/login"
          state={{ from: location.pathname } satisfies AuthRedirectState}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-full font-semibold text-xs hover:bg-brand-soft transition-colors duration-300 shadow-md shadow-brand/20"
        >
          <LogIn size={14} />
          Giriş Yap
        </Link>
        <Link
          to="/register"
          state={{ from: location.pathname } satisfies AuthRedirectState}
          className="w-full inline-flex items-center justify-center gap-2 bg-white text-brand border border-brand/25 py-3 rounded-full font-semibold text-xs hover:border-brand/60 transition-colors duration-300"
        >
          Ücretsiz Hesap Oluştur
        </Link>
      </div>
    </div>
  );
}
