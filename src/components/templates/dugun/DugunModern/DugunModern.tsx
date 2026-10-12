import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * DugunModern — "Gece Modası": nötr kömür zemin, sağ üstten çapraz düşen
 * orkide-lila ışık huzmesi, sola yaslı editoryal düzen ve dik (italik
 * olmayan) ince serif isimler. Kategorinin tek sola yaslı hero'su.
 */
export function DugunModern({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunModern}
      renderHero={(props) => (
        <KurdeleHero
          {...props}
          align="start"
          nameClassName="not-italic font-light text-[3rem] @sm:text-6xl @lg:text-7xl leading-[0.98] tracking-[-0.01em]"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #151418 0%, #0c0b0e 60%, #09080b 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <div
                aria-hidden="true"
                className="absolute -right-[35%] -top-[15%] w-[95%] h-[150%] rotate-[22deg] blur-2xl"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(231,154,192,0) 0%, rgba(231,154,192,0.24) 42%, rgba(185,167,224,0.18) 68%, rgba(185,167,224,0) 100%)'
                }}
              />
              <Halo color="231,154,192" size={55} x={92} y={8} opacity={0.32} duration={12} />
            </>
          }
          // Geniş kaplarda metnin boş bıraktığı sağ yarıyı dev bir kontur `&` taşır.
          overlay={
            <span
              aria-hidden="true"
              className="hidden @3xl:block absolute right-[5%] top-1/2 -translate-y-1/2 font-serif italic leading-none select-none text-[26rem] text-transparent"
              style={{ WebkitTextStroke: '1px rgba(231,154,192,0.3)' }}
            >
              &amp;
            </span>
          }
          parallax={8}
          grain={0.035}
          fadeTo="#0c0b0e"
        />
      )}
    />
  );
}
