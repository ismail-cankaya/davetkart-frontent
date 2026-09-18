/**
 * Davetiye içeriği denetimi — `npm run verify:content`
 *
 * 🔴 Buradaki hataların hiçbiri derleme hatası vermez ve çoğu ekranda "çalışıyor"
 * görünür: sahte bir varsayılan tarih formda sorunsuz durur, ta ki kullanıcı ona
 * hiç dokunmadan kaydedip misafirine gönderene kadar. Bu yüzden yeni
 * davetiyenin başlangıç durumu, sunucuya giden ilk gövde, önizlemenin boş
 * alanları nasıl ele aldığı ve konum bağlantılarının biçimi açıkça sınanır.
 *
 * Gerçek modüller kullanılır; yalnızca axios'un taşıma katmanı sahte bir
 * sunucuyla değiştirilir.
 */
import { api } from '../src/services/api';
import { useAuthStore } from '../src/stores/useAuthStore';
import { useInvitationStore } from '../src/stores/useInvitationStore';
import { EVENT_CATEGORIES, INITIAL_INVITATION, SHOWCASE_CONTENT, upcomingShowcaseDate } from '../src/data';
import { displayNames, joinNames, splitNames } from '../src/utils/names';
import { displayText, formatDateStr } from '../src/components/templates/utils';
import { wallClockToInstant } from '../src/utils/eventTime';
import { createTimelineEvent, hasTimelineEventContent } from '../src/utils/timelineEvents';
import { withShowcaseContent } from '../src/utils/showcase';
import {
  buildDirectionsUrl,
  buildMapEmbedUrl,
  formatCoordinates,
  isHttpUrl,
  parseCoordinates,
  readMapLocation
} from '../src/utils/mapLocation';
import type { GeoPoint, Invitation, TimelineEvent } from '../src/types';

// ——— Yardımcılar ————————————————————————————————————————————————————————

let failures = 0;

