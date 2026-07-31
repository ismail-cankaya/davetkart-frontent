import React from 'react';
import {
  DugunSade, DugunManzara, DugunSekilli, DugunModern,
  Dugun1, Dugun2, Dugun3, Dugun4, Dugun5,
  DugunGokyuzu, DugunMumIsigi, DugunGulYapraklari, DugunDenizIsiltisi,
  DugunSahil, DugunOnyx,
  DugunAurora, DugunBento, DugunNoir, DugunKrom
} from './dugun';
import {
  KinaSade, KinaManzara, KinaSekilli, KinaModern, KinaBordo, KinaSaray, KinaMum,
  KinaAurora, KinaBento, KinaNoir, KinaKrom
} from './kina';
import {
  NisanSade, NisanManzara, NisanSekilli, NisanModern, NisanSampanya,
  NisanOrman, NisanAlyans, NisanBohem,
  NisanAurora, NisanBento, NisanNoir, NisanKrom
} from './nisan';
import { SunnetKlasik, SunnetModern, SunnetYildiz, SunnetMasallah, SunnetLunapark } from './sunnet';
import {
  DogumGunuNeseli, DogumGunuSik, DogumGunuKonfeti,
  DogumGunuLuks, DogumGunuBulut, DogumGunuZarif
} from './dogum-gunu';
import {
  MezuniyetAkademik, MezuniyetDinamik, MezuniyetLacivert,
  MezuniyetKampus, MezuniyetPusula
} from './mezuniyet';
import {
  BabyShowerPastel, BabyShowerBoho, BabyShowerKabarcik,
  BabyMelek, BabyMuzikKutusu, BabyGokyuzu
} from './baby-shower';
import { PartiNeon, PartiGala, PartiAurora } from './parti';
import { KurumsalNetwork, KurumsalCam, KurumsalZirve } from './kurumsal';
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
  'dugun-sahil': DugunSahil,
  'dugun-onyx': DugunOnyx,
  // Düğün — videosuz modern tasarım dilleri
  'dugun-aurora': DugunAurora,
  'dugun-bento': DugunBento,
  'dugun-noir': DugunNoir,
  'dugun-krom': DugunKrom,
  // Kına
  'kina-sade': KinaSade,
  'kina-manzara': KinaManzara,
  'kina-sekilli': KinaSekilli,
  'kina-modern': KinaModern,
  'kina-bordo': KinaBordo,
  'kina-saray': KinaSaray,
  'kina-mum': KinaMum,
  'kina-aurora': KinaAurora,
  'kina-bento': KinaBento,
  'kina-noir': KinaNoir,
  'kina-krom': KinaKrom,
  // Nişan
  'nisan-sade': NisanSade,
  'nisan-manzara': NisanManzara,
  'nisan-sekilli': NisanSekilli,
  'nisan-modern': NisanModern,
  'nisan-sampanya': NisanSampanya,
  'nisan-orman': NisanOrman,
  'nisan-alyans': NisanAlyans,
  'nisan-bohem': NisanBohem,
  'nisan-aurora': NisanAurora,
  'nisan-bento': NisanBento,
  'nisan-noir': NisanNoir,
  'nisan-krom': NisanKrom,
  // Sünnet
  'sunnet-klasik': SunnetKlasik,
  'sunnet-modern': SunnetModern,
  'sunnet-yildiz': SunnetYildiz,
  'sunnet-masallah': SunnetMasallah,
  'sunnet-lunapark': SunnetLunapark,
  // Doğum Günü
  'dogum-gunu-neseli': DogumGunuNeseli,
  'dogum-gunu-sik': DogumGunuSik,
  'dogum-gunu-konfeti': DogumGunuKonfeti,
  'dogum-gunu-luks': DogumGunuLuks,
  'dogum-gunu-bulut': DogumGunuBulut,
  'dogum-gunu-zarif': DogumGunuZarif,
  // Mezuniyet
  'mezuniyet-akademik': MezuniyetAkademik,
  'mezuniyet-dinamik': MezuniyetDinamik,
  'mezuniyet-lacivert': MezuniyetLacivert,
  'mezuniyet-kampus': MezuniyetKampus,
  'mezuniyet-pusula': MezuniyetPusula,
  // Baby Shower
  'baby-shower-pastel': BabyShowerPastel,
  'baby-shower-boho': BabyShowerBoho,
  'baby-shower-kabarcik': BabyShowerKabarcik,
  'baby-melek': BabyMelek,
  'baby-muzik-kutusu': BabyMuzikKutusu,
  'baby-gokyuzu': BabyGokyuzu,
  // Parti
  'parti-neon': PartiNeon,
  'parti-gala': PartiGala,
  'parti-aurora': PartiAurora,
  // Kurumsal
  'kurumsal-network': KurumsalNetwork,
  'kurumsal-cam': KurumsalCam,
  'kurumsal-zirve': KurumsalZirve,
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
