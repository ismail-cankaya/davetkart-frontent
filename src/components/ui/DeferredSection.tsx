import React from 'react';
import { cn } from '../../utils/cn';

interface DeferredSectionProps {
  /**
   * Henüz çizilmemiş bölümün tahmini yüksekliği, kırılım noktası başına:
   * `[--defer-height:2250px] lg:[--defer-height:1510px]`. Gerçek yüksekliğe
   * yakın tutulmalı; aksi hâlde bölüm çizildiğinde kaydırma çubuğu sıçrar.
   */
  estimateClassName: string;
  children: React.ReactNode;
}

/**
 * Görünür alana yaklaşana kadar içeriğinin stil, layout ve boyama işini
 * tarayıcıya atlatan sarmalayıcı (`content-visibility: auto`; bkz. index.css
 * `.defer-offscreen`).
 *
 * 🔴 Ana sayfanın alt bölümleri ilk ekranda görünmediği hâlde her karede
 * boyanıyordu: bulanık arka plan lekeleri, sürekli dönen süslemeler ve
 * degradeler, kullanıcı hero'dan ilk kez aşağı kaydırırken GPU bütçesini
 * paylaşıyordu. Bu sarmalayıcı onları, kullanıcı yaklaşana kadar maliyetsiz
 * kılar. İçerik DOM'da kalır; arama, erişilebilirlik ve çapa bağlantıları
 * etkilenmez.
 *
 * Yalnızca kendi taşmasını kırpan (`overflow-hidden`) bölümleri sarın:
 * `content-visibility` boyama sınırlaması getirir ve bölüm dışına taşan
 * süslemeler kesilir.
 */
export function DeferredSection({ estimateClassName, children }: DeferredSectionProps) {
  return <div className={cn('defer-offscreen', estimateClassName)}>{children}</div>;
}
