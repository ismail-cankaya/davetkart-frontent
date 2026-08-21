import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Brutal hero — kütüphanenin tek ANTİ-DEKORATİF dili.
 *
 * Diğer yirmi dil daveti güzelleştirmeye çalışır: kağıt dokusu, altın varak,
 * yumuşak gradient. Brutalizm bunun tam tersini yapar — süsü kaldırır ve
 * geriye kalan ham malzemeyi (kutu, çizgi, tipografi, düz renk) büyüterek
 * gösterir. Bu yüzden burada tek bir gradient, tek bir yuvarlatılmış köşe ve
 * tek bir bulanık gölge yok. Gölge bile katı: 8px kayık, sıfır blur.
 *
 * Hiyerarşi tamamen ÖLÇEK farkıyla kurulur. İsim, kabın genişliğine göre
 * (cqw) büyüyen dev bir grotesk blok olarak kelime kelime yığılır; geri kalan
 * her şey 9px'lik mono etikete iner. Aradaki uçurum, dekor olmadan da güçlü
 * bir odak üretir.
 *
 * Giriş animasyonu da bilinçli olarak projenin "luxe" easing'ini kullanmaz:
 * kartlar yumuşakça süzülmez, yerine OTURUR (sert spring, kısa mesafe).
 */

export interface BrutalHeroProps extends HeroRenderProps {
  /** Çerçeve ve sert gölgenin mürekkebi — kompozisyonun iskeleti. */
  ink?: string;
  /** Ana vurgu: sert gölge ve sayaç bloklarının dolgusu. */
  accent?: string;
  /** İkincil vurgu: mesaj bloğu ve rozet. */
  accent2?: string;
  /** `accent` dolgusunun üstündeki yazı rengi. */
  onAccent?: string;
  /** `accent2` dolgusunun üstündeki yazı rengi — iki vurgu farklı parlaklıkta
   *  olduğu için tek bir kontrast rengi ikisine birden yetmiyor. */
  onAccent2?: string;
}

/** Sert kenarlı kutu: sıfır yarıçap, sıfır blur, kayık gölge. */
function Slab({
  ink,
  shadow,
  className,
  style,
  children
}: {
  ink: string;
  shadow?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn('relative border-[3px]', className)}
      style={{
        borderColor: ink,
        boxShadow: shadow ? `7px 7px 0 0 ${shadow}` : undefined,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function BrutalHero({
  invitation,
  theme,
  flavor,
  ink = '#101010',
  accent = '#e5484d',
  accent2 = '#f2b705',
  onAccent = '#fff4ee',
  onAccent2 = '#101010'
}: BrutalHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);

  // İsim kelimelere bölünüp alt alta yığılır: brutalizmde satır sonu bir
  // tipografi kararıdır, metnin kabına sığmasının yan etkisi değil.
  const words = (invitation.names || 'Davetlisiniz').split(' ').filter(Boolean);

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');
  const timeText = dateParts.slice(-1)[0];

  const rows: Array<[string, string]> = [
    ['Tarih', dateText],
    ['Saat', timeText],
    ['Mekan', invitation.venue]
  ];

  return (
    <section className="relative flex-1 flex items-center justify-center px-4 @sm:px-6 py-10 @sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="w-full max-w-[23rem] @sm:max-w-md"
      >
        <Slab ink={ink} shadow={accent} className={theme.surface}>
          {/* Üst ticker: tek satırlık kayan etiket şeridi. Marquee brutalist
              webin imzasıdır; burada başlık metnini taşıyarak dekor değil
              BİLGİ taşır. */}
          <div
            className="relative overflow-hidden border-b-[3px] py-1.5"
            style={{ borderColor: ink, background: accent }}
          >
            <motion.div
              className="flex w-max gap-6 whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
            >
              {/* İki kopya: biri çıkarken diğeri girer, dikiş görünmez. */}
              {[0, 1].map((copy) => (
                <span key={copy} className="flex gap-6">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="text-[9px] font-black uppercase tracking-[0.18em]"
                      style={{ color: onAccent }}
                    >
                      {invitation.title || flavor.envelopeLabel} <span className="opacity-50">/</span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="relative px-5 @sm:px-6 pt-6 @sm:pt-7 pb-5 @sm:pb-6">
            {/* Rozet: çerçeveyi kasten taşırır. Brutalizmde hizasızlık bir
                hata değil, kompozisyonun gerilimini kuran öğedir. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: -9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.35 }}
              className="absolute -top-5 -right-3 @sm:-right-4 w-16 h-16 @sm:w-[4.5rem] @sm:h-[4.5rem] border-[3px] flex flex-col items-center justify-center gap-0.5"
              style={{ borderColor: ink, background: accent2, color: onAccent2 }}
            >
              <Ornament size={20} />
              <span className="text-[7.5px] font-black uppercase tracking-[0.12em]">Davet</span>
            </motion.div>

            {/* İsim bloğu: ölçek hiyerarşinin tamamını taşır. */}
            <h1
              className={cn('font-sans font-black uppercase leading-[0.84] tracking-[-0.035em]', theme.heading)}
              style={{ fontSize: 'clamp(2.1rem, 13cqw, 4rem)' }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 24, delay: 0.08 + i * 0.07 }}
                  className="block break-words"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Mesaj: ikincil renkte düz blok. Kutunun içinde nefes payı yok —
                metin kenara dayanır. */}
            {invitation.subtitle && (
              <div
                className="mt-5 border-[3px] px-3 py-2.5"
                style={{ borderColor: ink, background: accent2, color: onAccent2 }}
              >
                <p className="text-[11.5px] font-bold leading-snug">{invitation.subtitle}</p>
              </div>
            )}

            {/* Bilgi satırları: her satır kalın bir kuralla ayrılır, etiket
                solda sabit genişlikte mono, değer sağda ağır. Tablo değil ama
                tablonun okunma ritmini taşır. */}
            <dl className="mt-5">
              {rows.map(([label, value], i) => (
                <div
                  key={label}
                  className="flex items-baseline gap-3 py-2.5"
                  style={{
                    borderTopWidth: 3,
                    borderTopStyle: 'solid',
                    borderTopColor: ink,
                    borderBottomWidth: i === rows.length - 1 ? 3 : 0,
                    borderBottomStyle: 'solid',
                    borderBottomColor: ink
                  }}
                >
                  <dt
                    className="w-14 shrink-0 text-[8.5px] font-black uppercase tracking-[0.16em]"
                    style={{ color: accent }}
                  >
                    {label}
                  </dt>
                  <dd className={cn('text-[12px] font-bold uppercase leading-tight break-words', theme.heading)}>
                    {value || '—'}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Sayaç: rakamlar düz renk bloklara oturur. Kart değil, dolgu. */}
            {invitation.showTimer && valid && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { v: days, l: 'Gün' },
                  { v: hours, l: 'Saat' },
                  { v: minutes, l: 'Dk' }
                ].map((unit) => (
                  <div
                    key={unit.l}
                    className="border-[3px] px-2 py-2 text-center"
                    style={{ borderColor: ink, background: accent, color: onAccent }}
                  >
                    <span className="block font-sans font-black tabular-nums leading-none text-xl @sm:text-2xl">
                      {String(unit.v).padStart(2, '0')}
                    </span>
                    <span className="block mt-1 text-[7.5px] font-black uppercase tracking-[0.18em] opacity-75">
                      {unit.l}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Slab>
      </motion.div>
    </section>
  );
}
