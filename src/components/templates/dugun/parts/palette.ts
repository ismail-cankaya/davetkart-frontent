/**
 * Düğün kategorisinin renk kimliği — "Tül & Kurdele".
 *
 * Tailwind sınıfları kaynakta literal durmak zorunda olduğu için temalar
 * (themes.ts) hex değerlerini kendi dizgilerinde tekrar eder; bu sabitler
 * satır içi stil, SVG ve HeroStage degradeleri içindir.
 */
export const DUGUN_RENK = {
  /** Tül beyazı: açık temaların zemini — fildişi değil, soğuk inci beyazı. */
  tul: '#f8f6f9',
  tulDerin: '#efebf2',
  /** İnci: kıl çizgiler, kenarlar, metal yerine geçen ışık. */
  inci: '#e4dee9',
  inciKoyu: '#cbc2d3',
  /** Mürekkep: menekşe-siyah yazı rengi. */
  murekkep: '#211b2d',
  murekkepOrta: '#433b52',
  murekkepSoluk: '#655d74',
  /** Şakayık: kategorinin tek sıcak vurgusu. */
  sakayik: '#9b3a63',
  sakayikAcik: '#d98bab',
  sakayikPudra: '#f3dde7',
  /** Mersin: botanik şablonların ikincil yeşili. */
  mersin: '#41604f',
  mersinAcik: '#a9c6b5',
  /** Gece: koyu temaların zemini. */
  gece: '#16121d',
  geceDerin: '#0e0b13',
  /** Gecede inci ve şakayık ışığı. */
  inciIsik: '#efe8f3',
  sakayikIsik: '#eba9c6',
  lila: '#c7b8e2'
} as const;

/** `rgba()` içinde kullanılacak rgb üçlüleri (HeroStage atmosfer katmanları). */
export const DUGUN_RGB = {
  murekkep: '33,27,45',
  gece: '22,18,29',
  inci: '217,208,226',
  inciIsik: '239,232,243',
  sakayik: '235,169,198',
  lila: '199,184,226',
  mersin: '169,198,181'
} as const;
