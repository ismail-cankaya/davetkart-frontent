import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film } from 'lucide-react';
import { TemplatePreset } from '../../types';
import { cn } from '../../utils/cn';
import { ease } from '../../utils/motion';

type CoverStatus = 'pending' | 'ready' | 'failed';

interface TemplateCoverProps {
  preset: TemplatePreset;
  alt: string;
  className?: string;
}

/**
 * Şablon kartının kapak görseli.
 *
 * Dört durum vardır ve birbirinden ayrılmalıdır:
 *
 *  1. Görsel var, henüz inmedi → temanın kendi degradesi (yer tutucu).
 *     🔴 Izgaranın gerçek bekleme noktası BURASIDIR: temalar pakette geldiği
 *     için "sonraki partiyi getirme" diye bir ağ turu yok, kapak görselleri
 *     ise ağdan iner. Yer tutucu gerçek bir olayla (`load`) kalkar, sahte bir
 *     gecikmeyle değil.
 *     🔴 Yer tutucu PARILDAMAZ. `loading="lazy"` yüzünden ekranın çok altındaki
 *     kartların görseli hiç istenmez; parıldayan bir iskelet hem olmayan bir
 *     indirmeyi varmış gibi gösterir hem de her kart için `will-change`
 *     katmanı açık tutardı. Hareketli "geliyor" işareti, kaydırmayla gelen
 *     partinin kartlarında durur (bkz. ThemeStep).
 *  2. Görsel var ve indi → normal <img>; iskelet üstünden çözülerek kalkar.
 *  3. `imageUrl` boş → şablon tamamen kod tabanlı (videosuz, fotoğrafsız);
 *     kapağı zaten kendi degradesidir. Bu bir eksiklik DEĞİL, o yüzden ne
 *     iskelet ne de uyarı ikonu gösterilir — beklenen bir şey yok.
 *  4. Görsel yüklenemedi → video posteri henüz eklenmemiş; degradeye düşer
 *     ve film ikonu bunun bekleyen bir varlık olduğunu belli eder.
 *
 * 3 ile 4'ü aynı şekilde göstermek, kod tabanlı şablonları "bozuk" gibi
 * okuturdu.
 */
export function TemplateCover({ preset, alt, className }: TemplateCoverProps) {
  const hasImage = Boolean(preset.imageUrl);
  const [status, setStatus] = useState<CoverStatus>(hasImage ? 'pending' : 'ready');

  // Aynı kart farklı bir şablona bağlanabilir (düzenleme panelinde kapak,
  // seçim değiştikçe yerinde güncellenir). Durum render sırasında sıfırlanır;
  // efektle yapılsaydı yeni kapak bir kare boyunca eskisinin "indi" ya da
  // "bozuk" durumunu miras alırdı.
  const [source, setSource] = useState(preset.imageUrl);
  if (source !== preset.imageUrl) {
    setSource(preset.imageUrl);
    setStatus(preset.imageUrl ? 'pending' : 'ready');
  }

  /**
   * Önbellekten gelen görsel, React dinleyiciyi bağlamadan önce tamamlanmış
   * olabilir; o zaman iskelet tek kare bile görünmez. Yalnızca "indi" yönünde
   * karar verir: `naturalWidth` kimi tarayıcılarda iç ölçüsü olmayan SVG'ler
   * için 0 döner, hata kararı bu yüzden `onError`'a bırakılır.
   */
  const adoptCached = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setStatus('ready');
  }, []);

  if (!hasImage || status === 'failed') {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          preset.backgroundStyle,
          className
        )}
        role="img"
        aria-label={alt}
      >
        {status === 'failed' && <Film size={26} strokeWidth={1.4} className="text-white/45" />}
      </div>
    );
  }

  return (
    <>
      <img
        ref={adoptCached}
        className={className}
        src={preset.imageUrl}
        alt={alt}
        loading="lazy"
        // Çözme ana thread'i beklemesin: kapaklar ilk kaydırmada ekrana girer.
        decoding="async"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('failed')}
      />

      {/* Yer tutucu <img>'den SONRA gelir: akışta sonraki kardeş olduğu için
          görselin üstünde boyanır ve inen kapağı açığa çıkararak çözülür.
          Kartın kendi degradesini kullanır — nötr gri bir kutu yerine, o
          temanın rengiyle bekleyen bir yer tutucu. */}
      <AnimatePresence>
        {status === 'pending' && (
          <motion.span
            key="cover-skeleton"
            aria-hidden="true"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: ease.out }}
            className={cn('absolute inset-0 pointer-events-none', preset.backgroundStyle)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
