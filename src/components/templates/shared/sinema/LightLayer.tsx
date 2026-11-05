import React from 'react';
import { cn } from '../../../../utils/cn';
import type { VideoSet } from '../videoAssets';
import { CinemaVideo } from './CinemaVideo';

/**
 * Metnin ÖNÜNDEN geçen ışık katmanı videosu (buhar, toz, ışıltı).
 *
 * Gerçek alfa kanallı video (VP9 alpha / HEVC alpha) tarayıcılar arasında
 * taşınabilir değil: Safari VP9 alfayı, Chrome HEVC alfayı oynatmaz. Bunun
 * yerine klip **siyah zemin üzerine** üretilir ve `mix-blend-mode: screen` ile
 * bindirilir: siyah = görünmez, parlak = ışık. Buhar, ışık ve parıltı gibi
 * "ekleyen" efektler için birebir doğru sonuç verir, her tarayıcıda çalışır
 * ve H.264 donanım çözücüsünü kullanır. Koyu bir nesneyi (gölge, duman)
 * öne bindirmek için uygun değildir.
 *
 * 🔴 Yalnızca `InvitationComposition`'ın `renderForeground` kancasından
 * çizilir: harmanı kompozisyonun ön plan kabı yapar. Hero'nun içine konursa
 * kaydırma kabının katman bağlamında boşlukla harmanlanır ve siyah bir perde
 * gibi sahneyi karartır.
 *
 * Ortak `CinemaVideo` üstüne kurulur: önizlemede ve "hareketi azalt"ta video
 * hiç oluşmaz, yalnızca poster kalır; ekran dışında ve sekme gizliyken durur.
 * Katman hiçbir zaman dokunuş almaz.
 */
export function LightLayer({
  video,
  mode,
  opacity = 1,
  className
}: {
  video: VideoSet;
  mode: 'preview' | 'live';
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ opacity }}
    >
      <CinemaVideo video={video} mode={mode} />
    </div>
  );
}
