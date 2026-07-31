import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('kina-bordo', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * KinaBordo — "Bordo İpek": şarap kırmızısı ipek kıvrımları üzerinde süzülen altın ışık ve toz.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const KINA_BORDO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#1d0710]',
  page: 'text-[#f2ded3]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#f2ded3]',
  body: 'text-[#c0a094]',
  accent: 'text-[#e8c07a]',
  accentBg: 'bg-[#e8c07a]',
  accentSoft: 'bg-[#e8c07a]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#f2ded3] placeholder:text-[#c0a094] focus:outline-none focus:border-[#e8c07a]/50 focus:ring-2 focus:ring-[#e8c07a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#e8c07a] hover:bg-[#f0cf95] text-[#2b0a15] shadow-lg shadow-[#e8c07a]/15',
  buttonGhost:
    'border border-white/15 text-[#f2ded3] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#e8c07a] via-[#e8c07a]/40 to-transparent'
};

export function KinaBordo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BORDO_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Açık metnin kontrastı için koyu scrim; ortada şeffaf kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#1d0710]" />
        </VideoBackdrop>
      )}
    />
  );
}
