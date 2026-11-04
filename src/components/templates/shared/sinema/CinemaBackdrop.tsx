import React from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import type { BackdropState } from '../InvitationComposition';
import type { VideoSet } from '../videoAssets';
import { CinemaVideo, type CinemaPhase, type CinemaPlayback } from './CinemaVideo';

interface CinemaBackdropProps extends BackdropState {
  video: VideoSet;
  mode: 'preview' | 'live';
  playback?: CinemaPlayback;
  onPhase?: (phase: CinemaPhase) => void;
  onVideo?: (el: HTMLVideoElement | null) => void;
  /** Video inene kadar ve "hareketi azalt"ta görünen CSS zemini. */
  base: string;
  /** Kaydırınca bölümlerin arkasına inen perde rengi, ör. `'8,2,4'`. */
  dimRgb: string;
  /** Hero çıkışında perdenin ulaşacağı opaklık (bölüm okunabilirliği). */
  dim?: number;
  /** Hero çıkışında video yakınlaşması (1 = yok). */
  zoom?: number;
  /** Videonun üstünde, perdenin altında: ışık, parçacık, süs. */
  children?: React.ReactNode;
  /** Perdenin de üstünde kalan katman (çerçeve, kenar süsü). */
  overlay?: React.ReactNode;
}

/**
 * Premium şablonların sabit sahnesi: video + kaydırmaya bağlı kamera
 * (yakınlaşma, karartma). Bölümler bu sahnenin önünden akar; hero'dan
 * çıkarken perde iner, kart yüzeyleri her karede okunur kalır.
 */
export function CinemaBackdrop({
  video,
  mode,
  playback,
  onPhase,
  onVideo,
  base,
  dimRgb,
  dim = 0.62,
  zoom = 1.08,
  heroExit,
  children,
  overlay
}: CinemaBackdropProps) {
  const reduced = useReducedMotion() ?? false;
  const scale = useTransform(heroExit, [0, 1], [1, reduced ? 1 : zoom]);
  const curtain = useTransform(heroExit, [0, 0.85], [0, dim]);
  return (
    <div className="absolute inset-0" style={{ background: base }}>
      <motion.div className="absolute inset-0 will-change-transform" style={{ scale }}>
        <CinemaVideo video={video} mode={mode} playback={playback} onPhase={onPhase} onVideo={onVideo} />
        {children}
      </motion.div>
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ opacity: curtain, background: `rgb(${dimRgb})` }} />
      {overlay}
    </div>
  );
}
