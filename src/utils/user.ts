import { AuthUser } from '../types';

/**
 * Oturum açmış kullanıcının tek satırlık görünen adı.
 *
 * Backend ad ve soyadı ayrı kolonlarda tutar ve API'de de ayrı döndürür;
 * birleştirme bilinçli olarak frontend'e bırakılmıştır. Her çağrı yerinde
 * şablon dizesi yazmak yerine tek kaynak burada: yarım dolu bir çiftte
 * (yalnızca ad girilmişse) araya sarkan boşluk basılmaz.
 */
export function fullName(user: Pick<AuthUser, 'firstName' | 'lastName'>): string {
  return [user.firstName, user.lastName]
    .filter((part): part is string => typeof part === 'string' && part.trim() !== '')
    .map((part) => part.trim())
    .join(' ');
}
