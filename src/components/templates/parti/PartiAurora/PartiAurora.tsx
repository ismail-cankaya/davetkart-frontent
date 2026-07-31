import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('parti-aurora', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * PartiAurora — "Neon Aurora": gece siyahında akan magenta-turkuaz neon şeritler.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const PARTI_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#06060c]',
  page: 'text-[#ece8fa]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#ece8fa]',
  body: 'text-[#9d97b8]',
  accent: 'text-[#35e0ff]',
  accentBg: 'bg-[#35e0ff]',
  accentSoft: 'bg-[#35e0ff]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#ece8fa] placeholder:text-[#9d97b8] focus:outline-none focus:border-[#35e0ff]/50 focus:ring-2 focus:ring-[#35e0ff]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#ff3fa4] to-[#8b5cff] hover:from-[#ff58b1] hover:to-[#9a70ff] text-white shadow-lg shadow-[#35e0ff]/15',
  buttonGhost:
    'border border-white/15 text-[#ece8fa] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#35e0ff] via-[#35e0ff]/40 to-transparent'
};

export function PartiAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_AURORA_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Açık metnin kontrastı için koyu scrim; ortada şeffaf kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#06060c]" />
        </VideoBackdrop>
      )}
    />
  );
}
