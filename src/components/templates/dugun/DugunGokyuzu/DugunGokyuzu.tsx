import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * Odak farkı bilinçli: yatay renderda güneş sol-alt üçte birde, merkez
 * korunur; dikeyde güneş alt yarıda olduğu için kırpmada biraz yukarısı
 * tutulur ki isimler açık gökte kalsın.
 */
const VIDEO = videoSet('gokyuzu-ruyasi', { landscape: '50% 50%', portrait: '50% 42%' });

/**
 * DugunGokyuzu — "Gökyüzü Rüyası": şafak göğü, süzülen bulutlar ve sıcak
 * güneş halesi. Palet videodan türetildi; başlıklar göğün gece mavisi,
 * vurgular bulut altlarındaki gül kurusu yansıma.
 */
const GOKYUZU_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#eef3f9]',
  page: 'text-[#3b4759]',
  surface: 'bg-white/72 backdrop-blur-md',
  border: 'border-[#dde6f0]',
  heading: 'text-[#2b3a4f]',
  body: 'text-[#6f7f93]',
  accent: 'text-[#bd8078]',
  accentBg: 'bg-[#bd8078]',
  accentSoft: 'bg-[#bd8078]/10',
  input:
    'w-full bg-white/85 border border-[#dde6f0] rounded-lg px-3.5 py-2.5 text-sm text-[#3b4759] placeholder:text-[#a3b1c2] focus:outline-none focus:border-[#7fa3c8] focus:ring-2 focus:ring-[#7fa3c8]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#3f5673] hover:bg-[#4e6a8c] text-[#f4f8fc] shadow-lg shadow-[#3f5673]/15',
  buttonGhost:
    'border border-[#c4d3e2] text-[#556781] hover:bg-[#e6eef6] hover:border-[#a5bcd2]',
  divider: 'bg-[#dde6f0]',
  timelineLine: 'from-[#8fb2d6] via-[#c3d6e8]/60 to-transparent'
};

/**
 * Hero'nun tamamını döngüsel gökyüzü videosu kaplar. Dikey konteynerde
 * (telefon ve editördeki telefon simülatörü) ayrı komponize edilmiş dikey
 * render devreye girer; yatay videoyu kırpmak kadrajın ~%65'ini yok ederdi.
 */
export function DugunGokyuzu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={GOKYUZU_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Scrim: koyu metnin açık gök üzerinde kontrastını yükseltir.
              Üstte ve altta yoğun, ortada şeffaf — video ortadan görünür. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/10 to-white/55" />

          {/* Kenar yumuşatma: hero, altındaki bölümlerin zeminine (#eef3f9)
              keskin bir çizgiyle değil, eriyerek bağlanır. */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#eef3f9]" />
        </VideoBackdrop>
      )}
    />
  );
}
