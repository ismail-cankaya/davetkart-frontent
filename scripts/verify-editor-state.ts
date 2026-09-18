/**
 * Editör ve oturum durumu denetimi — `npm run verify:state`
 *
 * 🔴 Bu hataların hiçbiri derleme hatası vermez ve hiçbiri tek bir istekte
 * görünmez: hepsi **sıralama** hatasıdır. Bir kaydetme yanıtının ne zaman
 * geldiği, kullanıcının o arada ne yaptığı ve hangi store'un sıfırlanmayı
 * unuttuğu. Elle denemede ancak yavaş bir ağda ve doğru tıklama sırasıyla
 * ortaya çıkarlar; bu yüzden burada açıkça sınanırlar.
 *
 * Gerçek store ve servis modülleri kullanılır; yalnızca axios'un taşıma
 * katmanı (adapter) sahte bir sunucuyla değiştirilir.
 */
import { api } from '../src/services/api';
import { invalidateConditionalCache } from '../src/services/conditionalGet';
import { useAuthStore } from '../src/stores/useAuthStore';
import { useCreateWizardStore } from '../src/stores/useCreateWizardStore';
import { useInvitationStore } from '../src/stores/useInvitationStore';
import { useRsvpStore } from '../src/stores/useRsvpStore';
import { signOut, startNewInvitation } from '../src/stores/sessionActions';
import { formatCalendarDay } from '../src/components/templates/utils';
import { INITIAL_INVITATION } from '../src/data';
import type { AuthUser, Invitation, InvitationRecord } from '../src/types';

// ——— Sahte sunucu ———————————————————————————————————————————————————————

interface RecordedRequest {
  method: string;
  url: string;
  body: { invitation?: Invitation; email?: string } | undefined;
  authorization: string | undefined;
}

type Reply = { status: number; data: unknown };
type Server = (req: RecordedRequest) => Reply | Promise<Reply>;

let requests: RecordedRequest[] = [];
let server: Server;
let failures = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  ✗ ${message}`);
}

function pass(message: string): void {
  console.log(`  ✓ ${message}`);
}

function check(condition: boolean, message: string, detail: string): void {
  if (condition) pass(message);
  else fail(`${message} — ${detail}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(api.defaults as any).adapter = async (config: any) => {
  const req: RecordedRequest = {
    method: String(config.method).toUpperCase(),
    url: String(config.url),
    body: typeof config.data === 'string' ? JSON.parse(config.data) : undefined,
    authorization: config.headers?.Authorization,
  };
  requests.push(req);

  const reply = await server(req);
  const response = { data: reply.data, status: reply.status, statusText: '', headers: {}, config };

  // Gerçek adapter'lar gibi durum kodunu `validateStatus` üzerinden geçir.
  const validate = config.validateStatus as ((status: number) => boolean) | undefined;
  if (validate && !validate(reply.status)) {
    const error = new Error(`Request failed with status code ${reply.status}`) as Error & {
      isAxiosError: boolean;
      response: unknown;
    };
    error.isAxiosError = true;
    error.response = response;
    throw error;
  }
  return response;
};

let serverIdSeq = 0;

/** Sunucu gibi kaydı geri yansıtır; kimliksiz program adımlarına kimlik verir. */
function echo(id: string, invitation: Invitation, status: 'saved' | 'published' = 'saved'): Reply {
  return {
    status: 200,
    data: {
      data: {
        id,
        status,
        updatedAt: new Date().toISOString(),
        invitation: {
          ...invitation,
          timelineEvents: invitation.timelineEvents.map((e) => ({ ...e, id: e.id ?? `srv-${++serverIdSeq}` })),
        },
      },
    },
  };
}

const USERS: Record<string, AuthUser> = {
  'ayse@ornek.com': { id: 'u1', firstName: 'Ayşe', lastName: 'Yılmaz', email: 'ayse@ornek.com' },
  'mehmet@ornek.com': { id: 'u2', firstName: 'Mehmet', lastName: 'Kaya', email: 'mehmet@ornek.com' },
};

const defaultServer: Server = (req) => {
  if (req.method === 'POST' && req.url === '/invitations') return echo('NEW-1', req.body!.invitation!);

  const own = req.url.match(/^\/invitations\/([^/]+)$/);
  if (req.method === 'PUT' && own) return echo(own[1], req.body!.invitation!);

  if (req.url === '/auth/login') {
    const user = USERS[req.body!.email!];
    return { status: 200, data: { user, token: `token-${user.id}` } };
  }
  return { status: 200, data: {} };
};

