import React from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';

/** Şerit sayısı: 6, telefonda akıcı ve kıvrım gözle yumuşak. */
const N = 6;
/** Kıvrımın toplam ek açısı (derece): sayfanın serbest kenarı sırttan önde gider. */
const BEND = 54;

/** `k`. şeridin sırta göre kendi açısı (ebeveynine göreli). */
function stripAngle(k: number, p: number): number {
  const bend = BEND * Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  return k === 0 ? -180 * p : -bend / (N - 1);
}

/** Şeridin dünyadaki toplam açısı (gölgelendirme için). */
function worldAngle(k: number, p: number): number {
  let a = 0;
  for (let i = 0; i <= k; i++) a += stripAngle(i, p);
  return a;
}

function Strip({ k, progress, front, back }: { k: number; progress: MotionValue<number>; front: React.ReactNode; back: React.ReactNode }) {
  const transform = useTransform(progress, (p) => `rotateY(${stripAngle(k, p).toFixed(3)}deg)`);
  // Işığa göre gölge: sayfa dikleştikçe koyulaşır, kıvrımın içi daha da.
  const shade = useTransform(progress, (p) => Math.min(0.55, Math.abs(Math.sin((worldAngle(k, p) * Math.PI) / 180)) * 0.45 + (p > 0 && p < 1 ? k * 0.012 : 0)));
  return (
    <motion.div
      className="absolute top-0 h-full [transform-style:preserve-3d] origin-left"
      style={{ left: k === 0 ? 0 : '100%', width: k === 0 ? `${100 / N}%` : '100%', transform }}
    >
      {/* Ön yüz: sayfa içeriğinin bu şeride düşen dilimi */}
      <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">
        <div className="absolute top-0 h-full" style={{ left: `${-k * 100}%`, width: `${N * 100}%` }}>
          {front}
        </div>
        <motion.div aria-hidden="true" className="absolute inset-0 bg-[#1A1208]" style={{ opacity: shade }} />
      </div>
      {/* Arka yüz: kâğıdın arkası (aynalı) */}
      <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <div className="absolute top-0 h-full" style={{ left: `${-(N - 1 - k) * 100}%`, width: `${N * 100}%` }}>
          {back}
        </div>
        <motion.div aria-hidden="true" className="absolute inset-0 bg-[#1A1208]" style={{ opacity: shade }} />
      </div>
      {k < N - 1 && <Strip k={k + 1} progress={progress} front={front} back={back} />}
    </motion.div>
  );
}

/**
 * Kıvrılarak çevrilen sayfa. Sayfa N dikey şeride bölünür; her şerit bir
 * öncekinin içinde, onun sağ kenarına menteşeli durur. İlk şerit sırttan
 * döner (−180°·p), sonrakiler küçük ek açılarla kenarı öne taşır: çevirme
 * ortasında sayfa gerçek kâğıt gibi bükülür, iki uçta (p = 0, 1) düzleşir.
 *
 * WebGL kullanılmaz: içerik gerçek DOM'dur (metin seçilir, ekran okuyucu
 * okur, galeri fotoğrafları CORS'a takılmadan çizilir).
 */
export function KivrilanSayfa({
  progress,
  front,
  back,
  className,
  style
}: {
  progress: MotionValue<number>;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  style?: React.ComponentProps<typeof motion.div>['style'];
}) {
  // Tamamen çevrilen sayfa sırtın soluna, ekran dışına düşer; dar ekranda
  // kenarda şerit gibi görünmesin diye gizlenir (geri çekilince yeniden görünür).
  const visibility = useTransform(progress, (p) => (p > 0.985 ? 'hidden' : 'visible'));
  return (
    <motion.div className={`absolute inset-0 [transform-style:preserve-3d] ${className ?? ''}`} style={{ ...style, visibility }}>
      <Strip k={0} progress={progress} front={front} back={back} />
    </motion.div>
  );
}
