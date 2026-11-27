import React, { Suspense, lazy, useMemo, type ComponentType } from 'react';
import { Invitation } from '../../types';
import { displayNames } from '../../utils/names';
import { TemplateProps } from './types';
import { LAZY_PRESETS } from './lazyPresets';
import { PRESET_PRIMARY_COLORS } from '../../templatePresetColors';

interface TemplateRendererProps {
  templateId: string;
  invitation: Invitation;
  mode?: 'preview' | 'live';
}

/**
 * FE-10: her şablon kendi chunk'ında (`React.lazy`); misafir yalnızca kendi şablonunu indirir.
 * Kategori barrel'ları (`./dugun` …) buraya statik içe aktarılmaz: aktarılsaydı 300 şablon ana pakete girerdi.
 */
function lazyTemplate<K extends string>(
  load: () => Promise<Record<K, ComponentType<TemplateProps>>>,
  name: K,
): ComponentType<TemplateProps> {
  return lazy<ComponentType<TemplateProps>>(() => load().then((m) => ({ default: m[name] })));
}

/** Şablon kimliği → tembel bileşen. Yeni şablon: barrel'a + buraya; `verify:bundle` eksiği yakalar. */
export const THEME_PRESETS: Record<string, ComponentType<TemplateProps>> = {
  // Düğün
  'dugun-sade': lazyTemplate(() => import('./dugun/DugunSade'), 'DugunSade'),
  'dugun-manzara': lazyTemplate(() => import('./dugun/DugunManzara'), 'DugunManzara'),
  'dugun-sekilli': lazyTemplate(() => import('./dugun/DugunSekilli'), 'DugunSekilli'),
  'dugun-modern': lazyTemplate(() => import('./dugun/DugunModern'), 'DugunModern'),
  // Düğün — katmanlı görsel şablon ailesi (Feature-based Colocation)
  'dugun-1': lazyTemplate(() => import('./dugun/Dugun1'), 'Dugun1'),
  'dugun-2': lazyTemplate(() => import('./dugun/Dugun2'), 'Dugun2'),
  'dugun-3': lazyTemplate(() => import('./dugun/Dugun3'), 'Dugun3'),
  'dugun-4': lazyTemplate(() => import('./dugun/Dugun4'), 'Dugun4'),
  'dugun-5': lazyTemplate(() => import('./dugun/Dugun5'), 'Dugun5'),
  // Düğün — videolu şablon ailesi
  'dugun-gokyuzu': lazyTemplate(() => import('./dugun/DugunGokyuzu'), 'DugunGokyuzu'),
  'dugun-mum-isigi': lazyTemplate(() => import('./dugun/DugunMumIsigi'), 'DugunMumIsigi'),
  'dugun-gul-yapraklari': lazyTemplate(() => import('./dugun/DugunGulYapraklari'), 'DugunGulYapraklari'),
  'dugun-deniz-isiltisi': lazyTemplate(() => import('./dugun/DugunDenizIsiltisi'), 'DugunDenizIsiltisi'),
  'dugun-sahil': lazyTemplate(() => import('./dugun/DugunSahil'), 'DugunSahil'),
  'dugun-onyx': lazyTemplate(() => import('./dugun/DugunOnyx'), 'DugunOnyx'),
  // Düğün — videosuz modern tasarım dilleri
  'dugun-aurora': lazyTemplate(() => import('./dugun/DugunAurora'), 'DugunAurora'),
  'dugun-bento': lazyTemplate(() => import('./dugun/DugunBento'), 'DugunBento'),
  'dugun-noir': lazyTemplate(() => import('./dugun/DugunNoir'), 'DugunNoir'),
  'dugun-krom': lazyTemplate(() => import('./dugun/DugunKrom'), 'DugunKrom'),
  'dugun-kagit': lazyTemplate(() => import('./dugun/DugunKagit'), 'DugunKagit'),
  'dugun-deco': lazyTemplate(() => import('./dugun/DugunDeco'), 'DugunDeco'),
  'dugun-riso': lazyTemplate(() => import('./dugun/DugunRiso'), 'DugunRiso'),
  'dugun-bilet': lazyTemplate(() => import('./dugun/DugunBilet'), 'DugunBilet'),
  'dugun-vitray': lazyTemplate(() => import('./dugun/DugunVitray'), 'DugunVitray'),
  'dugun-kinetik': lazyTemplate(() => import('./dugun/DugunKinetik'), 'DugunKinetik'),
  'dugun-cizgi': lazyTemplate(() => import('./dugun/DugunCizgi'), 'DugunCizgi'),
  'dugun-plak': lazyTemplate(() => import('./dugun/DugunPlak'), 'DugunPlak'),
  'dugun-suluboya': lazyTemplate(() => import('./dugun/DugunSuluboya'), 'DugunSuluboya'),
  'dugun-pano': lazyTemplate(() => import('./dugun/DugunPano'), 'DugunPano'),
  'dugun-yildiz-haritasi': lazyTemplate(() => import('./dugun/DugunYildizHaritasi'), 'DugunYildizHaritasi'),
  'dugun-dokuma': lazyTemplate(() => import('./dugun/DugunDokuma'), 'DugunDokuma'),
  'dugun-film': lazyTemplate(() => import('./dugun/DugunFilm'), 'DugunFilm'),
  'dugun-mermer': lazyTemplate(() => import('./dugun/DugunMermer'), 'DugunMermer'),
  'dugun-gazete': lazyTemplate(() => import('./dugun/DugunGazete'), 'DugunGazete'),
  'dugun-posta': lazyTemplate(() => import('./dugun/DugunPosta'), 'DugunPosta'),
  // Kına
  'kina-sade': lazyTemplate(() => import('./kina/KinaSade'), 'KinaSade'),
  'kina-manzara': lazyTemplate(() => import('./kina/KinaManzara'), 'KinaManzara'),
  'kina-sekilli': lazyTemplate(() => import('./kina/KinaSekilli'), 'KinaSekilli'),
  'kina-modern': lazyTemplate(() => import('./kina/KinaModern'), 'KinaModern'),
  'kina-bordo': lazyTemplate(() => import('./kina/KinaBordo'), 'KinaBordo'),
  'kina-saray': lazyTemplate(() => import('./kina/KinaSaray'), 'KinaSaray'),
  'kina-mum': lazyTemplate(() => import('./kina/KinaMum'), 'KinaMum'),
  'kina-aurora': lazyTemplate(() => import('./kina/KinaAurora'), 'KinaAurora'),
  'kina-bento': lazyTemplate(() => import('./kina/KinaBento'), 'KinaBento'),
  'kina-noir': lazyTemplate(() => import('./kina/KinaNoir'), 'KinaNoir'),
  'kina-krom': lazyTemplate(() => import('./kina/KinaKrom'), 'KinaKrom'),
  'kina-kagit': lazyTemplate(() => import('./kina/KinaKagit'), 'KinaKagit'),
  'kina-deco': lazyTemplate(() => import('./kina/KinaDeco'), 'KinaDeco'),
  'kina-riso': lazyTemplate(() => import('./kina/KinaRiso'), 'KinaRiso'),
  'kina-vitray': lazyTemplate(() => import('./kina/KinaVitray'), 'KinaVitray'),
  'kina-kinetik': lazyTemplate(() => import('./kina/KinaKinetik'), 'KinaKinetik'),
  'kina-cizgi': lazyTemplate(() => import('./kina/KinaCizgi'), 'KinaCizgi'),
  'kina-plak': lazyTemplate(() => import('./kina/KinaPlak'), 'KinaPlak'),
  'kina-suluboya': lazyTemplate(() => import('./kina/KinaSuluboya'), 'KinaSuluboya'),
  'kina-pano': lazyTemplate(() => import('./kina/KinaPano'), 'KinaPano'),
  'kina-yildiz-haritasi': lazyTemplate(() => import('./kina/KinaYildizHaritasi'), 'KinaYildizHaritasi'),
  'kina-dokuma': lazyTemplate(() => import('./kina/KinaDokuma'), 'KinaDokuma'),
  'kina-film': lazyTemplate(() => import('./kina/KinaFilm'), 'KinaFilm'),
  'kina-mermer': lazyTemplate(() => import('./kina/KinaMermer'), 'KinaMermer'),
  'kina-gazete': lazyTemplate(() => import('./kina/KinaGazete'), 'KinaGazete'),
  'kina-posta': lazyTemplate(() => import('./kina/KinaPosta'), 'KinaPosta'),
  // Nişan
  'nisan-sade': lazyTemplate(() => import('./nisan/NisanSade'), 'NisanSade'),
  'nisan-manzara': lazyTemplate(() => import('./nisan/NisanManzara'), 'NisanManzara'),
  'nisan-sekilli': lazyTemplate(() => import('./nisan/NisanSekilli'), 'NisanSekilli'),
  'nisan-modern': lazyTemplate(() => import('./nisan/NisanModern'), 'NisanModern'),
  'nisan-sampanya': lazyTemplate(() => import('./nisan/NisanSampanya'), 'NisanSampanya'),
  'nisan-orman': lazyTemplate(() => import('./nisan/NisanOrman'), 'NisanOrman'),
  'nisan-alyans': lazyTemplate(() => import('./nisan/NisanAlyans'), 'NisanAlyans'),
  'nisan-bohem': lazyTemplate(() => import('./nisan/NisanBohem'), 'NisanBohem'),
  'nisan-aurora': lazyTemplate(() => import('./nisan/NisanAurora'), 'NisanAurora'),
  'nisan-bento': lazyTemplate(() => import('./nisan/NisanBento'), 'NisanBento'),
  'nisan-noir': lazyTemplate(() => import('./nisan/NisanNoir'), 'NisanNoir'),
  'nisan-krom': lazyTemplate(() => import('./nisan/NisanKrom'), 'NisanKrom'),
  'nisan-kagit': lazyTemplate(() => import('./nisan/NisanKagit'), 'NisanKagit'),
  'nisan-deco': lazyTemplate(() => import('./nisan/NisanDeco'), 'NisanDeco'),
  'nisan-riso': lazyTemplate(() => import('./nisan/NisanRiso'), 'NisanRiso'),
  'nisan-vitray': lazyTemplate(() => import('./nisan/NisanVitray'), 'NisanVitray'),
  'nisan-kinetik': lazyTemplate(() => import('./nisan/NisanKinetik'), 'NisanKinetik'),
  'nisan-cizgi': lazyTemplate(() => import('./nisan/NisanCizgi'), 'NisanCizgi'),
  'nisan-plak': lazyTemplate(() => import('./nisan/NisanPlak'), 'NisanPlak'),
  'nisan-suluboya': lazyTemplate(() => import('./nisan/NisanSuluboya'), 'NisanSuluboya'),
  'nisan-pano': lazyTemplate(() => import('./nisan/NisanPano'), 'NisanPano'),
  'nisan-yildiz-haritasi': lazyTemplate(() => import('./nisan/NisanYildizHaritasi'), 'NisanYildizHaritasi'),
  'nisan-dokuma': lazyTemplate(() => import('./nisan/NisanDokuma'), 'NisanDokuma'),
  'nisan-film': lazyTemplate(() => import('./nisan/NisanFilm'), 'NisanFilm'),
  'nisan-mermer': lazyTemplate(() => import('./nisan/NisanMermer'), 'NisanMermer'),
  'nisan-gazete': lazyTemplate(() => import('./nisan/NisanGazete'), 'NisanGazete'),
  'nisan-posta': lazyTemplate(() => import('./nisan/NisanPosta'), 'NisanPosta'),
  // Sünnet
  'sunnet-klasik': lazyTemplate(() => import('./sunnet/SunnetKlasik'), 'SunnetKlasik'),
  'sunnet-modern': lazyTemplate(() => import('./sunnet/SunnetModern'), 'SunnetModern'),
  'sunnet-yildiz': lazyTemplate(() => import('./sunnet/SunnetYildiz'), 'SunnetYildiz'),
  'sunnet-masallah': lazyTemplate(() => import('./sunnet/SunnetMasallah'), 'SunnetMasallah'),
  'sunnet-lunapark': lazyTemplate(() => import('./sunnet/SunnetLunapark'), 'SunnetLunapark'),
  'sunnet-kagit': lazyTemplate(() => import('./sunnet/SunnetKagit'), 'SunnetKagit'),
  'sunnet-riso': lazyTemplate(() => import('./sunnet/SunnetRiso'), 'SunnetRiso'),
  'sunnet-aurora': lazyTemplate(() => import('./sunnet/SunnetAurora'), 'SunnetAurora'),
  'sunnet-deco': lazyTemplate(() => import('./sunnet/SunnetDeco'), 'SunnetDeco'),
  'sunnet-bento': lazyTemplate(() => import('./sunnet/SunnetBento'), 'SunnetBento'),
  'sunnet-krom': lazyTemplate(() => import('./sunnet/SunnetKrom'), 'SunnetKrom'),
  'sunnet-vitray': lazyTemplate(() => import('./sunnet/SunnetVitray'), 'SunnetVitray'),
  'sunnet-kinetik': lazyTemplate(() => import('./sunnet/SunnetKinetik'), 'SunnetKinetik'),
  'sunnet-cizgi': lazyTemplate(() => import('./sunnet/SunnetCizgi'), 'SunnetCizgi'),
  'sunnet-plak': lazyTemplate(() => import('./sunnet/SunnetPlak'), 'SunnetPlak'),
  'sunnet-suluboya': lazyTemplate(() => import('./sunnet/SunnetSuluboya'), 'SunnetSuluboya'),
  'sunnet-pano': lazyTemplate(() => import('./sunnet/SunnetPano'), 'SunnetPano'),
  'sunnet-yildiz-haritasi': lazyTemplate(() => import('./sunnet/SunnetYildizHaritasi'), 'SunnetYildizHaritasi'),
  'sunnet-dokuma': lazyTemplate(() => import('./sunnet/SunnetDokuma'), 'SunnetDokuma'),
  'sunnet-film': lazyTemplate(() => import('./sunnet/SunnetFilm'), 'SunnetFilm'),
  'sunnet-mermer': lazyTemplate(() => import('./sunnet/SunnetMermer'), 'SunnetMermer'),
  'sunnet-gazete': lazyTemplate(() => import('./sunnet/SunnetGazete'), 'SunnetGazete'),
  'sunnet-posta': lazyTemplate(() => import('./sunnet/SunnetPosta'), 'SunnetPosta'),
  // Doğum Günü
  'dogum-gunu-neseli': lazyTemplate(() => import('./dogum-gunu/DogumGunuNeseli'), 'DogumGunuNeseli'),
  'dogum-gunu-sik': lazyTemplate(() => import('./dogum-gunu/DogumGunuSik'), 'DogumGunuSik'),
  'dogum-gunu-konfeti': lazyTemplate(() => import('./dogum-gunu/DogumGunuKonfeti'), 'DogumGunuKonfeti'),
  'dogum-gunu-luks': lazyTemplate(() => import('./dogum-gunu/DogumGunuLuks'), 'DogumGunuLuks'),
  'dogum-gunu-bulut': lazyTemplate(() => import('./dogum-gunu/DogumGunuBulut'), 'DogumGunuBulut'),
  'dogum-gunu-zarif': lazyTemplate(() => import('./dogum-gunu/DogumGunuZarif'), 'DogumGunuZarif'),
  'dogum-gunu-riso': lazyTemplate(() => import('./dogum-gunu/DogumGunuRiso'), 'DogumGunuRiso'),
  'dogum-gunu-aurora': lazyTemplate(() => import('./dogum-gunu/DogumGunuAurora'), 'DogumGunuAurora'),
  'dogum-gunu-deco': lazyTemplate(() => import('./dogum-gunu/DogumGunuDeco'), 'DogumGunuDeco'),
  'dogum-gunu-bento': lazyTemplate(() => import('./dogum-gunu/DogumGunuBento'), 'DogumGunuBento'),
  'dogum-gunu-krom': lazyTemplate(() => import('./dogum-gunu/DogumGunuKrom'), 'DogumGunuKrom'),
  'dogum-gunu-vitray': lazyTemplate(() => import('./dogum-gunu/DogumGunuVitray'), 'DogumGunuVitray'),
  'dogum-gunu-kinetik': lazyTemplate(() => import('./dogum-gunu/DogumGunuKinetik'), 'DogumGunuKinetik'),
  'dogum-gunu-cizgi': lazyTemplate(() => import('./dogum-gunu/DogumGunuCizgi'), 'DogumGunuCizgi'),
  'dogum-gunu-plak': lazyTemplate(() => import('./dogum-gunu/DogumGunuPlak'), 'DogumGunuPlak'),
  'dogum-gunu-suluboya': lazyTemplate(() => import('./dogum-gunu/DogumGunuSuluboya'), 'DogumGunuSuluboya'),
  'dogum-gunu-pano': lazyTemplate(() => import('./dogum-gunu/DogumGunuPano'), 'DogumGunuPano'),
  'dogum-gunu-yildiz-haritasi': lazyTemplate(() => import('./dogum-gunu/DogumGunuYildizHaritasi'), 'DogumGunuYildizHaritasi'),
  'dogum-gunu-dokuma': lazyTemplate(() => import('./dogum-gunu/DogumGunuDokuma'), 'DogumGunuDokuma'),
  'dogum-gunu-film': lazyTemplate(() => import('./dogum-gunu/DogumGunuFilm'), 'DogumGunuFilm'),
  'dogum-gunu-mermer': lazyTemplate(() => import('./dogum-gunu/DogumGunuMermer'), 'DogumGunuMermer'),
  'dogum-gunu-gazete': lazyTemplate(() => import('./dogum-gunu/DogumGunuGazete'), 'DogumGunuGazete'),
  'dogum-gunu-posta': lazyTemplate(() => import('./dogum-gunu/DogumGunuPosta'), 'DogumGunuPosta'),
  // Mezuniyet
  'mezuniyet-akademik': lazyTemplate(() => import('./mezuniyet/MezuniyetAkademik'), 'MezuniyetAkademik'),
  'mezuniyet-dinamik': lazyTemplate(() => import('./mezuniyet/MezuniyetDinamik'), 'MezuniyetDinamik'),
  'mezuniyet-lacivert': lazyTemplate(() => import('./mezuniyet/MezuniyetLacivert'), 'MezuniyetLacivert'),
  'mezuniyet-kampus': lazyTemplate(() => import('./mezuniyet/MezuniyetKampus'), 'MezuniyetKampus'),
  'mezuniyet-pusula': lazyTemplate(() => import('./mezuniyet/MezuniyetPusula'), 'MezuniyetPusula'),
  'mezuniyet-bilet': lazyTemplate(() => import('./mezuniyet/MezuniyetBilet'), 'MezuniyetBilet'),
  'mezuniyet-bento': lazyTemplate(() => import('./mezuniyet/MezuniyetBento'), 'MezuniyetBento'),
  'mezuniyet-noir': lazyTemplate(() => import('./mezuniyet/MezuniyetNoir'), 'MezuniyetNoir'),
  'mezuniyet-riso': lazyTemplate(() => import('./mezuniyet/MezuniyetRiso'), 'MezuniyetRiso'),
  'mezuniyet-aurora': lazyTemplate(() => import('./mezuniyet/MezuniyetAurora'), 'MezuniyetAurora'),
  'mezuniyet-kagit': lazyTemplate(() => import('./mezuniyet/MezuniyetKagit'), 'MezuniyetKagit'),
  'mezuniyet-vitray': lazyTemplate(() => import('./mezuniyet/MezuniyetVitray'), 'MezuniyetVitray'),
  'mezuniyet-kinetik': lazyTemplate(() => import('./mezuniyet/MezuniyetKinetik'), 'MezuniyetKinetik'),
  'mezuniyet-cizgi': lazyTemplate(() => import('./mezuniyet/MezuniyetCizgi'), 'MezuniyetCizgi'),
  'mezuniyet-plak': lazyTemplate(() => import('./mezuniyet/MezuniyetPlak'), 'MezuniyetPlak'),
  'mezuniyet-suluboya': lazyTemplate(() => import('./mezuniyet/MezuniyetSuluboya'), 'MezuniyetSuluboya'),
  'mezuniyet-pano': lazyTemplate(() => import('./mezuniyet/MezuniyetPano'), 'MezuniyetPano'),
  'mezuniyet-yildiz-haritasi': lazyTemplate(() => import('./mezuniyet/MezuniyetYildizHaritasi'), 'MezuniyetYildizHaritasi'),
  'mezuniyet-dokuma': lazyTemplate(() => import('./mezuniyet/MezuniyetDokuma'), 'MezuniyetDokuma'),
  'mezuniyet-film': lazyTemplate(() => import('./mezuniyet/MezuniyetFilm'), 'MezuniyetFilm'),
  'mezuniyet-mermer': lazyTemplate(() => import('./mezuniyet/MezuniyetMermer'), 'MezuniyetMermer'),
  'mezuniyet-gazete': lazyTemplate(() => import('./mezuniyet/MezuniyetGazete'), 'MezuniyetGazete'),
  'mezuniyet-posta': lazyTemplate(() => import('./mezuniyet/MezuniyetPosta'), 'MezuniyetPosta'),
  // Baby Shower
  'baby-shower-pastel': lazyTemplate(() => import('./baby-shower/BabyShowerPastel'), 'BabyShowerPastel'),
  'baby-shower-boho': lazyTemplate(() => import('./baby-shower/BabyShowerBoho'), 'BabyShowerBoho'),
  'baby-shower-kabarcik': lazyTemplate(() => import('./baby-shower/BabyShowerKabarcik'), 'BabyShowerKabarcik'),
  'baby-melek': lazyTemplate(() => import('./baby-shower/BabyMelek'), 'BabyMelek'),
  'baby-muzik-kutusu': lazyTemplate(() => import('./baby-shower/BabyMuzikKutusu'), 'BabyMuzikKutusu'),
  'baby-gokyuzu': lazyTemplate(() => import('./baby-shower/BabyGokyuzu'), 'BabyGokyuzu'),
  'baby-riso': lazyTemplate(() => import('./baby-shower/BabyRiso'), 'BabyRiso'),
  'baby-bento': lazyTemplate(() => import('./baby-shower/BabyBento'), 'BabyBento'),
  'baby-kagit': lazyTemplate(() => import('./baby-shower/BabyKagit'), 'BabyKagit'),
  'baby-aurora': lazyTemplate(() => import('./baby-shower/BabyAurora'), 'BabyAurora'),
  'baby-krom': lazyTemplate(() => import('./baby-shower/BabyKrom'), 'BabyKrom'),
  'baby-vitray': lazyTemplate(() => import('./baby-shower/BabyVitray'), 'BabyVitray'),
  'baby-kinetik': lazyTemplate(() => import('./baby-shower/BabyKinetik'), 'BabyKinetik'),
  'baby-cizgi': lazyTemplate(() => import('./baby-shower/BabyCizgi'), 'BabyCizgi'),
  'baby-plak': lazyTemplate(() => import('./baby-shower/BabyPlak'), 'BabyPlak'),
  'baby-suluboya': lazyTemplate(() => import('./baby-shower/BabySuluboya'), 'BabySuluboya'),
  'baby-pano': lazyTemplate(() => import('./baby-shower/BabyPano'), 'BabyPano'),
  'baby-yildiz-haritasi': lazyTemplate(() => import('./baby-shower/BabyYildizHaritasi'), 'BabyYildizHaritasi'),
  'baby-dokuma': lazyTemplate(() => import('./baby-shower/BabyDokuma'), 'BabyDokuma'),
  'baby-film': lazyTemplate(() => import('./baby-shower/BabyFilm'), 'BabyFilm'),
  'baby-mermer': lazyTemplate(() => import('./baby-shower/BabyMermer'), 'BabyMermer'),
  'baby-gazete': lazyTemplate(() => import('./baby-shower/BabyGazete'), 'BabyGazete'),
  'baby-posta': lazyTemplate(() => import('./baby-shower/BabyPosta'), 'BabyPosta'),
  // Parti
  'parti-neon': lazyTemplate(() => import('./parti/PartiNeon'), 'PartiNeon'),
  'parti-gala': lazyTemplate(() => import('./parti/PartiGala'), 'PartiGala'),
  'parti-aurora': lazyTemplate(() => import('./parti/PartiAurora'), 'PartiAurora'),
  'parti-deco': lazyTemplate(() => import('./parti/PartiDeco'), 'PartiDeco'),
  'parti-bilet': lazyTemplate(() => import('./parti/PartiBilet'), 'PartiBilet'),
  'parti-krom': lazyTemplate(() => import('./parti/PartiKrom'), 'PartiKrom'),
  'parti-noir': lazyTemplate(() => import('./parti/PartiNoir'), 'PartiNoir'),
  'parti-riso': lazyTemplate(() => import('./parti/PartiRiso'), 'PartiRiso'),
  'parti-bento': lazyTemplate(() => import('./parti/PartiBento'), 'PartiBento'),
  'parti-kagit': lazyTemplate(() => import('./parti/PartiKagit'), 'PartiKagit'),
  'parti-vitray': lazyTemplate(() => import('./parti/PartiVitray'), 'PartiVitray'),
  'parti-kinetik': lazyTemplate(() => import('./parti/PartiKinetik'), 'PartiKinetik'),
  'parti-cizgi': lazyTemplate(() => import('./parti/PartiCizgi'), 'PartiCizgi'),
  'parti-plak': lazyTemplate(() => import('./parti/PartiPlak'), 'PartiPlak'),
  'parti-suluboya': lazyTemplate(() => import('./parti/PartiSuluboya'), 'PartiSuluboya'),
  'parti-pano': lazyTemplate(() => import('./parti/PartiPano'), 'PartiPano'),
  'parti-yildiz-haritasi': lazyTemplate(() => import('./parti/PartiYildizHaritasi'), 'PartiYildizHaritasi'),
  'parti-dokuma': lazyTemplate(() => import('./parti/PartiDokuma'), 'PartiDokuma'),
  'parti-film': lazyTemplate(() => import('./parti/PartiFilm'), 'PartiFilm'),
  'parti-mermer': lazyTemplate(() => import('./parti/PartiMermer'), 'PartiMermer'),
  'parti-gazete': lazyTemplate(() => import('./parti/PartiGazete'), 'PartiGazete'),
  'parti-posta': lazyTemplate(() => import('./parti/PartiPosta'), 'PartiPosta'),
  // Kurumsal
  'kurumsal-network': lazyTemplate(() => import('./kurumsal/KurumsalNetwork'), 'KurumsalNetwork'),
  'kurumsal-cam': lazyTemplate(() => import('./kurumsal/KurumsalCam'), 'KurumsalCam'),
  'kurumsal-zirve': lazyTemplate(() => import('./kurumsal/KurumsalZirve'), 'KurumsalZirve'),
  'kurumsal-deco': lazyTemplate(() => import('./kurumsal/KurumsalDeco'), 'KurumsalDeco'),
  'kurumsal-bilet': lazyTemplate(() => import('./kurumsal/KurumsalBilet'), 'KurumsalBilet'),
  'kurumsal-bento': lazyTemplate(() => import('./kurumsal/KurumsalBento'), 'KurumsalBento'),
  'kurumsal-noir': lazyTemplate(() => import('./kurumsal/KurumsalNoir'), 'KurumsalNoir'),
  'kurumsal-aurora': lazyTemplate(() => import('./kurumsal/KurumsalAurora'), 'KurumsalAurora'),
  'kurumsal-kagit': lazyTemplate(() => import('./kurumsal/KurumsalKagit'), 'KurumsalKagit'),
  'kurumsal-vitray': lazyTemplate(() => import('./kurumsal/KurumsalVitray'), 'KurumsalVitray'),
  'kurumsal-kinetik': lazyTemplate(() => import('./kurumsal/KurumsalKinetik'), 'KurumsalKinetik'),
  'kurumsal-cizgi': lazyTemplate(() => import('./kurumsal/KurumsalCizgi'), 'KurumsalCizgi'),
  'kurumsal-plak': lazyTemplate(() => import('./kurumsal/KurumsalPlak'), 'KurumsalPlak'),
  'kurumsal-suluboya': lazyTemplate(() => import('./kurumsal/KurumsalSuluboya'), 'KurumsalSuluboya'),
  'kurumsal-pano': lazyTemplate(() => import('./kurumsal/KurumsalPano'), 'KurumsalPano'),
  'kurumsal-yildiz-haritasi': lazyTemplate(() => import('./kurumsal/KurumsalYildizHaritasi'), 'KurumsalYildizHaritasi'),
  'kurumsal-dokuma': lazyTemplate(() => import('./kurumsal/KurumsalDokuma'), 'KurumsalDokuma'),
  'kurumsal-film': lazyTemplate(() => import('./kurumsal/KurumsalFilm'), 'KurumsalFilm'),
  'kurumsal-mermer': lazyTemplate(() => import('./kurumsal/KurumsalMermer'), 'KurumsalMermer'),
  'kurumsal-gazete': lazyTemplate(() => import('./kurumsal/KurumsalGazete'), 'KurumsalGazete'),
  'kurumsal-posta': lazyTemplate(() => import('./kurumsal/KurumsalPosta'), 'KurumsalPosta'),

  // ——— Yeni tasarım dilleri ———
  // Brutal
  'dugun-brutal': lazyTemplate(() => import('./dugun/DugunBrutal'), 'DugunBrutal'),
  'kina-brutal': lazyTemplate(() => import('./kina/KinaBrutal'), 'KinaBrutal'),
  'nisan-brutal': lazyTemplate(() => import('./nisan/NisanBrutal'), 'NisanBrutal'),
  'sunnet-brutal': lazyTemplate(() => import('./sunnet/SunnetBrutal'), 'SunnetBrutal'),
  'dogum-gunu-brutal': lazyTemplate(() => import('./dogum-gunu/DogumGunuBrutal'), 'DogumGunuBrutal'),
  'mezuniyet-brutal': lazyTemplate(() => import('./mezuniyet/MezuniyetBrutal'), 'MezuniyetBrutal'),
  'baby-brutal': lazyTemplate(() => import('./baby-shower/BabyBrutal'), 'BabyBrutal'),
  'parti-brutal': lazyTemplate(() => import('./parti/PartiBrutal'), 'PartiBrutal'),
  'kurumsal-brutal': lazyTemplate(() => import('./kurumsal/KurumsalBrutal'), 'KurumsalBrutal'),
  // Terrazzo
  'dugun-terrazzo': lazyTemplate(() => import('./dugun/DugunTerrazzo'), 'DugunTerrazzo'),
  'kina-terrazzo': lazyTemplate(() => import('./kina/KinaTerrazzo'), 'KinaTerrazzo'),
  'nisan-terrazzo': lazyTemplate(() => import('./nisan/NisanTerrazzo'), 'NisanTerrazzo'),
  'sunnet-terrazzo': lazyTemplate(() => import('./sunnet/SunnetTerrazzo'), 'SunnetTerrazzo'),
  'dogum-gunu-terrazzo': lazyTemplate(() => import('./dogum-gunu/DogumGunuTerrazzo'), 'DogumGunuTerrazzo'),
  'mezuniyet-terrazzo': lazyTemplate(() => import('./mezuniyet/MezuniyetTerrazzo'), 'MezuniyetTerrazzo'),
  'baby-terrazzo': lazyTemplate(() => import('./baby-shower/BabyTerrazzo'), 'BabyTerrazzo'),
  'parti-terrazzo': lazyTemplate(() => import('./parti/PartiTerrazzo'), 'PartiTerrazzo'),
  'kurumsal-terrazzo': lazyTemplate(() => import('./kurumsal/KurumsalTerrazzo'), 'KurumsalTerrazzo'),
  // Teknik Çizim
  'dugun-blueprint': lazyTemplate(() => import('./dugun/DugunBlueprint'), 'DugunBlueprint'),
  'kina-blueprint': lazyTemplate(() => import('./kina/KinaBlueprint'), 'KinaBlueprint'),
  'nisan-blueprint': lazyTemplate(() => import('./nisan/NisanBlueprint'), 'NisanBlueprint'),
  'sunnet-blueprint': lazyTemplate(() => import('./sunnet/SunnetBlueprint'), 'SunnetBlueprint'),
  'dogum-gunu-blueprint': lazyTemplate(() => import('./dogum-gunu/DogumGunuBlueprint'), 'DogumGunuBlueprint'),
  'mezuniyet-blueprint': lazyTemplate(() => import('./mezuniyet/MezuniyetBlueprint'), 'MezuniyetBlueprint'),
  'baby-blueprint': lazyTemplate(() => import('./baby-shower/BabyBlueprint'), 'BabyBlueprint'),
  'parti-blueprint': lazyTemplate(() => import('./parti/PartiBlueprint'), 'PartiBlueprint'),
  'kurumsal-blueprint': lazyTemplate(() => import('./kurumsal/KurumsalBlueprint'), 'KurumsalBlueprint'),
  // Herbaryum
  'dugun-herbaryum': lazyTemplate(() => import('./dugun/DugunHerbaryum'), 'DugunHerbaryum'),
  'kina-herbaryum': lazyTemplate(() => import('./kina/KinaHerbaryum'), 'KinaHerbaryum'),
  'nisan-herbaryum': lazyTemplate(() => import('./nisan/NisanHerbaryum'), 'NisanHerbaryum'),
  'sunnet-herbaryum': lazyTemplate(() => import('./sunnet/SunnetHerbaryum'), 'SunnetHerbaryum'),
  'dogum-gunu-herbaryum': lazyTemplate(() => import('./dogum-gunu/DogumGunuHerbaryum'), 'DogumGunuHerbaryum'),
  'mezuniyet-herbaryum': lazyTemplate(() => import('./mezuniyet/MezuniyetHerbaryum'), 'MezuniyetHerbaryum'),
  'baby-herbaryum': lazyTemplate(() => import('./baby-shower/BabyHerbaryum'), 'BabyHerbaryum'),
  'parti-herbaryum': lazyTemplate(() => import('./parti/PartiHerbaryum'), 'PartiHerbaryum'),
  'kurumsal-herbaryum': lazyTemplate(() => import('./kurumsal/KurumsalHerbaryum'), 'KurumsalHerbaryum'),
  // Ufuk — kaydırdıkça gün batımından geceye ilerleyen sinematik manzara
  'dugun-ufuk': lazyTemplate(() => import('./dugun/DugunUfuk'), 'DugunUfuk'),
  'kina-ufuk': lazyTemplate(() => import('./kina/KinaUfuk'), 'KinaUfuk'),
  'nisan-ufuk': lazyTemplate(() => import('./nisan/NisanUfuk'), 'NisanUfuk'),
  'sunnet-ufuk': lazyTemplate(() => import('./sunnet/SunnetUfuk'), 'SunnetUfuk'),
  'dogum-gunu-ufuk': lazyTemplate(() => import('./dogum-gunu/DogumGunuUfuk'), 'DogumGunuUfuk'),
  'mezuniyet-ufuk': lazyTemplate(() => import('./mezuniyet/MezuniyetUfuk'), 'MezuniyetUfuk'),
  'baby-ufuk': lazyTemplate(() => import('./baby-shower/BabyUfuk'), 'BabyUfuk'),
  'parti-ufuk': lazyTemplate(() => import('./parti/PartiUfuk'), 'PartiUfuk'),
  'kurumsal-ufuk': lazyTemplate(() => import('./kurumsal/KurumsalUfuk'), 'KurumsalUfuk'),
  // Çini
  'dugun-cini': lazyTemplate(() => import('./dugun/DugunCini'), 'DugunCini'),
  'kina-cini': lazyTemplate(() => import('./kina/KinaCini'), 'KinaCini'),
  'nisan-cini': lazyTemplate(() => import('./nisan/NisanCini'), 'NisanCini'),
  'sunnet-cini': lazyTemplate(() => import('./sunnet/SunnetCini'), 'SunnetCini'),
  'dogum-gunu-cini': lazyTemplate(() => import('./dogum-gunu/DogumGunuCini'), 'DogumGunuCini'),
  'mezuniyet-cini': lazyTemplate(() => import('./mezuniyet/MezuniyetCini'), 'MezuniyetCini'),
  'baby-cini': lazyTemplate(() => import('./baby-shower/BabyCini'), 'BabyCini'),
  'parti-cini': lazyTemplate(() => import('./parti/PartiCini'), 'PartiCini'),
  'kurumsal-cini': lazyTemplate(() => import('./kurumsal/KurumsalCini'), 'KurumsalCini'),
  // Ebru
  'dugun-ebru': lazyTemplate(() => import('./dugun/DugunEbru'), 'DugunEbru'),
  'kina-ebru': lazyTemplate(() => import('./kina/KinaEbru'), 'KinaEbru'),
  'nisan-ebru': lazyTemplate(() => import('./nisan/NisanEbru'), 'NisanEbru'),
  'sunnet-ebru': lazyTemplate(() => import('./sunnet/SunnetEbru'), 'SunnetEbru'),
  'dogum-gunu-ebru': lazyTemplate(() => import('./dogum-gunu/DogumGunuEbru'), 'DogumGunuEbru'),
  'mezuniyet-ebru': lazyTemplate(() => import('./mezuniyet/MezuniyetEbru'), 'MezuniyetEbru'),
  'baby-ebru': lazyTemplate(() => import('./baby-shower/BabyEbru'), 'BabyEbru'),
  'parti-ebru': lazyTemplate(() => import('./parti/PartiEbru'), 'PartiEbru'),
  'kurumsal-ebru': lazyTemplate(() => import('./kurumsal/KurumsalEbru'), 'KurumsalEbru'),
  // Varak Monogram
  'dugun-monogram': lazyTemplate(() => import('./dugun/DugunMonogram'), 'DugunMonogram'),
  'kina-monogram': lazyTemplate(() => import('./kina/KinaMonogram'), 'KinaMonogram'),
  'nisan-monogram': lazyTemplate(() => import('./nisan/NisanMonogram'), 'NisanMonogram'),
  'sunnet-monogram': lazyTemplate(() => import('./sunnet/SunnetMonogram'), 'SunnetMonogram'),
  'dogum-gunu-monogram': lazyTemplate(() => import('./dogum-gunu/DogumGunuMonogram'), 'DogumGunuMonogram'),
  'mezuniyet-monogram': lazyTemplate(() => import('./mezuniyet/MezuniyetMonogram'), 'MezuniyetMonogram'),
  'baby-monogram': lazyTemplate(() => import('./baby-shower/BabyMonogram'), 'BabyMonogram'),
  'parti-monogram': lazyTemplate(() => import('./parti/PartiMonogram'), 'PartiMonogram'),
  'kurumsal-monogram': lazyTemplate(() => import('./kurumsal/KurumsalMonogram'), 'KurumsalMonogram'),
  // Takvim
  'dugun-takvim': lazyTemplate(() => import('./dugun/DugunTakvim'), 'DugunTakvim'),
  'kina-takvim': lazyTemplate(() => import('./kina/KinaTakvim'), 'KinaTakvim'),
  'nisan-takvim': lazyTemplate(() => import('./nisan/NisanTakvim'), 'NisanTakvim'),
  'sunnet-takvim': lazyTemplate(() => import('./sunnet/SunnetTakvim'), 'SunnetTakvim'),
  'dogum-gunu-takvim': lazyTemplate(() => import('./dogum-gunu/DogumGunuTakvim'), 'DogumGunuTakvim'),
  'mezuniyet-takvim': lazyTemplate(() => import('./mezuniyet/MezuniyetTakvim'), 'MezuniyetTakvim'),
  'baby-takvim': lazyTemplate(() => import('./baby-shower/BabyTakvim'), 'BabyTakvim'),
  'parti-takvim': lazyTemplate(() => import('./parti/PartiTakvim'), 'PartiTakvim'),
  'kurumsal-takvim': lazyTemplate(() => import('./kurumsal/KurumsalTakvim'), 'KurumsalTakvim'),
  // Kâğıt / el yapımı — davetiye seti (docs/rehber/tasarim/KAGIT-KONSEPTI.md)
  'nisan-soz-mektubu': lazyTemplate(() => import('./nisan/NisanSozMektubu'), 'NisanSozMektubu'),
  'nisan-gul-kurusu': lazyTemplate(() => import('./nisan/NisanGulKurusu'), 'NisanGulKurusu'),
  'nisan-soz-senedi': lazyTemplate(() => import('./nisan/NisanSozSenedi'), 'NisanSozSenedi'),
  // Konsept şablonları (Kitap · Harita · Sergi) ve Yedi Davetiye — tembel yüklenir, bkz. lazyPresets.ts
  ...LAZY_PRESETS,
};

