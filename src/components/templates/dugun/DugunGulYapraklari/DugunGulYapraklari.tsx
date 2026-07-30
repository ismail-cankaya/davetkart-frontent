import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Işık kaynağı üst kısımda; dikeyde kırpma biraz yukarıyı korur. */
const VIDEO = videoSet('gul-yapraklari', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * DugunGulYapraklari — "Gül Yaprakları": pudra zemine süzülen yapraklar.
 * Klasik romantik düğün; palet yaprakların gül kurusu tonlarından türedi.
 */
const GUL_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#fdf4f2]',
  page: 'text-[#59403f]',
  surface: 'bg-white/75 backdrop-blur-md',
  border: 'border-[#f0dcd9]',
  heading: 'text-[#48302f]',
  body: 'text-[#92777a]',
  accent: 'text-[#bf7f88]',
  accentBg: 'bg-[#bf7f88]',
  accentSoft: 'bg-[#bf7f88]/10',
  input:
    'w-full bg-white/85 border border-[#f0dcd9] rounded-lg px-3.5 py-2.5 text-sm text-[#59403f] placeholder:text-[#bda3a3] focus:outline-none focus:border-[#bf7f88] focus:ring-2 focus:ring-[#bf7f88]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#a8616c] hover:bg-[#b9737f] text-[#fdf4f2] shadow-lg shadow-[#a8616c]/15',
  buttonGhost:
    'border border-[#e8ccc9] text-[#7d5a5e] hover:bg-[#f8e8e6] hover:border-[#d9b3b0]',
  divider: 'bg-[#f0dcd9]',
  timelineLine: 'from-[#bf7f88] via-[#e3c2c4]/60 to-transparent'
};

export function DugunGulYapraklari({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={GUL_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Zemin zaten açık; scrim yalnızca yaprakların metnin üzerinden
              geçtiği anlarda kontrastı korumak için hafif bir yıkama. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/15 to-white/45" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#fdf4f2]" />
        </VideoBackdrop>
      )}
    />
  );
}
