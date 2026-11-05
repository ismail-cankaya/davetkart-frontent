import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { displayText } from '../../utils';
import type { Invitation } from '../../../../types';
import { TemplateProps } from '../../types';
import { KURUMSAL_FLAVOR } from '../flavors';

/*
 * Palet — "Mürekkep & Kehribar": yeşil-siyah hacker klişesi değil; derin
 * grafit/lacivert zemin #0E1420, panel #141B29, fildişi metin #EEE8DA,
 * çelik mavisi komutlar #8FA9C7, kehribar vurgu #E3B26B, soluk #8A95A8.
 * (Tailwind sınıfları taranabilsin diye renkler sınıflarda düz yazılır.)
 */

const TERMINAL_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0E1420] [&_.font-serif]:font-mono [&_.font-serif]:font-semibold [&_.font-serif]:tracking-tight',
  page: 'text-[#EEE8DA]',
  surface: 'bg-[#141B29]/85 backdrop-blur-sm shadow-[0_18px_50px_-28px_rgba(0,0,0,0.8)]',
  border: 'border-[#8FA9C7]/20',
  heading: 'text-[#EEE8DA]',
  body: 'text-[#A9B3C4]',
  accent: 'text-[#E3B26B] font-mono',
  accentBg: 'bg-[#E3B26B]',
  accentSoft: 'bg-[#E3B26B]/10',
  // Komut istemi hissi: monospace + solda kehribar bir imleç çubuğu.
  input:
    'w-full font-mono bg-[#0E1420] bg-[linear-gradient(#E3B26B,#E3B26B)] bg-no-repeat bg-[length:7px_2px] bg-[position:12px_72%] border border-[#8FA9C7]/25 rounded-md pl-7 pr-3.5 py-2.5 text-sm text-[#EEE8DA] placeholder:text-[#6B7790] focus:outline-none focus:border-[#E3B26B]/70 focus:ring-2 focus:ring-[#E3B26B]/15 transition-all duration-300',
  buttonPrimary:
    "font-mono before:content-['>_'] before:text-[#0E1420]/60 bg-[#E3B26B] hover:bg-[#EDC386] text-[#0E1420] shadow-lg shadow-[#E3B26B]/15",
  buttonGhost: 'font-mono border border-[#8FA9C7]/35 text-[#EEE8DA] hover:bg-[#8FA9C7]/10',
  divider: 'bg-[#8FA9C7]/15',
  timelineLine: 'from-[#8FA9C7]/70 via-[#8FA9C7]/30 to-transparent',
  envelope: {
    paper: 'bg-[#141B29]',
    flap: 'bg-[#1B2333]',
    seal: 'bg-[#E3B26B] text-[#0E1420]',
    glow: 'bg-[#8FA9C7]/25',
    card: 'bg-[#EEE8DA] border border-[#8FA9C7]/40'
  },
  mapHeader: 'bg-[#1B2333]',
  footer: { names: 'text-[#A9B3C4]', branding: 'text-[#8A95A8]' }
};

const TERMINAL_FLAVOR: TemplateFlavor = {
  ...KURUMSAL_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Oturum açıldı',
  headings: {
    timeline: '$ agenda --list',
    details: '$ venue --map',
    gallery: '$ ls ./galeri',
    gift: '$ donate --info',
    rsvp: '$ rsvp --join'
  },
  eyebrows: { timeline: 'Gündem', details: 'Konum', gallery: 'Arşiv', gift: 'Katkı', rsvp: 'Katılım Kaydı' }
};

// ——— Senaryo ———

type Tone = 'title' | 'strong' | 'plain' | 'muted' | 'accent';

interface OutputLine {
  text: string;
  tone: Tone;
}

interface ScriptBlock {
  cmd: string;
  out: OutputLine[];
}

const AGENDA_LIMIT = 4;

