import type { TemplateFlavor } from '../../shared/flavor';
import { romen, type BezAdi, type EtiketBicimi } from '../../konsept/kitap';
import { NISAN_FLAVOR } from '../flavors';

/**
 * Nişanın kitap preset'lerinin ortak tabanı. Nişan hikâyenin **önsözü**dür
 * (KITAP-KONSEPTI §7): birinci bölüm düğündür, burada henüz bölüm yoktur.
 *
 * Kategoriden aynen kalanlar: zarf etiketi "Nişan Davetiyesi", italik satır
 * "Söz Verdik, Nişanlanıyoruz". Bölüm adları kitten gelir (`useKitapFlavor`).
 */
export const NISAN_KITAP_FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  giftNote:
    'Hikâyemizin bu ilk sayfasında yanımızda olmanız en güzel armağan; yine de takdirinizi iletmek isterseniz hesap bilgilerimiz aşağıdadır.'
};

/**
 * Bölüm üst etiketleri: önsözün sayfaları — "Önsöz · II", "Önsöz · III".
 * Hero önsözün ilk sayfasıdır (I); düğündeki "Bölüm II" burada olmaz, çünkü
 * kitabın birinci bölümü henüz yazılmadı. Modül sabiti (useMemo bağımlılığı).
 */
export const ONSOZ_ETIKETI: EtiketBicimi = (sira) => `Önsöz · ${romen(sira)}`;

/**
 * Nişanın bezi `murdum`: düğün `sise` ve `lacivert`, kına `sarap` taşır; aynı
 * konseptte iki kategori aynı kapağı taşımaz (KITAP-KONSEPTI §11, K7).
 */
export const NISAN_BEZI: BezAdi = 'murdum';
