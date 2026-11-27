/**
 * Şablon metin anlık görüntüsü (Faz 24) — metin taşımasının "görünüm değişmedi" kanıtı.
 *
 *   node scripts/run-check.mjs scripts/text-slots/snapshot.tsx <çıktı-klasörü>
 *
 * Katalogdaki her şablonu her kategorisinde, bütün modüller açık ve zarflı/zarfsız iki hâlde
 * HTML'e çizer. Saat ve rastgelelik sabitlenir; iki çalıştırmanın çıktısı birebir aynı olmalı.
 * Taşımadan önce ve sonra alınan iki klasör `diff -r` ile karşılaştırılır.
 * Ayrıntı: docs/rehber/scripts/text-slots.md
 */
import '../render-env';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { TemplateRenderer } from '../../src/components/templates/TemplateRenderer';
import { INITIAL_INVITATION } from '../../src/data';
import { TEMPLATE_PRESETS } from '../../src/templateCatalog';
import type { Invitation } from '../../src/types';

const FIXED_NOW = Date.parse('2027-01-15T12:00:00Z');
const RealDate = Date;
class FixedDate extends RealDate {
  constructor(...args: ConstructorParameters<typeof Date> | []) {
    if (args.length === 0) super(FIXED_NOW);
    else super(...(args as ConstructorParameters<typeof Date>));
  }
  static now(): number {
    return FIXED_NOW;
  }
}
globalThis.Date = FixedDate as DateConstructor;

let seed = 42;
Math.random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

// run-check betiği aynı süreçte yükler: argv = [node, run-check.mjs, betik, klasör].
const outDir = process.argv[3];
if (!outDir) {
  console.error('Kullanım: node scripts/run-check.mjs scripts/text-slots/snapshot.tsx <çıktı-klasörü>');
  process.exit(2);
}
fs.mkdirSync(outDir, { recursive: true });

const FULL: Partial<Invitation> = {
  names: 'Deniz & Can',
  title: '',
  subtitle: '',
  date: '2027-06-12T19:00',
  timezone: 'Europe/Istanbul',
  venue: 'Kuzguncuk Bahçe',
  mapUrl: 'https://maps.google.com/?q=Kuzguncuk',
  showTimer: true,
  showTimeline: true,
  showGallery: true,
  showGift: true,
  showRSVP: true,
  bankName: 'Örnek Bankası',
  accountHolder: 'Deniz Yılmaz',
  iban: 'TR000000000000000000000000',
  giftOptions: [500, 1000],
  rsvpDeadline: '2027-06-01',
  askMenuPreference: true,
  timelineEvents: [
    { id: 't1', time: '19:00', title: 'Karşılama', description: 'Bahçede' },
    { id: 't2', time: '20:00', title: 'Nikâh', description: '' }
  ] as Invitation['timelineEvents'],
  galleryImages: [{ id: null, url: '/x/1.webp' }, { id: null, url: '/x/2.webp' }]
};

async function render(invitation: Invitation, presetId: string): Promise<string> {
  seed = 42;
  const { prelude } = await prerenderToNodeStream(
    <TemplateRenderer templateId={presetId} invitation={invitation} mode="live" />
  );
  let html = '';
  for await (const chunk of prelude) html += String(chunk);
  return html;
}

async function main(): Promise<void> {
  let count = 0;
for (const preset of TEMPLATE_PRESETS) {
  for (const categoryId of preset.categories) {
    for (const showEnvelope of [false, true]) {
      const invitation: Invitation = {
        ...INITIAL_INVITATION,
        ...FULL,
        imageTheme: preset.id,
        phoneBackground: preset.id,
        categoryId,
        showEnvelope
      };
      const html = await render(invitation, preset.id);
      fs.writeFileSync(path.join(outDir, `${categoryId}__${preset.id}__${showEnvelope ? 'zarf' : 'acik'}.html`), html);
      count += 1;
    }
  }
}
console.log(`${count} çizim yazıldı → ${outDir}`);
}

void main();
