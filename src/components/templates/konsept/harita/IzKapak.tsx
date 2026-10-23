import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText } from '../../utils';
import type { Invitation } from '../../../../types';
import type { HeroRenderProps } from '../../shared/InvitationComposition';
import { Kartus } from './Kartus';
import { Dipnot, Rozet, Varisa, YolTarifi } from './Lejant';
import { Carpi, Igne } from './Igne';
import { Rota, type RotaStili } from './Rota';
import { KuzeyOku, PusulaGulu, Simge } from './simgeler';
import { genisMi, type Kutu } from './rotaPlani';
import { izPlani, type Capa, type IzDuzeni, type IzPlani } from './izPlani';
import { haritaTarihi, kisiler, lejantKur, type Durak, type LejantVerisi, type SimgeSozlugu } from './veri';
import { HARITA_SURE, useHaritaHareketi, type GirisProps } from './hareket';
import { useGirisPenceresi, useKapakAltiBildirimi, useKatmanFontu, useOlcumEtkisi } from './kapakOrtak';
import { HARITA_RENK } from './palet';
import type { KoseSusu } from './HaritaKapak';

/**
 * İz kapağı: lejantı olmayan harita kapağı. Program adımları haritanın
 * üstünde tek tek **durak kutularıdır** (gerçek metin); rota onların
 * rozetlerinden geçer ve hedefte biter. Lejantın geri kalanı (mekân, program
 * yoksa tarih, geri sayım, yol tarifi) hedefin yanındaki varış kartındadır.
 *
 * - `hazine`: kartuş üstte ortada (genişte sağ üstte); duraklar sağlı sollu
 *   zikzak; kesik çizgi X'e varır.
 * - `hat`: duraklar dikey bir hattın istasyonları (telefonda sol kenarda
 *   omurga); hat iğnede biter. Genişte kartuş solda, hat sağda.
 *
 * Ölçü ve zamanlama `HaritaKapak` ile aynı kurallardadır (`kapakOrtak.ts`):
 * rota katmanı fontları bekler; kutular yer değiştirirse rota onları
 * animasyonsuz izler. Kılavuz: docs/rehber/…/konsept/harita/IzKapak.md
 */
export interface IzKapakProps extends HeroRenderProps {
  duzen: IzDuzeni;
  rota: RotaStili;
  sus: KoseSusu;
  /** Varış kartında mekânın üstündeki küçük üretilen satır ("Hazine burada"). Yalnızca mekân varsa. */
  hedefEtiketi?: string;
  /** Kategorinin durak sözlüğü; genel sözlükten önce aranır (`durakSimgesi`). */
  sozluk?: SimgeSozlugu;
  vurgu?: 'esit' | 'ilk';
  /** Haritada en çok kaç durak (varsayılan 4); kalanı "+N durak programda". */
  enCok?: number;
}

interface IzOlcu {
  w: number;
  h: number;
  kartus: Kutu;
  capalar: Capa[];
}

const ETIKET = '[font-family:var(--hr-etiket)] font-semibold uppercase tracking-[0.18em]';
const KUTU = 'bg-white border-[1.5px] border-[#23303A]';
const RAKAM = '[font-variant-numeric:lining-nums_tabular-nums]';

/**
 * Öğenin kapağa göre yeri. `offset*` kullanılır (dönüşümü saymaz): kutular
 * girişte y 8 → 0 kayarken ölçü oynamaz. Ara kapların kenar kalınlığı eklenir.
 */
function konum(e: HTMLElement, kok: HTMLElement): { x: number; y: number } | null {
  let x = 0;
  let y = 0;
  let n: Element | null = e;
  while (n && n !== kok) {
    if (!(n instanceof HTMLElement)) return null;
    x += n.offsetLeft;
    y += n.offsetTop;
    const ust: Element | null = n.offsetParent;
    if (ust instanceof HTMLElement && ust !== kok) {
      x += ust.clientLeft;
      y += ust.clientTop;
    }
    n = ust;
  }
  return n === kok ? { x, y } : null;
}

