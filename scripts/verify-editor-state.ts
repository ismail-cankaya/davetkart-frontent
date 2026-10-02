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
import { useSubscriptionStore } from '../src/stores/useSubscriptionStore';
import { signOut, startNewInvitation } from '../src/stores/sessionActions';
import { pendingWrites } from '../src/hooks/useInvitationDraft';
import { formatCalendarDay } from '../src/components/templates/utils';
import { INITIAL_INVITATION } from '../src/data';
import type { AuthUser, Invitation, InvitationRecord } from '../src/types';

// ——— Sahte sunucu ———————————————————————————————————————————————————————

interface RecordedRequest {
  method: string;
  url: string;
  body: { invitation?: Invitation; email?: string; editCode?: string; guestCount?: number; website?: string } | undefined;
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
      config: unknown;
    };
    error.isAxiosError = true;
    error.response = response;
    // Gerçek axios hatası isteğin yapılandırmasını taşır; 401 interceptor'ı
    // hangi token'la gönderildiğine oradan bakıyor (Faz 10, 10.29).
    error.config = config;
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
    // Taslak: hiç yayınlanmadı (Faz 10, backend 10.21).
    publishedAt: null,
    releasableUntil: null,
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

/**
 * Faz 10 (FE 10.21 · backend 10.66b): editör önizlemesi misafirin göreceği
 * imzayı gösterir. Karar sunucunundur: kayıtla gelir, her kayıt ve yayın
 * yanıtında tazelenir, istek gövdesine hiç girmez.
 */
async function brandingFollowsTheServer(): Promise<void> {
  console.log('\nİmza (Elit\'te "DavetKart ile hazırlandı" yok)');
  reset();

  // Sunucu gibi davranır: kararı istekten değil "siparişten" verir.
  let elit = false;
  const brandingServer: Server = (req) => {
    const reply = defaultServer(req) as Reply & { data: { data?: { invitation?: Invitation } } };
    if (reply.data.data?.invitation) reply.data.data.invitation.showBranding = !elit;
    return reply;
  };
  server = brandingServer;

  useInvitationStore.getState().loadRecord(record('REC-E', { showBranding: false }));
  check(
    useInvitationStore.getState().invitation.showBranding === false,
    'kayıt yüklenince önizleme sunucunun imza kararını alıyor',
    `showBranding=${useInvitationStore.getState().invitation.showBranding}`,
  );

  elit = true;
  useInvitationStore.getState().updateField('names', 'Deniz & Can');
  await useInvitationStore.getState().saveInvitation();
  const sent = invitationWrites().at(-1)?.body?.invitation;
  check(
    sent !== undefined && !('showBranding' in sent),
    'imza kararı istek gövdesine girmiyor',
    JSON.stringify(Object.keys(sent ?? {}).filter((key) => key.startsWith('show'))),
  );
  check(
    useInvitationStore.getState().invitation.showBranding === false,
    'kaydetme yanıtı kararı koruyor',
    `showBranding=${useInvitationStore.getState().invitation.showBranding}`,
  );

  // Gold kayıt açık; Elit ödendi, sonraki otomatik kayıt kararı tazeler.
  elit = false;
  useInvitationStore.getState().loadRecord(record('REC-G', { showBranding: true }));
  elit = true;
  useInvitationStore.getState().updateField('names', 'Ece & Mert');
  await useInvitationStore.getState().saveInvitation();
  check(
    useInvitationStore.getState().invitation.showBranding === false,
    'ödemeden sonraki kayıt yanıtı imzayı kaldırıyor',
    `showBranding=${useInvitationStore.getState().invitation.showBranding}`,
  );

  // Yayın bağsız Elit paketini bağlar (K99): karar yayın yanıtıyla gelir.
  elit = false;
  useInvitationStore.getState().loadRecord(record('REC-P', { showBranding: true }));
  server = (req) => {
    if (req.url === '/invitations/REC-P/publish') {
      elit = true;
      return brandingServer({ ...req, method: 'PUT', url: '/invitations/REC-P', body: { invitation: useInvitationStore.getState().invitation } });
    }
    return brandingServer(req);
  };
  await useInvitationStore.getState().publishInvitation();
  check(
    useInvitationStore.getState().invitation.showBranding === false,
    'yayın yanıtı imza kararını tazeliyor (paket yayında bağlanır)',
    `showBranding=${useInvitationStore.getState().invitation.showBranding}`,
  );

  useInvitationStore.getState().resetInvitation();
  check(
    useInvitationStore.getState().invitation.showBranding === undefined,
    'yeni taslakta karar yok: imza çizilir',
    `showBranding=${useInvitationStore.getState().invitation.showBranding}`,
  );
}