function record(id: string, patch: Partial<Invitation>): InvitationRecord {
  return {
    id,
    status: 'saved',
    updatedAt: '2026-09-01T10:00:00Z',
    invitation: {
      ...INITIAL_INVITATION,
      ...patch,
      timelineEvents: INITIAL_INVITATION.timelineEvents.map((e, i) => ({
        ...e,
        id: `${id}-tl-${i}`,
        localKey: `srv-${id}-tl-${i}`,
      })),
    },
  };
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
}

const tick = () => new Promise((r) => setTimeout(r, 5));

const invitationWrites = () =>
  requests.filter((r) => (r.method === 'POST' || r.method === 'PUT') && /^\/invitations(\/[^/]+)?$/.test(r.url));

function signInAs(email: string): void {
  const user = USERS[email];
  useAuthStore.setState({ user, token: `token-${user.id}`, isAuthenticated: true });
}

function reset(): void {
  requests = [];
  server = defaultServer;
  useInvitationStore.getState().resetInvitation();
  useCreateWizardStore.getState().startNew();
  useRsvpStore.getState().setInvitationScope(null);
  invalidateConditionalCache();
  signInAs('ayse@ornek.com');
}

// ——— Senaryolar ————————————————————————————————————————————————————————

async function autosaveContract(): Promise<void> {
  console.log('\nOtomatik kaydetme');
  reset();

  // `useInvitationAutoSave` yalnızca `editRevision`'ı izler. Kaydetme yanıtı
  // sayacı artırsaydı her başarılı kayıt bir sonrakini tetiklerdi.
  const before = useInvitationStore.getState().editRevision;
  useInvitationStore.getState().updateField('names', 'Deniz & Can');
  const afterEdit = useInvitationStore.getState().editRevision;
  await useInvitationStore.getState().saveInvitation();
  const afterSave = useInvitationStore.getState().editRevision;

  check(afterEdit === before + 1, 'kullanıcı düzenlemesi editRevision\'ı artırıyor', `${before} → ${afterEdit}`);
  check(afterSave === afterEdit, 'kaydetme yanıtı editRevision\'ı artırmıyor (döngü yok)', `${afterEdit} → ${afterSave}`);

  useInvitationStore.getState().loadRecord(record('REC-A', {}));
  useInvitationStore.getState().resetInvitation();
  check(
    useInvitationStore.getState().editRevision === afterSave,
    'kayıt yükleme ve sıfırlama kaydetme tetiklemiyor',
    `editRevision=${useInvitationStore.getState().editRevision}`,
  );

  reset();
  const a = useInvitationStore.getState().saveInvitation();
  const b = useInvitationStore.getState().saveInvitation();
  await Promise.all([a, b]);
  const posts = invitationWrites().filter((r) => r.method === 'POST').length;
  check(posts === 1, 'eşzamanlı iki kaydetme tek POST üretiyor (kuyruk)', `POST sayısı=${posts}`);
}

async function documentVersionContract(): Promise<void> {
  console.log('\nBelge sürümü (bekleyen form yazımları)');
  reset();

  // Formlar `documentVersion` değişince bekleyen (gecikmeli) yazımlarını atar.
  // Kaydetme yanıtı ya da galeri güncellemesi sürümü artırsaydı, kullanıcının
  // o anda yazdığı metin her otomatik kayıtta sessizce silinirdi.
  const start = useInvitationStore.getState().documentVersion;
  useInvitationStore.getState().updateField('names', 'Deniz & Can');
  await useInvitationStore.getState().saveInvitation();
  const recordId = useInvitationStore.getState().recordId;
  if (recordId) {
    useInvitationStore.getState().applyGallery(recordId, (images) => [...images, { id: 'MEDIA-1', url: 'https://cdn.test/1.jpg' }]);
  }
  check(
    useInvitationStore.getState().documentVersion === start,
    'düzenleme, kaydetme ve galeri güncellemesi belge sürümünü değiştirmiyor',
    `${start} → ${useInvitationStore.getState().documentVersion}`,
  );

  // Sıfırlama ve kayıt yükleme ise başka bir belgeye geçiştir: eski belgeye ait
  // bekleyen yazım yeni belgeye düşmemeli.
  useInvitationStore.getState().resetInvitation();
  const afterReset = useInvitationStore.getState().documentVersion;
  useInvitationStore.getState().loadRecord(record('REC-B', { names: 'Ayşe & Ali' }));
  const afterLoad = useInvitationStore.getState().documentVersion;
  check(
    afterReset > start && afterLoad > afterReset,
    'sıfırlama ve kayıt yükleme belge sürümünü artırıyor',
    `${start} → ${afterReset} → ${afterLoad}`,
  );
}