function check(condition: boolean, message: string, detail: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${message} — ${detail}`);
  }
}

const isEmptyStep = (event: TimelineEvent) =>
  event.id === null && event.time === '' && event.title === '' && event.description === '';

const samePoint = (a: GeoPoint | null, b: GeoPoint | null) =>
  a !== null && b !== null && a.lat.toFixed(6) === b.lat.toFixed(6) && a.lng.toFixed(6) === b.lng.toFixed(6);

// ——— Sahte sunucu ———————————————————————————————————————————————————————

let lastBody: { invitation?: Invitation } | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(api.defaults as any).adapter = async (config: any) => {
  lastBody = typeof config.data === 'string' ? JSON.parse(config.data) : undefined;
  const invitation = lastBody?.invitation;

  return {
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    data: {
      data: {
        id: 'NEW-1',
        status: 'saved',
        updatedAt: '2026-09-17T10:00:00Z',
        invitation: {
          ...invitation,
          timelineEvents: (invitation?.timelineEvents ?? []).map((e, i) => ({ ...e, id: `srv-${i}` }))
        }
      }
    }
  };
};

// ——— Senaryolar ————————————————————————————————————————————————————————

function initialState(): void {
  console.log('\nYeni davetiyenin başlangıç durumu');

  check(INITIAL_INVITATION.names === '', 'isimler boş başlıyor', `names="${INITIAL_INVITATION.names}"`);
  check(INITIAL_INVITATION.date === '', 'tarih ve saat boş başlıyor', `date="${INITIAL_INVITATION.date}"`);
  check(INITIAL_INVITATION.venue === '', 'davet konumu boş başlıyor', `venue="${INITIAL_INVITATION.venue}"`);
  check(INITIAL_INVITATION.mapUrl === '', 'ulaşım bilgisi boş başlıyor', `mapUrl="${INITIAL_INVITATION.mapUrl}"`);

  const steps = INITIAL_INVITATION.timelineEvents;
  check(steps.length === 2, 'program akışında tam olarak iki adım var', `adım sayısı=${steps.length}`);
  check(steps.every(isEmptyStep), 'iki adımın saat, başlık ve açıklaması boş; kimliği null', JSON.stringify(steps));
  check(
    new Set(steps.map((e) => e.localKey)).size === steps.length,
    'başlangıç adımlarının yerel anahtarları benzersiz',
    steps.map((e) => e.localKey).join(', ')
  );

  const dugun = EVENT_CATEGORIES.find((c) => c.id === 'dugun');
  check(
    dugun?.nameLabels.join('|') === 'Gelin Adı|Damat Adı' &&
      dugun.namePlaceholders.join('|') === 'Gelin adını giriniz|Damat adını giriniz',
    'düğün: "Gelin Adı" / "Damat Adı" etiketleri ve yönlendirici placeholder\'lar',
    JSON.stringify(dugun)
  );
  check(
    EVENT_CATEGORIES.every((c) => c.namePlaceholders.every((p) => p.trim() !== '' && !/örn\.?/i.test(p))),
    'her kategorinin isim placeholder\'ı dolu ve örnek isim değil, talimat',
    JSON.stringify(EVENT_CATEGORIES.map((c) => c.namePlaceholders))
  );
}

async function firstSaveCarriesNoFakeContent(): Promise<void> {
  console.log('\nİlk kaydetme');

  useAuthStore.setState({
    user: { id: 'u1', firstName: 'Ayşe', lastName: 'Yılmaz', email: 'ayse@ornek.com' },
    token: 'token-u1',
    isAuthenticated: true
  });
  useInvitationStore.getState().resetInvitation();
  await useInvitationStore.getState().saveInvitation();

  const sent = lastBody?.invitation;
  check(
    sent?.names === '' && sent?.date === '' && sent?.venue === '' && sent?.mapUrl === '',
    'dokunulmamış taslak sunucuya örnek isim, tarih ya da konum göndermiyor',
    JSON.stringify({ names: sent?.names, date: sent?.date, venue: sent?.venue, mapUrl: sent?.mapUrl })
  );

  // Ağdaki gövde `localKey` taşımamalı; bu yüzden tip değil, çalışma anındaki anahtar sınanır.
  const sentSteps: Array<Record<string, unknown>> = (sent?.timelineEvents ?? []).map((e) => ({ ...e }));
  check(
    sentSteps.length === 2 &&
      sentSteps.every((e) => e.id === null && e.time === '' && e.title === '' && !('localKey' in e)),
    'boş adımlar kimliksiz gidiyor, yerel anahtar gövdeye sızmıyor',
    JSON.stringify(sentSteps)
  );

  useInvitationStore.getState().updateField('timelineEvents', []);
  await useInvitationStore.getState().saveInvitation();
  const afterDelete = lastBody?.invitation?.timelineEvents ?? null;
  check(
    Array.isArray(afterDelete) && afterDelete.length === 0 && useInvitationStore.getState().saveState === 'saved',
    'tüm adımlar silinince boş liste güvenle kaydediliyor ("hepsini sil")',
    `gövde=${JSON.stringify(afterDelete)}, saveState=${useInvitationStore.getState().saveState}`
  );

  useInvitationStore.getState().resetInvitation();
  check(
    useInvitationStore.getState().invitation.timelineEvents.length === 2 &&
      useInvitationStore.getState().invitation.timelineEvents.every(isEmptyStep),
    'sıfırlama yine iki boş adımla açıyor',
    JSON.stringify(useInvitationStore.getState().invitation.timelineEvents)
  );
}

function timelineSteps(): void {
  console.log('\nProgram adımları');

  const created = createTimelineEvent();
  check(isEmptyStep(created), 'eklenen adım boş doğuyor (örnek saat yok)', JSON.stringify(created));

  const keys = Array.from({ length: 2000 }, () => createTimelineEvent().localKey);
  const defaults = INITIAL_INVITATION.timelineEvents.map((e) => e.localKey);
  check(
    new Set(keys).size === keys.length && !keys.some((k) => defaults.includes(k)),
    'art arda üretilen 2000 anahtar benzersiz ve başlangıç anahtarlarıyla çakışmıyor',
    `benzersiz=${new Set(keys).size}`
  );

  const base: TimelineEvent = { id: null, localKey: 'k', time: '', title: '', description: '' };
  check(!hasTimelineEventContent(base), 'boş adım önizlemede gösterilmiyor', 'içerik var sayıldı');
  check(
    !hasTimelineEventContent({ ...base, title: '   ', description: '\n' }),
    'yalnızca boşluk içeren adım da boş sayılıyor',
    'içerik var sayıldı'
  );
  check(
    hasTimelineEventContent({ ...base, time: '18:00' }) &&
      hasTimelineEventContent({ ...base, title: 'Nikah' }) &&
      hasTimelineEventContent({ ...base, description: 'Bahçede' }),
    'tek bir alanı dolu adım önizlemede gösteriliyor',
    'dolu adım boş sayıldı'
  );
}

function emptyDatesAndVenues(): void {
  console.log('\nÖnizlemede boş tarih ve konum');

  const empties = [formatDateStr(''), formatDateStr('   '), formatDateStr(null), formatDateStr(undefined), formatDateStr('tarih-değil')];
  check(
    empties.every((value) => value === ''),
    'boş ya da geçersiz tarih hata vermeden boş metne dönüşüyor ("Invalid Date" yok)',
    JSON.stringify(empties)
  );

  const shown = formatDateStr('2026-11-14T19:00');
  check(shown.includes('2026') && shown.includes('19:00'), 'girilmiş tarih biçimleniyor', shown);

  check(wallClockToInstant('', 'Europe/Istanbul') === null, 'boş tarihte geri sayım hesaplanmıyor', 'bir an döndü');

  check(
    displayText(null) === '' && displayText(undefined) === '' && displayText('  ') === '' && displayText(' Çırağan ') === 'Çırağan',
    'konum metni boşsa kap çizilmiyor, doluysa kırpılıyor',
    JSON.stringify([displayText(null), displayText('  '), displayText(' Çırağan ')])
  );
}

function mapLocations(): void {
  console.log('\nUlaşım bilgisi (harita konumu)');

  const ciragan: GeoPoint = { lat: 41.0431, lng: 29.0154 };

  const accepted = ['41.0431, 29.0154', '41.0431 29.0154', '41.0431;29.0154', '41,0431; 29,0154', '41,0431 29,0154', ' 41.0431 ,29.0154 '];
  check(
    accepted.every((input) => samePoint(parseCoordinates(input), ciragan)),
    'yaygın koordinat yazımları çözülüyor (nokta ve Türkçe virgül ondalık)',
    JSON.stringify(accepted.map((input) => parseCoordinates(input)))
  );

  const rejected = ['', 'Çırağan Sarayı', '91, 29', '41, 181', '41,0431,29,0154', '41.0431'];
  check(
    rejected.every((input) => parseCoordinates(input) === null),
    'geçersiz ya da belirsiz koordinat reddediliyor',
    JSON.stringify(rejected.map((input) => parseCoordinates(input)))
  );

  const directions = buildDirectionsUrl(ciragan);
  check(
    directions === 'https://www.google.com/maps/dir/?api=1&destination=41.043100,29.015400',
    'seçilen nokta resmî Google Haritalar yol tarifi bağlantısına yazılıyor',
    directions
  );
  check(isHttpUrl(directions), 'üretilen bağlantı backend\'in url kuralından geçecek biçimde', directions);

  const withPlace = buildDirectionsUrl(ciragan, 'ChIJ-abc_123');
  check(
    withPlace === `${directions}&destination_place_id=ChIJ-abc_123` && samePoint(readMapLocation(withPlace), ciragan),
    'öneriden seçilen yerin kimliği bağlantıya ekleniyor, koordinat yine okunuyor',
    withPlace
  );
  check(samePoint(readMapLocation(directions), ciragan), 'kayıtlı bağlantıdan koordinat geri okunuyor', String(readMapLocation(directions)));
  check(
    samePoint(readMapLocation('https://www.google.com/maps/place/Ciragan/@41.0431,29.0154,17z/data=x'), ciragan),
    'paylaşım bağlantısındaki @enlem,boylam tanınıyor',
    'okunamadı'
  );
  check(
    readMapLocation('https://maps.app.goo.gl/abc123') === null && readMapLocation('javascript:alert(1)') === null,
    'koordinat taşımayan ya da http(s) olmayan bağlantıdan nokta uydurulmuyor',
    'bir nokta döndü'
  );
  check(formatCoordinates(ciragan) === '41.043100, 29.015400', 'koordinat alanda okunur biçimde gösteriliyor', formatCoordinates(ciragan));

  const blankMap = buildMapEmbedUrl(null);
  const pinnedMap = buildMapEmbedUrl(ciragan);
  check(
    blankMap.includes('bbox=') && !blankMap.includes('marker=') && pinnedMap.includes('marker=41.043100,29.015400'),
    'harita nokta yokken işaretsiz, nokta seçilince iğneli açılıyor',
    `${blankMap} | ${pinnedMap}`
  );
}

function homepageShowcase(): void {
  console.log('\nAna sayfa tanıtımı');

  const before = JSON.stringify(INITIAL_INVITATION);
  const showcase = withShowcaseContent(INITIAL_INVITATION);
  check(
    showcase.names === SHOWCASE_CONTENT.names && showcase.venue === SHOWCASE_CONTENT.venue && showcase.timelineEvents.length === 4,
    'boş taslakta tanıtım örnek içerikle dolu çiziliyor',
    JSON.stringify({ names: showcase.names, venue: showcase.venue, steps: showcase.timelineEvents.length })
  );
  check(JSON.stringify(INITIAL_INVITATION) === before, 'örnek içerik başlangıç durumuna yazılmıyor', 'INITIAL_INVITATION değişti');

  const draft: Invitation = { ...INITIAL_INVITATION, names: 'Ayşe & Ali' };
  check(withShowcaseContent(draft) === draft, 'kullanıcı bir alan doldurduysa taslak olduğu gibi gösteriliyor', 'örnek içerik bindirildi');

  const stepOnly: Invitation = {
    ...INITIAL_INVITATION,
    timelineEvents: [{ id: null, localKey: 'k', time: '', title: 'Kına', description: '' }]
  };
  check(withShowcaseContent(stepOnly) === stepOnly, 'yalnızca bir program adımı dolu taslak da olduğu gibi gösteriliyor', 'örnek içerik bindirildi');

  // Sabit bir tanıtım tarihi bir gün geçmişte kalır; geri sayım sıfırda donar.
  const showcaseAt = wallClockToInstant(SHOWCASE_CONTENT.date, 'Europe/Istanbul');
  const monthAhead = Date.now() + 30 * 24 * 60 * 60 * 1000;
  check(
    showcaseAt !== null && showcaseAt > monthAhead,
    'tanıtım tarihi geçmişte kalmıyor (en az bir ay sonrası)',
    SHOWCASE_CONTENT.date
  );
  check(
    upcomingShowcaseDate(new Date(2026, 10, 20, 23, 59)) === '2027-03-20T19:00',
    'tanıtım tarihi ay ve yıl geçişinde doğru biçimde kuruluyor',
    upcomingShowcaseDate(new Date(2026, 10, 20, 23, 59))
  );
}

function coupleNames(): void {
  console.log('\nİsim alanları');

  // Tek isim girildiğinde hangi alana ait olduğu kaybolmamalı.
  const secondOnly = joinNames('', 'Ali');
  check(
    splitNames(secondOnly)[0] === '' && splitNames(secondOnly)[1] === 'Ali',
    'yalnızca ikinci isim girilince isim kendi alanında kalıyor',
    JSON.stringify(splitNames(secondOnly))
  );
  check(joinNames('Ayşe', '') === 'Ayşe' && splitNames('Ayşe')[0] === 'Ayşe', 'yalnızca birinci isim düz metin olarak saklanıyor', joinNames('Ayşe', ''));
  check(joinNames('', '') === '' && joinNames('  ', ' ') === '', 'iki alan da boşken isim boş kalıyor', JSON.stringify(joinNames('  ', ' ')));
  check(
    joinNames(' Ayşe ', ' Ali ') === 'Ayşe & Ali' && splitNames('Ayşe & Ali').join('|') === 'Ayşe|Ali',
    'iki isim birleşip aynı biçimde ayrılıyor',
    joinNames(' Ayşe ', ' Ali ')
  );

  // Saklama işareti ekrana basılmaz.
  check(displayNames(secondOnly) === 'Ali', 'önizleme ayracı göstermiyor (& Ali → Ali)', displayNames(secondOnly));
  check(displayNames('Ayşe &') === 'Ayşe', 'sondaki ayraç da gösterilmiyor', displayNames('Ayşe &'));
  check(displayNames('Ayşe & Ali') === 'Ayşe & Ali', 'iki isimli metin olduğu gibi gösteriliyor', displayNames('Ayşe & Ali'));
  check(displayNames('&') === '' && displayNames('') === '', 'yalnızca ayraç kalan isim boş sayılıyor', JSON.stringify(displayNames('&')));
}

async function main(): Promise<void> {
  initialState();
  await firstSaveCarriesNoFakeContent();
  timelineSteps();
  emptyDatesAndVenues();
  mapLocations();
  homepageShowcase();
  coupleNames();

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Davetiye içeriği doğru: sahte varsayılan yok, boş alanlar önizlemede çizilmiyor, konum bağlantıları geçerli.');
}

void main();
