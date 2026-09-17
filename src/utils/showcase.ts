import { Invitation } from '../types';
import { SHOWCASE_CONTENT } from '../data';
import { hasText } from './text';
import { hasTimelineEventContent } from './timelineEvents';

/** Taslakta, tanıtım içeriğinin dolduracağı alanlardan biri dolu mu? */
export function hasShowcaseFieldContent(invitation: Invitation): boolean {
  return (
    hasText(invitation.names) ||
    hasText(invitation.date) ||
    hasText(invitation.venue) ||
    invitation.timelineEvents.some(hasTimelineEventContent)
  );
}

/**
 * Ana sayfa önizlemesinin çizeceği davetiye.
 *
 * Yeni davetiye artık boş doğar; ana sayfadaki tanıtım ise dolu görünmelidir.
 * Taslakta henüz içerik yoksa örnek içerik yalnızca ÇİZİME bindirilir —
 * store'a yazılmaz, dolayısıyla kaydedilmez.
 *
 * 🔴 Ya hep ya hiç: kullanıcı tek bir alanı doldurduysa taslak olduğu gibi
 * gösterilir. Karışık gösterim (kullanıcının ismi + örnek tarih), girilmemiş
 * bir bilgiyi kaydedilmiş gibi gösterirdi.
 */
export function withShowcaseContent(invitation: Invitation): Invitation {
  return hasShowcaseFieldContent(invitation) ? invitation : { ...invitation, ...SHOWCASE_CONTENT };
}
