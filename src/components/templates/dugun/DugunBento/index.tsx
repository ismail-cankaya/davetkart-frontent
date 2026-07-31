import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunBento — "Bento Editorial": bilgiyi hücre alanına göre hiyerarşiye
 * sokan yapılandırılmış ızgara.
 *
 * Bu dilde arka plan bilinçli olarak sakin: mesh %18 opaklıkta, parçacık
 * yok. Bento'nun gücü düzenin netliğinde; arkada hareket olursa ızgaranın
 * disiplini dağılır ve kartlar "yüzen kutu" gibi görünür.
 */
const DUGUN_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f5f1]',
  page: 'text-[#4a4640]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e4dfd6]',
  heading: 'text-[#1f1d1a]',
  body: 'text-[#827d73]',
  accent: 'text-[#7d8c6f]',
  accentBg: 'bg-[#7d8c6f]',
  accentSoft: 'bg-[#7d8c6f]/12',
  input:
    'w-full bg-white border border-[#e4dfd6] rounded-lg px-3.5 py-2.5 text-sm text-[#4a4640] placeholder:text-[#a9a49a] focus:outline-none focus:border-[#7d8c6f] focus:ring-2 focus:ring-[#7d8c6f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1f1d1a] hover:bg-[#35322d] text-[#f7f5f1] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d8d2c7] text-[#5c574f] hover:bg-[#efece5] hover:border-[#bfb8aa]',
  divider: 'bg-[#e4dfd6]',
  timelineLine: 'from-[#7d8c6f] via-[#c3ccb6]/60 to-transparent'
};

export function DugunBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fbfaf7 0%, #f4f1ea 55%, #eeeae0 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            // Çok düşük opaklık: renk sıcaklığı verir, dikkat çekmez.
            <AuroraMesh colors={['196,206,180', '224,205,186', '208,198,214']} opacity={0.18} duration={30} />
          }
          parallax={6}
          grain={0.016}
          fadeTo="#f7f5f1"
        />
      )}
    />
  );
}