/** Yayındaki davetiyede Elit modülü açan kaydı reddeden sunucu (K88). */
const paywallServer: Server = (req) =>
  req.method === 'PUT' && req.body?.invitation?.showGallery === true
    ? { status: 402, data: { error: { code: 'PAYWALL_TIER_INSUFFICIENT', params: { requiredTier: 'elit' } } } }
    : defaultServer(req);

async function publishedModuleRejection(): Promise<void> {
  console.log('\nYayındaki davetiyede plan üstü modül (Faz 10 · K88)');
  reset();

  const opened: string[] = [];
  const stopWatching = useSubscriptionStore.subscribe((state, prev) => {
    if (state.isPaywallOpen && !prev.isPaywallOpen) {
      opened.push(`${state.reason}/${state.requiredTier}/${state.invitationId}`);
    }
  });

  useInvitationStore.getState().loadRecord({ ...record('REC-P', { venue: 'Eski Salon' }), status: 'published' });
  server = paywallServer;

  // Aynı otomatik kaydetme penceresinde iki düzenleme: metin + Elit modül.
  useInvitationStore.getState().updateField('venue', 'Çırağan Sarayı');
  useInvitationStore.getState().updateField('showGallery', true);
  const revisionBefore = useInvitationStore.getState().editRevision;
  await useInvitationStore.getState().saveInvitation();

  const rejected = useInvitationStore.getState();
  check(rejected.invitation.showGallery === false, 'reddedilen modül anahtarı geri alınıyor', `showGallery=${rejected.invitation.showGallery}`);
  check(
    rejected.invitation.venue === 'Çırağan Sarayı',
    'aynı penceredeki metin korunuyor — yalnızca açılan modül geri alınır',
    `venue="${rejected.invitation.venue}"`,
  );
  check(
    opened.length === 1 && opened[0] === 'upgrade/elit/REC-P',
    'plan duvarı bir kez, sunucunun planıyla ve "yükselt" nedeniyle açılıyor',
    JSON.stringify(opened),
  );
  check(
    rejected.editRevision === revisionBefore + 1 && rejected.saveState === 'idle',
    'geri alma yeniden kaydetmeyi tetikliyor (sunucu isteğin tamamını reddetmişti)',
    `editRevision ${revisionBefore} → ${rejected.editRevision}, saveState=${rejected.saveState}`,
  );

  // Kullanıcı duvarı kapatır; otomatik kaydetme kalan düzenlemeyi yeniden
  // gönderir. Duvar kapalıyken gelen her yeni 402 onu YENİDEN açardı —
  // fırtına tam olarak böyle görünür.
  useSubscriptionStore.getState().closePaywall();
  await useInvitationStore.getState().saveInvitation();
  const resent = invitationWrites().at(-1);
  check(
    resent?.method === 'PUT' &&
      resent.body?.invitation?.showGallery === false &&
      resent.body?.invitation?.venue === 'Çırağan Sarayı',
    'yeniden kaydetme metni gönderiyor, reddedilen modülü göndermiyor',
    `${resent?.method} showGallery=${resent?.body?.invitation?.showGallery} venue="${resent?.body?.invitation?.venue}"`,
  );
  check(useInvitationStore.getState().saveState === 'saved', 'yeniden kaydetme başarılı', `saveState=${useInvitationStore.getState().saveState}`);

  useInvitationStore.getState().updateField('title', 'Nikâhımıza Davetlisiniz');
  await useInvitationStore.getState().saveInvitation();
  check(opened.length === 1, 'sonraki kaydetmeler yeni bir plan duvarı açmıyor (402 fırtınası yok)', `açılış sayısı=${opened.length}`);

  stopWatching();
  useSubscriptionStore.getState().closePaywall();
}

