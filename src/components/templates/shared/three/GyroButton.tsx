import React, { useState, useSyncExternalStore } from 'react';
import { Smartphone } from 'lucide-react';
import { cn } from '../../../../utils/cn';

type Permission = 'unknown' | 'granted' | 'denied';

interface OrientationWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

/** iOS 13+ jiroskop için izin ister; izin bir dokunuşla istenebilir, sayfa başına bir kez. */
let permission: Permission = 'unknown';
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function needsPermission(): boolean {
  if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') return false;
  // Masaüstü Chromium da `requestPermission` sunuyor; düğme yalnızca dokunmatik telefonda anlamlı.
  const touch = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return touch && typeof (DeviceOrientationEvent as unknown as OrientationWithPermission).requestPermission === 'function';
}

async function request(): Promise<void> {
  const ask = (DeviceOrientationEvent as unknown as OrientationWithPermission).requestPermission;
  // Hareket (ivme/sallama) izni ayrı bir sorudur ama aynı dokunuşla istenebilir;
  // `useDeviceMotion` kullanan şablonlar ikinci bir düğme göstermez.
  const askMotion =
    typeof DeviceMotionEvent !== 'undefined'
      ? (DeviceMotionEvent as unknown as OrientationWithPermission).requestPermission
      : undefined;
  try {
    const [orientation] = await Promise.all([
      ask ? ask() : Promise.resolve('granted' as const),
      askMotion ? askMotion().catch(() => 'denied' as const) : Promise.resolve('granted' as const)
    ]);
    permission = orientation;
  } catch {
    permission = 'denied';
  }
  listeners.forEach((l) => l());
}

/**
 * "Eğerek oynat" düğmesi: yalnızca izin isteyen tarayıcıda (iOS Safari) ve
 * henüz karar verilmemişken görünür. Öbür cihazlarda `useTilt` izinsiz çalışır.
 */
export function GyroButton({ className, label = 'Telefonu eğerek oynatın' }: { className?: string; label?: string }) {
  const current = useSyncExternalStore(subscribe, () => permission, () => 'granted' as Permission);
  const [needed] = useState(needsPermission);
  if (!needed || current !== 'unknown') return null;
  return (
    <button
      type="button"
      onClick={() => void request()}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 min-h-11 text-[11px] tracking-[0.15em] uppercase backdrop-blur-md transition-colors',
        className
      )}
    >
      <Smartphone size={14} />
      {label}
    </button>
  );
}
