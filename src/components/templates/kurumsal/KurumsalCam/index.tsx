import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh, Iridescent } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalHero } from '../parts/KurumsalHero';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { GlassPanes } from '../parts/GlassPanes';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalCam — "Sıvı Cam", gündüz sürümü: buz beyazı zeminde kobalt ve
 * platin renk kütleleri, önlerinde iki buzlu cam levha.
 *
 * Kategorinin sinematik şablonlarının tek açık zeminlisi. Cam etkisi
 * backdrop-blur'la değil (her karede yeniden örneklenirdi), bulanık renk
 * kütlelerinin önüne konan yarı saydam levhalarla kurulur.
 */
const CAM_THEME = kurumsalTheme({
  id: 'stone',
  base: 'bg-[#EDEFF2]',
  page: 'text-[#3E434B]',
  surface: 'bg-white/75 backdrop-blur-xl',
  border: 'border-[#101216]/10',
  heading: 'text-[#101216]',
  body: 'text-[#535862]',
  accent: 'text-[#2B3FE0]',
  accentBg: 'bg-[#2B3FE0]',
  accentSoft: 'bg-[#2B3FE0]/10',
  input:
    'w-full bg-white/90 border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/18 transition duration-300',
  buttonPrimary: 'bg-[#2B3FE0] hover:bg-[#2233C2] text-white shadow-[0_14px_30px_-16px_rgba(43,63,224,0.7)]',
  buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-white/70 hover:border-[#101216]/30',
  divider: 'bg-[#101216]/12',
  timelineLine: 'from-[#2B3FE0] via-[#8F9CFF]/50 to-transparent'
});

export function KurumsalCam({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={CAM_THEME}
      renderHero={(props) => <KurumsalHero {...props} align="start" />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(150deg, #F6F7F9 0%, #E9ECF2 52%, #DCE1EC 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <>
              {/* Sıvı degrade: ağır, sakin (36 s) — kurumsal ton telaş etmez. */}
              <AuroraMesh colors={['43,63,224', '143,156,255', '197,203,211']} opacity={0.2} duration={36} />
              <Iridescent opacity={0.1} duration={24} className="mix-blend-soft-light" />
              <GlassPanes revealed={revealed} />
            </>
          }
          overlay={<KurumsalFrame color="rgba(16,18,22,0.3)" revealed={revealed} />}
          parallax={9}
          grain={0.02}
          fadeTo="#EDEFF2"
        />
      )}
    />
  );
}