async function newInvitationDoesNotOverwrite(): Promise<void> {
  console.log('\nYeni davetiye');
  reset();

  useInvitationStore.getState().loadRecord(record('REC-A', { names: 'Ayşe & Ali' }));
  startNewInvitation();
  useInvitationStore.getState().updateField('names', 'Yepyeni Çift');
  await useInvitationStore.getState().saveInvitation();

  const last = invitationWrites().at(-1);
  check(
    last?.method === 'POST' && last.url === '/invitations',
    '"Yeni Davetiye Oluştur" yeni kayıt açıyor, açık kaydın üzerine yazmıyor',
    `giden istek: ${last?.method} ${last?.url}`,
  );
}

async function staleSaveResponseIsIgnored(): Promise<void> {
  console.log('\nKuşak yarışı');
  reset();

  useInvitationStore.getState().loadRecord(record('REC-A', { names: 'A' }));
  useInvitationStore.getState().updateField('names', 'A (düzenlendi)');

  const gate = deferred();
  server = async (req) => {
    if (req.method === 'PUT' && req.url === '/invitations/REC-A') await gate.promise;
    return defaultServer(req);
  };

  const inflight = useInvitationStore.getState().saveInvitation();
  await tick();
  useInvitationStore.getState().loadRecord(record('REC-B', { names: 'B' }));
  gate.resolve();
  await inflight;

  const state = useInvitationStore.getState();
  check(state.recordId === 'REC-B', 'geç gelen kaydetme yanıtı yeni açılan kaydın kimliğini ezmiyor', `recordId=${state.recordId}`);

  await state.saveInvitation();
  const last = invitationWrites().at(-1);
  check(
    last?.url === '/invitations/REC-B' && last.body?.invitation?.names === 'B',
    'sonraki kaydetme B\'nin içeriğini B\'ye yazıyor',
    `${last?.method} ${last?.url} names="${last?.body?.invitation?.names}"`,
  );
}

async function publishRequiresSuccessfulSave(): Promise<void> {
  console.log('\nYayınlama');
  reset();

  useInvitationStore.getState().loadRecord(record('REC-A', { names: 'Eski' }));
  useInvitationStore.getState().updateField('names', 'Yeni');
  server = (req) => {
    if (req.method === 'PUT') return { status: 503, data: { error: { code: 'SERVICE_UNAVAILABLE' } } };
    return defaultServer(req);
  };

  let threw = false;
  try {
    await useInvitationStore.getState().publishInvitation();
  } catch {
    threw = true;
  }
  const published = requests.some((r) => r.url.endsWith('/publish'));
  check(threw && !published, 'kaydetme başarısızken yayınlanmıyor ve hata fırlatılıyor', `hata=${threw}, publish isteği=${published}`);

  server = (req) =>
    req.url === '/invitations/REC-A/publish'
      ? echo('REC-A', useInvitationStore.getState().invitation, 'published')
      : defaultServer(req);
  requests = [];
  const result = await useInvitationStore.getState().publishInvitation();
  const order = requests.map((r) => `${r.method} ${r.url}`).join(' → ');
  check(
    result.status === 'published' && order === 'PUT /invitations/REC-A → POST /invitations/REC-A/publish',
    'kaydetme başarılıysa önce kaydediyor, sonra yayınlıyor',
    order,
  );
}

