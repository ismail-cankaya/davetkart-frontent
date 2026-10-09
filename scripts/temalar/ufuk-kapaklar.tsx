/**
 * Ufuk şablonlarının kapak görsellerini üretir.
 *
 *   npx tsx scripts/temalar/ufuk-kapaklar.tsx
 *
 * Kapak, canlı sahnenin ta kendisidir: aynı çizimler (scenes/ufuk/art) ve
 * aynı renkler (scenes/ufuk/presets) tek bir durağan SVG'ye basılır. Bir
 * sahnenin çizimi ya da rengi değiştiğinde bu betik yeniden çalıştırılır;
 * elle çizilmiş ayrı bir kapak, zamanla şablondan kopardı.
 *
 * Kare: alacakaranlık, ışıklar yanmaya başlamış — davetiyenin açılış anı ile
 * gece arasındaki en canlı hâl. Kadraj şeridin ortasına (ana motif) odaklanır,
 * çünkü kart küçüktür ve kenarlardaki ağaçlar orada okunmaz.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FLOAT, STRIP, UFUK_ART, UfukStrip } from '../../src/components/templates/shared/scenes/ufuk/art';
import { UFUK_PRESETS, UfukFamily, UfukPreset } from '../../src/components/templates/shared/scenes/ufuk/presets';

/** Aile → şablon klasörü ve dosya adı öneki. */
const TARGETS: Record<UfukFamily, { dir: string; component: string; slug: string }> = {
  dugun: { dir: 'dugun', component: 'DugunUfuk', slug: 'dugun-ufuk' },
  kina: { dir: 'kina', component: 'KinaUfuk', slug: 'kina-ufuk' },
  nisan: { dir: 'nisan', component: 'NisanUfuk', slug: 'nisan-ufuk' },
  sunnet: { dir: 'sunnet', component: 'SunnetUfuk', slug: 'sunnet-ufuk' },
  'dogum-gunu': { dir: 'dogum-gunu', component: 'DogumGunuUfuk', slug: 'dogum-gunu-ufuk' },
  mezuniyet: { dir: 'mezuniyet', component: 'MezuniyetUfuk', slug: 'mezuniyet-ufuk' },
  baby: { dir: 'baby-shower', component: 'BabyUfuk', slug: 'baby-ufuk' },
  parti: { dir: 'parti', component: 'PartiUfuk', slug: 'parti-ufuk' },
  kurumsal: { dir: 'kurumsal', component: 'KurumsalUfuk', slug: 'kurumsal-ufuk' }
};

/** 4:3 kadraj, şeridin ortasından. */
const VIEW = { x: 160, y: 0, w: 1280, h: 960 };
/** Kapakta ışıkların parlaklığı: yanmaya başlamış, henüz gece değil. */
const LIGHTS = 0.75;

function Strip({ strip, y }: { strip: UfukStrip; y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      {strip.glow && <g opacity={LIGHTS}>{strip.glow}</g>}
      {strip.shape}
      {strip.lights && <g opacity={LIGHTS}>{strip.lights}</g>}
    </g>
  );
}

function Poster({ preset }: { preset: UfukPreset }) {
  const art = UFUK_ART[preset.kind](preset.palette, 'kapak');
  const ground = VIEW.h - STRIP.h;
  const sun = { x: VIEW.x + VIEW.w * 0.68, y: VIEW.h * 0.74, r: VIEW.w * 0.075 };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} width={VIEW.w} height={VIEW.h}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          {preset.sky.dusk.map(([color, at]) => (
            <stop key={at} offset={`${at}%`} stopColor={color} />
          ))}
        </linearGradient>
        <radialGradient id="halo">
          <stop offset="0%" stopColor={`rgb(${preset.sun})`} stopOpacity={0.42} />
          <stop offset="30%" stopColor={`rgb(${preset.sun})`} stopOpacity={0.15} />
          <stop offset="62%" stopColor={`rgb(${preset.sun})`} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="disc" cy="45%">
          <stop offset="0%" stopColor="rgb(255,247,232)" />
          <stop offset="58%" stopColor={`rgb(${preset.sun})`} />
          <stop offset="100%" stopColor={`rgb(${preset.sun})`} stopOpacity={0.85} />
        </radialGradient>
        <linearGradient id="haze" x1="0" y1="1" x2="0" y2="0">
          <stop offset="8%" stopColor={`rgb(${preset.haze})`} stopOpacity={0} />
          <stop offset="34%" stopColor={`rgb(${preset.haze})`} stopOpacity={0.34} />
          <stop offset="58%" stopColor={`rgb(${preset.haze})`} stopOpacity={0.12} />
          <stop offset="80%" stopColor={`rgb(${preset.haze})`} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="vignette" r="75%">
          <stop offset="50%" stopColor={`rgb(${preset.scrim})`} stopOpacity={0} />
          <stop offset="100%" stopColor={`rgb(${preset.scrim})`} stopOpacity={0.4} />
        </radialGradient>
      </defs>

      <rect x={VIEW.x} y={0} width={VIEW.w} height={VIEW.h} fill="url(#sky)" />
      <circle cx={sun.x} cy={sun.y} r={sun.r * 9 * 0.62} fill="url(#halo)" />
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill="url(#disc)" />

      <Strip strip={art.far} y={ground} />
      <rect x={VIEW.x} y={VIEW.h * 0.38} width={VIEW.w} height={VIEW.h * 0.62} fill="url(#haze)" />
      {art.float && <Strip strip={art.float} y={VIEW.h - FLOAT.h} />}
      <Strip strip={art.mid} y={ground} />
      <Strip strip={art.near} y={ground} />
      {art.top && <Strip strip={art.top} y={0} />}

      <rect x={VIEW.x} y={0} width={VIEW.w} height={VIEW.h} fill="url(#vignette)" />
    </svg>
  );
}

// fileURLToPath: URL yolu yüzde kodludur; proje yolunda "ş" gibi bir harf
// varsa elle çözülen yol başka (var olmayan) bir klasörü gösterirdi.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

for (const [family, preset] of Object.entries(UFUK_PRESETS) as Array<[UfukFamily, UfukPreset]>) {
  const target = TARGETS[family];
  const folder = path.join(root, 'src/components/templates', target.dir, target.component, 'assets');
  fs.mkdirSync(folder, { recursive: true });
  const file = path.join(folder, `${target.slug}-kapak.svg`);
  const markup = renderToStaticMarkup(<Poster preset={preset} />);
  fs.writeFileSync(file, `${markup}\n`);
  console.log(`${path.relative(root, file)}  ${(markup.length / 1024).toFixed(1)} KB`);
}
