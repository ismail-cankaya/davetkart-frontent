import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('nisan-sampanya', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * NisanSampanya — "Şampanya İpek": fildişi ipek dokusu, şampanya vurgular ve yüzen altın zerreler.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const NISAN_SAMPANYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#faf6ee]',
  page: 'text-[#8d8172]',
  surface: 'bg-white/78 backdrop-blur-md',
  border: 'border-[#e8e0d0]',
  heading: 'text-[#3b342a]',
  body: 'text-[#8d8172]',
  accent: 'text-[#b08d57]',
  accentBg: 'bg-[#b08d57]',
  accentSoft: 'bg-[#b08d57]/10',
  input:
    'w-full bg-white/85 border border-[#e8e0d0] rounded-lg px-3.5 py-2.5 text-sm text-[#3b342a] placeholder:text-[#8d8172] focus:outline-none focus:border-[#b08d57] focus:ring-2 focus:ring-[#b08d57]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#3b342a] hover:bg-[#4e4536] text-[#faf6ee] shadow-lg shadow-[#3b342a]/15',
  buttonGhost:
    'border border-[#ddd2bd] text-[#6c6253] hover:bg-[#f1ebdf] hover:border-[#c9bda3]',
  divider: 'bg-[#e8e0d0]',
  timelineLine: 'from-[#b08d57] via-[#b08d57]/50 to-transparent'
};

export function NisanSampanya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_SAMPANYA_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Koyu metnin kontrastı için açık scrim; ortada şeffaf kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/15 to-white/50" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#faf6ee]" />
        </VideoBackdrop>
      )}
    />
  );
}
