import type { Invitation } from '../types';

/**
 * Kullanıcının kendi içeriği (K305, K321): önizlemede tıklanarak düzenlenir, paket istemez, `text_overrides`'a değil
 * davetiyenin kendi kolonlarına yazılır. Sınırlar backend `InvitationRequest` ile aynı.
 */
export const USER_FIELDS = ['names', 'title', 'subtitle', 'venue', 'date'] as const;
export type UserField = (typeof USER_FIELDS)[number];

export const USER_FIELD_LIMITS: Readonly<Record<Exclude<UserField, 'date'>, number>> = {
  names: 120,
  title: 120,
  subtitle: 255,
  venue: 180
};

/** Çok satıra izin veren alanlar. */
export const MULTILINE_USER_FIELDS: ReadonlySet<UserField> = new Set(['subtitle']);

export function userFieldValue(invitation: Invitation, field: UserField): string {
  return invitation[field] ?? '';
}

export function userFieldValues(invitation: Invitation): Record<UserField, string> {
  return {
    names: userFieldValue(invitation, 'names'),
    title: userFieldValue(invitation, 'title'),
    subtitle: userFieldValue(invitation, 'subtitle'),
    venue: userFieldValue(invitation, 'venue'),
    date: userFieldValue(invitation, 'date')
  };
}