function olcuAl(kok: HTMLElement, kartus: HTMLElement): IzOlcu | null {
  const k = konum(kartus, kok);
  if (!k || !kartus.offsetWidth) return null;
  const capalar: Capa[] = [];
  kok.querySelectorAll<HTMLElement>('[data-iz]').forEach((e) => {
    const p = konum(e, kok);
    const tur = e.dataset.iz;
    if (p && (tur === 'bas' || tur === 'durak' || tur === 'hedef'))
      capalar.push({ tur, n: { x: Math.round(p.x + e.offsetWidth / 2), y: Math.round(p.y + e.offsetHeight / 2) } });
  });
  return { w: kok.clientWidth, h: kok.clientHeight, kartus: { x: k.x, y: k.y, w: kartus.offsetWidth, h: kartus.offsetHeight }, capalar };
}

/**
 * Aynı ölçü mü? Kutu boyları ve çapalar 2 px'e kadar oynayabilir: giriş
 * kayması biterken alt piksel yuvarlaması bir rozeti 1 px kaydırır (ölçüldü,
 * ~1.03 s) ve rota yeniden kurulursa okları döner. Kadrajın kendisi tam eşleşir.
 */
const PAY = 2;
const yakin = (a: number, b: number) => Math.abs(a - b) <= PAY;
const ayniKutu = (a: Kutu, b: Kutu) => yakin(a.x, b.x) && yakin(a.y, b.y) && yakin(a.w, b.w) && yakin(a.h, b.h);
const ayniOlcu = (a: IzOlcu, b: IzOlcu) =>
  a.w === b.w &&
  yakin(a.h, b.h) &&
  ayniKutu(a.kartus, b.kartus) &&
  a.capalar.length === b.capalar.length &&
  a.capalar.every((c, i) => c.tur === b.capalar[i].tur && yakin(c.n.x, b.capalar[i].n.x) && yakin(c.n.y, b.capalar[i].n.y));

/** Hazine durağı: rozet içe bakar (sağdaki kutuda solda, soldakinde sağda), rota rozetten geçer. */
function HazineDuragi({ durak, ters, giris }: { durak: Durak; ters: boolean; giris: GirisProps }) {
  return (
    <motion.div {...giris} className={cn('flex items-center gap-2.5 py-2', KUTU, ters ? 'flex-row-reverse pl-3.5 pr-2 text-right' : 'pl-2 pr-3.5')}>
      <span data-iz="durak" className="flex shrink-0">
        <Rozet durak={durak} />
      </span>
      <span className="min-w-0">
        {durak.saat && <span className={cn(ETIKET, RAKAM, 'block text-[12px] leading-tight text-[#A8321F]')}>{durak.saat}</span>}
        {durak.ad && <span className="block break-words text-[15px] leading-snug text-[#23303A]">{durak.ad}</span>}
      </span>
    </motion.div>
  );
}

/**
 * Hat istasyonu: rozet hattın üstünde (kutunun 39 px solunda), kısa bir rota
 * çizgisi kutuya bağlar. Saat iri, adı yanında.
 */
function HatDuragi({ durak, giris }: { durak: Durak; giris: GirisProps }) {
  return (
    <motion.div {...giris} className="relative">
      <span data-iz="durak" className="absolute left-[-39px] top-[calc(50%-14px)] flex">
        <Rozet durak={durak} />
      </span>
      <span aria-hidden="true" className="absolute left-[-13px] top-1/2 h-[2px] w-[13px] -translate-y-1/2 bg-[#A8321F]" />
      <span className={cn('flex items-baseline gap-3 px-3 py-2', KUTU)}>
        {durak.saat && <span className={cn(RAKAM, 'shrink-0 [font-family:var(--hr-etiket)] text-[20px] font-semibold leading-none text-[#23303A]')}>{durak.saat}</span>}
        {durak.ad && <span className="min-w-0 break-words text-[15px] leading-snug text-[#23303A]">{durak.ad}</span>}
      </span>
    </motion.div>
  );
}

