import React from 'react';
import type { TemplateFlavor } from '../../shared/flavor';
import { KitapAdlar, kisiler, romen, type EtiketBicimi } from '../../konsept/kitap';
import { cn } from '../../../../utils/cn';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { InvText, staticFixedText } from '../../../../invitationText/InvitationTextContext';

/**
 * Doğum gününün kitap preset'lerinin ortak tabanı. Doğum günü hikâyenin
 * **yeni bölümü**dür (KITAP-KONSEPTI §7). Yaş veride yoktur: hiçbir yerde
 * sayı yazılmaz ("Otuzuncu Bölüm" gibi), bölüm adsızdır — *Yeni Bölüm*.
 *
 * Kategoriden aynen kalanlar: zarf etiketi "Doğum Günü Davetiyesi", italik
 * satır "Yeni Yaşımı Birlikte Kutlayalım". Bölüm adları kitten gelir.
 */
export const DOGUM_GUNU_KITAP_FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  textScopes: ['dogum-gunu-kitap', ...(DOGUM_GUNU_FLAVOR.textScopes ?? [])]
};

/** Yetişkin, anı defteri: "Yeni Bölüm · II", "Yeni Bölüm · III"… */
export const YENI_BOLUM_ETIKETI: EtiketBicimi = (sira) => staticFixedText('design.dogum-gunu-kitap.yeniBolum').replace('{n}', romen(sira));


/**
 * Çocuk, masal kitabı: sayfalar sözcükle — "İkinci Sayfa", "Üçüncü Sayfa".
 * Hero birinci sayfadır; bölüm en çok altıdır (hero + beş bölüm).
 */
export const MASAL_SAYFA_ETIKETI: EtiketBicimi = (sira) =>
  staticFixedText(`design.dogum-gunu-kitap.sayfa${Math.min(Math.max(sira, 1), 6)}`);

interface SahipAdiProps {
  /** `invitation.names` — doğum gününde *Sahibi & Ev sahibi* (KONSEPT-ORTAK §4). */
  names: string | null | undefined;
  as?: 'h1' | 'p';
  /** Kısa adda varılacak en büyük boy (px) ve akış (`cqi`); KitapAdlar'a geçer. */
  enCok?: number;
  akis?: number;
  /** Sahibinin adının rengi. */
  className?: string;
  /** "Ev sahibi" künye satırının rengi. */
  kunyeClassName?: string;
}

/**
 * Doğum gününün ad dizgisi. Kitabın adı **sahibidir** (tek başına, büyük);
 * ev sahibi kitabın künyesindeki gibi küçük bir satırdır: "EV SAHİBİ" ve
 * altında italik ad. Düğündeki eşit `A & B` dizgisi burada yanlış okunurdu
 * (iki kutlanan). Üçüncü ad olursa ev sahibi satırına `&` ile eklenir.
 *
 * Ad yoksa KitapAdlar'ın "Davetlisiniz"i; ev sahibi yoksa satır hiç yoktur.
 */
export function SahipAdi({ names, as = 'h1', enCok, akis, className, kunyeClassName }: SahipAdiProps) {
  const [sahibi, ...digerleri] = kisiler(names);
  const evSahibi = digerleri.join(' & ');
  return (
    <div className="flex flex-col items-center">
      <KitapAdlar adlar={sahibi ? [sahibi] : []} as={as} enCok={enCok} akis={akis} className={className} />
      {evSahibi && (
        <p className={cn('mt-5 flex flex-col items-center gap-1', kunyeClassName)}>
          <span className="text-[10px] uppercase tracking-[0.3em]"><InvText k="design.ortak.evSahibi" /></span>
          <span className="text-[15px] italic leading-snug [text-wrap:balance]">{evSahibi}</span>
        </p>
      )}
    </div>
  );
}
