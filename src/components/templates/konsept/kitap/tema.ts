import type { SectionTheme } from '../../shared/palette';

/**
 * İç sayfa teması: bölümler şamua üstünde, mürekkeple dizilmiş kitap sayfası.
 *
 * Kâğıt kitinin "ek kart" dilinden bilerek ayrılır: doku, gölge, kesik çizgi
 * yok. Yüzeyler sayfanın kendi rengidir, yalnızca ince bir kılçizgiyle ayrılır;
 * köşe 2 px. Renkler sabit sınıflardır (palet tek, preset'ler bezle ayrışır).
 *
 * Yazı: kök Caslon Text'e döner; bölüm başlıkları (`h2.font-serif`) Caslon
 * Display'e, 34 px'e ve 400 ağırlığa çevrilir — Display'in kıl çizgileri
 * 32 px altında kopar (KITAP-KONSEPTI §3.2). Öbür `font-serif`'ler (program
 * adımı, mekân satırı) Caslon Text kalır. Varyantlar iki sınıflı seçicidir;
 * bileşenlerin `text-2xl`/`font-bold`'unu sıradan bağımsız yener.
 *
 * Ortak kancalar (KONSEPT-ORTAK §3.1, K8 · K10):
 * - `timelineLayout: 'icindekiler'` — program noktalı satırlarla dizilir.
 * - `hideMapHeader` — kitapta harita yok; Detaylar kartı soyut harita
 *   başlığı olmadan başlar.
 * - `sectionMotion` 0.4 s / 12 px — kitabın kısa "bölüm girişi" (§6).
 * - `status` — kitabın kendi mürekkepleri: onay şişe yeşili, hata koyu
 *   kurdele (şamuada ölçüldü, tema.md).
 */
const KOK = [
  'bg-[#F2EAD3]',
  '[font-family:var(--kt-metin-font)]',
  '[&_.font-serif]:[font-family:var(--kt-metin-font)]',
  '[&_h2.font-serif]:[font-family:var(--kt-baslik-font)]',
  '[&_h2.font-serif]:font-normal',
  '[&_h2.font-serif]:text-[2.125rem]',
  '[&_h2.font-serif]:leading-[1.12]',
  '[&_h2.font-serif]:[text-wrap:balance]',
  // İçindekiler noktaları: ortak %60 opaklık şamuada 2.63 kalıyordu; %80 ile
  // 3.95 (çizilmiş ekranda ölçüldü). Noktalar süstür ama gözü saate taşır.
  '[&_.border-dotted]:opacity-80'
].join(' ');

export const KITAP_TEMASI: SectionTheme = {
  id: 'stone',
  base: KOK,
  page: 'text-[#231F1A]',
  surface: 'bg-[#F2EAD3] rounded-[2px] shadow-none',
  border: 'border-[#231F1A]/20',
  heading: 'text-[#231F1A]',
  body: 'text-[#5E5446]',
  accent: 'text-[#8C2F2F]',
  accentBg: 'bg-[#8C2F2F]',
  accentSoft: 'bg-[#8C2F2F]/10',
  input:
    'w-full bg-transparent border border-[#5E5446] rounded-[2px] px-3.5 py-2.5 text-[16px] text-[#231F1A] placeholder:text-[#5E5446] placeholder:italic focus:outline-none focus:border-[#8C2F2F] focus:ring-2 focus:ring-[#8C2F2F]/25 transition-colors duration-300',
  buttonPrimary: 'bg-[#8C2F2F] hover:bg-[#74262A] text-[#F2EAD3] rounded-[2px] shadow-none',
  buttonGhost: 'border border-[#8C2F2F] text-[#8C2F2F] hover:bg-[#8C2F2F]/[0.06] rounded-[2px]',
  divider: 'bg-[#231F1A]/15',
  timelineLine: 'from-[#8C2F2F] via-[#8C2F2F]/40 to-transparent',
  timelineLayout: 'icindekiler',
  hideMapHeader: true,
  sectionMotion: { duration: 0.4, distance: 12 },
  status: {
    success: 'bg-[#1F3A2E]/10 text-[#1F3A2E]',
    error: 'text-[#74262A]',
    errorInput: 'border-[#74262A] focus:border-[#74262A] focus:ring-[#74262A]/25'
  },
  // Ortak alt bilgi opaklıkla soluklaşır; şamuada tam `soluk` 6.17.
  footer: { names: 'text-[#5E5446]', branding: 'text-[#5E5446]' }
};