/** Varış kartı: lejantın kalanı. Hiçbir satırı yoksa çizilmez; işaret yine kalır. */
function VarisKarti({
  veri,
  invitation,
  etiket,
  giris,
  className
}: {
  veri: LejantVerisi;
  invitation: Invitation;
  etiket?: string;
  giris: GirisProps;
  className?: string;
}) {
  const mapUrl = displayText(invitation.mapUrl);
  const sayac = invitation.showTimer && !!haritaTarihi(invitation.date).gun;
  if (!veri.mekan && !veri.tarihSatiri && !mapUrl && !sayac) return null;
  return (
    <motion.div
      {...giris}
      // İlk satır hangisiyse üst boşluğu ve (geri sayımın) kesik çizgisi düşer.
      className={cn(
        'min-w-0 px-4 pt-3 pb-4 [&>*:first-child]:mt-0 [&>p:first-child]:border-t-0 [&>p:first-child]:pt-0',
        KUTU,
        className
      )}
    >
      {veri.mekan && (
        <p className="text-[#23303A]">
          {etiket && <span className={cn(ETIKET, 'mb-0.5 block text-[11px] leading-snug text-[#A8321F]')}>{etiket}</span>}
          <span className="block break-words text-[16px] font-medium leading-snug">{veri.mekan}</span>
        </p>
      )}
      {veri.tarihSatiri && (
        <p className={cn(RAKAM, 'mt-2 flex items-start gap-2 text-[15px] font-medium leading-snug text-[#23303A]')}>
          <Simge ad="takvim" boyut={18} className="mt-[1px] shrink-0" />
          {veri.tarihSatiri}
        </p>
      )}
      <Varisa invitation={invitation} />
      {mapUrl && <YolTarifi mapUrl={mapUrl} className="mt-3" />}
    </motion.div>
  );
}

/** Rota katmanı: kutuların altında; süs (aynı bilgi kutularda metin). */
function IzKatmani({
  plan,
  olcu,
  stil,
  girisBitti,
  kayma
}: {
  plan: IzPlani;
  olcu: IzOlcu;
  stil: RotaStili;
  girisBitti: boolean;
  kayma: number;
}) {
  const statik = girisBitti || kayma > HARITA_SURE.esnek;
  const olcek = statik ? 1 : 1 - kayma;
  const h = useHaritaHareketi(statik, olcek);
  const { halka } = plan;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg width={olcu.w} height={olcu.h} viewBox={`0 0 ${olcu.w} ${olcu.h}`} className="absolute inset-0">
        <Rota noktalar={plan.noktalar} duraklar={[]} stil={stil} gizli={plan.gizli} girisBitti={statik} olcek={olcek} />
        {halka && (
          <motion.circle
            {...h.belir(0.1, 0.25)}
            cx={halka.x}
            cy={halka.y}
            r="8"
            fill={HARITA_RENK.yol}
            stroke={HARITA_RENK.murekkep}
            strokeWidth="3"
          />
        )}
      </svg>
    </div>
  );
}

function KoseSusuCiz({ sus, genis }: { sus: KoseSusu; genis: boolean }) {
  return sus === 'kuzey' ? (
    <span className="flex flex-col items-center gap-0.5 rounded-full bg-white px-2 pt-2 pb-1.5">
      <KuzeyOku boyut={22} />
      <span className="[font-family:var(--hr-etiket)] text-[12px] font-semibold leading-none">K</span>
    </span>
  ) : (
    <PusulaGulu boyut={genis ? 52 : 44} />
  );
}

