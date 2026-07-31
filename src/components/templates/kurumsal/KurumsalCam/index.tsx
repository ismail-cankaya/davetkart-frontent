import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Kendi videosu: Parti'nin aurora çekimiyle aynı kapağı paylaşmaz. */
const VIDEO = videoSet('kurumsal-cam', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * KurumsalCam — Konsept 2, "Sıvı Cam Şıklığı": buzlu cam ardından süzülen,
 * ağır hareket eden kurumsal renklerde sıvı degrade.
 *
 * Buradaki buzlu cam efekti bir katman değil, `haze` parçacıklarının
 * yavaşlığından doğuyor: dev, çok sönük ve çok yavaş lekeler videoyu
 * yumuşatır. CSS backdrop-blur ile yapılsaydı tüm hero tek seferde
 * bulanıklaşır, sıvının hareketi kaybolurdu.
 *
 * Tipografi bilinçli olarak sans-serif (theme-cormorant yok): kurumsal
 * davette okunaklılık zarafetin önüne geçer.
 */
const CAM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#080a12]',
  page: 'text-[#dde2ee]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl',
  border: 'border-white/16',
  heading: 'text-[#f4f7ff]',
  body: 'text-[#8a93a8]',
  accent: 'text-[#7ee0d0]',
  accentBg: 'bg-[#7ee0d0]',
  accentSoft: 'bg-[#7ee0d0]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-lg px-3.5 py-2.5 text-sm text-[#eaeef8] placeholder:text-[#727b90] focus:outline-none focus:border-[#7ee0d0]/60 focus:ring-2 focus:ring-[#7ee0d0]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#7ee0d0] hover:bg-[#95e8da] text-[#07231f] shadow-lg shadow-[#7ee0d0]/22',
  buttonGhost:
    'border border-white/18 text-[#dde2ee] hover:bg-white/8 hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#7ee0d0] via-[#7ee0d0]/40 to-transparent'
};

export function KurumsalCam({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={CAM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(135deg, #0e2a2e 0%, #101430 45%, #07080f 100%)"
          scrim={{ from: 'both', strength: 0.44 }}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="126,224,208" size={70} x={50} y={46} opacity={0.24} duration={12} />}
          particles={[
            // Buzlu cam: dev, sönük, çok yavaş lekeler.
            {
              preset: 'haze',
              colors: ['#7ee0d0', '#6c8cf0', '#c07ee0'],
              blend: 'screen',
              density: 1.2,
              speed: 0.5,
              opacity: 0.7,
              pointerStrength: 0,
              depth: 0.4,
              seed: 7
            }
          ]}
          parallax={9}
          grain={0.028}
          fadeTo="#080a12"
        />
      )}
    />
  );
}