/** Boş veriyi atlayarak komut bloklarını kurar. Bloğun çıktısı yoksa blok hiç yazılmaz. */
function buildScript(d: HeroData, invitation: Invitation): ScriptBlock[] {
  const blocks: ScriptBlock[] = [];
  const line = (text: string, tone: Tone): OutputLine[] => (text ? [{ text, tone }] : []);

  blocks.push({
    cmd: 'event --name',
    out: [
      ...line(d.title, 'muted'),
      { text: d.hasNames ? d.people.join(' & ') : NO_NAMES, tone: 'title' },
      ...line(d.subtitle, 'plain')
    ]
  });

  const when = [d.date.weekday && d.date.day ? `${d.date.weekday}, ${d.date.day}` : d.date.day, d.date.time && `saat ${d.date.time}`]
    .filter(Boolean)
    .join(' · ');
  blocks.push({ cmd: 'event --date', out: line(when, 'strong') });

  blocks.push({
    cmd: 'venue --map',
    out: [...line(d.venue, 'strong'), ...(d.venue && displayText(invitation.mapUrl) ? line('→ yol tarifi aşağıda hazır', 'muted') : [])]
  });

  const agenda = invitation.showTimeline
    ? invitation.timelineEvents.filter((e) => displayText(e.title) || displayText(e.time))
    : [];
  const agendaOut: OutputLine[] = agenda
    .slice(0, AGENDA_LIMIT)
    .map((e) => ({ text: [displayText(e.time).padEnd(5, ' '), displayText(e.title)].filter(Boolean).join('  '), tone: 'plain' as const }));
  if (agenda.length > AGENDA_LIMIT) agendaOut.push({ text: `… +${agenda.length - AGENDA_LIMIT} oturum daha`, tone: 'muted' });
  blocks.push({ cmd: 'agenda --list', out: agendaOut });

  return blocks.filter((b) => b.out.length > 0);
}

/** Ekran okuyucu için senaryonun tamamı, tek seferde. */
function scriptToText(blocks: ScriptBlock[]): string {
  return blocks.map((b) => b.out.map((o) => o.text).join('. ')).join('. ');
}

const CHAR_MS = 42;
const LINE_MS = 150;
const BLOCK_PAUSE_MS = 420;
const START_MS = 700;

/**
 * Daktilo motoru: senaryo düz bir adım dizisidir (komutun her harfi bir adım,
 * her çıktı satırı bir adım). Tek bir `step` sayacı ilerler; her blok kendi
 * başlangıç adımına göre ne kadarını göstereceğini hesaplar. Zamanlayıcı her
 * adımda yeniden kurulur ve effect temizliğinde iptal edilir.
 */
function useTypewriter(blocks: ScriptBlock[], instant: boolean, running: boolean) {
  const starts = useMemo(() => {
    let acc = 0;
    return blocks.map((b) => {
      const s = acc;
      acc += b.cmd.length + b.out.length;
      return s;
    });
  }, [blocks]);
  const total = blocks.reduce((n, b) => n + b.cmd.length + b.out.length, 0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (instant || !running || step >= total) return;
    const blockIdx = starts.findIndex((s, i) => step >= s && step < s + blocks[i].cmd.length + blocks[i].out.length);
    const local = step - starts[blockIdx];
    const cmdLen = blocks[blockIdx].cmd.length;
    let delay = local < cmdLen ? CHAR_MS + (local % 5 === 0 ? 30 : 0) : LINE_MS;
    if (local === cmdLen) delay = 260; // Enter'a basıldı, çıktı geliyor.
    if (local === 0) delay = step === 0 ? START_MS : BLOCK_PAUSE_MS;
    const id = window.setTimeout(() => setStep((s) => s + 1), delay);
    return () => window.clearTimeout(id);
  }, [step, total, instant, running, starts, blocks]);

  return { step: instant ? total : Math.min(step, total), starts, total };
}

const TONE_CLASS: Record<Tone, string> = {
  title: 'text-[#EEE8DA] text-[1.35rem] sm:text-2xl font-semibold leading-snug tracking-tight',
  strong: 'text-[#EEE8DA]',
  plain: 'text-[#C9CFDA]',
  muted: 'text-[#8A95A8]',
  accent: 'text-[#E3B26B]'
};

function Cursor({ blink }: { blink: boolean }) {
  const cls = 'inline-block w-[0.6em] h-[1.1em] -mb-[0.18em] ml-0.5 bg-[#E3B26B]';
  if (!blink) return <span className={cls} />;
  return (
    <motion.span
      className={cls}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
    />
  );
}

function Prompt({ children }: { children?: React.ReactNode }) {
  return (
    <div className="whitespace-pre-wrap break-words">
      <span className="text-[#E3B26B]">$ </span>
      <span className="text-[#8FA9C7]">{children}</span>
    </div>
  );
}

