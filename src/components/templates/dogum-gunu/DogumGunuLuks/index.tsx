import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, LightLeak, GoldSheen, Iridescent } from '../../shared/effects';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuLuks — Konsept 1, "Lüks Parti Patlaması": koyu zeminde patlayan,
 * ağır çekimde dökülen altın / gümüş / rose-gold 3B konfetiler; merkezde
 * neon parlamayla yanıp sönen yaş rakamı.
 *
 * Konfetinin hızı bilinçli olarak düşük (speed 0.6): 120fps ağır çekim
 * hissi hızdan değil, düşüşün terminal hıza yavaşça oturmasından geliyor.
 * Motorun hava direnci katsayısı bu his için ayarlı.
 */
const LUKS_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0809]',
  page: 'text-[#e9dfd6]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#e0b878]/22',
  heading: 'text-[#fdf4e8]',
  body: 'text-[#9d9086]',
  accent: 'text-[#e0b878]',
  accentBg: 'bg-[#e0b878]',
  accentSoft: 'bg-[#e0b878]/10',
  input:
    'w-full bg-white/[0.06] border border-[#e0b878]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f5ebe0] placeholder:text-[#877b71] focus:outline-none focus:border-[#e0b878]/60 focus:ring-2 focus:ring-[#e0b878]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e0b878] to-[#f0d5a4] hover:from-[#e9c78d] hover:to-[#f7e2b8] text-[#171009] shadow-lg shadow-[#e0b878]/25',
  buttonGhost:
    'border border-[#e0b878]/25 text-[#e9dfd6] hover:bg-[#e0b878]/10 hover:border-[#e0b878]/45',
  divider: 'bg-[#e0b878]/18',
  timelineLine: 'from-[#e0b878] via-[#e6a898]/50 to-transparent'
};

export function DogumGunuLuks({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={LUKS_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 85% 70% at 50% 42%, #2e2415 0%, #14100b 55%, #070506 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Neon yaş rakamının arkasındaki parlama — hızlı nabız (6s),
                  konseptin tek "parti" ritmi burada. */}
              <Halo color="224,184,120" size={68} x={50} y={40} opacity={0.36} duration={6} />
              {/* Metalik konfetinin havadaki yansıması: sıcak uca çekilmiş
                  iridesan katman, soft-light ile zemini boyamadan parlar. */}
              <Iridescent
                opacity={0.2}
                duration={13}
                className="mix-blend-soft-light [filter:hue-rotate(330deg)_saturate(0.9)]"
              />
              <LightLeak color="255,228,180" opacity={0.28} duration={12} />
              <GoldSheen color="240,213,164" opacity={0.16} duration={8} />
            </>
          }
          particles={[
            // Ağır çekim 3B konfeti: altın, gümüş, rose-gold.
            {
              preset: 'confetti',
              colors: ['#e0b878', '#d9d9d9', '#e6a898', '#f5e2b0'],
              density: 1.2,
              speed: 0.6,
              opacity: 0.95,
              depth: 1,
              seed: 4
            },
            // Patlamadan geriye kalan metalik toz bulutu.
            {
              preset: 'fairyDust',
              colors: ['#e0b878', '#ffe9c0', '#e6a898'],
              blend: 'screen',
              density: 0.8,
              speed: 0.5,
              opacity: 0.6,
              depth: 0.4,
              seed: 47
            }
          ]}
          fadeTo="#0a0809"
        />
      )}
    />
  );
}
