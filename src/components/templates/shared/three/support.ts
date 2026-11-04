/**
 * 3D sahnenin açılıp açılmayacağına karar veren cihaz denetimleri. Bu dosya
 * three.js içe aktarmaz: ana paketten ya da şablon chunk'ından güvenle çağrılır.
 */

export type StageQuality = 'low' | 'high';

interface NavigatorHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
}

let webglCache: boolean | null = null;

/** Tarayıcı WebGL bağlamı açabiliyor mu (bir kez denenir, sonuç saklanır). */
export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    webglCache = gl !== null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/**
 * Çok zayıf cihaz ya da veri tasarrufu: 3D hiç açılmaz, statik görünüm kalır.
 * Eşikler bilinçli olarak gevşek; orta seviye telefon 3D'yi `low` kaliteyle alır.
 */
export function isVeryLowEnd(): boolean {
  if (typeof navigator === 'undefined') return true;
  const nav = navigator as Navigator & NavigatorHints;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 1) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) return true;
  return false;
}

/** Dokunmatik/küçük ekran ya da sınırlı bellek → `low` (daha az örnek, düşük DPR). */
export function preferredQuality(mode: 'preview' | 'live'): StageQuality {
  if (mode === 'preview' || typeof window === 'undefined') return 'low';
  const nav = navigator as Navigator & NavigatorHints;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  return coarse || lowMemory ? 'low' : 'high';
}

/** DPR aralığı: canlıda `[1, 1.75]`, düşük kalitede ve önizlemede `[1, 1.25]`. */
export function dprFor(quality: StageQuality): [number, number] {
  return quality === 'high' ? [1, 1.75] : [1, 1.25];
}
