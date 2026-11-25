import { isRouteErrorResponse, useLocation, useNavigate, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Home, RefreshCw, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useInvitationStore } from '../../stores/useInvitationStore';
import type { InvitationSaveState } from '../../types';

/** app: page or layout · editor: also tells whether edits are saved · guest: no site links. */
export type RouteErrorScope = 'app' | 'editor' | 'guest';

type SaveNote = 'local' | 'saving' | 'failed' | 'saved';

// Vite / browser wording for a lazy chunk that could not be fetched.
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|Unable to preload CSS|Failed to fetch/i;

function isChunkLoadError(error: unknown): boolean {
  return error instanceof Error && CHUNK_ERROR.test(error.message);
}

function describe(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function saveNote(isAuthenticated: boolean, saveState: InvitationSaveState): SaveNote {
  if (!isAuthenticated) return 'local'; // anonymous draft lives only in memory
  if (saveState === 'saving') return 'saving';
  if (saveState === 'error' || saveState === 'rejected') return 'failed';
  return 'saved';
}

/**
 * The editor unmounts when it crashes; its auto-save cleanup flushes the
 * pending edit, so this note follows the live save state (D3).
 */
function EditorSaveNote() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const saveState = useInvitationStore(s => s.saveState);
  const note = saveNote(isAuthenticated, saveState);
  return (
    <p data-save-note={note} className={`mt-4 rounded-2xl px-4 py-3 text-sm ${note === 'saved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
      {t(`routeError.save.${note}`)}
    </p>
  );
}

/** Route `errorElement` (FE-02, K222). Details: docs/rehber/src/components/errors/RouteError.md */
export function RouteError({ scope = 'app' }: { scope?: RouteErrorScope }) {
  const error = useRouteError();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const chunk = isChunkLoadError(error);

  // A new location resets the boundary without a reload: in-memory drafts survive.
  const retry = () => navigate(`${location.pathname}${location.search}${location.hash}`, { replace: true });

  return (
    <section role="alert" data-route-error={scope} className="min-h-[60vh] flex items-center justify-center px-4 py-24 bg-cream text-ink">
      <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-xl shadow-ink/5 text-center">
        <AlertTriangle className="mx-auto mb-4 text-gold" size={32} aria-hidden />
        <h1 className="font-serif text-2xl text-brand">{t(chunk ? 'routeError.chunkTitle' : 'routeError.title')}</h1>
        <p className="mt-3 text-sm text-muted">{t(chunk ? 'routeError.chunkBody' : 'routeError.body')}</p>
        {scope === 'editor' && <EditorSaveNote />}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {!chunk && (
            <button type="button" onClick={retry} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-brand text-white text-sm font-semibold cursor-pointer">
              <RotateCcw size={15} aria-hidden />
              {t('routeError.retry')}
            </button>
          )}
          <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-ink/15 text-sm font-semibold cursor-pointer">
            <RefreshCw size={15} aria-hidden />
            {t('routeError.reload')}
          </button>
          {scope !== 'guest' && (
            // Plain link: a full load also replaces a broken router state.
            <a href="/" className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-ink/15 text-sm font-semibold">
              <Home size={15} aria-hidden />
              {t('routeError.home')}
            </a>
          )}
        </div>
        {import.meta.env.DEV && <pre className="mt-6 text-start text-xs text-red-700 whitespace-pre-wrap">{describe(error)}</pre>}
      </div>
    </section>
  );
}
