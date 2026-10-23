import type { SectionTheme } from '../../shared/palette';

/**
 * Harita teması: bölümler haritanın üstünde `yol` beyazı kartlarda okunur.
 *
 * Kartlar düz beyazdır (cam yok, gölge yok — gölge yalnızca kartuşta);
 * köşeler keskin. Kart dışındaki bölüm başlıkları haritanın perdelenmiş
 * hâlinin üstünde durur; en kötü zemin ölçümü kılavuzdadır.
 *
 * Yazı: gövde Barlow Semi Condensed; bölümlerin `font-serif` başlıkları
 * Newsreader italiğe çevrilir. `font-synthesis: none` — yüklenmeyen
 * kalınlıklar sahte kalın üretmez, en yakın yüklü kalınlığa düşer.
 */
const KOK =
  'bg-[#EEF0E6] [font-family:var(--hr-govde)] [font-synthesis:none] [&_.font-serif]:[font-family:var(--hr-italik)] [&_.font-serif]:italic [&_.font-serif]:font-medium';

export const HARITA_TEMASI: SectionTheme = {
  id: 'stone',
  base: KOK,
  page: 'text-[#23303A]',
  surface: 'bg-white rounded-[3px]',
  border: 'border-[#23303A]/30',
  heading: 'text-[#23303A]',
  body: 'text-[#4E5B63]',
  accent: 'text-[#A8321F]',
  accentBg: 'bg-[#A8321F]',
  accentSoft: 'bg-[#A8321F]/10',
  input:
    'w-full bg-white border border-[#4E5B63] rounded-[3px] px-3.5 py-2.5 text-[15px] text-[#23303A] placeholder:text-[#4E5B63] focus:outline-none focus:border-[#A8321F] focus:ring-2 focus:ring-[#A8321F]/25 transition-colors duration-300',
  buttonPrimary: 'bg-[#A8321F] hover:bg-[#8F2A1A] text-white rounded-[3px]',
  buttonGhost: 'border border-[#23303A] text-[#23303A] hover:bg-[#23303A]/[0.06] rounded-[3px]',
  divider: 'bg-[#23303A]/15',
  // Program çizgisi düz rota rengi: haritada degrade yok.
  timelineLine: 'from-[#A8321F] via-[#A8321F] to-[#A8321F]',
  mapHeader: 'bg-[#EEF0E6]',
  footer: { names: 'text-[#4E5B63]', branding: 'text-[#4E5B63]' },
  // Ortak kancalar (KONSEPT-ORTAK §3.1, K10). Kapak zaten haritadır: Detaylar'ın
  // soyut harita başlığı ikinci bir harita olurdu.
  hideMapHeader: true,
  // Program düğümü haritadaki durakla aynı: beyaz daire, 2 px rota kenar, içte rota nokta.
  timelineNode: 'bg-white border-2 border-[#A8321F] rounded-full',
  // Bölüm girişi kartuş/lejantla aynı dil (HARITA-KONSEPTI §6): 0.4 s, 8 px.
  sectionMotion: { duration: 0.4, distance: 8 },
  // Durum renkleri paletten: başarı park yeşili üstünde mürekkep, hata rotanın koyu tonu.
  status: {
    success: 'bg-[#B7C9A2] text-[#23303A]',
    error: 'text-[#8F2A1A]',
    errorInput: 'border-[#8F2A1A] focus:border-[#8F2A1A] focus:ring-[#8F2A1A]/25'
  }
};

/**
 * Hazine haritası ekseninin teması (HARITA-KONSEPTI §2.2): sayfa zemini sıcak
 * arazi `#F1E6C8`; geri kalan her şey `HARITA_TEMASI`. Kartlar yine beyaz,
 * kontrastlar kartın kendisinde ölçülür; zemindeki başlık ve gövde mürekkep
 * 10.85, gri 5.63 (hesaplandı; çizilmiş ekran ölçümü preset kılavuzunda).
 */
export const HARITA_TEMASI_SICAK: SectionTheme = {
  ...HARITA_TEMASI,
  base: KOK.replace('bg-[#EEF0E6]', 'bg-[#F1E6C8]'),
  mapHeader: 'bg-[#F1E6C8]'
};
