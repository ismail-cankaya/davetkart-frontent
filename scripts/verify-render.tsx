/**
 * Bileşen çizim denetimi — `npm run verify:render` (Faz 10, FE 10.23)
 *
 * Öbür doğrulama betikleri store'ları ve servisleri sınar; bu betik ekrana ne
 * ÇİZİLDİĞİNİ sınar. Gerçek bileşenler `react-dom/server` ile HTML'e çizilir:
 * tarayıcı yok, efektler koşmaz, ilk çizimde görünen metin denetlenir.
 *
 * Beş söz:
 *   1. Elit'te "DavetKart ile hazırlandı" imzası yok (K102): misafir sayfasında
 *      BÜTÜN şablonlarda ve sahibin editör önizlemesinde.
 *   2. Bu cihazdan yanıt vermiş misafir formu "güncelle" olarak görür (K101).
 *   3. Gizlilik metninin saklama süreleri kodla aynı (K97 · K98).
 *   4. Dil seçici yalnızca tr/en sunuyor; eski kayıtlı tercih tr açılıyor (FE-01, K220).
 *   5. Hata veren rota markalı RouteError çiziyor; chunk hatası bir kez yeniliyor (FE-02, K222 · K223).
 *
 * Ayrıntılı açıklama: docs/rehber/scripts/verify-render.md
 */
import './render-env';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { prerenderToNodeStream } from 'react-dom/static';
import { MemoryRouter, RouterProvider, createMemoryRouter, matchRoutes, type RouteObject } from 'react-router-dom';
import { TemplateRenderer } from '../src/components/templates/TemplateRenderer';
import { DeviceSimulator } from '../src/components/preview/DeviceSimulator';
import { RSVPForm } from '../src/components/templates/shared/RSVPForm';
import PrivacyPage from '../src/pages/legal/PrivacyPage';
import CookiesPage from '../src/pages/legal/CookiesPage';
import { BACKUP_PURGE_DAYS, GUEST_DATA_MONTHS_AFTER_EVENT, UNDATED_GUEST_DATA_MONTHS } from '../src/legal/retention';
import { STATIC_FAQS } from '../src/pages/PricingPage';
import { getSectionTheme } from '../src/components/templates/shared/palette';
import { DUGUN_FLAVOR } from '../src/components/templates/dugun/flavors';
import { useInvitationStore } from '../src/stores/useInvitationStore';
import { useRsvpStore } from '../src/stores/useRsvpStore';
import { RSVP_RECEIPT_KEY_PREFIX, rsvpReceipts } from '../src/services/rsvpReceipts';
import { INITIAL_INVITATION } from '../src/data';
import { TEMPLATE_PRESETS } from '../src/templateCatalog';
import { DEFAULT_PRESET_ID, PRESET_PRIMARY_COLORS } from '../src/templatePresetColors';
import { LAZY_PRESETS } from '../src/components/templates/lazyPresets';
import i18n, { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, getLanguageDirection } from '../src/i18n';
import { LanguageSwitcher } from '../src/components/LanguageSwitcher';
import { routes } from '../src/routes';
import NotFoundPage from '../src/pages/NotFoundPage';
import { PRELOAD_RELOAD_KEY, PRELOAD_RELOAD_WINDOW_MS, recoverFromPreloadError } from '../src/utils/preloadRecovery';
import type { Invitation, InvitationRecord } from '../src/types';
import { Toaster, withToast, type ToastItem } from '../src/components/ui/Toast';

const SIGNATURE = 'DavetKart ile hazırlandı';

let failures = 0;

