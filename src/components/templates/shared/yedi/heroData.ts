import { useMemo } from 'react';
import type { Invitation } from '../../../../types';
import { splitPeople } from '../../../../utils/names';
import { displayText } from '../../utils';
import { eventDateParts, type EventDateParts } from '../eventDate';

/** Yedi Davetiye hero'larının ortak okuması: boş alanlar `''`, kişi listesi en çok iki ad. */
export interface HeroData {
  people: string[];
  /** Ad yoksa "Davetlisiniz" yazan satır için. */
  hasNames: boolean;
  title: string;
  subtitle: string;
  venue: string;
  date: EventDateParts;
}

export function useHeroData(invitation: Invitation): HeroData {
  return useMemo(() => {
    const people = splitPeople(invitation.names).slice(0, 2);
    return {
      people,
      hasNames: people.length > 0,
      title: displayText(invitation.title),
      subtitle: displayText(invitation.subtitle),
      venue: displayText(invitation.venue),
      date: eventDateParts(invitation.date)
    };
  }, [invitation.names, invitation.title, invitation.subtitle, invitation.venue, invitation.date]);
}

/** Ad yokken hero'nun büyük satırı (konsept şablonlarıyla aynı söz). */
export const NO_NAMES = 'Davetlisiniz';
