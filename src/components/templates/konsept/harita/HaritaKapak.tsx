import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText } from '../../utils';
import type { HeroRenderProps } from '../../shared/InvitationComposition';
import { Kartus } from './Kartus';
import { Dipnot, Lejant } from './Lejant';
import { Igne, IGNE_OLCU } from './Igne';
import { Rota, type RotaStili } from './Rota';
import { KuzeyOku, PusulaGulu } from './simgeler';
import { genisMi, rotaPlani, type Duzen, type Kutu, type RotaPlani } from './rotaPlani';
import { haritaTarihi, kisiler, lejantKur, type Durak } from './veri';
import { HARITA_SURE, useHaritaHareketi } from './hareket';
import { PERDE_DISARIDA, useHaritaBaglami } from './baglam';

const useOlcumEtkisi = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Haritanın köşe süsü: şehirde kuzey oku, kırda pusula gülü. */
export type KoseSusu = 'kuzey' | 'pusula';

export interface HaritaKapakProps extends HeroRenderProps {
  duzen: Duzen;
  rota: RotaStili;
  sus: KoseSusu;
  /** Dipnotta ölçek esprisi ("1 cm = bir ömür") — konsept başına en çok bir espri. */
  olcekEsprisi?: boolean;
}

interface Olcu {
  w: number;
  h: number;
  kartus: Kutu;
  lejant: Kutu | null;
}

const kutu = (e: HTMLElement | null): Kutu | null =>
  e && e.offsetWidth ? { x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight } : null;

const ayni = (a: Kutu | null, b: Kutu | null) => a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);

/**
 * Rota, iğne ve mekân etiketi: kartuşla lejantın ARASINDAKİ katman.
 * Kutuların altında kalır (rota kartuşun kenarından çıkıyor görünür).
 * Bütünü süstür; aynı bilgi lejantta gerçek metindir (`aria-hidden`).
 */
function HaritaKatmani({
  plan,
  olcu,
  duraklar,
  mekan,
  stil,
  genis,
  girisBitti
}: {
  plan: RotaPlani;
  olcu: Olcu;
  duraklar: Durak[];
  mekan: string;
  stil: RotaStili;
  genis: boolean;
  girisBitti: boolean;
}) {
  const h = useHaritaHareketi(girisBitti);
  const { igne, etiket } = plan;
  const basY = igne.y - (IGNE_OLCU.uc.y - IGNE_OLCU.bas.y);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg width={olcu.w} height={olcu.h} viewBox={`0 0 ${olcu.w} ${olcu.h}`} className="absolute inset-0">
        <Rota noktalar={plan.noktalar} duraklar={duraklar} stil={stil} girisBitti={girisBitti} />
      </svg>

      <div className="absolute" style={{ left: igne.x - IGNE_OLCU.uc.x, top: igne.y - IGNE_OLCU.uc.y }}>
        <motion.div {...h.igne(0.55)} style={{ transformOrigin: '50% 100%' }}>
          <Igne />
        </motion.div>
      </div>

      {mekan && etiket.genislik >= 80 && (
        <div
          className="absolute -translate-y-1/2"
          style={
            etiket.yon === 'sag'
              ? { left: igne.x + 22, top: basY, maxWidth: etiket.genislik }
              : { right: olcu.w - igne.x + 22, top: basY, maxWidth: etiket.genislik }
          }
        >
          {/* Dar kadrajda tek satır: etiket rotanın S kıvrımına binmesin. Tam ad lejantta. */}
          <motion.p
            {...h.belir(0.72, 0.25)}
            className={cn(
              'bg-white px-2 py-1 [font-family:var(--hr-etiket)] text-[15px] font-semibold leading-tight tracking-[0.03em] text-[#23303A]',
              etiket.yon === 'sol' && 'text-right'
            )}
          >
            <span className={cn('block', genis ? 'line-clamp-2 break-words' : 'truncate')}>{mekan}</span>
          </motion.p>
        </div>
      )}
    </div>
  );
}

/**
 * Harita kapağı: tam ekran harita (arka plan `renderBackdrop`'ta), bir köşede
 * kartuş, karşı köşede lejant, arada veriden kurulan rota.
 *
 * Kartuşla lejantın yeri ve boyu ölçülür (ResizeObserver + her çizimden sonra
 * konum okuması); rota ve iğne bu ölçüden kurulur. Ölçü gelmeden rota
 * çizilmez — sunucu çiziminde de çizilmez, bilgi yine eksiksizdir.
 */
