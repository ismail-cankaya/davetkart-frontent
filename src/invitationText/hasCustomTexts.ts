import type { Invitation } from '../types';

/**
 * Davetiyede değiştirilmiş sabit metin var mı (Faz 24, K305). Backend `has_custom_texts` ile aynı soru:
 * görünmeyen (başka şablona ait) metinler de sayılır (K309).
 */
export function hasCustomTexts(invitation: Pick<Invitation, 'textOverrides'>): boolean {
  return Object.values(invitation.textOverrides ?? {}).some((texts) => texts !== undefined && Object.keys(texts).length > 0);
}
