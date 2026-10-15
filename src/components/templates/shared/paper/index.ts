/**
 * "Kâğıt / el yapımı" ortak kiti — tek giriş noktası. Şablonlar kendi doku,
 * kenar ya da mührünü icat etmez; buradan alır.
 *
 * Kılavuz: docs/rehber/tasarim/KAGIT-KONSEPTI.md
 */
export { KagitKok } from './KagitKok';
export { KagitLevha, tirtikliKenar } from './KagitLevha';
export { KagitZarf } from './KagitZarf';
export type { KagitZarfProps } from './KagitZarf';
export { MumMuhur } from './MumMuhur';
export { Adlar } from './Adlar';
export { Kabartma, MurekkepDamga } from './Baski';
export { SuluboyaLeke } from './SuluboyaLeke';
export { KAGIT_TEMASI, KAGIT_TEMASI_KOYU } from './tema';
export { basHarfler } from './basHarfler';
export type { BasHarfKurali } from './basHarfler';
export { kaymaGirisi, belirmeGirisi, basmaGirisi, KAGIT_SURE } from './hareket';
export { useElYazisiHazir, EL_YAZILARI } from './fontlar';
export type { ElYazisi } from './fontlar';
export { ACIK_KAGITLAR, KOYU_KAGITLAR, KOYU_MUREKKEPLER, ACIK_MUREKKEPLER, MUMLAR, PIGMENTLER, kagitDegiskenleri } from './palet';
export type { KagitSeti, KagitDegiskeni, PigmentAdi } from './palet';