async function rejectionWithNothingToRollBack(): Promise<void> {
  console.log('\nGeri alınacak modül yoksa');
  reset();

  // Sunucunun son onayladığı hâlde galeri ZATEN açık (ör. aynı kayıt başka bir
  // sekmede değişti) ve sunucu her PUT'u reddediyor. Editör neyi geri alacağını
  // bilemez: tahmin etmemeli ve aynı 402'yi otomatik olarak tekrarlamamalı.
  useInvitationStore.getState().loadRecord({ ...record('REC-Q', { showGallery: true }), status: 'published' });
  server = paywallServer;

  useInvitationStore.getState().updateField('title', 'Yeni Başlık');
  const revisionBefore = useInvitationStore.getState().editRevision;
  await useInvitationStore.getState().saveInvitation();

  const state = useInvitationStore.getState();
  check(
    state.editRevision === revisionBefore && state.saveState === 'error' && state.invitation.showGallery === true,
    'geri alınacak modül yoksa otomatik yeniden kaydetme döngüsü kurulmuyor',
    `editRevision ${revisionBefore} → ${state.editRevision}, saveState=${state.saveState}, showGallery=${state.invitation.showGallery}`,
  );

  useSubscriptionStore.getState().closePaywall();
}

function draftWritesOnlyWhatTheFormChanged(): void {
  console.log('\nForm taslağı (bekleyen yazım)');

  // Kullanıcı Hediye anahtarını açtı ve IBAN alanlarına yazmaya başladı; yazım
  // beklerken sunucu 402 döndü ve store anahtarı geri aldı. Taslakta anahtar
  // hâlâ açık (bayat), banka adı ise gerçekten yeni.
  const stored: Invitation = { ...INITIAL_INVITATION, showGift: false, bankName: '' };
  const draft: Invitation = { ...INITIAL_INVITATION, showGift: true, bankName: 'Ziraat Bankası' };

  const writes = pendingWrites(new Set(['bankName'] as const), draft, stored);
  check(
    writes.length === 1 && writes[0] === 'bankName',
    'bekleyen yazım yalnızca formun değiştirdiği alanı yazıyor; store\'un geri aldığı anahtar geri yazılmıyor',
    JSON.stringify(writes),
  );

  const untouched = pendingWrites(new Set(['bankName'] as const), { ...draft, bankName: '' }, stored);
  check(untouched.length === 0, 'store\'dakiyle aynı olan alan yeniden yazılmıyor', JSON.stringify(untouched));
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
  await tick();
  const revoke = requests.find((r) => r.url === '/auth/logout');
  check(
    revoke?.method === 'POST' && revoke.authorization === 'Bearer token-u1',
    'açık çıkış token\'ı sunucuda iptal ediyor',
    `${revoke?.method} ${revoke?.url} ${revoke?.authorization}`,
  );

  // Faz 10 (FE 10.16): şifre sıfırlandı ya da hesap silindi, token sunucuda
  // ZATEN yok. Bellek yine temizlenmeli; iptal isteği gitmemeli.
  reset();
  useInvitationStore.getState().loadRecord(record('REC-U1', { names: 'Ayşe\'nin Davetiyesi' }));
  signOut({ revoke: false });
  await tick();
  check(
    !useAuthStore.getState().isAuthenticated && useInvitationStore.getState().recordId === null,
    'sunucuda silinmiş oturum: bellek yine temizleniyor',
    `isAuthenticated=${useAuthStore.getState().isAuthenticated}, recordId=${useInvitationStore.getState().recordId}`,
  );
  check(
    !requests.some((r) => r.url === '/auth/logout'),
    'sunucuda silinmiş oturum: iptal isteği gönderilmiyor',
    requests.map((r) => `${r.method} ${r.url}`).join(', '),
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

/**
 * Faz 10 (10.29): açılışta `GET /auth/me`. Token 30 gün yaşıyor (K90);
 * süresi dolmuş ya da başka cihazdan iptal edilmiş token açılışta düşmeli.
 * Son iki senaryo sıralama hatası: eski oturumun GEÇ gelen cevabı.
 */
async function sessionRefresh(): Promise<void> {
  console.log('\nOturum doğrulama (açılış)');

  const UNAUTHENTICATED: Reply = { status: 401, data: { error: { code: 'UNAUTHENTICATED' } } };

  reset();
  server = (req) =>
    req.url === '/auth/me'
      ? { status: 200, data: { data: { ...USERS['ayse@ornek.com'], lastName: 'Yılmaz-Kaya' } } }
      : defaultServer(req);
  await useAuthStore.getState().refreshSession();
  const me = requests.find((r) => r.url === '/auth/me');
  check(
    me?.method === 'GET' && me.authorization === 'Bearer token-u1',
    'açılış isteği GET /auth/me, güncel token\'la',
    `${me?.method} ${me?.url} ${me?.authorization}`,
  );
  check(
    useAuthStore.getState().user?.lastName === 'Yılmaz-Kaya',
    'geçerli token: kullanıcı sunucudan tazeleniyor (zarf açılıyor)',
    `lastName="${useAuthStore.getState().user?.lastName}"`,
  );

  reset();
  server = (req) => (req.url === '/auth/me' ? UNAUTHENTICATED : defaultServer(req));
  await useAuthStore.getState().refreshSession();
  check(
    !useAuthStore.getState().isAuthenticated && useAuthStore.getState().token === null,
    'süresi dolmuş token: oturum açılışta düşüyor',
    `isAuthenticated=${useAuthStore.getState().isAuthenticated}`,
  );

  reset();
  server = (req) => {
    if (req.url === '/auth/me') throw new Error('Network Error');
    return defaultServer(req);
  };
  await useAuthStore.getState().refreshSession();
  check(
    useAuthStore.getState().isAuthenticated && useAuthStore.getState().token === 'token-u1',
    'ağ hatası: oturum korunuyor (çevrimdışı açılış çıkış yaptırmaz)',
    `isAuthenticated=${useAuthStore.getState().isAuthenticated}, token=${useAuthStore.getState().token}`,
  );

  // 🔴 Eski token'la giden /me yoldayken kullanıcı başka hesapla giriyor;
  // 401 girişten SONRA geliyor. O 401 eski oturum hakkında.
  reset();
  const late401 = deferred();
  server = async (req) => {
    if (req.url === '/auth/me') {
      await late401.promise;
      return UNAUTHENTICATED;
    }
    return defaultServer(req);
  };
  const refreshing = useAuthStore.getState().refreshSession();
  await tick();
  useAuthStore.getState().logout();
  await useAuthStore.getState().login({ email: 'mehmet@ornek.com', password: 'x' });
  late401.resolve();
  await refreshing;
  check(
    useAuthStore.getState().isAuthenticated && useAuthStore.getState().user?.id === 'u2',
    'eski token\'ın geç gelen 401\'i yeni oturumu düşürmüyor',
    `isAuthenticated=${useAuthStore.getState().isAuthenticated}, user=${useAuthStore.getState().user?.id}`,
  );

  reset();
  const lateOk = deferred();
  server = async (req) => {
    if (req.url === '/auth/me') {
      await lateOk.promise;
      return { status: 200, data: { data: USERS['ayse@ornek.com'] } };
    }
    return defaultServer(req);
  };
  const refreshingAgain = useAuthStore.getState().refreshSession();
  await tick();
  await useAuthStore.getState().login({ email: 'mehmet@ornek.com', password: 'x' });
  lateOk.resolve();
  await refreshingAgain;
  check(
    useAuthStore.getState().user?.id === 'u2',
    'eski oturumun geç gelen cevabı yeni kullanıcının üstüne yazılmıyor',
    `user=${useAuthStore.getState().user?.id}`,
  );
}

/** Node'da tarayıcı deposu yok; bellekte bir yedek (yalnızca bu betik için). */
function installMemoryStorage(): Map<string, string> {
  const store = new Map<string, string>();
  (globalThis as { localStorage?: Storage }).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
  return store;
}

/**
 * Faz 10 (FE 10.18 · K101): aynı misafirin ikinci gönderimi yeni satır açmaz,
 * düzenleme koduyla eski yanıtı günceller.
 */
async function rsvpOwnReply(): Promise<void> {
  console.log('\nLCV: kendi yanıtını güncelleme');

  const storage = installMemoryStorage();
  const INV = 'INV-G';
  const collection = `/public/invitations/${INV}/rsvps`;
  const reply = (id: string, guestCount: number, editCode: string): Reply => ({
    status: 200,
    data: { data: { id, guestName: 'Şeyma Şen', guestCount, menuPreference: '', status: 'attending', createdAt: '', editCode } },
  });

  let created = 0;
  let putStatus = 200;
  const rsvpServer: Server = (req) => {
    if (req.method === 'POST' && req.url === collection) {
      created += 1;
      return { ...reply(`R${created}`, req.body?.guestCount ?? 0, `kod-${created}`), status: 201 };
    }
    if (req.method === 'PUT' && req.url.startsWith(`${collection}/`)) {
      if (putStatus === 404) return { status: 404, data: { error: { code: 'RESOURCE_NOT_FOUND' } } };
      if (putStatus === 403) return { status: 403, data: { error: { code: 'RSVP_DEADLINE_PASSED' } } };
      const id = req.url.slice(collection.length + 1);
      return reply(id, req.body?.guestCount ?? 0, req.body?.editCode ?? '');
    }
    return defaultServer(req);
  };

  const submit = async (guestCount: number) => {
    useRsvpStore.getState().updateDraft({ guestName: 'Şeyma Şen', guestCount });
    return useRsvpStore.getState().submitDraft();
  };

  reset();
  server = rsvpServer;
  useRsvpStore.getState().setInvitationScope(INV);
  await submit(3);
  check(
    requests.some((r) => r.method === 'POST' && r.url === collection) && useRsvpStore.getState().ownReply?.editCode === 'kod-1',
    'ilk gönderim POST; dönen kod bu davetiye için hatırlanıyor',
    `ownReply=${JSON.stringify(useRsvpStore.getState().ownReply)}`,
  );

  requests = [];
  await submit(2);
  const put = requests.find((r) => r.method === 'PUT');
  const list = useRsvpStore.getState().rsvpList;
  check(
    put?.url === `${collection}/R1` && put.body?.editCode === 'kod-1' && !requests.some((r) => r.method === 'POST'),
    'ikinci gönderim yeni yanıt değil: aynı yanıta, kodla PUT',
    requests.map((r) => `${r.method} ${r.url}`).join(', '),
  );
  check(
    put !== undefined && !('website' in (put.body ?? {})),
    'güncellemede tuzak alanı gönderilmiyor',
    JSON.stringify(put?.body),
  );
  check(
    list.filter((r) => r.id === 'R1').length === 1 && list[0]?.guestCount === 2,
    'listede aynı yanıt bir kez, güncel haliyle',
    JSON.stringify(list.map((r) => [r.id, r.guestCount])),
  );

  // Sayfa yenilendi: depo boş başlar, kod tarayıcıdan geri okunur.
  useRsvpStore.setState({ ownReply: null });
  useRsvpStore.getState().setInvitationScope(null);
  useRsvpStore.getState().setInvitationScope(INV);
  check(
    useRsvpStore.getState().ownReply?.rsvpId === 'R1',
    'sayfa yenilense de kod tarayıcıdan geri okunuyor',
    `ownReply=${JSON.stringify(useRsvpStore.getState().ownReply)}`,
  );

  // Sahip yanıtı sildi: PUT 404 → kod unutulur, yeni yanıt gönderilir.
  requests = [];
  putStatus = 404;
  let fresh: Awaited<ReturnType<typeof submit>> = null;
  let freshError = '';
  try {
    fresh = await submit(4);
  } catch (error) {
    // Çökmek yerine kontrol olarak raporlansın; sonraki senaryolar da koşsun.
    freshError = (error as Error).message;
  }
  check(
    fresh?.id === 'R2' && requests.some((r) => r.method === 'POST') && useRsvpStore.getState().ownReply?.rsvpId === 'R2',
    '404: kod unutulup yeni yanıt gönderiliyor, yeni kod hatırlanıyor',
    `${requests.map((r) => `${r.method} ${r.url}`).join(', ')} → ${fresh?.id ?? freshError}`,
  );

  // Başka bir hata (son tarih geçti): yeni yanıta DÜŞÜLMEZ, kod korunur.
  requests = [];
  putStatus = 403;
  let thrown = false;
  try {
    await submit(1);
  } catch {
    thrown = true;
  }
  check(
    thrown && !requests.some((r) => r.method === 'POST') && storage.has(`davetkart_rsvp_receipt:${INV}`),
    'son tarih hatası: yeni yanıt açılmıyor, kod korunuyor',
    `thrown=${thrown}, ${requests.map((r) => `${r.method} ${r.url}`).join(', ')}`,
  );

  useRsvpStore.getState().setInvitationScope(null);
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
  await brandingFollowsTheServer();
  await publishedModuleRejection();
  await rejectionWithNothingToRollBack();
  draftWritesOnlyWhatTheFormChanged();
  await sessionBoundaries();
  await sessionRefresh();
  await rsvpOwnReply();
  await rsvpScopeRace();
  calendarDayAcrossZones();

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Editör ve oturum durumu doğru: kaydetme döngüsü yok, belgeler ve hesaplar birbirine karışmıyor.');
}

void main();