async function sessionBoundaries(): Promise<void> {
  console.log('\nOturum sınırları');

  reset();
  useInvitationStore.getState().loadRecord(record('REC-U1', { names: 'Ayşe\'nin Davetiyesi' }));
  useCreateWizardStore.getState().resumeEditor('dugun');
  signOut();
  const inv = useInvitationStore.getState();
  check(
    inv.recordId === null && inv.invitation.names === INITIAL_INVITATION.names && useCreateWizardStore.getState().stage === 'build',
    'açık çıkış editörü ve sihirbazı temizliyor',
    `recordId=${inv.recordId}, names="${inv.invitation.names}", stage=${useCreateWizardStore.getState().stage}`,
  );

  // 401 interceptor'ının yolu: yalnızca `logout()` — editör bilerek korunur.
  reset();
  useInvitationStore.getState().loadRecord(record('REC-U1', { names: 'Ayşe\'nin Davetiyesi' }));
  useAuthStore.getState().logout();
  await useAuthStore.getState().login({ email: 'mehmet@ornek.com', password: 'x' });
  useInvitationStore.getState().updateField('names', 'Mehmet\'in Tasarımı');
  await useInvitationStore.getState().saveInvitation();
  const last = invitationWrites().at(-1);
  check(
    last?.method === 'POST' && last.body?.invitation?.names === 'Mehmet\'in Tasarımı',
    'oturum düştükten sonra başka hesap girince önceki hesabın kaydına yazılmıyor',
    `${last?.method} ${last?.url} names="${last?.body?.invitation?.names}"`,
  );

  reset();
  useInvitationStore.getState().loadRecord(record('REC-U1', { names: 'Yarım Kalan' }));
  useAuthStore.getState().logout();
  await useAuthStore.getState().login({ email: 'ayse@ornek.com', password: 'x' });
  check(
    useInvitationStore.getState().recordId === 'REC-U1',
    'oturum düştükten sonra aynı hesap girince çalışma korunuyor',
    `recordId=${useInvitationStore.getState().recordId}`,
  );

  reset();
  useAuthStore.getState().logout();
  useInvitationStore.getState().updateField('names', 'Anonim Taslak');
  await useAuthStore.getState().login({ email: 'mehmet@ornek.com', password: 'x' });
  check(
    useInvitationStore.getState().invitation.names === 'Anonim Taslak',
    'giriş yapmadan hazırlanan taslak girişten sonra korunuyor',
    `names="${useInvitationStore.getState().invitation.names}"`,
  );
}

async function rsvpScopeRace(): Promise<void> {
  console.log('\nLCV kapsamı');
  reset();

  const gate = deferred();
  server = async (req) => {
    if (req.url === '/invitations/INV-A/rsvps') {
      await gate.promise;
      return {
        status: 200,
        data: { data: [{ id: 'r1', guestName: 'A misafiri', guestCount: 2, menuPreference: '', status: 'attending', createdAt: '' }] },
      };
    }
    return defaultServer(req);
  };

  useRsvpStore.getState().setInvitationScope('INV-A');
  const inflight = useRsvpStore.getState().fetchRsvps();
  await tick();
  useRsvpStore.getState().setInvitationScope('INV-B');
  gate.resolve();
  await inflight;

  const { invitationId, rsvpList } = useRsvpStore.getState();
  check(
    invitationId === 'INV-B' && rsvpList.length === 0,
    'kapsam değişince önceki davetiyenin yanıtları yenisine yazılmıyor',
    `invitationId=${invitationId}, liste=${JSON.stringify(rsvpList.map((r) => r.guestName))}`,
  );
}

function calendarDayAcrossZones(): void {
  console.log('\nLCV son tarihi');
  const original = process.env.TZ;

  for (const tz of ['Europe/Istanbul', 'America/New_York', 'Pacific/Pago_Pago', 'Pacific/Kiritimati']) {
    process.env.TZ = tz;
    const shown = formatCalendarDay('2026-11-10');
    check(shown === '10 Kasım 2026', `${tz}: 2026-11-10 → 10 Kasım 2026`, `gösterilen: ${shown}`);
  }

  // `process.env.TZ = undefined` "undefined" dizgisini yazar; anahtar silinmeli.
  if (original === undefined) delete process.env.TZ;
  else process.env.TZ = original;

  check(formatCalendarDay('') === null, 'boş son tarih gösterilmiyor', String(formatCalendarDay('')));
}

async function main(): Promise<void> {
  await autosaveContract();
  await documentVersionContract();
  await newInvitationDoesNotOverwrite();
  await staleSaveResponseIsIgnored();
  await publishRequiresSuccessfulSave();
  await sessionBoundaries();
  await rsvpScopeRace();
  calendarDayAcrossZones();

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Editör ve oturum durumu doğru: kaydetme döngüsü yok, belgeler ve hesaplar birbirine karışmıyor.');
}

void main();
