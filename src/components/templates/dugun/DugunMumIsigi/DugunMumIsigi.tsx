import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Bokeh kütlesi her iki renderda da kenarlarda; merkez metin için temiz. */
const VIDEO = videoSet('mum-isigi', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * DugunMumIsigi — "Mum Işığı": gece nikâhı için koyu lacivert-kahve zemin,
 * süzülen altın bokeh. Tek koyu videolu tema; tipografi ışık, vurgular
 * mum alevinin şampanya sarısı.
 */
const MUM_ISIGI_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#0a0d14]',
  page: 'text-[#e8ddc9]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#f7edd8]',
  body: 'text-[#a2937d]',
  accent: 'text-[#e3b878]',
  accentBg: 'bg-[#e3b878]',
  accentSoft: 'bg-[#e3b878]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#f0e6d2] placeholder:text-[#7d7060] focus:outline-none focus:border-[#e3b878]/50 focus:ring-2 focus:ring-[#e3b878]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#e3b878] hover:bg-[#efc98d] text-[#17110a] shadow-lg shadow-[#e3b878]/15',
  buttonGhost:
    'border border-white/15 text-[#e8ddc9] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#e3b878] via-[#e3b878]/40 to-transparent'
};

export function DugunMumIsigi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={MUM_ISIGI_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Açık renk metnin kontrastı için koyu scrim: kenarlarda yoğun,
              ortada şeffaf — bokeh görünürken yazı okunaklı kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a0d14]" />
        </VideoBackdrop>
      )}
    />
  );
}
