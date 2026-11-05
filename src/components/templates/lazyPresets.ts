import { lazy, type ComponentType } from 'react';
import type { TemplateProps } from './types';

type Preset = ComponentType<TemplateProps>;

/**
 * Konsept barrel'ındaki adlandırılmış bir dışa aktarımı `React.lazy` bileşenine çevirir.
 * Barrel'lar kategori barrel'ına (`dugun/index.ts`) bağlanmaz: bağlansaydı modül ana
 * pakete statik olarak girer, tembel yükleme boşa giderdi.
 */
function fromBarrel<K extends string>(load: () => Promise<Record<K, Preset>>, name: K): Preset {
  return lazy(() => load().then((m) => ({ default: m[name] })));
}

const dugunKitap = () => import('./dugun/kitap');
const dugunHarita = () => import('./dugun/harita');
const dugunSergi = () => import('./dugun/sergi');
const nisanKitap = () => import('./nisan/kitap');
const nisanHarita = () => import('./nisan/harita');
const nisanSergi = () => import('./nisan/sergi');
const dogumGunuKitap = () => import('./dogum-gunu/kitap');
const dogumGunuHarita = () => import('./dogum-gunu/harita');
const dogumGunuSergi = () => import('./dogum-gunu/sergi');

/** Konsept şablonları (Kitap · Harita · Sergi) — her konsept kendi chunk'ında. */
export const LAZY_KONSEPT_PRESETS: Record<string, Preset> = {
  'dugun-kitap-birinci-bolum': fromBarrel(dugunKitap, 'DugunKitapBirinciBolum'),
  'dugun-kitap-ic-kapak': fromBarrel(dugunKitap, 'DugunKitapIcKapak'),
  'dugun-harita-kir-yolu': fromBarrel(dugunHarita, 'DugunHaritaKirYolu'),
  'dugun-harita-kiyi-kenti': fromBarrel(dugunHarita, 'DugunHaritaKiyiKenti'),
  'dugun-sergi-beyaz-kup': fromBarrel(dugunSergi, 'DugunSergiBeyazKup'),
  'dugun-sergi-duvar-yazisi': fromBarrel(dugunSergi, 'DugunSergiDuvarYazisi'),
  'nisan-kitap-kurdele': fromBarrel(nisanKitap, 'NisanKitapKurdele'),
  'nisan-kitap-onsoz': fromBarrel(nisanKitap, 'NisanKitapOnsoz'),
  'nisan-harita-kavusak': fromBarrel(nisanHarita, 'NisanHaritaKavusak'),
  'nisan-harita-kroki': fromBarrel(nisanHarita, 'NisanHaritaKroki'),
  'nisan-sergi-bir-omur': fromBarrel(nisanSergi, 'NisanSergiBirOmur'),
  'nisan-sergi-diptik': fromBarrel(nisanSergi, 'NisanSergiDiptik'),
  'dogum-gunu-kitap-masal': fromBarrel(dogumGunuKitap, 'DogumGunuKitapMasal'),
  'dogum-gunu-kitap-yeni-bolum': fromBarrel(dogumGunuKitap, 'DogumGunuKitapYeniBolum'),
  'dogum-gunu-harita-hazine-avi': fromBarrel(dogumGunuHarita, 'DogumGunuHaritaHazineAvi'),
  'dogum-gunu-harita-kutlama-hatti': fromBarrel(dogumGunuHarita, 'DogumGunuHaritaKutlamaHatti'),
  'dogum-gunu-sergi-devam-eden': fromBarrel(dogumGunuSergi, 'DogumGunuSergiDevamEden'),
  'dogum-gunu-sergi-retrospektif': fromBarrel(dogumGunuSergi, 'DogumGunuSergiRetrospektif'),
};

/** Yedi Davetiye — düğün şablonları; 3B/WebGL olanların sahnesi ayrıca tembel yüklenir. */
export const LAZY_YEDI_PRESETS: Record<string, Preset> = {
  'dugun-kitap-sayfa': fromBarrel(() => import('./dugun/DugunKitapSayfa'), 'DugunKitapSayfa'),
  'dugun-gul-3d': fromBarrel(() => import('./dugun/DugunGul3d'), 'DugunGul3d'),
  'dugun-popup': fromBarrel(() => import('./dugun/DugunPopup'), 'DugunPopup'),
  'dugun-fener': fromBarrel(() => import('./dugun/DugunFener'), 'DugunFener'),
  'dugun-murekkep': fromBarrel(() => import('./dugun/DugunMurekkep'), 'DugunMurekkep'),
  'dugun-altin-toz': fromBarrel(() => import('./dugun/DugunAltinToz'), 'DugunAltinToz'),
  'dugun-holografik': fromBarrel(() => import('./dugun/DugunHolografik'), 'DugunHolografik'),
};

