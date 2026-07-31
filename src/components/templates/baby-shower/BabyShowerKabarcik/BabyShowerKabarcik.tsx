import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('baby-shower-kabarcik', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * BabyShowerKabarcik — "Kabarcıklar": nane-şeftali pastel degradede yükselen saydam kabarcıklar.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const BABY_KABARCIK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4faf7]',
  page: 'text-[#8aa09a]',
  surface: 'bg-white/78 backdrop-blur-md',
  border: 'border-[#dceee8]',
  heading: 'text-[#38504b]',
  body: 'text-[#8aa09a]',
  accent: 'text-[#e2a08c]',
  accentBg: 'bg-[#e2a08c]',
  accentSoft: 'bg-[#e2a08c]/10',
  input:
    'w-full bg-white/85 border border-[#dceee8] rounded-lg px-3.5 py-2.5 text-sm text-[#38504b] placeholder:text-[#8aa09a] focus:outline-none focus:border-[#e2a08c] focus:ring-2 focus:ring-[#e2a08c]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#5f9c8f] hover:bg-[#6fada0] text-[#f2fbf8] shadow-lg shadow-[#5f9c8f]/20',
  buttonGhost:
    'border border-[#cfe4dd] text-[#5d7a74] hover:bg-[#e8f4f0] hover:border-[#aed2c9]',
  divider: 'bg-[#dceee8]',
  timelineLine: 'from-[#e2a08c] via-[#e2a08c]/50 to-transparent'
};

export function BabyShowerKabarcik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_KABARCIK_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Koyu metnin kontrastı için açık scrim; ortada şeffaf kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/15 to-white/50" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f4faf7]" />
        </VideoBackdrop>
      )}
    />
  );
}
