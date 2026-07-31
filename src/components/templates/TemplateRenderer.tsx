import React from 'react';
import {
  DugunSade, DugunManzara, DugunSekilli, DugunModern,
  Dugun1, Dugun2, Dugun3, Dugun4, Dugun5,
  DugunGokyuzu, DugunMumIsigi, DugunGulYapraklari, DugunDenizIsiltisi
} from './dugun';
import { KinaSade, KinaManzara, KinaSekilli, KinaModern, KinaBordo } from './kina';
import { NisanSade, NisanManzara, NisanSekilli, NisanModern, NisanSampanya } from './nisan';
import { SunnetKlasik, SunnetModern, SunnetYildiz } from './sunnet';
import { DogumGunuNeseli, DogumGunuSik, DogumGunuKonfeti } from './dogum-gunu';
import { MezuniyetAkademik, MezuniyetDinamik, MezuniyetLacivert } from './mezuniyet';
import { BabyShowerPastel, BabyShowerBoho, BabyShowerKabarcik } from './baby-shower';
import { PartiNeon, PartiGala, PartiAurora } from './parti';
import { Invitation } from '../../types';
import { TemplateProps } from './types';

interface TemplateRendererProps {
  templateId: string;
  invitation: Invitation;
  onRsvpClick: () => void;
  mode?: 'preview' | 'live';
}

/**
 * Kategori ve Stile göre eşlenen 12 temel tema şablonu.
 */
const THEME_PRESETS: Record<string, React.ComponentType<TemplateProps>> = {
  // Düğün
  'dugun-sade': DugunSade,
  'dugun-manzara': DugunManzara,
  'dugun-sekilli': DugunSekilli,
  'dugun-modern': DugunModern,
  // Düğün — katmanlı görsel şablon ailesi (Feature-based Colocation)
  'dugun-1': Dugun1,
  'dugun-2': Dugun2,
  'dugun-3': Dugun3,
  'dugun-4': Dugun4,
  'dugun-5': Dugun5,
  // Düğün — videolu şablon ailesi
  'dugun-gokyuzu': DugunGokyuzu,
  'dugun-mum-isigi': DugunMumIsigi,
  'dugun-gul-yapraklari': DugunGulYapraklari,
  'dugun-deniz-isiltisi': DugunDenizIsiltisi,
  // Kına
  'kina-sade': KinaSade,
  'kina-manzara': KinaManzara,
  'kina-sekilli': KinaSekilli,
  'kina-modern': KinaModern,
  'kina-bordo': KinaBordo,
  // Nişan
  'nisan-sade': NisanSade,
  'nisan-manzara': NisanManzara,
  'nisan-sekilli': NisanSekilli,
  'nisan-modern': NisanModern,
  'nisan-sampanya': NisanSampanya,
  // Sünnet
  'sunnet-klasik': SunnetKlasik,
  'sunnet-modern': SunnetModern,
  'sunnet-yildiz': SunnetYildiz,
  // Doğum Günü
  'dogum-gunu-neseli': DogumGunuNeseli,
  'dogum-gunu-sik': DogumGunuSik,
  'dogum-gunu-konfeti': DogumGunuKonfeti,
  // Mezuniyet
  'mezuniyet-akademik': MezuniyetAkademik,
  'mezuniyet-dinamik': MezuniyetDinamik,
  'mezuniyet-lacivert': MezuniyetLacivert,
  // Baby Shower
  'baby-shower-pastel': BabyShowerPastel,
  'baby-shower-boho': BabyShowerBoho,
  'baby-shower-kabarcik': BabyShowerKabarcik,
  // Parti
  'parti-neon': PartiNeon,
  'parti-gala': PartiGala,
  'parti-aurora': PartiAurora,
};

export function TemplateRenderer({ templateId, invitation, onRsvpClick, mode = 'preview' }: TemplateRendererProps) {
  // Combine category and style, fallback to 'dugun' if category lacks templates
  const category = ['dugun', 'kina', 'nisan'].includes(invitation.categoryId) ? invitation.categoryId : 'dugun';
  
  // If the templateId is already a composite (e.g. from old data), use it directly,
  // otherwise compose it.
  const presetKey = templateId.includes('-') ? templateId : `${category}-${templateId}`;

  // Tema ID'si eşleniyorsa o temayı render et.
  const ThemePreset = THEME_PRESETS[presetKey] || THEME_PRESETS[`dugun-${templateId}`];
  if (ThemePreset) {
    return <ThemePreset invitation={invitation} onRsvpClick={onRsvpClick} mode={mode} />;
  }

  // Varsayılan olarak DugunSade kullan
  return <DugunSade invitation={invitation} onRsvpClick={onRsvpClick} mode={mode} />;
}