/**
 * Premium sinematik şablonlar (Gold): her biri kodla üretilmiş kendi videosuyla
 * (scripts/video/<id>/) ve kendi chunk'ında. Rehber: premium-videolu.md.
 */
export const LAZY_PREMIUM_PRESETS: Record<string, Preset> = {
  'kina-al-duvak': fromBarrel(() => import('./kina/KinaAlDuvak'), 'KinaAlDuvak'),
  'parti-havuz': fromBarrel(() => import('./parti/PartiHavuz'), 'PartiHavuz'),
  'baby-ay-besigi': fromBarrel(() => import('./baby-shower/BabyAyBesigi'), 'BabyAyBesigi'),
  'nisan-iplik': fromBarrel(() => import('./nisan/NisanIplik'), 'NisanIplik'),
  'dugun-yasemin': fromBarrel(() => import('./dugun/DugunYasemin'), 'DugunYasemin'),
  'sunnet-sehzade': fromBarrel(() => import('./sunnet/SunnetSehzade'), 'SunnetSehzade'),
  'dogum-gunu-havai-fisek': fromBarrel(() => import('./dogum-gunu/DogumGunuHavaiFisek'), 'DogumGunuHavaiFisek'),
  'dugun-kristal-balo': fromBarrel(() => import('./dugun/DugunKristalBalo'), 'DugunKristalBalo'),
  'mezuniyet-kep': fromBarrel(() => import('./mezuniyet/MezuniyetKep'), 'MezuniyetKep'),
  'dugun-saray-kapisi': fromBarrel(() => import('./dugun/DugunSarayKapisi'), 'DugunSarayKapisi'),
};

/** Altı hızlı şablon — CSS 3B, SVG çizgi, canvas 2B ve motion; bkz. docs/rehber/src/components/templates/alti-hizli-sablon.md */
export const LAZY_ALTI_PRESETS: Record<string, Preset> = {
  'dogum-gunu-mumlar': fromBarrel(() => import('./dogum-gunu/DogumGunuMumlar'), 'DogumGunuMumlar'),
  'kurumsal-terminal': fromBarrel(() => import('./kurumsal/KurumsalTerminal'), 'KurumsalTerminal'),
  'kina-mehndi': fromBarrel(() => import('./kina/KinaMehndi'), 'KinaMehndi'),
  'dugun-origami-turna': fromBarrel(() => import('./dugun/DugunOrigamiTurna'), 'DugunOrigamiTurna'),
  'sunnet-atli-karinca': fromBarrel(() => import('./sunnet/SunnetAtliKarinca'), 'SunnetAtliKarinca'),
  'dugun-kum-saati': fromBarrel(() => import('./dugun/DugunKumSaati'), 'DugunKumSaati'),
};

/** On iki etkileşimli şablon — bkz. docs/rehber/src/components/templates/oniki-etkilesimli-sablon.md */
export const LAZY_ONIKI_PRESETS: Record<string, Preset> = {
  'dugun-opera': fromBarrel(() => import('./dugun/DugunOpera'), 'DugunOpera'),
  'nisan-kiraz-agaci': fromBarrel(() => import('./nisan/NisanKirazAgaci'), 'NisanKirazAgaci'),
  'sunnet-golge-oyunu': fromBarrel(() => import('./sunnet/SunnetGolgeOyunu'), 'SunnetGolgeOyunu'),
  'dogum-gunu-arcade': fromBarrel(() => import('./dogum-gunu/DogumGunuArcade'), 'DogumGunuArcade'),
  'mezuniyet-kara-tahta': fromBarrel(() => import('./mezuniyet/MezuniyetKaraTahta'), 'MezuniyetKaraTahta'),
  'baby-donence': fromBarrel(() => import('./baby-shower/BabyDonence'), 'BabyDonence'),
  'parti-disko-topu': fromBarrel(() => import('./parti/PartiDiskoTopu'), 'PartiDiskoTopu'),
  'kurumsal-izometrik': fromBarrel(() => import('./kurumsal/KurumsalIzometrik'), 'KurumsalIzometrik'),
};

/** Kayıt dosyasının ve `verify:render`'ın okuduğu bütün tembel şablonlar. */
export const LAZY_PRESETS: Record<string, Preset> = {
  ...LAZY_KONSEPT_PRESETS,
  ...LAZY_YEDI_PRESETS,
  ...LAZY_PREMIUM_PRESETS,
  ...LAZY_ALTI_PRESETS,
  ...LAZY_ONIKI_PRESETS
};