/** Tembel şablonun chunk'ı inerken: boş, tam ekran ve sessiz bir zemin — şablonun kendi renginde. */
function TemplateFallback({ color }: { color?: string }) {
  return <div className="min-h-[100svh] w-full bg-[#F4F1EA]" style={color ? { background: color } : undefined} aria-busy="true" />;
}

export function TemplateRenderer({ templateId, invitation: stored, mode = 'preview' }: TemplateRendererProps) {
  // Şablonların tek giriş kapısı: saklama biçimindeki isim ayracı (`& Ali`,
  // bkz. utils/names) burada temizlenir; 180+ şablonun her biri ayrıca bilmez.
  // Değişiklik yoksa aynı nesne geçer — şablonların memo'su bozulmaz.
  const names = displayNames(stored.names);
  const invitation = useMemo(
    () => (names === stored.names ? stored : { ...stored, names }),
    [stored, names]
  );

  // Combine category and style, fallback to 'dugun' if category lacks templates
  const category = ['dugun', 'kina', 'nisan'].includes(invitation.categoryId) ? invitation.categoryId : 'dugun';
  
  // If the templateId is already a composite (e.g. from old data), use it directly,
  // otherwise compose it.
  const presetKey = templateId.includes('-') ? templateId : `${category}-${templateId}`;

  // Tema ID'si eşleniyorsa o temayı render et.
  const ThemePreset = THEME_PRESETS[presetKey] || THEME_PRESETS[`dugun-${templateId}`];
  if (ThemePreset) {
    return (
      <Suspense fallback={<TemplateFallback color={PRESET_PRIMARY_COLORS[presetKey]} />}>
        <ThemePreset invitation={invitation} mode={mode} />
      </Suspense>
    );
  }

  // Varsayılan olarak DugunSade kullan
  const Fallback = THEME_PRESETS['dugun-sade'];
  return (
    <Suspense fallback={<TemplateFallback />}>
      <Fallback invitation={invitation} mode={mode} />
    </Suspense>
  );
}
