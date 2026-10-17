import type { TemplateFlavor } from '../../shared/flavor';
import { DUGUN_FLAVOR } from '../flavors';

/**
 * Düğünün kitap preset'lerinin ortak flavor tabanı. Bölüm adları ve numaralı
 * etiketler kitten gelir (`useKitapFlavor`); burada yalnızca düğüne özgü
 * hediye notu kitap diline çevrilir. Zarf etiketi ("Düğün Davetiyesi") ve
 * italik satır ("Evleniyoruz") kategoriden aynen kalır.
 */
export const DUGUN_KITAP_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  giftNote: 'Bu hikâyede yanımızda olmanız en güzel armağan; yine de takdirinizi iletmek isterseniz hesap bilgilerimiz aşağıdadır.'
};
