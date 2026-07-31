import React, { Suspense, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { getSectionTheme } from './palette';
import { TemplateFlavor } from './flavor';
import { Envelope } from './Envelope';
import { Summary, SummaryDensity } from './Summary';

// Below-the-fold sections stay lazy — the hero paints without them.
const Timeline = React.lazy(() => import('./Timeline').then((m) => ({ default: m.Timeline })));
const Details = React.lazy(() => import('./Details').then((m) => ({ default: m.Details })));
const Gallery = React.lazy(() => import('./Gallery').then((m) => ({ default: m.Gallery })));
const GiftRegistry = React.lazy(() => import('./GiftRegistry').then((m) => ({ default: m.GiftRegistry })));
const RSVPForm = React.lazy(() => import('./RSVPForm').then((m) => ({ default: m.RSVPForm })));

/** Özel hero düzenlerine geçirilen bağlam — Summary'nin aldığının aynısı. */
export interface HeroRenderProps {
  invitation: Invitation;
  theme: ReturnType<typeof getSectionTheme>;
  flavor: TemplateFlavor;
}

interface InvitationCompositionProps {
  invitation: Invitation;
  flavor: TemplateFlavor;
  mode: 'preview' | 'live';
  themeOverride?: ReturnType<typeof getSectionTheme>;
  renderHeroBackground?: () => React.ReactNode;
  /**
   * Hero'nun ÖN PLANINI tamamen değiştirir (varsayılan: Summary).
   *
   * renderHeroBackground yalnızca arkadaki katmanı değiştirir; tipografi ve
   * yerleşim aynı kalır. Gerçek bir tasarım dili farkı (bento ızgara, dev
   * serif minimal) düzenin kendisini değiştirmeyi gerektirdiği için ayrı bir
   * kanca var. Verilmezse hiçbir şablon etkilenmez.
   */
  renderHero?: (props: HeroRenderProps) => React.ReactNode;
  /**
   * Hero metin konteynerinin yerleşimini şablona göre özelleştirir; süslerin
   * kapladığı alanı padding'le güvenli bölgeye çevirmek (Dugun1) veya metni
   * kemer açıklığı gibi sınırlı bir kutuya oturtmak (Dugun4) için kullanılır.
   * cn/twMerge ile varsayılan sınıfların üzerine yazılır.
   */
  heroContentClassName?: string;
  /** Summary tipografi yoğunluğu; dar hero alanlarında 'compact' kullanılır. */
  summaryDensity?: SummaryDensity;
}

/**
 * Composition root of the modular invitation. Reads the wizard's visibility
 * flags off the invitation and renders only the enabled modules, themed by
 * the invitation's palette and flavored by its category template.
 */
export function InvitationComposition({
  invitation,
  flavor,
  mode,
  themeOverride,
  renderHeroBackground,
  renderHero,
  heroContentClassName,
  summaryDensity = 'default'
}: InvitationCompositionProps) {
  const theme = themeOverride || getSectionTheme(invitation.palette);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const envelopeVisible = invitation.showEnvelope && !envelopeOpened;

  const sectionFallback = (
    <div className={cn('w-full h-24 flex items-center justify-center', theme.page)}>
      <div className={cn('w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin', theme.accent)} />
    </div>
  );

  return (
    // @container: içerideki @sm/@md varyantları viewport'a değil bu kökün
    // genişliğine bakar — dar telefon simülatöründe de gerçek mobilde de
    // tipografi/sayaç aynı şekilde ölçeklenir.
    <div data-mode={mode} className={cn('relative w-full h-full overflow-hidden @container', theme.base, theme.page)}>
      
      {/* 1. Category-specific background pattern stays fixed behind all sections */}
      {flavor.BackgroundPattern && (
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <flavor.BackgroundPattern className={cn('w-full h-full', theme.accent)} />
        </div>
      )}

      {/* 2. Envelope layer */}
      <AnimatePresence>
        {envelopeVisible && (
          <Envelope
            invitation={invitation}
            theme={theme}
            flavor={flavor}
            onOpened={() => setEnvelopeOpened(true)}
          />
        )}
      </AnimatePresence>

      {/* 3. Scrollable content */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className={cn(
          'relative z-10 w-full h-full overflow-x-hidden',
          envelopeVisible ? 'overflow-y-hidden' : 'overflow-y-auto'
        )}
      >
        {/* Hero fills at least one "screen" of the scroll container */}
        <div className="min-h-full flex flex-col relative">
          {/* Dynamic background effect strictly for the Hero section */}
          {renderHeroBackground && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              {renderHeroBackground()}
            </div>
          )}
          <div className={cn('relative z-10 w-full h-full flex flex-col grow', heroContentClassName)}>
            {renderHero
              ? renderHero({ invitation, theme, flavor })
              : <Summary invitation={invitation} theme={theme} flavor={flavor} density={summaryDensity} />}
          </div>
        </div>

        <div className="relative z-10">
          <Suspense fallback={sectionFallback}>
            {invitation.showTimeline && (
              <Timeline invitation={invitation} theme={theme} flavor={flavor} scrollContainer={scrollRef} />
            )}

            <Details invitation={invitation} theme={theme} flavor={flavor} />

            {invitation.showGallery && <Gallery invitation={invitation} theme={theme} flavor={flavor} />}

            {invitation.showGift && <GiftRegistry invitation={invitation} theme={theme} flavor={flavor} />}

            {invitation.showRSVP && <RSVPForm invitation={invitation} theme={theme} flavor={flavor} />}
          </Suspense>

          {/* Footer signature */}
          <footer className={cn('py-8 text-center')}>
            <p className={cn('text-[10px] font-medium tracking-[0.3em] uppercase opacity-60', theme.body)}>
              {invitation.names || 'DavetKart'}
            </p>
            <p className={cn('text-[9px] mt-1.5 opacity-40', theme.body)}>DavetKart ile hazırlandı</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
