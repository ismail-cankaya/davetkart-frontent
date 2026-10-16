import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import '../../src/index.css';
import { TemplateRenderer } from '../../src/components/templates/TemplateRenderer';
import type { TemplateProps } from '../../src/components/templates/types';
import { TEMPLATE_PRESETS } from '../../src/data';
import { displayNames } from '../../src/utils/names';
import { kimligiCoz, MODULLER, SENARYOLAR, senaryoKur, type Modul, type SenaryoAdi } from './senaryolar';

type Sablon = React.ComponentType<TemplateProps>;

/**
 * Konsept klasörlerinin barrel'ları (`<kategori>/<slug>/index.ts`). Preset kayıt dosyasına
 * dokunmadan bulunabilsinler diye doğrudan yüklenir. Büyük harfle başlayan klasörler
 * (`dugun/Dugun1/`) eski düzenin preset'leridir; onlar `TemplateRenderer` üzerinden çizilir.
 */
const BARRELLER = import.meta.glob<Record<string, unknown>>('/src/components/templates/*/*/index.ts');
const KONSEPT_BARRELLERI = Object.keys(BARRELLER).filter((yol) => /\/templates\/[^/]+\/[a-z][a-z0-9-]*\/index\.ts$/.test(yol));

/** `dogum-gunu-sergi-beyaz-kup` → `DogumGunuSergiBeyazKup` (KONSEPT-ORTAK §3). */
const pascal = (kimlik: string) =>
  kimlik
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

function durum(deger: 'hazir' | 'hata', mesaj = '') {
  document.documentElement.dataset.onizleme = deger;
  document.documentElement.dataset.onizlemeMesaj = mesaj;
}

const q = new URLSearchParams(location.search);
const PRESET = q.get('preset') ?? '';
const SENARYO = (SENARYOLAR as readonly string[]).includes(q.get('senaryo') ?? '') ? (q.get('senaryo') as SenaryoAdi) : 'dolu';
const ZARF = q.get('zarf') === '1';
const KAPAT = (q.get('kapat') ?? '').split(',').filter((m): m is Modul => (MODULLER as readonly string[]).includes(m));
const MOD = q.get('mod') === 'preview' ? 'preview' : 'live';

function Hata({ mesaj }: { mesaj: string }) {
  useEffect(() => durum('hata', mesaj), [mesaj]);
  return (
    <div style={{ padding: 24, font: '14px/1.5 system-ui', color: '#b3261e', whiteSpace: 'pre-wrap' }}>{mesaj}</div>
  );
}

function Onizleme() {
  const kimlik = kimligiCoz(PRESET);
  const kategori = q.get('kategori') ?? kimlik?.kategori ?? 'dugun';
  const [sablon, setSablon] = useState<Sablon | 'eski' | null>(null);
  const [hata, setHata] = useState('');

  useEffect(() => {
    const slug = kimlik?.kalan.split('-')[0] ?? '';
    const yol = `/src/components/templates/${kategori}/${slug}/index.ts`;
    const yukle = BARRELLER[yol];
    if (!yukle) {
      if (TEMPLATE_PRESETS.some((p) => p.id === PRESET)) setSablon('eski');
      else setHata(`"${PRESET}" bulunamadı.\nBeklenen barrel: ${yol}\nKonsept barrel'ları:\n${KONSEPT_BARRELLERI.join('\n') || '(yok)'}`);
      return;
    }
    yukle().then((modul) => {
      const ad = pascal(PRESET);
      const bilesen = modul[ad];
      if (typeof bilesen === 'function' || (typeof bilesen === 'object' && bilesen !== null)) setSablon(() => bilesen as Sablon);
      else setHata(`${yol} içinde "${ad}" dışa aktarılmamış.\nDışa aktarılanlar: ${Object.keys(modul).join(', ')}`);
    }, (e: unknown) => setHata(`${yol} yüklenemedi: ${String(e)}`));
  }, [kategori, kimlik?.kalan]);

  const davet = useMemo(() => {
    const ham = senaryoKur({ kategori, senaryo: SENARYO, zarf: ZARF, kapat: KAPAT });
    // TemplateRenderer'ın tek giriş kapısındaki temizliğin aynısı (bkz. utils/names).
    return { ...ham, names: displayNames(ham.names) };
  }, [kategori]);

  useEffect(() => {
    if (sablon) durum('hazir');
  }, [sablon]);

  if (hata) return <Hata mesaj={hata} />;
  if (!sablon) return null;
  if (sablon === 'eski') return <TemplateRenderer templateId={PRESET} invitation={davet} onRsvpClick={() => {}} mode={MOD} />;
  const Bilesen = sablon;
  return <Bilesen invitation={davet} onRsvpClick={() => {}} mode={MOD} />;
}

/** `?preset` yoksa: konsept barrel'larındaki bütün preset'lerin bağlantıları. */
function Liste() {
  const [satirlar, setSatirlar] = useState<{ yol: string; adlar: string[] }[]>([]);
  useEffect(() => {
    Promise.all(KONSEPT_BARRELLERI.map(async (yol) => ({ yol, adlar: Object.keys(await BARRELLER[yol]()) }))).then((s) => {
      setSatirlar(s);
      durum('hazir');
    });
  }, []);
  const kimlik = (ad: string) => ad.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return (
    <div style={{ padding: 24, font: '14px/1.6 system-ui' }}>
      <h1 style={{ fontSize: 18 }}>Konsept preset'leri</h1>
      {satirlar.length === 0 && <p>Henüz konsept barrel'ı yok.</p>}
      {satirlar.map(({ yol, adlar }) => (
        <div key={yol} style={{ marginBottom: 12 }}>
          <code>{yol}</code>
          <ul>
            {adlar.map((ad) => (
              <li key={ad}>
                {SENARYOLAR.map((s) => (
                  <a key={s} href={`?preset=${kimlik(ad)}&senaryo=${s}`} style={{ marginRight: 10 }}>
                    {kimlik(ad)} · {s}
                  </a>
                ))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

createRoot(document.getElementById('kok')!).render(
  <React.StrictMode>
    {/* App ile aynı: hareketi azaltma tercihi transform'ları atlatır. */}
    <MotionConfig reducedMotion="user">
      {PRESET ? (
        <div style={{ position: 'fixed', inset: 0 }}>
          <Onizleme />
        </div>
      ) : (
        <Liste />
      )}
    </MotionConfig>
  </React.StrictMode>
);