function TerminalHero({ invitation, mode, revealed }: HeroRenderProps & { mode: 'preview' | 'live'; revealed: boolean }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const instant = reduced || mode === 'preview';
  const blocks = useMemo(() => buildScript(d, invitation), [d, invitation]);
  const { step, starts, total } = useTypewriter(blocks, instant, revealed);
  const done = step >= total;
  const srText = scriptToText(blocks);

  return (
    <div className="grow flex flex-col items-center justify-center px-4 pt-14 pb-24">
      <p className="sr-only">{srText}</p>
      <motion.div
        aria-hidden="true"
        initial={instant ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[560px] rounded-xl overflow-hidden border border-[#8FA9C7]/20 bg-[#141B29]/95 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(227,178,107,0.05)]"
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#1B2333] border-b border-[#8FA9C7]/15">
          <span className="w-3 h-3 rounded-full bg-[#D9705F]/85" />
          <span className="w-3 h-3 rounded-full bg-[#E3B26B]/85" />
          <span className="w-3 h-3 rounded-full bg-[#8FA9C7]/85" />
          <span className="flex-1 text-center -ml-12 font-mono text-[11px] tracking-wide text-[#8A95A8] truncate">davetkart@event: ~</span>
        </div>
        <div className="font-mono text-[13px] sm:text-sm leading-relaxed px-4 sm:px-5 py-5 min-h-[300px] text-left">
          {blocks.map((b, i) => {
            const local = step - starts[i];
            if (local < 0) return null;
            const chars = Math.min(local, b.cmd.length);
            const lines = Math.max(0, Math.min(local - b.cmd.length, b.out.length));
            // İmleç, yazılmakta olan (ya da Enter bekleyen) komutun sonunda durur.
            const typing = !done && lines === 0 && local <= b.cmd.length;
            return (
              <div key={b.cmd} className={i > 0 ? 'mt-3.5' : undefined}>
                <Prompt>
                  {b.cmd.slice(0, chars)}
                  {typing && <Cursor blink={false} />}
                </Prompt>
                {b.out.slice(0, lines).map((o, j) => (
                  <motion.div
                    key={j}
                    initial={instant ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`whitespace-pre-wrap break-words pl-3 border-l border-[#8FA9C7]/15 ${o.tone === 'title' ? 'my-1' : ''} ${TONE_CLASS[o.tone]}`}
                  >
                    {o.text}
                  </motion.div>
                ))}
              </div>
            );
          })}
          {done && (
            <div className="mt-3.5">
              <Prompt>
                <Cursor blink={!reduced} />
              </Prompt>
            </div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="mt-8"
      >
        <HeroCountdown
          invitation={invitation}
          cellClassName="px-2.5 py-2 rounded-md border border-[#8FA9C7]/20 bg-[#141B29]/70"
          numberClassName="font-mono text-[#EEE8DA]"
          labelClassName="font-mono text-[#8A95A8] tracking-[0.12em]"
        />
      </motion.div>
    </div>
  );
}

/** Sabit sahne: ince ızgara + çelik mavisi ve kehribar hale. Envelope açılışını üst bileşene bildirir. */
function TerminalBackdrop({ revealed, onReveal }: BackdropState & { onReveal: () => void }) {
  useEffect(() => {
    if (revealed) onReveal();
  }, [revealed, onReveal]);
  return (
    <div className="absolute inset-0 bg-[#0E1420]" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#8FA9C7_1px,transparent_1px),linear-gradient(90deg,#8FA9C7_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-[radial-gradient(closest-side,rgba(143,169,199,0.16),transparent)]" />
      <div className="absolute -bottom-1/4 right-[-20%] w-[90%] h-[60%] bg-[radial-gradient(closest-side,rgba(227,178,107,0.08),transparent)]" />
    </div>
  );
}

/**
 * KurumsalTerminal — "Terminal": koyu bir terminal penceresinde komutlar
 * harf harf yazılır (`$ event --name`, `$ event --date`, `$ venue --map`,
 * `$ agenda --list`), çıktıları satır satır düşer, sonunda imleç yanıp söner.
 * Boş veriye ait komut hiç yazılmaz. Önizleme ve "hareketi azalt" anında tamdır.
 */
export function KurumsalTerminal({ invitation, mode = 'preview' }: TemplateProps) {
  const [revealed, setRevealed] = useState(false);
  const markRevealed = React.useCallback(() => setRevealed(true), []);
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={TERMINAL_FLAVOR}
      mode={mode}
      themeOverride={TERMINAL_TEMASI}
      renderBackdrop={(state) => <TerminalBackdrop {...state} onReveal={markRevealed} />}
      renderHero={(props) => <TerminalHero {...props} mode={mode} revealed={revealed} />}
    />
  );
}