export function HaritaKapak({ invitation, scrollContainer, duzen, rota, sus, olcekEsprisi = false }: HaritaKapakProps) {
  const h = useHaritaHareketi();
  const kokRef = useRef<HTMLElement | null>(null);
  const kartusRef = useRef<HTMLDivElement | null>(null);
  const lejantRef = useRef<HTMLDivElement | null>(null);
  const [olcu, setOlcu] = useState<Olcu | null>(null);
  const [girisBitti, setGirisBitti] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setGirisBitti(true), HARITA_SURE.ust * 1000);
    return () => window.clearTimeout(id);
  }, []);

  const olc = () => {
    const kok = kokRef.current;
    const kartus = kutu(kartusRef.current);
    if (!kok || !kartus) return;
    const yeni: Olcu = { w: kok.clientWidth, h: kok.clientHeight, kartus, lejant: kutu(lejantRef.current) };
    setOlcu((eski) =>
      eski && eski.w === yeni.w && eski.h === yeni.h && ayni(eski.kartus, yeni.kartus) && ayni(eski.lejant, yeni.lejant) ? eski : yeni
    );
  };

  // Konum boyuttan bağımsız değişebilir (yerleşim genişe geçince kutular yer
  // değiştirir); bu yüzden her çizimden sonra bir kez okunur. Değişmediyse
  // durum aynı nesne kalır ve yeniden çizim olmaz.
  useOlcumEtkisi(olc);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => olc());
    for (const e of [kokRef.current, kartusRef.current, lejantRef.current]) if (e) ro.observe(e);
    return () => ro.disconnect();
  }, []);

  // Kapağın alt kenarını sahneye bildirir: perde tam oradan başlar.
  const baglam = useHaritaBaglami();
  const { scrollY } = useScroll({ container: scrollContainer });
  const kapakBoyu = olcu?.h ?? 0;
  useEffect(() => {
    if (!baglam) return;
    const yaz = () => {
      const kok = kokRef.current;
      baglam.kapakAlti.set(Math.max(0, (kok ? kok.offsetTop + kok.offsetHeight : 0) - scrollY.get()));
    };
    yaz();
    const birak = scrollY.on('change', yaz);
    return () => {
      birak();
      baglam.kapakAlti.set(PERDE_DISARIDA);
    };
  }, [baglam, scrollY, kapakBoyu]);

  const genis = olcu ? genisMi(olcu.w, olcu.h) : false;
  const ters = duzen === 'ayna' && genis;

  const veri = useMemo(() => lejantKur(invitation), [invitation]);
  const { gun, haftaGunu } = haritaTarihi(invitation.date);
  const tarih = [gun, haftaGunu].filter(Boolean).join(' · ');
  const plan = useMemo(
    () => (olcu ? rotaPlani({ w: olcu.w, h: olcu.h, kartus: olcu.kartus, lejant: olcu.lejant, duzen, genis }) : null),
    [olcu, duzen, genis]
  );

  return (
    <section
      ref={kokRef}
      className={cn(
        'relative flex-1 px-4 pt-5 pb-5 @3xl:px-10 @3xl:pt-9 @3xl:pb-8',
        // Geniş kadrajda kartuş ve lejant karşı köşelerde aynı satırı paylaşır:
        // kapak ikisinin toplamı değil, büyüğü kadar uzar.
        genis ? 'grid grid-cols-[minmax(0,27rem)_1fr_minmax(0,22rem)] grid-rows-[1fr] gap-x-8' : 'flex flex-col'
      )}
    >
      <Kartus
        ref={kartusRef}
        giris={h.kutu(0)}
        baslik={displayText(invitation.title)}
        adlar={kisiler(invitation.names)}
        altBaslik={displayText(invitation.subtitle)}
        tarih={tarih}
        className={cn(
          'z-10',
          genis ? cn('col-start-1 row-start-1', ters ? 'self-end' : 'self-start') : 'self-start w-[calc(100%-3rem)] max-w-[24rem] @3xl:max-w-[27rem]'
        )}
      />

      {!genis && <div aria-hidden="true" className="flex-1 min-h-[160px]" />}

      <div
        ref={lejantRef}
        className={cn(
          'relative z-10 flex flex-col gap-2',
          genis
            ? cn('col-start-3 row-start-1 items-end', ters ? 'self-start' : 'self-end')
            : cn('w-[calc(100%-2.5rem)] max-w-[22rem]', duzen === 'ayna' ? 'self-start items-start' : 'self-end items-end')
        )}
      >
        <Lejant veri={veri} invitation={invitation} giris={h.kutu(0.12)} className="w-full" />
        <Dipnot olcek={olcekEsprisi} giris={h.belir(0.6)} />
      </div>

      {plan && olcu && <HaritaKatmani plan={plan} olcu={olcu} duraklar={veri.duraklar} mekan={veri.mekan} stil={rota} genis={genis} girisBitti={girisBitti} />}

      <motion.div
        aria-hidden="true"
        {...h.belir(0.45)}
        className={cn(
          'pointer-events-none absolute z-0 text-[#23303A]',
          sus === 'kuzey' ? 'right-4 top-5 @3xl:right-10 @3xl:top-9' : ters ? 'right-10 bottom-8' : 'right-3 top-4 @3xl:right-9 @3xl:top-8'
        )}
      >
        {sus === 'kuzey' ? (
          <span className="flex flex-col items-center gap-0.5 rounded-full bg-white px-2 pt-2 pb-1.5">
            <KuzeyOku boyut={22} />
            <span className="[font-family:var(--hr-etiket)] text-[12px] font-semibold leading-none">K</span>
          </span>
        ) : (
          <PusulaGulu boyut={52} />
        )}
      </motion.div>
    </section>
  );
}