function check(condition: boolean, message: string, detail: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${message} — ${detail}`);
  }
}

/** Kısa liste: hata mesajında ilk birkaç şablon yeter. */
const sample = (ids: string[]) => `${ids.length} şablon: ${ids.slice(0, 5).join(', ')}${ids.length > 5 ? '…' : ''}`;

/**
 * Misafir sayfası. Konsept ve 3B şablonlar `React.lazy` ile yüklenir; `prerender`
 * Suspense'in çözülmesini beklediği için tembel şablonlar da tam çizilir.
 */
async function guestPage(presetId: string, patch: Partial<Invitation>): Promise<string> {
  const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
  const invitation: Invitation = {
    ...INITIAL_INVITATION,
    imageTheme: presetId,
    phoneBackground: presetId,
    categoryId: preset?.categories[0] ?? INITIAL_INVITATION.categoryId,
    ...patch,
  };
  const { prelude } = await prerenderToNodeStream(
    <TemplateRenderer templateId={presetId} invitation={invitation} mode="live" />,
  );
  let html = '';
  for await (const chunk of prelude) html += String(chunk);
  return html;
}

function record(showBranding: boolean): InvitationRecord {
  return {
    id: 'REC-R',
    status: 'published',
    updatedAt: '2026-10-02T10:00:00Z',
    publishedAt: '2026-10-02T10:00:00Z',
    releasableUntil: '2026-10-05T10:00:00Z',
    invitation: { ...INITIAL_INVITATION, names: 'Deniz & Can', showBranding },
  };
}

/** Kompozisyonun alt bilgisi (imzanın tek yeri). */
function footerOf(html: string): string {
  return html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/)?.[1] ?? '';
}

/**
 * 🔴 Sunucu çiziminde zustand GÜNCEL durumu değil BAŞLANGIÇ durumunu okur
 * (`useSyncExternalStore`'un sunucu anlık görüntüsü = `getInitialState()`).
 * Store'a bağlı bir bileşen çizilmeden önce güncel durum o nesneye kopyalanır.
 * Bileşen aynı seçicilerle okur; değişen yalnızca okunan nesne.
 */
function syncServerSnapshot(): void {
  Object.assign(useInvitationStore.getInitialState(), useInvitationStore.getState());
  Object.assign(useRsvpStore.getInitialState(), useRsvpStore.getState());
}

function editorPreview(): string {
  syncServerSnapshot();
  return renderToStaticMarkup(<DeviceSimulator simulatorRef={React.createRef() as React.RefObject<HTMLDivElement>} />);
}

// ——— 1. İmza ——————————————————————————————————————————————————————————

async function signatureOnTheGuestPage(): Promise<void> {
  console.log('\nİmza: misafir sayfası (bütün şablonlar)');

  const missing: string[] = [];
  const leaked: string[] = [];
  const missingWithoutDecision: string[] = [];

  for (const { id } of TEMPLATE_PRESETS) {
    if (!(await guestPage(id, { showBranding: true })).includes(SIGNATURE)) missing.push(id);
    if ((await guestPage(id, { showBranding: false })).includes(SIGNATURE)) leaked.push(id);
    if (!(await guestPage(id, {})).includes(SIGNATURE)) missingWithoutDecision.push(id);
  }

  const total = TEMPLATE_PRESETS.length;
  check(leaked.length === 0, `Elit kararı (false) ${total} şablonun hepsinde imzayı kaldırıyor`, sample(leaked));
  check(missing.length === 0, `true iken ${total} şablonun hepsinde imza var`, sample(missing));
  check(
    missingWithoutDecision.length === 0,
    `karar yoksa (eski yanıt, taslak) ${total} şablonun hepsinde imza var`,
    sample(missingWithoutDecision),
  );
}

// ——— 1b. Tembel şablonlar: kayıt ve veri ——————————————————————————————————————

/** Konsept şablonları (A) ve tembel yüklenen yeni şablonlar. */
const LAZY_IDS = Object.keys(LAZY_PRESETS);

/** B-E5: misafir sayfasının katalogsuz renk/kimlik modülü katalogla aynı (`npm run gen:preset-colors`). */
function presetColorsMatchTheCatalog(): void {
  console.log('\nŞablon renkleri (B-E5):');
  const drift = TEMPLATE_PRESETS.filter((p) => PRESET_PRIMARY_COLORS[p.id] !== p.primaryColor).map((p) => p.id);
  const extra = Object.keys(PRESET_PRIMARY_COLORS).length - TEMPLATE_PRESETS.length;
  check(drift.length === 0 && extra === 0, `${TEMPLATE_PRESETS.length} şablonun rengi katalogla aynı`, `ayrışan: ${drift.slice(0, 5).join(', ')} · fazla: ${extra} → npm run gen:preset-colors`);
  check(DEFAULT_PRESET_ID === TEMPLATE_PRESETS[0].id, 'varsayılan şablon kataloğun ilki', DEFAULT_PRESET_ID);
}

async function lazyPresetsRender(): Promise<void> {
  console.log(`\nTembel şablonlar: kayıt ve veri (${LAZY_IDS.length} şablon)`);

  const unlisted = LAZY_IDS.filter((id) => !TEMPLATE_PRESETS.some((p) => p.id === id));
  check(unlisted.length === 0, 'hepsi data.ts kataloğunda', sample(unlisted));

  const full: Partial<Invitation> = {
    names: 'Deniz & Can',
    date: '2027-06-12T19:00',
    venue: 'Kuzguncuk Bahçe',
    showGallery: true,
    galleryImages: [{ id: null, url: '/x/1.webp' }, { id: null, url: '/x/2.webp' }],
  };
  const noNames: string[] = [];
  const noVenue: string[] = [];
  for (const id of LAZY_IDS) {
    const html = await guestPage(id, full);
    if (!html.includes('Deniz')) noNames.push(id);
    if (!html.includes('Kuzguncuk Bahçe')) noVenue.push(id);
  }
  check(noNames.length === 0, 'dolu veride adlar çiziliyor', sample(noNames));
  check(noVenue.length === 0, 'dolu veride mekân çiziliyor', sample(noVenue));

  // Boş veri: fotoğraf yok, program yok, ad/tarih/mekân yok — hiçbiri kırılmamalı.
  const empty: Partial<Invitation> = {
    names: '', date: '', venue: '', showGallery: true, galleryImages: [], timelineEvents: [], showGift: true,
  };
  const broken: string[] = [];
  for (const id of LAZY_IDS) {
    try {
      const html = await guestPage(id, empty);
      if (html.length < 500) broken.push(id);
    } catch (e) {
      broken.push(`${id} (${String(e).slice(0, 80)})`);
    }
  }
  check(broken.length === 0, 'boş veride (fotoğraf/program/ad yok) çizim kırılmıyor', sample(broken));
}

function signatureInTheEditorPreview(): void {
  console.log('\nİmza: sahibin editör önizlemesi');

  useInvitationStore.getState().loadRecord(record(false));
  const elit = editorPreview();
  check(!elit.includes(SIGNATURE), 'Elit kaydı yüklenince önizlemede imza yok', 'imza çizildi');
  check(footerOf(elit).includes('Deniz'), 'alt bilgide adlar kalıyor', `alt bilgi: ${footerOf(elit)}`);

  useInvitationStore.getState().loadRecord(record(true));
  check(editorPreview().includes(SIGNATURE), 'Gold kaydında önizlemede imza var', 'imza yok');

  useInvitationStore.getState().resetInvitation();
  check(editorPreview().includes(SIGNATURE), 'yeni taslakta önizlemede imza var', 'imza yok');
}

// ——— 2. LCV: kendi yanıtı ———————————————————————————————————————————————

const RSVP_INVITATION: Invitation = { ...INITIAL_INVITATION, showRSVP: true, showEnvelope: false };

function inlineForm(): string {
  syncServerSnapshot();
  return renderToStaticMarkup(
    <RSVPForm invitation={RSVP_INVITATION} theme={getSectionTheme(RSVP_INVITATION.palette)} flavor={DUGUN_FLAVOR} />,
  );
}

/** Tembel bölümler dahil bütün sayfa: `prerender` Suspense'in çözülmesini bekler. */
async function fullGuestPage(): Promise<string> {
  syncServerSnapshot();
  const { prelude } = await prerenderToNodeStream(
    <TemplateRenderer templateId="dugun-sade" invitation={RSVP_INVITATION} mode="live" />,
  );
  let html = '';
  for await (const chunk of prelude) html += String(chunk);
  return html;
}

async function ownReplyForm(): Promise<void> {
  console.log('\nLCV: kendi yanıtını güncelleme (K101)');

  useRsvpStore.getState().setInvitationScope('INV-R');
  const fresh = inlineForm();
  check(
    fresh.includes('Katılımımı Bildir') && !fresh.includes('daha önce yanıt verdiniz'),
    'ilk ziyarette form yeni yanıt gönderiyor',
    'güncelleme metni çizildi',
  );

  // Gönderimden sonra kod tarayıcıda kalır; sayfa yeniden açılınca geri okunur.
  rsvpReceipts.remember('INV-R', { rsvpId: 'R1', editCode: 'kod-1' });
  useRsvpStore.getState().setInvitationScope(null);
  useRsvpStore.getState().setInvitationScope('INV-R');

  const again = inlineForm();
  check(
    again.includes('Yanıtımı Güncelle') && again.includes('Bu cihazdan daha önce yanıt verdiniz'),
    'aynı cihazdan dönen misafir "Yanıtımı Güncelle" ve açıklamayı görüyor',
    'yeni yanıt formu çizildi',
  );
  check((await fullGuestPage()).includes('Yanıtımı Güncelle'), 'misafir sayfasının tamamında form güncelleme hâlinde', 'yok');

  useRsvpStore.getState().setInvitationScope('INV-S');
  check(inlineForm().includes('Katılımımı Bildir'), 'kod davetiyeye özgü: başka davetiyede yeni yanıt', 'güncelleme çizildi');

  useRsvpStore.getState().setInvitationScope(null);
}

/** src altında verilen kalıbı içeren modüller (statik içe aktarma grafiğinin yaklaşığı). */
function sourcesMatching(pattern: RegExp): string[] {
  return (fs.readdirSync('src', { recursive: true }) as string[])
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .filter((file) => pattern.test(fs.readFileSync(path.join('src', file), 'utf8')));
}

/** K189 (FE-51, D1): misafir yüklemesi kapalı — arayüzde dosya alanı ve ölü yükleme kodu yok. */
async function guestUploadsAreOff(): Promise<void> {
  console.log('\nLCV: misafir yüklemesi kapalı (K189)');

  useRsvpStore.getState().setInvitationScope('INV-U');
  check(!inlineForm().includes('type="file"'), 'satır içi LCV formu dosya alanı çizmiyor', 'dosya alanı çizildi');
  check(!(await fullGuestPage()).includes('type="file"'), 'misafir sayfasının tamamında dosya alanı yok', 'dosya alanı var');
  useRsvpStore.getState().setInvitationScope(null);

  const leftovers = sourcesMatching(/RsvpModal|uploadAsGuest|onRsvpClick/);
  check(
    leftovers.length === 0 && !fs.existsSync('src/components/preview/RsvpModal.tsx'),
    'RsvpModal, uploadAsGuest ve onRsvpClick paket grafiğinde yok',
    leftovers.join(', ') || 'RsvpModal.tsx duruyor',
  );
}

// ——— 3. Gizlilik metni ————————————————————————————————————————————————————

/**
 * Saklama süreleri bölümü. Başlık içindekiler listesinde de geçtiği için
 * SON geçişinden bir sonraki bölümün başlığına kadar alınır.
 */
function privacySection(title: string, next: string): string {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <PrivacyPage />
    </MemoryRouter>,
  );
  const start = html.lastIndexOf(title);
  return html.slice(start, html.indexOf(next, start));
}

/**
 * FE-52 (19.19, K232): backend'de yayın süresi ve uzatma yok; SSS bunları vaat etmez,
 * misafir verisi süresini sabitten söyler.
 */
function pricingFaq(): void {
  console.log('\nFiyat sayfası SSS (FE-52):');
  const promises = STATIC_FAQS.filter(f => /yayın süre|uzat/i.test(`${f.q} ${f.a}`)).map(f => f.q);
  check(promises.length === 0, 'yayın süresi ya da ücretli uzatma vaadi yok (K232)', `geçen soru: ${promises.join(' | ')}`);
  check(
    STATIC_FAQS.some(f => f.a.includes(`etkinlik tarihinden ${GUEST_DATA_MONTHS_AFTER_EVENT} ay sonra silinir`)),
    `misafir verisi ${GUEST_DATA_MONTHS_AFTER_EVENT} ay, sabitle aynı (K98)`,
    'cümle yok ya da sabitten ayrıştı',
  );
  check(
    STATIC_FAQS.some(f => f.a.includes(`oluşturulduğu) tarihten ${UNDATED_GUEST_DATA_MONTHS} ay sonra`)),
    `SSS tarihsiz davetiye ${UNDATED_GUEST_DATA_MONTHS} ay, sabitle aynı (K257, B-E8)`,
    'kural yok ya da sabitten ayrıştı',
  );
}

/** B-H5: tarayıcıya yazılan LCV düzenleme kodu Çerez Politikası'nın zorunlu listesinde adıyla geçmeli. */
async function cookieStorageList(): Promise<void> {
  console.log('\nÇerez Politikası: yerel depolama listesi (B-H5)');
  await i18n.changeLanguage(DEFAULT_LANGUAGE); // satır t() ile çizilir (verify:i18n tabanı artmasın)
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <CookiesPage />
    </MemoryRouter>,
  );
  check(
    html.includes(RSVP_RECEIPT_KEY_PREFIX) && html.includes('LCV yanıt düzenleme kodu'),
    `LCV düzenleme kodu (${RSVP_RECEIPT_KEY_PREFIX}*) listede`,
    'satır yok ya da anahtar adı koddan ayrıştı',
  );
}

/** SEC-11 (19.18, K231): sayfadaki listeden bağımsız yazılı; biri sayfadan silinirse kırmızı. */
const DATA_PROCESSORS = ['Amazon Web Services', 'Amazon CloudFront', 'Amazon SES', 'Shopier', 'Natro', 'Sentry', 'Google Gemini'];

function privacyRetention(): void {
  console.log('\nGizlilik metni: saklama süreleri (K97 · K98)');

  const text = privacySection('Saklama Süreleri', 'Veri Güvenliği Önlemleri');
  check(text.length > 0, 'bölüm bulundu', 'başlık yok');
  check(text.includes('canlı sistemden derhal silinir'), 'hesap silinince canlı veriler hemen silinir (K97)', 'ifade yok');
  check(
    text.includes(`yedeklerden de en geç ${BACKUP_PURGE_DAYS} gün içinde`),
    `yedeklerden en geç ${BACKUP_PURGE_DAYS} gün, sabitle aynı (K231)`,
    'yedek cümlesi yok ya da süre sabitten ayrıştı',
  );
  check(
    text.includes(`oluşturulduğu tarihten ${UNDATED_GUEST_DATA_MONTHS} ay sonra silinir`),
    `tarihsiz davetiyede misafir verisi ${UNDATED_GUEST_DATA_MONTHS} ay, sabitle aynı (K257)`,
    'kural yok',
  );
  check(text.includes('30 gün'), 'silinen davetiye 30 gün (K98)', 'süre yok');
  check(
    text.includes(`etkinlik tarihinden ${GUEST_DATA_MONTHS_AFTER_EVENT} ay`),
    `misafir verisi etkinlikten ${GUEST_DATA_MONTHS_AFTER_EVENT} ay, sabitle aynı (K98)`,
    'süre yok ya da sabitten ayrıştı',
  );
  check(text.includes('12 ay'), 'iletişim mesajı 12 ay (K98)', 'süre yok');
  check(
    !text.includes('zamanaşımı') && !text.includes('yayın bitiminden'),
    'eski, kodla çelişen ifadeler yok',
    '"zamanaşımı" ya da "yayın bitiminden" geri geldi',
  );

  pricingFaq();

  const processors = privacySection('Hizmet Aldığımız Veri İşleyenler', 'Saklama Süreleri');
  const missing = DATA_PROCESSORS.filter(name => !processors.includes(name));
  check(
    processors.length > 0 && missing.length === 0,
    `veri işleyenler adıyla: ${DATA_PROCESSORS.length} sağlayıcı (K231)`,
    `eksik: ${missing.join(', ') || 'bölüm yok'}`,
  );
}

/**
 * FE-01 (Faz 19.20): seçici yalnızca çevrilmiş dilleri çiziyor; on dilli
 * dönemden kalan bir tercih (`de`) sayfayı varsayılan dilde açıyor.
 */
async function languageScope(): Promise<void> {
  console.log('\nDil kapsamı (FE-01):');
  const codes = SUPPORTED_LANGUAGES.map(l => l.code).join(',');
  check(codes === 'tr,en', 'sunulan diller tr ve en', `liste: ${codes}`);

  const html = renderToStaticMarkup(<LanguageSwitcher variant="inline" />);
  const buttons = (html.match(/<button/g) ?? []).length;
  check(buttons === 2, 'seçici iki dil çiziyor', `${buttons} düğme`);
  check(!/>(es|fr|de|zh|hi|ar|ru|pt)</.test(html), 'gizli diller seçicide yok', html.slice(0, 160));

  localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');
  await i18n.changeLanguage();
  check(i18n.resolvedLanguage === DEFAULT_LANGUAGE, "kayıtlı 'de' tercihiyle sayfa tr açılıyor", `dil: ${i18n.resolvedLanguage}`);
  check(localStorage.getItem(LANGUAGE_STORAGE_KEY) === DEFAULT_LANGUAGE, 'eski tercih tr ile değiştirildi', `kayıt: ${localStorage.getItem(LANGUAGE_STORAGE_KEY)}`);

  localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
  await i18n.changeLanguage();
  check(i18n.resolvedLanguage === 'en', 'kayıtlı en tercihi korunuyor', `dil: ${i18n.resolvedLanguage}`);
  check(getLanguageDirection('ar') === 'ltr', 'gizli Arapça sayfayı RTL çevirmiyor', 'rtl');
}

/** Gerçek rota tablosu; `path`'teki rotaya hata fırlatan bir yükleyici takılır. */
function withFailingRoute(list: RouteObject[], path: string, error: Error): RouteObject[] {
  return list.map(route => {
    if (route.path === path) {
      return { ...route, loader: () => { throw error; } } as RouteObject;
    }
    return route.children ? ({ ...route, children: withFailingRoute(route.children, path, error) } as RouteObject) : route;
  });
}

async function failingRoute(path: string, url: string, error: Error): Promise<string> {
  const router = createMemoryRouter(withFailingRoute(routes, path, error), { initialEntries: [url] });
  await new Promise<void>(resolve => {
    if (router.state.initialized) return resolve();
    const stop = router.subscribe(state => {
      if (state.initialized) {
        stop();
        resolve();
      }
    });
  });
  const html = renderToStaticMarkup(<RouterProvider router={router} />);
  router.dispose();
  return html;
}

/**
 * FE-02 (Faz 19.21): hata veren rota ham "Unexpected Application Error!" değil
 * markalı `RouteError` çiziyor; editör ve misafir sayfası kendi sınırında.
 */
async function routeErrors(): Promise<void> {
  console.log('\nHata sınırı (FE-02):');
  await i18n.changeLanguage('tr');
  const boom = new Error('fe02-boom');
  const RAW = 'Unexpected Application Error';

  const page = await failingRoute('/pricing', '/pricing', boom);
  check(page.includes('data-route-error="app"') && !page.includes(RAW), 'sayfa hatası RouteError çiziyor', page.slice(0, 160));
  check(page.includes('<footer'), 'sayfa hatasında başlık/alt bilgi kalıyor', 'alt bilgi yok');
  check(page.includes('Bir şeyler ters gitti') && page.includes('href="/"'), 'Türkçe metin ve ana sayfa bağlantısı', 'metin/bağlantı yok');
  check(!page.includes('fe02-boom'), 'hata ayrıntısı kullanıcıya gösterilmiyor', 'ayrıntı sızdı');

  const editor = await failingRoute('/create/:id?', '/create', boom);
  check(editor.includes('data-route-error="editor"'), 'editör kendi sınırında', editor.match(/data-route-error="\w+"/)?.[0] ?? 'sınır yok');
  check(editor.includes('data-save-note="local"'), 'oturumsuz taslak için "yenilerseniz kaybolur" notu', 'not yok');

  // Faz 28 (K322): Tasarım Stüdyosu da editör sınırında.
  const studio = await failingRoute('/studio/:id?', '/studio', boom);
  check(studio.includes('data-route-error="editor"'), 'stüdyo editör sınırında', studio.match(/data-route-error="\w+"/)?.[0] ?? 'sınır yok');

  const guest = await failingRoute('/invite/:id', '/invite/abc', boom);
  check(guest.includes('data-route-error="guest"'), 'misafir sayfası kendi sınırında', guest.match(/data-route-error="\w+"/)?.[0] ?? 'sınır yok');
  check(!guest.includes('href="/"'), 'misafire site bağlantısı yok', 'ana sayfa bağlantısı var');

  const chunk = await failingRoute('/pricing', '/pricing', new TypeError('Failed to fetch dynamically imported module: /assets/PricingPage-x1.js'));
  check(chunk.includes('Sayfa yüklenemedi'), 'yüklenemeyen chunk için ayrı metin', 'genel metin çizildi');
}

/** Faz 20 (FE-06): bilinmeyen adres açıklamasız ana sayfaya atılmaz. */
async function notFound(): Promise<void> {
  console.log('\nBilinmeyen adres (Faz 20, FE-06):');
  await i18n.changeLanguage('tr');
  const match = matchRoutes(routes, '/olmayan-sayfa') ?? [];
  const last = match[match.length - 1]?.route;
  check(last?.path === '*' && match.length > 1, 'bilinmeyen adres ortak düzen içindeki 404 rotasına düşüyor', match.map(m => m.route.path ?? '(düzen)').join(' > '));
  check(matchRoutes(routes, '/pricing')?.at(-1)?.route.path === '/pricing', 'bilinen adres 404 değil', 'pricing 404 oldu');
  const html = renderToStaticMarkup(<MemoryRouter><NotFoundPage /></MemoryRouter>);
  check(html.includes('Sayfa bulunamadı') && html.includes('href="/"'), '404: Türkçe başlık ve ana sayfa bağlantısı', html.slice(0, 160));
}

/** FE-02 (K223): `vite:preloadError` → tek seferlik yenileme, döngü yok. */
function preloadRecovery(): void {
  console.log('\nChunk yenilemesi (FE-02):');
  const kept = new Map<string, string>();
  const storage = { getItem: (k: string) => kept.get(k) ?? null, setItem: (k: string, v: string) => void kept.set(k, v) };
  let clock = 1_000_000;
  let reloads = 0;
  let prevented = 0;
  const deps = { storage, reload: () => void (reloads += 1), now: () => clock };
  const event = { preventDefault: () => void (prevented += 1) };

  check(recoverFromPreloadError(event, deps) && reloads === 1 && prevented === 1, 'ilk hata: bir kez yenileniyor', `yenileme ${reloads}`);
  check(kept.get(PRELOAD_RELOAD_KEY) === String(clock), 'bayrak zaman damgasıyla yazıldı', `bayrak ${kept.get(PRELOAD_RELOAD_KEY)}`);
  clock += 5_000;
  check(!recoverFromPreloadError(event, deps) && reloads === 1 && prevented === 1, 'yenileme de başarısız: ikinci kez yenilenmiyor (RouteError)', `yenileme ${reloads}`);
  clock += PRELOAD_RELOAD_WINDOW_MS;
  check(recoverFromPreloadError(event, deps) && reloads === 2, 'süre geçince yeni hata yine bir kez yenileniyor', `yenileme ${reloads}`);
  check(!recoverFromPreloadError(event, { ...deps, storage: null }) && reloads === 2, 'depolama yoksa körlemesine yenileme yok', `yenileme ${reloads}`);
}

/** FE-54: toast live regions are in the markup before any message (screen readers ignore late regions). */
function toastRegions(): void {
  console.log('\nBildirim bölgeleri (FE-54):');
  const html = renderToStaticMarkup(<Toaster />);
  check(/role="status"[^>]*aria-live="polite"/.test(html), 'başarı/bilgi: role="status" aria-live="polite" baştan var', html.slice(0, 200));
  check(/role="alert"[^>]*aria-live="assertive"/.test(html), 'hata: role="alert" aria-live="assertive" baştan var', html.slice(0, 200));

  // Faz 20 (FE-57): aynı bildirim yığılmaz, en yenisi sona geçer; farklı metin ya da ton ayrı kalır.
  const item = (id: number, message: string, type: ToastItem['type'] = 'error'): ToastItem => ({ id, message, type });
  let list: ToastItem[] = [];
  for (const next of [item(1, 'Parola yanlış'), item(2, 'Bağlantı yok'), item(3, 'Parola yanlış'), item(4, 'Parola yanlış', 'info')]) {
    list = withToast(list, next);
  }
  check(
    list.map(t => t.id).join(',') === '2,3,4',
    'aynı metin ve ton yığılmıyor, en yenisi kalıyor; farklı ton ayrı',
    list.map(t => `${t.id}:${t.type}:${t.message}`).join(' | '),
  );
}

async function main(): Promise<void> {
  await signatureOnTheGuestPage();
  await lazyPresetsRender();
  presetColorsMatchTheCatalog();
  signatureInTheEditorPreview();
  await ownReplyForm();
  await guestUploadsAreOff();
  privacyRetention();
  await cookieStorageList();
  await languageScope();
  await routeErrors();
  await notFound();
  preloadRecovery();
  toastRegions();

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Ekrana çizilen doğru: Elit imzasız, dönen misafir yanıtını güncelliyor, saklama süreleri kodla aynı, dil seçici yalnızca tr/en, hata veren rota RouteError çiziyor.');
}

void main();