export function IzKapak({
  invitation,
  flavor,
  scrollContainer,
  duzen,
  rota,
  sus,
  hedefEtiketi,
  sozluk,
  vurgu = 'esit',
  enCok = 4
}: IzKapakProps) {
  const h = useHaritaHareketi();
  const kokRef = useRef<HTMLElement | null>(null);
  const kartusRef = useRef<HTMLDivElement | null>(null);
  const sutunRef = useRef<HTMLDivElement | null>(null);
  const [olcu, setOlcu] = useState<IzOlcu | null>(null);
  const girisBitti = useGirisPenceresi();
  const fontlar = useKatmanFontu();

  const olc = () => {
    const kok = kokRef.current;
    const kartus = kartusRef.current;
    if (!kok || !kartus) return;
    const yeni = olcuAl(kok, kartus);
    if (yeni) setOlcu((eski) => (eski && ayniOlcu(eski, yeni) ? eski : yeni));
  };
  // Her çizimden sonra bir kez okunur (yerleşim genişe geçince kutular yer
  // değiştirir); değişmediyse durum aynı nesne kalır, yeniden çizim olmaz.
  useOlcumEtkisi(olc);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => olc());
    for (const e of [kokRef.current, kartusRef.current, sutunRef.current]) if (e) ro.observe(e);
    return () => ro.disconnect();
  }, []);
  useKapakAltiBildirimi(kokRef, scrollContainer, olcu?.h ?? 0);

  const genis = olcu ? genisMi(olcu.w, olcu.h) : false;
  const veri = useMemo(() => lejantKur(invitation, enCok, sozluk), [invitation, enCok, sozluk]);
  const adlar = kisiler(invitation.names);
  const { gun, haftaGunu } = haritaTarihi(invitation.date);
  const tarih = [gun, haftaGunu].filter(Boolean).join(' · ');
  const plan = useMemo(() => (olcu && fontlar.hazir ? izPlani({ duzen, genis, ...olcu }) : null), [olcu, fontlar.hazir, duzen, genis]);
  const durakVar = veri.duraklar.length > 0;
  const hazine = duzen === 'hazine';

  const kalan = veri.kalan > 0 && (
    <motion.p
      {...h.belir(0.5)}
      className={cn('relative z-10 mt-3 bg-white px-2 py-1 text-[13px] text-[#4E5B63]', hazine ? 'self-center' : 'self-start')}
    >
      +{veri.kalan} durak programda
    </motion.p>
  );
  const bosluk = <div aria-hidden="true" className={cn('flex-1', durakVar ? 'min-h-6' : hazine ? 'min-h-[150px]' : 'min-h-[120px]')} />;
  const kart = (
    <VarisKarti
      veri={veri}
      invitation={invitation}
      etiket={hedefEtiketi}
      giris={h.kutu(0.3)}
      className={hazine ? 'flex-1 max-w-[17rem] @3xl:max-w-[19.5rem]' : 'w-full max-w-[19rem] @3xl:max-w-[19.5rem]'}
    />
  );

  const hedef = hazine ? (
    // Ortada: X her kadrajda adanın üstüne düşer (HazineAdasi çekirdeği). X kartın ilk satırı hizasında.
    <div className="relative z-10 mt-2 flex items-start gap-3 self-center">
      <motion.span {...h.igne(0.55)} className="relative mt-1 flex size-10 shrink-0">
        <Carpi />
        <span data-iz="hedef" className="absolute left-1/2 top-1/2 size-0" />
      </motion.span>
      {kart}
    </div>
  ) : (
    <div className="relative z-10 mt-1 min-h-[32px] self-stretch">
      {/* İğne hattın üstünde: ucu kartın ilk satırı hizasında (kutunun 26 px solu, 24 px aşağısı). */}
      <span className="absolute left-[-42px] top-[-22px]">
        <motion.span {...h.igne(0.55)} className="block" style={{ transformOrigin: '50% 100%' }}>
          <Igne />
        </motion.span>
        <span data-iz="hedef" className="absolute left-[16px] top-[46px] size-0" />
      </span>
      {kart}
    </div>
  );

  const duraklar = durakVar && (
    <ol aria-label={flavor.headings.timeline} className={cn('relative z-10 flex flex-col', hazine ? 'gap-6' : 'gap-4')}>
      {veri.duraklar.map((durak, i) =>
        hazine ? (
          <li key={durak.anahtar} className={cn('max-w-[15.5rem]', i % 2 === 0 ? 'self-end' : 'self-start')}>
            <HazineDuragi durak={durak} ters={i % 2 === 1} giris={h.kutu(0.12 + i * 0.06)} />
          </li>
        ) : (
          <li key={durak.anahtar} className="self-start max-w-full">
            <HatDuragi durak={durak} giris={h.kutu(0.12 + i * 0.06)} />
          </li>
        )
      )}
    </ol>
  );

  const kose = (
    <motion.div aria-hidden="true" {...h.belir(0.45)} className={cn('pointer-events-none text-[#23303A]', genis && 'absolute z-0', genis && (hazine ? 'left-9 top-8' : 'right-[30rem] bottom-8'))}>
      <KoseSusuCiz sus={sus} genis={genis} />
    </motion.div>
  );
  const dipnot = <Dipnot olcek={false} giris={h.belir(0.6)} className={cn('z-10', genis && 'absolute', genis && (hazine ? 'right-10 bottom-8' : 'left-10 bottom-8'))} />;

  const kartus = (
    <Kartus
      ref={kartusRef}
      giris={h.kutu(0)}
      baslik={displayText(invitation.title)}
      adlar={adlar}
      altBaslik={displayText(invitation.subtitle)}
      tarih={tarih}
      hizala={hazine ? 'orta' : 'sol'}
      vurgu={vurgu}
      className={cn(
        'z-10',
        hazine
          ? genis
            ? 'col-start-2 row-start-1 self-start'
            : 'self-center w-full max-w-[24rem] @3xl:max-w-[27rem]'
          : genis
            ? 'col-start-1 row-start-1 self-start'
            : 'w-full max-w-[27rem]'
      )}
    />
  );

  // Sütun: durakların ve hedefin kabı. DOM sırası her düzende aynı: kartuş, sütun, köşe, dipnot.
  const sutun = (
    <div
      ref={sutunRef}
      className={cn(
        'relative flex flex-col',
        hazine
          ? genis
            ? 'col-start-1 row-start-1 mx-auto w-full max-w-[36rem] pt-4'
            : 'flex-1 mt-7'
          : genis
            ? 'col-start-3 row-start-1 pl-12'
            : 'flex-1 mt-6'
      )}
    >
      {/* Genişte hattın başı sütunun tepesindedir; kartuştan gelen kol buraya katılır. */}
      {!hazine && genis && <span data-iz="bas" aria-hidden="true" className="mb-5 ml-[-33px] block size-[14px]" />}
      {duraklar}
      {kalan}
      {bosluk}
      {hedef}
    </div>
  );

  return (
    <section
      ref={kokRef}
      className={cn(
        'relative flex-1',
        genis
          ? cn('grid grid-rows-[1fr] gap-x-10 px-10 pt-9 pb-8', hazine ? 'grid-cols-[minmax(0,1fr)_minmax(0,26rem)]' : 'grid-cols-[minmax(0,27rem)_1fr_minmax(0,24rem)]')
          : cn('flex flex-col pt-5 pb-5 @3xl:pt-9 @3xl:pb-8', hazine ? 'px-4 @3xl:px-10' : 'pl-16 pr-4 @3xl:pl-24 @3xl:pr-10')
      )}
    >
      {kartus}
      {sutun}
      {genis ? (
        <>
          {kose}
          {dipnot}
        </>
      ) : (
        <div className="relative z-10 mt-4 flex items-end justify-between gap-3">
          {kose}
          {dipnot}
        </div>
      )}
      {plan && olcu && <IzKatmani plan={plan} olcu={olcu} stil={rota} girisBitti={girisBitti} kayma={fontlar.kayma} />}
    </section>
  );
}
