import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyKrom — "Likit Krom" baby shower yorumu: sedef. Metal değil, İNCİ yüzeyi.
 *
 * Krom dili başka kategorilerde gece zemininde sert metal olarak kurulur;
 * burada aynı iridesan katman açık zemine alınınca sabun köpüğü / sedef
 * kabuk hissine dönüşüyor. Başlık yine degradeden kesiliyor ama tonlar
 * doygunluk yerine parlaklıkla ayrışıyor.
 */
const BABY_KROM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f7fa]',
  page: 'text-[#5b606b]',
  surface: 'bg-white/70 backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-[#e3e7ee]',
  heading:
    'text-transparent bg-clip-text bg-gradient-to-br from-[#7f9cc4] via-[#b696cc] to-[#6fbfb4]',
  body: 'text-[#8a909c]',
  accent: 'text-[#7fb3c9]',
  accentBg: 'bg-[#7fb3c9]',
  accentSoft: 'bg-[#7fb3c9]/14',
  input:
    'w-full bg-white/85 border border-[#e3e7ee] rounded-xl px-3.5 py-2.5 text-sm text-[#5b606b] placeholder:text-[#8a909c] focus:outline-none focus:border-[#7fb3c9] focus:ring-2 focus:ring-[#7fb3c9]/18 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#a9c9e8] via-[#d8c0e8] to-[#a9e0d8] hover:brightness-105 text-[#22262e] shadow-lg shadow-[#a9c9e8]/30',
  buttonGhost:
    'border border-[#dbe1ea] text-[#6b707b] hover:bg-[#edf1f6] hover:border-[#bcc5d2]',
  divider: 'bg-[#e3e7ee]',
  timelineLine: 'from-[#7fb3c9] via-[#c8b6dc]/60 to-transparent'
};

export function BabyKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #fdfeff 0%, #eef2f8 55%, #e5ebf3 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <>
              {/* soft-light: sedef katmanı zemini boyamaz, üzerinde parlar —
                  açık zeminde düz opaklık kullanılsaydı renkler çamurlaşırdı. */}
              <Iridescent opacity={0.5} duration={18} className="mix-blend-soft-light" />
              <Halo color="169,201,232" size={60} x={50} y={38} opacity={0.24} duration={11} />
            </>
          }
          parallax={6}
          grain={0.018}
          fadeTo="#f5f7fa"
        />
      )}
    />
  );
}
