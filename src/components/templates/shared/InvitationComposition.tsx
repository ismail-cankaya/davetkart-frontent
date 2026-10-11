import React, { Suspense, useRef, useState } from 'react';
import { AnimatePresence, MotionValue, useScroll, useTransform } from 'motion/react';
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
  /**
   * Davetiyenin kendi kaydırma kabı. Sayfa değil bu kap kaydığı için,
   * kaydırmaya bağlı bir çıkış (Ufuk) `useScroll`'a bunu `container` olarak
   * vermek zorundadır; vermezse pencereyi dinler ve hiç ilerlemez.
   */
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Tüm davetiyenin ARKASINDA sabit duran sahneye geçirilen durum.
 *
 * İki ilerleme ayrı tutulur, çünkü ikisi farklı soruları yanıtlar:
 *  - `heroExit` piksel tabanlıdır: hero bir ekran boyu kaydığında 1 olur.
 *    Hero'dan içeriğe geçiş her davetiyede aynı mesafede biter.
 *  - `progress` belge oranıdır: davetiyenin sonunda 1 olur. Bölümleri az
 *    olan bir davetiye "geceye" daha çabuk varır — sahne içeriğe göre akar.
 */
export interface BackdropState extends HeroBackgroundState {
  heroExit: MotionValue<number>;
  progress: MotionValue<number>;
}

/** Hero arka planına geçirilen giriş durumu. */
export interface HeroBackgroundState {
  /**
   * Zarf yoksa baştan, varsa zarf kaymaya başladığı anda `true` olur. Arka
   * planda bir GİRİŞ animasyonu olan şablonlar (ör. Dugun süs görselleri)
   * onu buna bağlar; aksi hâlde giriş zarfın arkasında görünmeden biter.
   * Sürekli ortam döngüleri (ışık, sis, parçacık) bunu yok sayabilir.
   */
  revealed: boolean;
}

interface InvitationCompositionProps {
  invitation: Invitation;
  flavor: TemplateFlavor;
  mode: 'preview' | 'live';
  themeOverride?: ReturnType<typeof getSectionTheme>;
  renderHeroBackground?: (state: HeroBackgroundState) => React.ReactNode;
  /**
   * Hero'yla birlikte kayıp giden `renderHeroBackground`'un aksine, kaydırma
   * kabının ARKASINDA sabit kalan ve tüm bölümleri taşıyan sahne.
   *
   * Sahne kaydırmayı izler (bkz. BackdropState); bölümler onun önünden akar.
   * Verildiğinde kategori deseni (flavor.BackgroundPattern) çizilmez: opak
   * bir sahnenin arkasında boyanması boşa iş olurdu.
   */
  renderBackdrop?: (state: BackdropState) => React.ReactNode;
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
 * `renderBackdrop` sahnesini kaydırma kabına bağlar.
 *
 * Ayrı bileşen olmasının sebebi: `useScroll` bir dinleyici kurar ve kanca
 * koşullu çağrılamaz. Composition'ın içinde çağrılsaydı sahnesi olmayan 200+
 * şablonun her biri boşuna bir kaydırma dinleyicisi taşırdı.
 */
function ScrollBackdrop({
  scrollRef,
  revealed,
  render
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  revealed: boolean;
  render: (state: BackdropState) => React.ReactNode;
}) {
  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });
  // Kabın yüksekliği her karede okunur: önizleme cihazı değiştiğinde ya da
  // telefon döndüğünde geçiş mesafesi yeni ekran boyuna kendiliğinden uyar.
  const heroExit = useTransform(scrollY, (y) => {
    const height = scrollRef.current?.clientHeight || 1;
    return Math.min(1, Math.max(0, y / height));
  });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {render({ revealed, heroExit, progress: scrollYProgress })}
    </div>
  );
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
  renderBackdrop,
  renderHero,
  heroContentClassName,
  summaryDensity = 'default'
}: InvitationCompositionProps) {
  const theme = themeOverride || getSectionTheme(invitation.palette);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [revealStarted, setRevealStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const envelopeVisible = invitation.showEnvelope && !envelopeOpened;

  /**
   * 🔴 Intro kapısı. Hero'nun ön planı zarf kaymaya BAŞLADIĞI anda mount
   * edilir, ondan önce değil. Hero'lar girişlerini `animate` ile mount anında
   * başlatır; zarfla birlikte mount edilselerdi koreografinin tamamı (~3 s)
   * opak zarfın arkasında oynayıp biter ve mühür kırıldığında altta durağan
   * bir hero belirirdi. Ağır katmanlar (video, parçacık, atmosfer)
   * `renderHeroBackground`'da yaşar ve baştan mount kalır; ön plan yalnızca
   * metin ve SVG süs olduğundan geç mount ucuzdur.
   */
  const revealed = !envelopeVisible || revealStarted;

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
      
      {/* 1. Fixed layer behind all sections: the template's scroll-driven
          scene if it has one, otherwise the category background pattern. */}
      {renderBackdrop ? (
        <ScrollBackdrop scrollRef={scrollRef} revealed={revealed} render={renderBackdrop} />
      ) : (
        flavor.BackgroundPattern && (
          <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
            <flavor.BackgroundPattern className={cn('w-full h-full', theme.accent)} />
          </div>
        )
      )}

      {/* 2. Envelope layer */}
      <AnimatePresence>
        {envelopeVisible && (
          <Envelope
            invitation={invitation}
            theme={theme}
            flavor={flavor}
            onRevealStart={() => setRevealStarted(true)}
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
              {renderHeroBackground({ revealed })}
            </div>
          )}
          <div className={cn('relative z-10 w-full h-full flex flex-col grow', heroContentClassName)}>
            {revealed &&
              (renderHero
                ? renderHero({ invitation, theme, flavor, scrollContainer: scrollRef })
                : <Summary invitation={invitation} theme={theme} flavor={flavor} density={summaryDensity} />)}
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
            {/* FE 10.20 (K102): Elit'te "Logosuz özel yayın". Karar sunucudan gelir
                (misafir sayfası ve FE 10.21'den beri editör); alan yoksa imza çizilir. */}
            {invitation.showBranding !== false && (
              <p className={cn('text-[9px] mt-1.5 opacity-40', theme.body)}>DavetKart ile hazırlandı</p>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
