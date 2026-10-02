/**
 * Bileşen çizim denetimi — `npm run verify:render` (Faz 10, FE 10.23)
 *
 * Öbür doğrulama betikleri store'ları ve servisleri sınar; bu betik ekrana ne
 * ÇİZİLDİĞİNİ sınar. Gerçek bileşenler `react-dom/server` ile HTML'e çizilir:
 * tarayıcı yok, efektler koşmaz, ilk çizimde görünen metin denetlenir.
 *
 * Üç söz:
 *   1. Elit'te "DavetKart ile hazırlandı" imzası yok (K102): misafir sayfasında
 *      BÜTÜN şablonlarda ve sahibin editör önizlemesinde.
 *   2. Bu cihazdan yanıt vermiş misafir formu "güncelle" olarak görür (K101).
 *   3. Gizlilik metninin saklama süreleri kodla aynı (K97 · K98).
 *
 * Ayrıntılı açıklama: docs/rehber/scripts/verify-render.md
 */
import './render-env';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { prerenderToNodeStream } from 'react-dom/static';
import { MemoryRouter } from 'react-router-dom';
import { TemplateRenderer } from '../src/components/templates/TemplateRenderer';
import { DeviceSimulator } from '../src/components/preview/DeviceSimulator';
import { RsvpModal } from '../src/components/preview/RsvpModal';
import { RSVPForm } from '../src/components/templates/shared/RSVPForm';
import PrivacyPage from '../src/pages/legal/PrivacyPage';
import { getSectionTheme } from '../src/components/templates/shared/palette';
import { DUGUN_FLAVOR } from '../src/components/templates/dugun/flavors';
import { useInvitationStore } from '../src/stores/useInvitationStore';
import { useRsvpStore } from '../src/stores/useRsvpStore';
import { rsvpReceipts } from '../src/services/rsvpReceipts';
import { INITIAL_INVITATION, TEMPLATE_PRESETS } from '../src/data';
import type { Invitation, InvitationRecord } from '../src/types';

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

function guestPage(presetId: string, patch: Partial<Invitation>): string {
  const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
  const invitation: Invitation = {
    ...INITIAL_INVITATION,
    imageTheme: presetId,
    phoneBackground: presetId,
    categoryId: preset?.categories[0] ?? INITIAL_INVITATION.categoryId,
    ...patch,
  };
  return renderToStaticMarkup(
    <TemplateRenderer templateId={presetId} invitation={invitation} onRsvpClick={() => {}} mode="live" />,
  );
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

function signatureOnTheGuestPage(): void {
  console.log('\nİmza: misafir sayfası (bütün şablonlar)');

  const missing: string[] = [];
  const leaked: string[] = [];
  const missingWithoutDecision: string[] = [];

  for (const { id } of TEMPLATE_PRESETS) {
    if (!guestPage(id, { showBranding: true }).includes(SIGNATURE)) missing.push(id);
    if (guestPage(id, { showBranding: false }).includes(SIGNATURE)) leaked.push(id);
    if (!guestPage(id, {}).includes(SIGNATURE)) missingWithoutDecision.push(id);
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

function rsvpModal(): string {
  syncServerSnapshot();
  return renderToStaticMarkup(<RsvpModal />);
}

/** Tembel bölümler dahil bütün sayfa: `prerender` Suspense'in çözülmesini bekler. */
async function fullGuestPage(): Promise<string> {
  syncServerSnapshot();
  const { prelude } = await prerenderToNodeStream(
    <TemplateRenderer templateId="dugun-sade" invitation={RSVP_INVITATION} onRsvpClick={() => {}} mode="live" />,
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
  check(rsvpModal().includes('YANITI GÖNDER'), 'önizleme penceresi de yeni yanıt diyor', 'metin yok');

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
  check(rsvpModal().includes('YANITIMI GÜNCELLE'), 'önizleme penceresi de güncelle diyor', 'metin yok');
  check((await fullGuestPage()).includes('Yanıtımı Güncelle'), 'misafir sayfasının tamamında form güncelleme hâlinde', 'yok');

  useRsvpStore.getState().setInvitationScope('INV-S');
  check(inlineForm().includes('Katılımımı Bildir'), 'kod davetiyeye özgü: başka davetiyede yeni yanıt', 'güncelleme çizildi');

  useRsvpStore.getState().setInvitationScope(null);
}

// ——— 3. Gizlilik metni ————————————————————————————————————————————————————

/**
 * Saklama süreleri bölümü. Başlık içindekiler listesinde de geçtiği için
 * SON geçişinden bir sonraki bölümün başlığına kadar alınır.
 */
function retentionSection(): string {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <PrivacyPage />
    </MemoryRouter>,
  );
  const start = html.lastIndexOf('Saklama Süreleri');
  return html.slice(start, html.indexOf('Veri Güvenliği Önlemleri', start));
}

function privacyRetention(): void {
  console.log('\nGizlilik metni: saklama süreleri (K97 · K98)');

  const text = retentionSection();
  check(text.length > 0, 'bölüm bulundu', 'başlık yok');
  check(text.includes('derhal silinir'), 'hesap silinince veriler hemen silinir (K97)', 'ifade yok');
  check(text.includes('30 gün'), 'silinen davetiye 30 gün (K98)', 'süre yok');
  check(text.includes('etkinlik tarihinden 6 ay'), 'misafir verisi etkinlikten 6 ay (K98)', 'süre yok');
  check(text.includes('12 ay'), 'iletişim mesajı 12 ay (K98)', 'süre yok');
  check(
    !text.includes('zamanaşımı') && !text.includes('yayın bitiminden'),
    'eski, kodla çelişen ifadeler yok',
    '"zamanaşımı" ya da "yayın bitiminden" geri geldi',
  );
}

async function main(): Promise<void> {
  signatureOnTheGuestPage();
  signatureInTheEditorPreview();
  await ownReplyForm();
  privacyRetention();

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Ekrana çizilen doğru: Elit imzasız, dönen misafir yanıtını güncelliyor, saklama süreleri kodla aynı.');
}

void main();
