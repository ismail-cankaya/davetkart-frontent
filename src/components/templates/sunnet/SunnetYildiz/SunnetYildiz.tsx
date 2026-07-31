import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('sunnet-yildiz', { landscape: '50% 50%', portrait: '50% 48%' });

/**
 * SunnetYildiz — "Yıldız Tozu": gece mavisi gökte titreşen altın yıldızlar ve yumuşak nebula.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const SUNNET_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#060f26]',
  page: 'text-[#e2eafa]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#e2eafa]',
  body: 'text-[#93a7c4]',
  accent: 'text-[#f2d79b]',
  accentBg: 'bg-[#f2d79b]',
  accentSoft: 'bg-[#f2d79b]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2eafa] placeholder:text-[#93a7c4] focus:outline-none focus:border-[#f2d79b]/50 focus:ring-2 focus:ring-[#f2d79b]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f2d79b] hover:bg-[#f8e4b4] text-[#0a1633] shadow-lg shadow-[#f2d79b]/15',
  buttonGhost:
    'border border-white/15 text-[#e2eafa] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#f2d79b] via-[#f2d79b]/40 to-transparent'
};

export function SunnetYildiz({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_YILDIZ_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Açık metnin kontrastı için koyu scrim; ortada şeffaf kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#060f26]" />
        </VideoBackdrop>
      )}
    />
  );
}
