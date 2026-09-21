import React from 'react';
import { motion } from 'motion/react';
import { ease } from '../../../utils/motion';

interface TrackingRevealProps {
  text: string;
  /**
   * Harf başına başlangıç aralığı farkı (em). Pozitif değer harfleri
   * dağınıktan toplar (0.24em → 0.04em için 0.2), negatif değer sıkıdan açar.
   * Son harf aralığı bileşenin değil, kapsayıcının `letter-spacing`'idir.
   */
  spread: number;
  duration: number;
  delay?: number;
}

/**
 * Harf aralığı açılıp kapanıyormuş gibi görünen başlık girişi — layout'suz.
 *
 * 🔴 `letterSpacing` canlandırmak başlığı her karede yeniden dizer; geniş bir
 * başlangıç değeri metni ilk karelerde alt satıra kırıp sonra geri toplar
 * (görünür bir zıplama). Burada harf aralığı baştan son değerindedir; her
 * harf merkeze uzaklığıyla orantılı bir `x` ofsetinden yerine kayar. Göze
 * aynı hareket, tarayıcıya yalnızca transform.
 *
 * Harfler kelime kelime `nowrap` gruplanır: satır bir kelimenin ortasından
 * kırılmaz. Ekran okuyucu parçalanmış harfleri değil, `sr-only` kopyayı okur.
 */
export function TrackingReveal({ text, spread, duration, delay = 0 }: TrackingRevealProps) {
  const chars = Array.from(text);
  const mid = (chars.length - 1) / 2;

  // Kelimelere böl ama her harfin METİN içindeki sırasını koru: ofset,
  // kelimenin değil bütün satırın merkezine göre hesaplanır.
  const words: { char: string; index: number }[][] = [[]];
  chars.forEach((char, index) => {
    if (char === ' ') words.push([]);
    else words[words.length - 1].push({ char, index });
  });

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <React.Fragment key={w}>
            {w > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {word.map(({ char, index }) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ x: `${(index - mid) * spread}em` }}
                  animate={{ x: '0em' }}
                  transition={{ duration, ease: ease.out, delay }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </span>
    </>
  );
}
